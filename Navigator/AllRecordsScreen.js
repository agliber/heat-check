import React from 'react';
import {FlatList, Text, View, Pressable} from 'react-native';
import {useTheme} from '@react-navigation/native';
import useAllRecords from './useAllRecords.js';

const AllRecordsScreen = ({navigation}) => {
  const {colors} = useTheme();
  const {records, loading, createRecord} = useAllRecords();
  return (
    <View>
      <FlatList
        data={records}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <Pressable
            style={{margin: 24, padding: 16, backgroundColor: colors.card}}
            onPress={() =>
              navigation.navigate('Record', {record: createRecord()})
            }>
            <Text>New</Text>
          </Pressable>
        )}
        renderItem={({item}) => (
          <Pressable
            style={{margin: 24, padding: 16, backgroundColor: colors.card}}
            onPress={() => navigation.navigate('Record', {record: item})}>
            <Text>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default AllRecordsScreen;
