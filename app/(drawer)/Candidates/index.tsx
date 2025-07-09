import CandidateCard from '@/components/CandidateCard';
import { FilterByAdvanceContent } from '@/components/FilterByAdvanceContent';
import { FilterByJobContent } from '@/components/FilterByJobContent';
import { FilterByLocationContent } from '@/components/FilterByLocationContent';
import { FilterByOtherContent } from '@/components/FilterByOtherContent';
import FilterTabsHorizontal, { Category } from '@/components/FilterTabsHorizontal';
import AnimatedInput from '@/components/InputExpandable';
import { ICandidate } from '@/components/Interfaces';
import BottomSheet from '@/components/PopupModal';
import RechargeScreen from '@/components/Recharge';
import { Colors } from '@/constants/Colors';
import { UserContext } from '@/services/userContext';
import { ApiService } from '@/services/userServices';
import { getGlobalStyles } from '@/styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useContext, useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, ToastAndroid, TouchableOpacity, useColorScheme, View } from 'react-native';

interface CandidatesProps {
  showFab?: boolean;
  addCandidateRoute?: string;
  viewCVRoute?: string;
  Route?: string
  profileName?: string
}

export default function Candidates({ 
  showFab = true, 
  addCandidateRoute = '/Candidates/AddCandidate',
  viewCVRoute = '/(drawer)/Candidates/ViewCV',
  Route = 'drawer',
  profileName = ''
}: CandidatesProps) {
  const { userData } = useContext(UserContext);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = getStyles(colorScheme ?? 'light');
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  }>({ title: '', content: null });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filterValue, setFilterData] = useState('');

  const categories = [
    { id: '1', name: 'Job'},
    { id: '2', name: 'Advance Filter'},
    { id: '3', name: 'Location'},
    { id: '4', name: 'Others Filter'},
  ];

  const loadCandidate = async() => {
    if (loading || !hasMore) return;
    if (userData) {
      let response : any
      setLoading(true);
      if (filterValue != '') {
        console.log('inside if '+filterValue);
        response = await ApiService.getCandidateList(Route,userData.user_id,page,filterValue)
      } else {
        console.log('inside else '+filterValue);
        response = await ApiService.getCandidateList(Route,userData.user_id,page)
      }
      
      if (response.isSuccess === 'true') {
        setCandidates((existingItems) => [...existingItems, ...response.result]);
        setPage((prePage) => prePage + 1);
      } else {
        setHasMore(false)
      }
      setLoading(false)
    }
  };

  useEffect(() => {
    if (Route === 'stack') {
      const renamedData : any = { job_title:  profileName};
      refreshCandidateList(renamedData);
      setFilterData(renamedData);
    } else {
      loadCandidate();
    }
  },[])

  const handleCategoryPress = (category: Category) => {
    switch (category.id) {
      case '1':
        setModalContent({
          title: 'Filter By Job',
          content: <FilterByJobContent onValueChange={FilterByJobValueChange}/>,
        });
        break;
      case '2':
        setModalContent({
          title: 'Advance Filter',
          content: <FilterByAdvanceContent onValueChange={FilterByAdvanceValueChange}/>,
        });
        break;
      case '3':
        setModalContent({
          title: 'Filter By Location',
          content: <FilterByLocationContent onValueChange={handleSelectedLocation}/>,
        });
        break;
      case '4':
        setModalContent({
          title: 'Filter By Other',
          content: <FilterByOtherContent FilerByOtherChange={FilterByOtherValueChange}/>,
        });
        break;
      default:
        setModalContent({
          title: 'Filter',
          content: <FilterByJobContent onValueChange={FilterByJobValueChange}/>,
        });
    }
    setModalVisible(true);
  };

  const FilterByJobValueChange = (data : any) => {
    if (Object.keys(data).length > 0) {
      refreshCandidateList(data);
      setFilterData(data);
    }
  };

  const FilterByOtherValueChange = (data: any) => {
    if (Object.keys(data).length > 0) {
      refreshCandidateList(data);
      setFilterData(data);
    }
  }

  const FilterByAdvanceValueChange = (data : any) => {
    if (Object.keys(data).length > 0) {
      refreshCandidateList(data);
      setFilterData(data);
    }
  };

  const handleSelectedLocation = (filterData : any) =>{
    if (Object.keys(filterData).length > 0) {
      const renamedData : any = Object.entries(filterData).reduce((acc, [key, value]) => {
        acc[`jobseeker_your${key}`] = value;
        return acc;
      }, {} as Record<string, any>);
      refreshCandidateList(renamedData);
      setFilterData(renamedData);
    }
  }

  const refreshCandidateList = (dataForFilter: any) => {
    if (userData) {
      setLoading(true)
      setModalVisible(false);
      setCandidates([]);
      ApiService.getCandidateList(Route,userData.user_id,1,dataForFilter).then(data => {
        if (data.isSuccess == 'true') {
          let allCandidates : ICandidate[] = data.result;
          setCandidates(allCandidates)
          setHasMore(true);
          setPage(2);
        } else {
          console.log(data.message);
        }
      }).catch(err=>{
        console.log("inside catch");
      }).finally(()=>{
        setLoading(false)
      })
    }
  }

  const hidePopup = () =>{
    setModalVisible(false);
  }

  const AddCandidate = () =>{
    router.push({
      pathname: addCandidateRoute as any,
    });
  }

  const CallAddWishList = (value: boolean, candidate_id: string) =>{
    if (userData) {
      ApiService.addWishList(candidate_id, userData.user_id, `${value}`).then(res=>{
        console.log(res);
        if (res.error === false) {
          ToastAndroid.show(res.message,3000)
        } else {
          ToastAndroid.show(res,3000)
        }
      });
    }
  }

  const handleViewCV = (id: string) =>{
    router.push({
      pathname: viewCVRoute as any,
      params: { id: id },
    });
  }

  const handleContact = (id: string) =>{
    setModalContent({
      title: '',
      content: <RechargeScreen candidateID={id} closeModal={()=>setModalVisible(false)}></RechargeScreen>,
    });
    setModalVisible(true)
  }

  const handleSearch = (searchKey: string) =>{
    console.log(searchKey);
    const DataforFilter : any = {}
    DataforFilter.search_key = searchKey;
    refreshCandidateList(DataforFilter);
     setFilterData(DataforFilter);
  }

  const colorss = {
    primary: '#5B94E2',
    white: '#FFFFFF',
    secondary: '#FF0000'
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={{flexDirection:'row', margin: 15, }}>
          <AnimatedInput colors={colorss} onSearch={handleSearch}></AnimatedInput>
          <FilterTabsHorizontal categories={categories} showFilterButton={false} onCategoryPress={handleCategoryPress}></FilterTabsHorizontal>
      </View>

      <BottomSheet 
        visible={modalVisible} 
        onClose={hidePopup}
        title={modalContent.title}
      >
        {modalContent.content}
      </BottomSheet>

      {showFab && (
        <TouchableOpacity style={styles.fab} onPress={AddCandidate}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}

      { !loading && candidates.length == 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            style={{width: 200, height: 200, backgroundColor: colors.background}}
            autoPlay 
            loop = {false}
            source={require('@/assets/animations/no-record-found.json')}
          />
          <Text style={{fontSize: 16, color: 'gray'}}>No Records Found</Text>
        </View>
      ) : (
        <FlatList
          data={candidates}
          renderItem={({ item }) => 
            <CandidateCard 
              candidate={item} 
              AddWishlist={CallAddWishList} 
              ViewCVClicked={handleViewCV} 
              ContactClicked={handleContact}
            />
          }
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={()=>refreshCandidateList('')}
              colors={['#0066CC']}
              tintColor="#0066CC"
            />
          }
          showsVerticalScrollIndicator={false}
          onEndReached={loadCandidate}
          onEndReachedThreshold={0.5}
        />
      )}
    </SafeAreaView>
  );
};

export const getStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  return StyleSheet.create({
    listContainer: {
      padding: 15,
      paddingBottom: 80,
    },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 50,
      backgroundColor: colors.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      zIndex: 100
    },
  });
}