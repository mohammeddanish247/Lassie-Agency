import { FilterByJobContent } from '@/components/FilterByJobContent';
import { Category } from '@/components/FilterTabsHorizontal';
import { JobListing } from '@/components/Interfaces';
import JobCard from '@/components/JobCard';
import { ApiService } from '@/services/userServices';
import { getGlobalStyles } from '@/styles/globalStyles';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const JobScreen = () => {
  const colorScheme = useColorScheme();
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  const colors = Colors[colorScheme ?? 'light'];
  const [JobList, setJobList] = useState<JobListing[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterData] = useState('');


  const fetchJobs = async() => {
    if (loading || !hasMore) return;
    let response : any
    setLoading(true);
    if (filterValue != '') {
      console.log('inside if '+filterValue);
      response = await ApiService.job_list(page,filterValue)
    } else {
      console.log('inside else '+filterValue);
      response = await ApiService.job_list(page)
    }
    // console.log(response);
    if (response.isSuccess === 'true') {
      setJobList((existingItems) => [...existingItems, ...response.result]);
      setPage((prePage) => prePage + 1);
    } else {
      setHasMore(false)
    }
    setLoading(false)
  };
  
  useEffect(()=>{
     fetchJobs();
  },[])

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

  const refreshJobList = (dataForFilter: any) => {
      setLoading(true)
      setModalVisible(false);
      setJobList([]);
      ApiService.job_list(1,dataForFilter).then(data => {
        if (data.isSuccess == 'true') {
          setJobList(data.result)
          setHasMore(true);
          setPage(2);
          // setFilterData('');
        } else {
          console.log(data.message);
        }
      }).catch(err=>{
        console.log("inside catch");
      }).finally(()=>{
        setLoading(false)
      })
  }

  return (
      <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'#5B94E2'} />
        {/* <View style={globalStyles.sectionContainer}> */}
          {/* <FilterTabsHorizontal categories={categories} showFilterButton={true} onCategoryPress={handleCategoryPress}></FilterTabsHorizontal> */}

           <FlatList
            data={JobList}
            renderItem={({ item }) =>  <JobCard job={item} onViewDetails={()=> GotoViewDetails(item.job_id)}/> }
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{paddingHorizontal: 20, paddingVertical: 20}}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={()=>refreshJobList('')}
                colors={['#0066CC']}
                tintColor="#0066CC"
              />
            }
            showsVerticalScrollIndicator={false}
            onEndReached={fetchJobs}
            onEndReachedThreshold={0.5}
          />

          {/* </View> */}
      </SafeAreaView>
  )
}

export default JobScreen

const styles = StyleSheet.create({
    
});