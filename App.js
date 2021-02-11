import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar, LogBox} from 'react-native';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import Navigator from './Navigator';

LogBox.ignoreAllLogs();

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    success: 'rgb(40, 167, 69)',
    muted: 'rgb(100,100,100)',
    danger: 'rgb(215, 5, 45)',
  },
};

const App = () => {
  StatusBar.setBarStyle('light-content');
  return (
    <NavigationContainer theme={darkTheme}>
      <Navigator />
    </NavigationContainer>
  );
};

export default App;
