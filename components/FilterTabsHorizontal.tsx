import React from 'react';
import { View, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

export interface Category {
  id: string;
  name: string;
};

type CategoryListProps = {
  categories: Category[];
  showFilterButton?: boolean;
  onCategoryPress: (category: Category) => void; // Add this prop
};

const FilterTabsHorizontal = ({ categories, showFilterButton = true, onCategoryPress }: CategoryListProps) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const styles = getStyles(colorScheme ?? 'light');

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={styles.categoryButton}
      onPress={() => onCategoryPress(item)} // Add onPress handler
    >
      <View style={[styles.categoryIcon, { backgroundColor: colors.secondaryDark }]}>
        <Text style={[styles.categoryIconText, { color: colors.text }]}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.categoriesContainer}>
      {showFilterButton && (
        <TouchableOpacity style={styles.categoryButton}>
          <View style={[styles.categoryIcon, { backgroundColor: colors.primary }]}>
            <Ionicons 
              name="options-outline" 
              size={24} 
              style={{ padding: 10, color: colors.white }} 
            />
          </View>  
        </TouchableOpacity>
      )}
      
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
        contentContainerStyle={!showFilterButton && { paddingLeft: 15 }}
      />
    </View>
  );
};

export const getStyles = (colorScheme: 'light' | 'dark') => {
    const colors =  Colors[colorScheme];
    return StyleSheet.create({
        categoriesList: {
          flexGrow: 0,
        },
        categoriesContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
          marginLeft: 0
        },
        categoryButton: {
          alignItems: 'center',
          marginHorizontal: 8,
        },
        categoryIcon: {
          height: 42,
          borderRadius: 8,
          backgroundColor: colors.secondaryDark,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 5,
        },
        categoryIconText: {
          padding: 10,
          fontSize: 14,
          color: colors.text,
        },
      });
}

export default FilterTabsHorizontal;