import React from 'react';
import {Text} from 'react-native';
import {useTheme} from '@react-navigation/native';

const CustomText = ({style, children, ...props}) => {
  const {colors} = useTheme();
  return (
    <Text style={[{color: colors.text}, style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;
