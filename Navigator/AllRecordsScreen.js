import React from 'react';
import {FlatList, Text, View, Pressable} from 'react-native';
import {useTheme} from '@react-navigation/native';

const AllRecordsScreen = ({navigation}) => {
  const {colors} = useTheme();
  return (
    <View>
      <FlatList
        data={[{title: 'Record 0', id: 0}]}
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
