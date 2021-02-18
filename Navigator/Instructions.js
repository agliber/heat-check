import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {Text} from '@heat-check/components';
import {useTheme} from '@react-navigation/native';

const Instructions = () => {
  return (
    <ScrollView contentInset={{top: 0, left: 0, bottom: 80, right: 0}}>
      <Text style={[styles.header1]}>How it works</Text>
      <Bubble>
        <Text style={[styles.header2]}>
          All stats are recorded by voice command 🎤
        </Text>
      </Bubble>
      <Bubble>
        {[
          '1. Hit record to start',
          '2. Say a spot like "free-throw"',
          '3. Then say "in" or "out"',
        ].map(text => (
          <Text key={text} style={[styles.paragraph]}>
            {text}
          </Text>
        ))}
      </Bubble>
      <Bubble>
        <Text style={[styles.paragraph]}>
          {
            'Recognized court spots: \n"Free-throw",\n"Left-corner-three",\n"left-wing-three",\n"top-of-the-key",\n"right-wing-three",\n"right-corner-three"'
          }
        </Text>
      </Bubble>
      <Bubble>
        <Text style={[styles.header2]}>Other useful commands:</Text>
        {[
          '"HeatCheck": to hear your made shots total',
          '"Spot": to hear your current court location',
          '"Undo"/"Redo": to undo/redo previous shot',
        ].map(text => (
          <Text key={text} style={[styles.paragraph]}>
            {text}
          </Text>
        ))}
      </Bubble>
    </ScrollView>
  );
};

const Bubble = ({children}) => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        padding: 16,
        borderRadius: 16,
        marginVertical: 8,
        borderColor: colors.border,
        borderWidth: 1,
      }}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  header1: {fontSize: 32, textAlign: 'center'},
  header2: {fontSize: 24},
  paragraph: {fontSize: 20, marginTop: 8},
});

export default Instructions;
