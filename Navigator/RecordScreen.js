import React, {useLayoutEffect, useState} from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TextInput,
  Pressable,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Collapsible from 'react-native-collapsible';
import useRecord from './useRecord.js';
import useVoice from './useVoice.js';
import {Circle} from 'react-native-progress';

const RecordScreen = ({navigation, route}) => {
  const {colors} = useTheme();
  const {record, currentSpot, dispatch} = useRecord(route.params?.record);

  useLayoutEffect(() => navigation.setOptions({headerShown: false}));

  const {
    isRecording,
    recordedValues,
    commandsHeard,
    lastCommandHeard,
    startOrStop,
  } = useVoice(command => dispatch({type: 'command', payload: command}));

  const [hideDevLogs, setHideDevLogs] = useState(true);

  const spotShots = [];
  let shotsMade = 0;
  record.shots.forEach((shot, index) => {
    if (shot.made) {
      shotsMade++;
    }
    if (shot.spot !== record.shots[index - 1]?.spot) {
      spotShots[spotShots.length] = [shot];
      return;
    }
    spotShots[spotShots.length - 1].push(shot);
  });
  spotShots.reverse();

  return (
    <SafeAreaView style={{flex: 1}}>
      <Pressable style={{marginLeft: 8}} onPress={() => navigation.goBack()}>
        <FeatherIcon name="chevron-left" color={colors.primary} size={32} />
      </Pressable>
      <View style={{flex: 1, alignItems: 'stretch', marginHorizontal: 16}}>
        <TextInput
          autoFocus={record.name === ''}
          autoCorrect={false}
          style={{marginLeft: 8, marginTop: 8, fontSize: 32}}
          placeholder="Record Title"
          containerStyle={{paddingHorizontal: 32}}
          value={record.name}
          onChangeText={text => {
            console.log('rename');
            dispatch({type: 'rename', payload: text});
          }}
          onBlur={() => {
            if (record.name === '') {
              dispatch({type: 'rename', payload: 'Untitled'});
            }
          }}
          returnKeyType="done"
        />
        <Circle
          style={{alignSelf: 'center', margin: 8}}
          progress={
            record.shots.length === 0 ? 0 : shotsMade / record.shots.length
          }
          showsText
          textStyle={{color: colors.text, fontSize: 20, fontWeight: '400'}}
          formatText={() => `${shotsMade}/${record.shots.length}`}
          direction="counter-clockwise"
          size={64}
          thickness={4}
          borderWidth={0}
          color="#7cfc00"
          unfilledColor={record.shots.length === 0 ? colors.border : '#ff69b4'}
        />
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
                  <McIcon name={'circle'} size={30} color="transparent" />
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
                    <McIcon
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
        <View>
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
      </View>
    </SafeAreaView>
  );
};

export default RecordScreen;
