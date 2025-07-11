import CandidateCard from '@/components/CandidateCard';
import { FilterByAdvanceContent } from '@/components/FilterByAdvanceContent';
import { FilterByJobContent } from '@/components/FilterByJobContent';
import { FilterByLocationContent } from '@/components/FilterByLocationContent';
import { FilterByOtherContent } from '@/components/FilterByOtherContent';
import { Category } from '@/components/FilterTabsHorizontal';
import { ICandidate } from '@/components/Interfaces';
import BottomSheet from '@/components/PopupModal';
import RechargeScreen from '@/components/Recharge';
import { Colors } from '@/constants/Colors';
import { UserContext } from '@/services/userContext';
import { ApiService } from '@/services/userServices';
import { getGlobalStyles } from '@/styles/globalStyles';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, StatusBar, StyleSheet, Text, ToastAndroid, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function Wishlist() {
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
      const response = await ApiService.getCandidateList(userData.user_id,page, '', true)
      if (response.isSuccess === 'true') {
        console.log(response);
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

  useFocusEffect(
    useCallback(() => {
      // navigation.getParent()?.setOptions({
      //   headerTitle: 'Wishlist',
      // });
    }, [])
  );

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
      ApiService.getCandidateList(userData.user_id,dataForFilter).then(data => {
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

  const CallAddWishList = (value: boolean, candidate_id: string) =>{
    if (userData) {
      ApiService.addWishList(candidate_id, userData.user_id, 'false').then(res=>{
        console.log(res);
        if (res.error === false) {
          ToastAndroid.show(res.message,3000)
        } else {
          ToastAndroid.show(res,3000)
        }
      }).finally(()=>{
        setCandidates(prevData => prevData.filter(x => x.canditate_id !== candidate_id));
      })
    }
  }

  const onRefresh = async () => {
    console.log("Danish");
    setLoading(true);
    if (userData) {
      const response = await ApiService.getCandidateList(userData.user_id,1, '', true)
      if (response.isSuccess === 'true') {
        setCandidates([])
        console.log(response);
        setCandidates((existingItems) => [...existingItems, ...response.result]);
      }
    }
    setLoading(false);
  };

  const handleViewCV = (id: string) =>{
    router.push({
      pathname: '/ViewCV',
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
  
  return (
    <SafeAreaView style={styles.container}>
       <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
          <View style={globalStyles.circleContainer}>
            <View style={globalStyles.halfCircle} />
          </View>
        {/* <View style={{marginTop: 20}}>
          <FilterTabsHorizontal categories={categories} showFilterButton={true} onCategoryPress={handleCategoryPress}/>
        </View> */}
        <BottomSheet 
          visible={modalVisible} 
          onClose={hidePopup}
          title={modalContent.title}>{modalContent.content}</BottomSheet>
        { !loading && candidates.length == 0 ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            style={{width: 200, height: 200, backgroundColor: colors.background}}
            autoPlay loop = {false}
            source={require('@/assets/animations/no-record-found.json')}
          />
          <Text style={{fontSize: 16, color: 'gray'}}>No Records Found</Text>
          <TouchableOpacity onPress={loadCandidate} style={styles.button}>
                        <Text style={styles.ButtonText}>Refresh</Text>
                      </TouchableOpacity>
        </View>
        ) : (
          <FlatList
            data={candidates}
            renderItem={({ item }) => <CandidateCard candidate={item} AddWishlist={CallAddWishList} ViewCVClicked={handleViewCV} ContactClicked={handleContact} isWishlistView={true}/>}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onEndReached={loadCandidate}
            onEndReachedThreshold={0.5}
            refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={onRefresh}
                  colors={['#0066CC']} // Customize for iOS (Android uses progress background)
                  tintColor="#0066CC" // iOS only
                />
              }
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
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContainer: {
      padding: 15,
      paddingBottom: 80, // Extra space at bottom to account for navigation
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
      elevation: 4, // for Android shadow
      shadowColor: '#000', // for iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      zIndex: 100
    },
      button: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 25,
    backgroundColor: '#5B94E2',
  },
    ButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  });
}