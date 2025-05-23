import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, FlatList } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';

export interface MultiCheckboxItem {
  id: string;
  name: string;
  checked: boolean;
}

interface MultiCheckboxListProps {
  data: MultiCheckboxItem[];
  onAddSelected: (allItems: MultiCheckboxItem[]) => void;
  addButtonLabel?: string;
}

export const MultiSelectCheckboxList: React.FC<MultiCheckboxListProps> = ({ 
  data, 
  onAddSelected,
  addButtonLabel = "Add Selected" 
}) => {
  const [items, setItems] = useState<MultiCheckboxItem[]>(data);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleAddSelected = () => {
    onAddSelected(items);
  };

  const selectedCount = items.filter(item => item.checked).length;

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled= {false}
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.itemContainer}
            onPress={() => toggleItem(item.id)}
          >
            <Checkbox
              value={item.checked}
              onValueChange={() => toggleItem(item.id)}
              color={item.checked ? '#4630EB' : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.itemLabel}>{item.name}</Text>
          </Pressable>
        )}
        // Optional performance/UI enhancements:
        initialNumToRender={10} // Optimize for your average list size
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true} // Helps with memory for large lists
        ListEmptyComponent={<Text>No items found</Text>} // Handle empty state
        ListFooterComponent={
          <TouchableOpacity 
            style={[
              styles.addButton,
              selectedCount === 0 && styles.addButtonDisabled
            ]} 
            onPress={handleAddSelected}
            disabled={selectedCount === 0}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.addButtonText}>
              {addButtonLabel} ({selectedCount})
            </Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 16,
  },
  itemContainer: {
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
  itemLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4630EB',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonDisabled: {
    backgroundColor: '#a7a7a7',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
});