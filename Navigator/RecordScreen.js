import React, {useLayoutEffect, useState} from 'react';
import {SafeAreaView, FlatList, View, Text, Pressable} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Collapsible from 'react-native-collapsible';
import useRecord from './useRecord.js';
import useVoice from './useVoice.js';

const RecordScreen = ({navigation, route}) => {
  const {colors} = useTheme();
  const {record, currentSpot, dispatch} = useRecord(route.params?.record);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: record.name,
      headerStyle: {shadowOffset: {height: 0, width: 0}},
    });
  });

  const {
    isRecording,
    recordedValues,
    commandsHeard,
    lastCommandHeard,
    startOrStop,
  } = useVoice(command => dispatch({type: 'command', payload: command}));

  const [hideDevLogs, setHideDevLogs] = useState(true);

  const spotShots = [];
  record.shots.forEach((shot, index) => {
    if (shot.spot !== record.shots[index - 1]?.spot) {
      spotShots[spotShots.length] = [shot];
      return;
    }
    spotShots[spotShots.length - 1].push(shot);
  });
  spotShots.reverse();

  console.log(spotShots);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        marginHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'stretch',
      }}>
      <View style={{flex: 1}}>
        <FlatList
          data={spotShots}
          keyExtractor={item => item[0].timestamp}
          ListHeaderComponent={() =>
            isRecording &&
            (spotShots.length === 0 ||
              currentSpot !== spotShots[0][0].spot) && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: colors.card,
                  borderWidth: 1,
                  borderColor: 'black',
                }}>
                <Text style={{minWidth: 40}}>{currentSpot ?? ''}</Text>
                <Icon name={'circle'} size={30} color="transparent" />
              </View>
            )
          }
          renderItem={({item, index}) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
                padding: 8,
                borderRadius: 8,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor:
                  index === 0 && currentSpot === item[0].spot
                    ? colors.outline
                    : 'transparent',
              }}>
              <Text style={{minWidth: 40}}>{item[0].spot ?? ''} </Text>
              <View style={{flexDirection: 'row', flex: 1}}>
                {item.map(shot => (
                  <Icon
                    key={shot.timestamp}
                    name={shot.made ? 'circle' : 'circle-outline'}
                    size={30}
                  />
                ))}
              </View>
            </View>
          )}
        />
      </View>
      <View>
        <Pressable style={{alignSelf: 'center'}} onPress={() => startOrStop()}>
          {!isRecording ? (
            <View
              style={{
                backgroundColor: 'green',
                width: 80,
                aspectRatio: 1,
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: colors.background, fontSize: 20}}>
                Record
              </Text>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: 'red',
                width: 80,
                aspectRatio: 1,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: colors.background, fontSize: 20}}>Stop</Text>
            </View>
          )}
        </Pressable>
        <Pressable
          onLongPress={() => setHideDevLogs(prev => !prev)}
          style={{backgroundColor: colors.card, width: 32}}
          hitSlop={100}
        />
        <Collapsible collapsed={hideDevLogs}>
          <Text style={{fontSize: 20}}>Last Command: {lastCommandHeard}</Text>
          <Text>
            Interpreted input: {'\n'} {recordedValues}
          </Text>
          <Text>
            Commands heard: {'\n'}
            {commandsHeard.join(' ')}
          </Text>
        </Collapsible>
      </View>
    </SafeAreaView>
  );
};

export default RecordScreen;
