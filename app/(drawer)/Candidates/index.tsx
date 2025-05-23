import CandidateCard from '@/components/CandidateCard';
import { FilterByAdvanceContent } from '@/components/FilterByAdvanceContent';
import { FilterByJobContent } from '@/components/FilterByJobContent';
import { FilterByLocationContent } from '@/components/FilterByLocationContent';
import { FilterByOtherContent } from '@/components/FilterByOtherContent';
import FilterTabsHorizontal, { Category } from '@/components/FilterTabsHorizontal';
import { ICandidate } from '@/components/Interfaces';
import BottomSheet from '@/components/PopupModal';
import { Colors } from '@/constants/Colors';
import { UserContext } from '@/services/userContext';
import { ApiService } from '@/services/userServices';
import { getGlobalStyles } from '@/styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, ToastAndroid, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function  Candidates() {
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


  const categories = [
    { id: '1', name: 'Job'},
    { id: '2', name: 'Advance Filter'},
    { id: '3', name: 'Location'},
    { id: '4', name: 'Others Filter'},
  ];

  const loadCandidate = async() => {
    if (loading || !hasMore) return;
    if (userData) {
      setLoading(true);
      const response = await ApiService.getCandidateList(userData.user_id,page)
      console.log(response);
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
    loadCandidate();
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
          content: <FilterByLocationContent/>,
        });
        break;
      case '4':
        setModalContent({
          title: 'Filter By Other',
          content: <FilterByOtherContent FilerByOtherChange={FilterByOtherValueChange}/>,
        });
        break;
      // Add more cases as needed
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
    }
  };

  const FilterByOtherValueChange = (data: any) => {
    if (Object.keys(data).length > 0) {
      refreshCandidateList(data);
    }
  }

  const FilterByAdvanceValueChange = (data : any) => {
    if (Object.keys(data).length > 0) {
      refreshCandidateList(data);
    }
  };

  const refreshCandidateList = (dataForFilter: any) => {
    if (userData) {
      setLoading(true)
      setModalVisible(false);
      setCandidates([]);
      ApiService.getCandidateList(userData.user_id,1,dataForFilter).then(data => {
        if (data.isSuccess == 'true') {
          let allCandidates : ICandidate[] = data.result;
          setCandidates(allCandidates)
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
      pathname: '/Candidates/AddCandidate',
      // params: { job_id: jobid },
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
  
  return (
    <SafeAreaView style={globalStyles.container}>
        <View style={{marginTop: 20}}>
          <FilterTabsHorizontal categories={categories} showFilterButton={true} onCategoryPress={handleCategoryPress}/>
        </View>
        <BottomSheet 
          visible={modalVisible} 
          onClose={hidePopup}
          title={modalContent.title}>{modalContent.content}</BottomSheet>
        <TouchableOpacity style={styles.fab} onPress={AddCandidate}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
        { !loading && candidates.length == 0 ? (
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
            data={candidates}
            renderItem={({ item }) => <CandidateCard candidate={item} AddWishlist={CallAddWishList} />}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onEndReached={loadCandidate}
            onEndReachedThreshold={0.5}
            ListFooterComponent={ ()=>(
              <View>
              {loading && <ActivityIndicator size={'large'} style={{marginTop:30, marginBottom:30}}/>}
              </View>
            )}
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
      paddingBottom: 80, // Extra space at bottom to account for 
    },
    fab: {
      position: 'absolute',
      right: 20,
      bottom: 20,
      backgroundColor: colors.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4, // for Android shadow
      shadowColor: '#000', // for iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      zIndex: 100
    },
  });
}