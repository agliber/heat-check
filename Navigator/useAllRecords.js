import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values'; // https://www.npmjs.com/package/uuid#react-native--expo
import {v4 as uuidv4} from 'uuid';

const useAllRecords = () => {
  const [records, setRecords] = useState();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // AsyncStorage.clear();
    AsyncStorage.getAllKeys()
      .then(keys => {
        console.log('keys', keys);
        return AsyncStorage.multiGet(keys);
      })
      .then(entries => {
        console.log('entries', entries);
        setRecords(entries.map(([key, value]) => JSON.parse(value)));
      })
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  const createRecord = () => {
    const record = {
      name: 'Untitled',
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      shots: [],
    };
    return AsyncStorage.setItem(record.id, JSON.stringify(record))
      .then(() => record)
      .catch(error => console.log(error));
  };

  return {records, loading, createRecord};
};

export default useAllRecords;
