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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Collapsible from 'react-native-collapsible';
import useRecord from './useRecord.js';
import useVoice from './useVoice.js';
import {Circle} from 'react-native-progress';
import {format, parseISO, formatDistanceStrict} from 'date-fns';

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
          textStyle={{color: colors.text, fontWeight: '400'}}
          formatText={() => `${shotsMade}/\n${record.shots.length}`}
          direction="counter-clockwise"
          size={80}
          thickness={4}
          borderWidth={0}
          color="green"
          unfilledColor={record.shots.length === 0 ? colors.border : 'red'}
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
                    borderWidth: 0.5,
                    borderColor: 'black',
                  }}>
                  <Text style={{minWidth: 40}}>{currentSpot ?? ''}</Text>
                </View>
              )
            }
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.border,
                  marginLeft: 16,
                }}
              />
            )}
            renderItem={({item, index}) => (
              <View
                style={{
                  marginTop: 8,
                  padding: 8,
                  borderRadius: 8,
                  borderWidth: 0.5,
                  borderColor:
                    index === 0 && currentSpot === item[0].spot
                      ? colors.outline
                      : 'transparent',
                }}>
                <View
                  style={{
                    margin: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 16}}>{item[0].spot ?? ''} </Text>
                  <Text style={{fontSize: 16}}>
                    {`${item.filter(shot => shot.made).length}/${item.length}`}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap'}}>
                  {item.map(shot => (
                    <FontAwesomeIcon
                      style={{marginRight: 2}}
                      key={shot.timestamp}
                      name={shot.made ? 'circle' : 'circle-thin'}
                      size={30}
                      color={'grey'}
                    />
                  ))}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{color: 'grey', margin: 4}}>
                    {format(parseISO(item[0].timestamp), 'MMM d yyyy')}
                  </Text>
                  <Text style={{color: 'grey', margin: 4}}>
                    {format(parseISO(item[0].timestamp), 'h:mmaa')}
                  </Text>
                  <Text style={{color: 'grey', margin: 4}}>
                    {formatDistanceStrict(
                      parseISO(item[0].timestamp),
                      parseISO(item[item.length - 1].timestamp),
                    )}
                  </Text>
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
