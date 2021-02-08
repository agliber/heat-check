import {useState} from 'react';

const useRecords = initialRecords => {
  const [records] = useState(initialRecords);

  return records;
};

export default useRecords;
