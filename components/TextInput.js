import React from 'react';
import {TextInput} from 'react-native';
import {useTheme} from '@react-navigation/native';

// https://reactnative.dev/docs/text#limited-style-inheritance
const CustomTextInput = ({style, ...props}) => {
  const {colors} = useTheme();
  return (
    <TextInput
      style={[{color: colors.text}, style]}
      placeholderTextColor={colors.disabled}
      {...props}
    />
  );
};

export default CustomTextInput;
