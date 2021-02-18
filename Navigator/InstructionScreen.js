import React, {useLayoutEffect} from 'react';
import {View, Pressable} from 'react-native';
import Instructions from './Instructions.js';
import {useTheme} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

const InstructionScreen = ({navigation, route}) => {
  const {colors} = useTheme();

  // const instructionsVisible = !isRecording && spotShots.length === 0;
  useLayoutEffect(() => navigation.setOptions({headerShown: false}));

  return (
    <View style={{flex: 1, backgroundColor: colors.card}}>
      <View style={{margin: 16}}>
        <Pressable onPress={() => navigation.goBack()}>
          <FeatherIcon
            style={{marginRight: 2}}
            name="x"
            size={30}
            color={colors.primary}
          />
        </Pressable>
        <Instructions />
      </View>
    </View>
  );
};

export default InstructionScreen;
