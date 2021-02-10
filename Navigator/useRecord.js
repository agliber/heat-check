import {useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {playSwish, playClunk, playShoeSqueak} from './sounds.js';

const useRecord = initialRecord => {
  const [{record, currentSpot}, dispatch] = useReducer(reducer, {
    record: initialRecord,
    currentSpot: null,
  });

  useEffect(() => {
    if (record.name !== 'Untitled' || record.shots.length > 0) {
      AsyncStorage.setItem(record.id, JSON.stringify(record)).then(() => {
        console.log('record saved');
      });
    }
  }, [record]);

  return {record, currentSpot, dispatch};
};

const reducer = (state, action) => {
  if (action.type === 'command') {
    const command = action.payload;
    if (['LC3', 'RC3', 'LW3', 'RW3', 'T3', 'FT'].includes(command)) {
      playShoeSqueak();
      return {...state, currentSpot: command};
    } else if (['IN', 'OUT'].includes(command)) {
      if (command === 'IN') {
        playSwish();
      } else {
        playClunk();
      }
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
  } else if (action.type === 'rename') {
    return {
      ...state,
      record: {...state.record, name: action.payload},
    };
  }

  return state;
};

export default useRecord;
