import React, {useState, useEffect} from 'react';
import {View, Text, Pressable} from 'react-native';
import Voice from '@react-native-community/voice';
import {useTheme} from '@react-navigation/native';

const RecordScreen = ({navigation, route}) => {
  const {colors} = useTheme();
  const record = route.params?.record;
  const [isRecording, setIsRecording] = useState(false);

  const [recordedValues, setRecordedValues] = useState('');
  useEffect(() => {
    Voice.isAvailable().then(isAvailable =>
      console.log('Voice.isAvailable()', isAvailable),
    );

    Voice.onSpeechRecognized = event => {
      console.log('recognized event', event);
      // if (error) {
      //   console.log(error);
      //   return;
      // }
    };

    // Voice.onSpeechResults = event => {
    //   console.log('recognized results', event);
    //   setRecordedValues(event?.value[0]);
    //   // if (error) {
    //   //   console.log(error);
    //   //   return;
    //   // }
    // };

    Voice.onSpeechPartialResults = event => {
      console.log('recognized partial event', event);
      // if (error) {
      //   console.log(error);
      //   return;
      // }
      setRecordedValues(event?.value[0]);
    };

    Voice.onSpeechStart = event => {
      console.log('start event', event);
      // if (error) {
      //   console.log(error);
      //   return;
      // }
      console.log('started recording');
      setIsRecording(true);
    };

    Voice.onSpeechEnd = event => {
      console.log('stop event', event);
      // if (error) {
      //   console.log(error);
      //   return;
      // }
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
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>{record.title}</Text>
      <Text>{recordedValues}</Text>
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
