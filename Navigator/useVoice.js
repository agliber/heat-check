import keyWord from './keyWord.json';
import {useState, useEffect} from 'react';
import {activateKeepAwake, deactivateKeepAwake} from 'expo-keep-awake';
import Voice from '@react-native-community/voice';

const useVoice = executeCommand => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedValues, setRecordedValues] = useState('');
  const [commandsHeard, setCommandsHeard] = useState([]);
  const [lastCommandHeard, setLastCommandHeard] = useState(null);

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
    const commandMap = new Map();
    Object.entries(keyWord).forEach(([command, aliases]) => {
      aliases.forEach(alias => commandMap.set(alias, command));
    });

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
        commandMap.get(words.slice(-4).join(' ')); // last 4 words
      // console.log('command heard: ', command);
      return command;
    };
    let timeoutId = null;

    Voice.onSpeechResults = event => {
      setRecordedValues(event?.value[0]);

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const command = matchSpeechToCommand(event?.value[0]);
        executeCommand(command);
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
  }, [executeCommand]);

  const startOrStop = () => {
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
  };

  return {
    isRecording,
    recordedValues,
    commandsHeard,
    lastCommandHeard,
    startOrStop,
  };
};

export default useVoice;
