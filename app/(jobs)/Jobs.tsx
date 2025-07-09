import { FilterByAdvanceContent } from '@/components/FilterByAdvanceContent';
import { FilterByJobContent } from '@/components/FilterByJobContent';
import { FilterByJobTypeContent } from '@/components/FilterByJobTypeContent';
import { FilterByLocationContent } from '@/components/FilterByLocationContent';
import { FilterBySkillContent } from '@/components/FilterBySkillContent';
import FilterTabsHorizontal, { Category } from '@/components/FilterTabsHorizontal';
import AnimatedInput from '@/components/InputExpandable';
import { JobListing } from '@/components/Interfaces';
import JobCard from '@/components/JobCard';
import BottomSheet from '@/components/PopupModal';
import { ApiService } from '@/services/userServices';
import { getGlobalStyles } from '@/styles/globalStyles';
import { router, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const JobScreen = () => {
  const [showFilter , setShowFilter] = useState('true');
  const { showFilterTab, profileName } : { showFilterTab : string, profileName: string } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  const colors = Colors[colorScheme ?? 'light'];
  const [JobList, setJobList] = useState<JobListing[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{title: string; content: React.ReactNode;}>({ title: '', content: null });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterData] = useState('');

  const categories = [
    { id: '1', name: 'Looking For'},
    { id: '2', name: 'Job Type'},
    // { id: '3', name: 'Skills'},
    { id: '4', name: 'Advance Filter'},
    { id: '5', name: 'Location'},
  ];

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
     if (showFilterTab === 'false') {
        setShowFilter('false');
        const renamedData : any = { job_posting_for:  profileName};
        refreshJobList(renamedData);
        setFilterData(renamedData);
      } else {
        fetchJobs();
      }
  },[])

   const FilterByJobValueChange = (data : any) => {
    if (Object.keys(data).length > 0) {
      const renamedData : any = { job_posting_for: data.job_title };
      refreshJobList(renamedData);
      setFilterData(renamedData);
    }
  };

  const FilterByJobTypeValueChange = (data: any) => {
    if (Object.keys(data).length > 0) {
      const renamedData : any = { job_posting_job_type: data.job_type };
      refreshJobList(renamedData);
      setFilterData(renamedData);
    }
  }

  const FilterBySkillValueChange = (data : any) => {
    if (Object.keys(data).length > 0) {
      refreshJobList(data);
      setFilterData(data);
    }
  };

  const FilterByAdvanceValueChange = (data : any) => {
    console.log(data);
    
    if (Object.keys(data).length > 0) {
       const renamedData : any = {}
       renamedData.job_posting_for =  data.job_title
       renamedData.job_posting_job_type = data.job_type
       renamedData.job_posting_skill = data.jobseeker_skills
      refreshJobList(renamedData);
      setFilterData(renamedData);
    }
  };

  const handleSelectedLocation = (filterData : any) =>{
    if (Object.keys(filterData).length > 0) {
       const renamedData : any = Object.entries(filterData).reduce((acc, [key, value]) => {
          acc[`job_posting_${key}`] = value;
          return acc;
        }, {} as Record<string, any>);
      refreshJobList(renamedData);
      setFilterData(renamedData);
    }
  }

  const handleCategoryPress = (category: Category) => {
    switch (category.id) {
      case '1':
        setModalContent({
          title: 'Looking For',
          content: <FilterByJobContent onValueChange={FilterByJobValueChange}/>,
        });
        break;
      case '2':
        setModalContent({
          title: 'Filter By Job Type',
          content: <FilterByJobTypeContent onValueChange={FilterByJobTypeValueChange}/>,
        });
        break;
      case '3':
        setModalContent({
          title: 'Filter By Skills',
          content: <FilterBySkillContent onValueChange={FilterBySkillValueChange} />,
        });
        break;
      case '4':
        setModalContent({
          title: 'Advance Filter',
           content: <FilterByAdvanceContent onValueChange={FilterByAdvanceValueChange} isCandidate={false}/>,
        });
        break;
      case '5':
        setModalContent({
          title: 'Filter By Location',
           content: <FilterByLocationContent onValueChange={(x)=> handleSelectedLocation(x)}/>,
        });
        break;
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
          console.log(data.result);
          
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

  const handleSearch = (searchKey: string) =>{
    console.log(searchKey);
    const DataforFilter : any = {}
    DataforFilter.search_key = searchKey;
    refreshJobList(DataforFilter);
     setFilterData(DataforFilter);
  }

  const colorss = {
    primary: '#5B94E2',
    white: '#FFFFFF',
    secondary: '#FF0000'
  };

  return (
      <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'#5B94E2'} />
        {/* <View style={globalStyles.sectionContainer}> */}
          <View style={{flexDirection:'row', margin: 15, }}>
            { showFilter == 'true' && (
              <>
              <AnimatedInput colors={colorss} onSearch={handleSearch}></AnimatedInput>
              <FilterTabsHorizontal categories={categories} showFilterButton={false} onCategoryPress={handleCategoryPress}></FilterTabsHorizontal>
              </>
            )}
          </View>
          <BottomSheet 
          visible={modalVisible} 
          onClose={()=>  setModalVisible(false)}
          title={modalContent.title}>{modalContent.content}</BottomSheet>

        { !loading && JobList.length == 0 ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            style={{width: 200, height: 200, backgroundColor: colors.background}}
            autoPlay loop = {false}
            source={require('@/assets/animations/no-record-found.json')}
          />
          <Text style={{fontSize: 16, color: 'gray'}}>No Records Found</Text>
        </View>
        ) : (
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
        )}
          {/* </View> */}
      </SafeAreaView>
  )
}

export default JobScreen

const styles = StyleSheet.create({
    searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  searchInputContainer: {
    flex: 1,
    height: 46,
    backgroundColor: '#fff',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  searchInput: {
    fontSize: 15,
  },
  searchButton: {
    width: 46,
    height: 46,
    backgroundColor: '#4a90e2',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});