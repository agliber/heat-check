import React, {useLayoutEffect} from 'react';
import {FlatList, Text, View, Pressable} from 'react-native';
import {useTheme} from '@react-navigation/native';
import useAllRecords from './useAllRecords.js';
import Icon from 'react-native-vector-icons/Feather';

const AllRecordsScreen = ({navigation}) => {
  const {colors} = useTheme();
  const {records, createRecord} = useAllRecords();

  useLayoutEffect(() => navigation.setOptions({headerShown: false}));

  return (
    <View style={{paddingHorizontal: 24, flex: 1}}>
      <View
        style={{
          marginTop: 64,
          marginHorizontal: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{fontSize: 32}}>All Records</Text>
        <Pressable
          hitSlop={16}
          onPress={() =>
            navigation.navigate('Record', {record: createRecord()})
          }>
          <Icon name="plus-circle" size={32} color={colors.primary} />
        </Pressable>
      </View>

      <FlatList
        style={{flex: 1}}
        data={records}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Pressable
            style={{
              padding: 16,
              backgroundColor: colors.card,
              borderRadius: 8,
              marginTop: 8,
            }}
            onPress={() => navigation.navigate('Record', {record: item})}>
            <Text>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default AllRecordsScreen;
