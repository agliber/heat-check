import React, {useLayoutEffect, useState, useEffect, useReducer} from 'react';
import {activateKeepAwake, deactivateKeepAwake} from 'expo-keep-awake';
import {SafeAreaView, FlatList, View, Text, Pressable} from 'react-native';
import Voice from '@react-native-community/voice';
import {useTheme} from '@react-navigation/native';
import keyWord from './keyWord.json';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Collapsible from 'react-native-collapsible';

const reducer = (state, command) => {
  if (['LC3', 'RC3', 'LW3', 'RW3', 'T3', 'FT'].includes(command)) {
    return {...state, currentSpot: command};
  } else if (['IN', 'OUT'].includes(command)) {
    const shot = {
      spot: state.currentSpot,
      timestamp: new Date().toISOString(),
      made: command === 'IN' ? true : false,
    };
    return {
      ...state,
      record: {...state.record, shots: [...state.record.shots, shot]},
    };
  }
  return state;
};

const RecordScreen = ({navigation, route}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: record.title,
      headerStyle: {shadowOffset: {height: 0, width: 0}},
    });
  });
  const {colors} = useTheme();
  const [{record, currentSpot}, dispatch] = useReducer(reducer, {
    record: route.params?.record,
    currentSpot: null,
  });

  const [isRecording, setIsRecording] = useState(false);

  const [recordedValues, setRecordedValues] = useState('');
  const [commandsHeard, setCommandsHeard] = useState([]);
  const [lastCommandHeard, setLastCommandHeard] = useState(null);
  const [hideDevLogs, setHideDevLogs] = useState(true);

  //https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [commandMap] = useState(() => {
    const map = new Map();
    Object.entries(keyWord).forEach(([command, aliases]) => {
      aliases.forEach(alias => map.set(alias, command));
    });
    console.log('map entries', Array.from(map.entries()));
    return map;
  });

  useEffect(() => {
    Voice.isAvailable().then(isAvailable =>
      console.log('Voice.isAvailable()', isAvailable),
    );

    Voice.onSpeechStart = event => {
      console.log('onSpeechStart event', event);
      console.log('started recording');
      setIsRecording(true);
      activateKeepAwake();
    };

    Voice.onSpeechEnd = event => {
      console.log('onSpeechEnd event', event);
      console.log('stopped recording');
      setIsRecording(false);
      deactivateKeepAwake();
    };

    return () => {
      Voice.destroy()
        .then(() => {
          console.log('Voice destroyed');
          Voice.removeAllListeners();
        })
        .catch(e => {
          console.log('UNABLE TO DESTROY');
          console.log(e.error);
        });
    };
  }, []);

  useEffect(() => {
    const matchSpeechToCommand = speech => {
      const words = speech.toLowerCase().split(' ');

      // console.log('last word', words.slice(-1).join(' '));
      // console.log('last 2 words', words.slice(-2).join(' '));
      // console.log('last 3 words', words.slice(-3).join(' '));
      // console.log('last 4 words', words.slice(-4).join(' '));

      const command =
        commandMap.get(words.slice(-1).join(' ')) ?? // last word heard
        commandMap.get(words.slice(-2).join(' ')) ?? // last 2 words
        commandMap.get(words.slice(-3).join(' ')) ?? // last 3 words
        commandMap.get(words.slice(-4).join(' ')); // last 3 words
      // console.log('command heard: ', command);
      return command;
    };

    let timeoutId = null;

    Voice.onSpeechResults = event => {
      setRecordedValues(event?.value[0]);

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const command = matchSpeechToCommand(event?.value[0]);
        dispatch(command);
        setLastCommandHeard(command);
        setCommandsHeard(commands => [...commands, command]);
        if (command) Voice.start('en-US');
        // if (command) {
        //   Voice.cancel().then(error => {
        //     console.log('Voice canceled', error);
        //     if (!error) {
        //       setIsRecording(false);
        //       Voice.start('en-US').then(error => {
        //         console.log('Voice start', error);
        //       });
        //     }
        //   });
        // }
      }, 500);
    };
  }, [commandMap]);

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
        <Pressable
          style={{alignSelf: 'center'}}
          onPress={() => {
            if (isRecording) {
              console.log('attempting to stop');
              Voice.stop().then(error => {
                if (!error) {
                  setIsRecording(false);
                }
              });
            } else {
              Voice.start('en-US');
            }
          }}>
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
