import {useReducer} from 'react';
import keyWord from './keyWord.json';

const reducer = (state, command) => {
  if (['LC3', 'RC3', 'LW3', 'RW3', 'T3', 'FT'].includes(command)) {
    return {...state, currentSpot: command};
  } else if (['IN', 'OUT'].includes(command)) {
    const shot = {
      spot: state.currentSpot,
      timestamp: new Date().toISOString(),
      made: command === 'IN' ? true : false,
    };
    return {
      ...state,
      record: {...state.record, shots: [...state.record.shots, shot]},
    };
  }
  return state;
};

const useRecord = initialRecord => {
  const [{record, currentSpot}, dispatch] = useReducer(reducer, {
    record: initialRecord,
    currentSpot: null,
  });

  const commandMap = new Map();
  Object.entries(keyWord).forEach(([command, aliases]) => {
    aliases.forEach(alias => commandMap.set(alias, command));
  });

  const matchSpeechToCommand = speech => {
    const words = speech.toLowerCase().split(' ');

    // console.log('last word', words.slice(-1).join(' '));
    // console.log('last 2 words', words.slice(-2).join(' '));
    // console.log('last 3 words', words.slice(-3).join(' '));
    // console.log('last 4 words', words.slice(-4).join(' '));

    const command =
      commandMap.get(words.slice(-1).join(' ')) ?? // last word heard
      commandMap.get(words.slice(-2).join(' ')) ?? // last 2 words
      commandMap.get(words.slice(-3).join(' ')) ?? // last 3 words
      commandMap.get(words.slice(-4).join(' ')); // last 3 words
    // console.log('command heard: ', command);
    return command;
  };

  return {record, currentSpot, dispatch, matchSpeechToCommand};
};

export default useRecord;
