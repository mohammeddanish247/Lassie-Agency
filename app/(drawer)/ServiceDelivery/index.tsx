import { ServiceDelivery } from '@/components/Interfaces';
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
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

const ServicesDelivery = () => {
    const [sd, setSD] = useState<ServiceDelivery[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { userData } = useContext(UserContext)
    const colorScheme = useColorScheme();
    const globalStyles = getGlobalStyles(colorScheme ?? 'light');
    
  const fetchSDList = async() =>{
    if (loading || !userData) return;
    try {
      setLoading(true);
      const response = await ApiService.get_service_delivery_list(userData.user_id)
      if (response.isSuccess === 'true') {
        setSD(response.result);
      }
    } catch (error) {
      console.error("Failed to fetch Orders:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchSDList()
  },[])

  const gotoDetails = (data :ServiceDelivery) =>{
    router.push({
      pathname: '/ServiceDelivery/ServiceDeliveryDetails',
      params: { DDdata: JSON.stringify(data) },
    });
  }

  const gotoAddServiceNotes = () =>{
    router.push({
      pathname: '/ServiceDelivery/AddDeliveryNote',
      // params: { data: JSON.stringify(data) },
    });
  }

  const Download = async (form_id : number) =>{
    try {
        await Linking.openURL(`https://selectmaids.org/api/service_delivery_notes_print.php?form_id=${form_id}`);
      } catch (error) {
        console.error('Failed to open URL:', error);
      }
  }

  // Card component for each candidate
  const ServiceDeliveryCard = ({ data } : {data : ServiceDelivery}) => (
    <View style={globalStyles.card}>
      {/* Candidate Details Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Candidate Details</Text>
          <View style={[styles.statusTag,data.c_verified.toLocaleLowerCase() === 'verified' ? styles.activeTag : styles.pendingTag]}>
            <Text style={styles.statusText}>{data.c_verified}</Text>
          </View>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>SI no: <Text style={styles.detailValue}>{data.form_no}</Text></Text>
          <Text style={styles.detailLabel}>Order No: <Text style={styles.detailValue}>{data.order_id}</Text></Text>
        </View>
        
        <Text style={styles.nameText}>{data.cname}</Text>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Mobile: <Text style={styles.detailValue}>{data.cmobile}</Text></Text>
          <Text style={styles.detailLabel}>Documents id : <Text style={styles.detailValue}>{data.cdocument}</Text></Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      {/* Employer Details Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Employer Details</Text>
          <View style={[styles.statusTag,data.e_verified.toLowerCase() === 'verified' ? styles.activeTag : styles.pendingTag]}>
            <Text style={styles.statusText}>{data.e_verified}</Text>
          </View>
        </View>
        <Text style={styles.nameText}>{data.ename}</Text>
        <Text style={styles.detailLabel}>Mobile: <Text style={styles.detailValue}>{data.emoble}</Text></Text>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.printButton} onPress={()=>Download(data.form_no)}>
          <Ionicons name="document-text-outline" size={18} color="#fff" />
          <Text style={styles.printButtonText}>Print/Download</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.viewButton} onPress={()=>gotoDetails(data)}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" />
      {loading ? (
            <View>
                <ActivityIndicator size={'large'} style={{alignItems:'center', marginTop : 20}}></ActivityIndicator>
            </View>
        ) : ( sd.length > 0 ? (
            <FlatList
              data={sd}
              renderItem={({ item }) => <ServiceDeliveryCard data={item} />}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={()=>fetchSDList()}
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
                 <TouchableOpacity onPress={fetchSDList} style={styles.button}>
                    <Text style={styles.ButtonText}>Refresh</Text>
                  </TouchableOpacity>
              </View>
            )
            // <View>
            //     {sd.map((sdItem, index) => (
            //     <ServiceDeliveryCard key={index} data={sdItem} />
            //     ))}
            // </View>
        )}
      
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={gotoAddServiceNotes}>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 50
  },
  sectionContainer: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start', // To prevent full width
  },
  activeTag: {
    backgroundColor: '#8BC34A', // Green for active
  },
  pendingTag: {
    backgroundColor: '#F7CB73', // Yellow for pending
  },
  statusText: {
    color: '#000', // Black text for better contrast
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize', // Makes "active" -> "Active"
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
  },
  detailValue: {
    color: '#333',
    fontWeight: '500',
  },
  nameText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginVertical: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  printButton: {
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
  printButtonText: {
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

export default ServicesDelivery;