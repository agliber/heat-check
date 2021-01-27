import React from 'react';
import {View, Text} from 'react-native';

const RecordScreen = ({navigation, route}) => {
  const record = route.params?.record;
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>{record.title}</Text>
    </View>
  );
};

export default RecordScreen;
