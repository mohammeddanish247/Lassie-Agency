import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Checkbox from 'expo-checkbox'; // or your preferred checkbox component

export interface checkbox {
  id: string;
  name: string;
  checked: boolean;
}

interface CheckboxListProps {
  data: checkbox[];
  returnValue: (data : checkbox[]) => void;
}

export const CheckboxList: React.FC<CheckboxListProps> = ({ data, returnValue }) => {
  const [dataList, setDataList] = useState<checkbox[]>(data);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (dataList.some(i=> i.checked == true)) {
      returnValue(dataList);
    }
  }, [dataList]);
  
  const onValueChange = (id : string) =>{
    setDataList(prev=> prev.map(job => 
      job.id === id ? { ...job, checked: !job.checked } : { ...job, checked: false }
    ))
  }
  
  return (
<View style={styles.container}>
        <FlatList
          scrollEnabled= {false}
          data={dataList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.jobItem}>
              <Checkbox
                value={item.checked}
                onValueChange={() => onValueChange(item.id)}
                color={item.checked ? '#4630EB' : undefined}
                style={styles.checkbox}
              />
              <Text style={styles.jobLabel} onPress={() => onValueChange(item.id)}>
                {item.name}
              </Text>
            </View>
          )}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: '100%',
  },
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    marginRight: 12,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#ddd',
    width: 20,
    height: 20,
  },
  jobLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});