import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Checkbox from 'expo-checkbox'; // or your preferred checkbox component
import { checkbox } from './CheckboxList';

interface CheckboxListProps {
  data: checkbox[];
  onToggle: (id: string) => void;
}

const CountryList: React.FC<CheckboxListProps> = ({ data, onToggle }) => {
  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled= {false}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <Checkbox
              value={item.checked}
              onValueChange={() => onToggle(item.id)}
              color={item.checked ? '#4630EB' : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.jobLabel}>{item.name}</Text>
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

export default CountryList;