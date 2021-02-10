import React, {useLayoutEffect, useState} from 'react';
import {FlatList, Text, View, Pressable, Alert} from 'react-native';
import {useTheme, useNavigation} from '@react-navigation/native';
import useAllRecords from './useAllRecords.js';
import Icon from 'react-native-vector-icons/Feather';
import Swipeable from 'react-native-swipeable';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const AllRecordsScreen = ({navigation}) => {
  const {colors} = useTheme();
  const {records, createRecord, deleteRecord} = useAllRecords();

  useLayoutEffect(() => navigation.setOptions({headerShown: false}));

  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          marginTop: 64,
          marginHorizontal: 16,
          marginBottom: 16,
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
        scrollEnabled={scrollEnabled}
        data={records}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => (
          <View
            style={{height: 1, backgroundColor: colors.border, marginLeft: 16}}
          />
        )}
        renderItem={({item}) => (
          <RecordListItem
            record={item}
            setScrollEnabled={setScrollEnabled}
            deleteRecord={deleteRecord}
          />
        )}
      />
    </View>
  );
};

const RecordListItem = ({record, setScrollEnabled, deleteRecord}) => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  return (
    <Swipeable
      rightContent={
        <View
          style={{
            flex: 1,
            backgroundColor: 'red',
            justifyContent: 'center',
            paddingLeft: 16,
          }}>
          <Icon name="trash" size={32} color={colors.background} />
        </View>
      }
      rightActionActivationDistance={96}
      onSwipeStart={() => setScrollEnabled(false)}
      onSwipeRelease={() => setScrollEnabled(true)}
      onRightActionRelease={() =>
        Alert.alert(
          `Are you sure you want to delete "${record.name}"?`,
          'This action cannot be undone',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Delete',
              onPress: () => deleteRecord(record.id),
              style: 'destructive',
            },
          ],
          {cancelable: false},
        )
      }
      onRightActionActivate={() => {
        ReactNativeHapticFeedback.trigger('impactHeavy');
      }}>
      <Pressable
        style={{padding: 16}}
        onPress={() => {
          navigation.navigate('Record', {record: record});
        }}>
        <Text style={{fontSize: 20}}>{record.name}</Text>
      </Pressable>
    </Swipeable>
  );
};

export default AllRecordsScreen;
