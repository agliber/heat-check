import React from 'react';

import AllRecordsScreen from './AllRecordsScreen.js';
import RecordScreen from './RecordScreen.js';
import InstructionScreen from './InstructionScreen.js';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

const MainStackScreen = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="AllRecords" component={AllRecordsScreen} />
      <MainStack.Screen name="Record" component={RecordScreen} />
    </MainStack.Navigator>
  );
};

const Navigator = () => {
  return (
    <RootStack.Navigator
      mode="modal"
      screenOptions={{cardOverlayEnabled: true}}>
      <RootStack.Screen
        name="Main"
        component={MainStackScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="Instruction"
        component={InstructionScreen}
        options={{
          ...TransitionPresets.ModalPresentationIOS,
        }}
      />
    </RootStack.Navigator>
  );
};

export default Navigator;
