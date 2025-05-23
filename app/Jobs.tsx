import { FilterByJobContent } from '@/components/FilterByJobContent';
import FilterTabsHorizontal, { Category } from '@/components/FilterTabsHorizontal';
import JobCard from '@/components/JobCard';
import { getGlobalStyles } from '@/styles/globalStyles';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const JobScreen = () => {
  const colorScheme = useColorScheme();
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  const colors = Colors[colorScheme ?? 'light'];
  const { unParsedData } = useLocalSearchParams();
  const data = unParsedData ? JSON.parse(unParsedData as string) : null;
  const [modalVisible, setModalVisible] = useState(false);

  const categories = [
    { id: '1', name: 'Cook', icon: '👨‍🍳' },
    { id: '2', name: 'Maid', icon: '🧹' },
    { id: '3', name: 'Governess', icon: '👩‍🏫' },
    { id: '4', name: 'Home Nurse', icon: '👩‍⚕️' },
    { id: '5', name: 'Cook', icon: '👨‍🍳' },
    { id: '6', name: 'Maid', icon: '🧹' },
    { id: '7', name: 'Governess', icon: '👩‍🏫' },
    { id: '8', name: 'Home Nurse', icon: '👩‍⚕️' },
  ];

  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  }>({ title: '', content: null });

  const handleCategoryPress = (category: Category) => {
    // Determine which content to show based on the category
    switch (category.id) {
      case '1':
        setModalContent({
          title: 'Filter By Job',
          content: <FilterByJobContent/>,
        });
        break;
      // case 'filter2':
      //   setModalContent({
      //     title: 'Filter By Status',
      //     content: <StatusFilterContent />,
      //   });
      //   break;
      // Add more cases as needed
      default:
        setModalContent({
          title: 'Filter',
          content: <FilterByJobContent />,
        });
    }
    setModalVisible(true);
  };

  const GotoViewDetails = useCallback((jobid: string) => {
    router.push({
      pathname: '/EmpDetails',
      params: { job_id: jobid },
    });
  }, []);

  return (
      <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'#5B94E2'} />
        <View style={globalStyles.sectionContainer}>
          <FilterTabsHorizontal categories={categories} showFilterButton={true} onCategoryPress={handleCategoryPress}></FilterTabsHorizontal>
          <View style={{marginTop: 20, marginBottom: 150}}>
            <FlatList data={data} showsVerticalScrollIndicator={false} renderItem={({item}) => (
            <JobCard
              job={item}
              onViewDetails={()=> GotoViewDetails(item.job_id)}
            />
          )}></FlatList>
          </View>
        </View>
      </SafeAreaView>
  )
}

export default JobScreen

const styles = StyleSheet.create({
    
});