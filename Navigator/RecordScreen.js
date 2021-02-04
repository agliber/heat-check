import React, {useLayoutEffect, useState, useEffect} from 'react';
import {View, Text, Pressable} from 'react-native';
import Voice from '@react-native-community/voice';
import {useTheme} from '@react-navigation/native';
import keyWord from './keyWord.json';

const RecordScreen = ({navigation, route}) => {
  const {colors} = useTheme();

  const record = route.params?.record;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: record.title,
      headerStyle: {shadowOffset: {height: 0, width: 0}},
    });
  });

  const [isRecording, setIsRecording] = useState(false);

  const [recordedValues, setRecordedValues] = useState('');
  const [commandsHeard, setCommandsHeard] = useState([]);
  const [lastCommandHeard, setLastCommandHeard] = useState(null);

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
    };

    Voice.onSpeechEnd = event => {
      console.log('onSpeechEnd event', event);
      console.log('stopped recording');
      setIsRecording(false);
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

      console.log('last word', words.slice(-1).join(' '));
      console.log('last 2 words', words.slice(-2).join(' '));
      console.log('last 3 words', words.slice(-3).join(' '));
      console.log('last 4 words', words.slice(-4).join(' '));

      const command =
        commandMap.get(words.slice(-1).join(' ')) ?? // last word heard
        commandMap.get(words.slice(-2).join(' ')) ?? // last 2 words
        commandMap.get(words.slice(-3).join(' ')) ?? // last 3 words
        commandMap.get(words.slice(-4).join(' ')); // last 3 words
      console.log('command heard: ', command);
      return command;
    };

    let timeoutId = null;
    // let partialResult = '';

    Voice.onSpeechResults = event => {
      console.log('onSpeechResults event', event);
      // if (
      //   event?.value[0].split(' ').length === partialResult.split(' ').length
      // ) {
      //   return;
      // }
      // partialResult = event?.value[0];
      setRecordedValues(event?.value[0]);
      console.log('timeoutId', timeoutId);

      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const command = matchSpeechToCommand(event?.value[0]);
        console.log('command', command);
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

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 32}}>
        {lastCommandHeard}
        {'\n\n'}
      </Text>

      <Text>
        Interpreted input: {'\n\n'} {recordedValues}
      </Text>
      <Text>
        Commands heard: {'\n\n'}
        {commandsHeard.join(' ')}
      </Text>
      <Pressable
        style={{margin: 24, padding: 16, backgroundColor: colors.card}}
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
        <Text>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
      </Pressable>
    </View>
  );
};

export default RecordScreen;
