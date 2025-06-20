import { Agreement } from '@/components/Interfaces';
import { UserContext } from '@/services/userContext';
import { ApiService } from '@/services/userServices';
import { getGlobalStyles } from '@/styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

const Agreements = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [agreementList, setAgreementList] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(UserContext)
  const colorScheme = useColorScheme();
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  
   // Filter agreements based on search query
   const filteredAgreements = agreementList.filter(agreement => 
    agreement.form_no.toString().includes(searchQuery.toLowerCase())
  );

  const fetchAgreement = async() =>{
    if (loading || !userData) return;
    try {
      setLoading(true);
      const response = await ApiService.get_agreements(userData.user_id);
      if (response.isSuccess === 'true') {
        setAgreementList(response.result);
        console.log("Agreement fetched");
      }
    } catch (error) {
      console.error("Failed to fetch agreements:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchAgreement()
  },[])

  const DownloadAgreement = async (form_id : number) =>{
    try {
        await Linking.openURL(`http://selectmaids.org/api/agreement_print.php?form_id=${form_id}`);
      } catch (error) {
        console.error('Failed to open URL:', error);
      }
  }

  const AgreementDetails = async (form_id : number) =>{
    router.push({
      pathname: '/Agreements/AgreementDetails',
      params: { form_id: form_id.toString() },
    });
  }

  const gotoAddAgreement = ()=>{
    router.push({
      pathname: '/Agreements/AddAgreement',
    });
  }

  // Agreement Card component
  const AgreementCard = ({ data }: {data : Agreement}) => (
    <View style={globalStyles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>SI. No: <Text style={styles.value}>{data.form_no}</Text></Text>
        <Text style={styles.label}>Form Number: <Text style={styles.value}>{data.order_id}</Text></Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Candidate Name: <Text style={styles.value}>{data.cname}</Text></Text>
        <Text style={styles.label}>Mobile: <Text style={styles.value}>{data.cmobile}</Text></Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Employer Name: <Text style={styles.value}>{data.ename}</Text></Text>
        <Text style={styles.label}>Mobile: <Text style={styles.value}>{data.emoble}</Text></Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Consultation Charge: <Text style={styles.value}>{data.consulting_charge}</Text></Text>
        <Text style={styles.label}>Pay Type: <Text style={styles.value}>{data.pay_type}</Text></Text>
      </View>
      
      <Text style={styles.label}>Agreement Validity: <Text style={styles.value}>{data.agr_date}</Text></Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.downloadButton} onPress={()=> DownloadAgreement(data.form_no)}>
          <Ionicons name="document-text-outline" size={18} color="#fff" />
          <Text style={styles.downloadButtonText}>Download</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.viewButton} onPress={()=> AgreementDetails(data.form_no)}>
          <Text style={styles.viewButtonText}>View Agreement</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by form no"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View>
            <ActivityIndicator size={'large'} style={{alignItems:'center'}}></ActivityIndicator>
        </View> ) : (
        filteredAgreements.length > 0 ? (
        <FlatList
          data={filteredAgreements}
          keyExtractor={(item) => item.form_no.toString()} // or another unique identifier
          renderItem={({ item }) => <AgreementCard data={item} />}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={()=>fetchAgreement()}
              colors={['#0066CC']} // Customize for iOS (Android uses progress background)
              tintColor="#0066CC" // iOS only
            />
          }
        />
        ) : (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            style={{width: 200, height: 200, backgroundColor: '#F5F9FF'}}
            autoPlay loop = {false}
            source={require('@/assets/animations/no-record-found.json')}
          />
          <Text style={{fontSize: 16, color: 'gray'}}>No Records Found</Text>
            <TouchableOpacity onPress={fetchAgreement} style={styles.button}>
              <Text style={styles.ButtonText}>Refresh</Text>
            </TouchableOpacity>
        </View>
      )
      )}
      
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={gotoAddAgreement}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 150,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  value: {
    color: '#333',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a90e2',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    flex: 1,
    marginRight: 10,
  },
  downloadButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '500',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#4a90e2',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    flex: 1,
  },
  viewButtonText: {
    color: '#4a90e2',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 50,
    backgroundColor: '#4a90e2',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
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

export default Agreements;