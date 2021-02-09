import {useReducer} from 'react';

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

  return {record, currentSpot, dispatch};
};

export default useRecord;
