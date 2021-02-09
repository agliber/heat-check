import React from 'react';
import {FlatList, Text, View, Pressable} from 'react-native';
import {useTheme} from '@react-navigation/native';
import useRecords from './useRecords.js';

const AllRecordsScreen = ({navigation}) => {
  const {colors} = useTheme();
  const {records, loading, createRecord} = useRecords();
  return (
    <View>
      <FlatList
        data={records}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <Pressable
            style={{margin: 24, padding: 16, backgroundColor: colors.card}}
            onPress={() =>
              createRecord().then(record => {
                console.log(record);
                navigation.navigate('Record', {record});
              })
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
