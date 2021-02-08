import React from 'react';
import {FlatList, Text, View, Pressable} from 'react-native';
import {useTheme} from '@react-navigation/native';
import useRecords from './useRecords.js';

const AllRecordsScreen = ({navigation}) => {
  const {colors} = useTheme();
  const records = useRecords([
    {title: 'Record 0', id: 0, shots: []},
    {title: 'Record 1', id: 1, shots: []},
  ]);
  return (
    <View>
      <FlatList
        data={records}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <Pressable
            style={{margin: 24, padding: 16, backgroundColor: colors.card}}
            onPress={() => navigation.navigate('Record', {record: item})}>
            <Text>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default AllRecordsScreen;
