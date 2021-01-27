import React from 'react';

import AllRecordsScreen from './AllRecordsScreen.js';
import RecordScreen from './RecordScreen.js';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

const Navigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AllRecords" component={AllRecordsScreen} />
      <Stack.Screen name="Record" component={RecordScreen} />
    </Stack.Navigator>
  );
};

export default Navigator;
