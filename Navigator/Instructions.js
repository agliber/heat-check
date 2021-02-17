import React from 'react';
import {View} from 'react-native';
import {Text} from '@heat-check/components';
// import {useTheme} from '@react-navigation/native';

const Instructions = () => {
  // const {colors} = useTheme();
  return (
    <View>
      <Text style={{fontSize: 32, marginTop: 16}}>
        All stats are recorded by voice command 🎤
      </Text>
      <Text style={{fontSize: 20, marginTop: 8}}>
        Hit record to start{'\n'}
      </Text>
      <Text style={{fontSize: 20, marginTop: 8}}>
        Say a name of a spot on the court
      </Text>
      <Text style={{fontSize: 20, marginTop: 8}}>
        {'Then say "in" or "out"'}
      </Text>
      <Text>{'(You can also say "make","hit","good","miss")'}</Text>
      <Text style={{fontSize: 20, marginTop: 8}}>
        {
          'Recognized court spots: \n"Free-throw",\n"Left-corner-three",\n"left-wing-three",\n"top-of-the-key",\n"right-wing-three",\n"right-corner-three"'
        }
      </Text>

      <Text style={{fontSize: 24, marginTop: 24}}>Other useful commands:</Text>
      <Text style={{fontSize: 20, marginTop: 8}}>
        {'"HeatCheck": to hear your made shots total'}
      </Text>
      <Text style={{fontSize: 20, marginTop: 8}}>
        {'"Spot": to hear your current court location'}
      </Text>
      <Text style={{fontSize: 20, marginTop: 8}}>
        {'"Undo"/"Redo": to undo/redo previous shot'}
      </Text>
    </View>
  );
};

export default Instructions;
