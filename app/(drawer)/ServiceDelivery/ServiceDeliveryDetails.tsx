import { ServiceDeliveryDetails } from '@/components/Interfaces';
import { ApiService } from '@/services/userServices';
import { getGlobalStyles } from '@/styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const DeliveryDetailsScreen = () => {
  const { DDdata } = useLocalSearchParams();
  const data = DDdata ? JSON.parse(DDdata as string) : null;
  const [sdDetails, setSDDetails] = useState<ServiceDeliveryDetails>();
  const [loading, setLoading] = useState(false);
        const colorScheme = useColorScheme();
        const globalStyles = getGlobalStyles(colorScheme ?? 'light');

  const fetchDetails = async() =>{
    if (loading) return;
    setLoading(true);
    const response = await ApiService.get_service_delivery_details(data.form_no)
    console.log(response);
    if (response.isSuccess === 'true') {
      setSDDetails(response.result[0]);
    }
    setLoading(false)
  }

  useEffect(()=>{
    fetchDetails();
  },[])

  const VerifyOTP = (user: string) => {
    console.log("Cliked Verify OTP");
    let d = {}
    if (user == 'Employer' && sdDetails) {
      d = {
        mobile_no: sdDetails.emoble,
        user: user,
        formNo: data.form_no
      }
    }
    if (user == 'Candidate' && sdDetails) {
      d = {
        mobile_no: sdDetails.cmobile,
        user: user,
        formNo: data.form_no
      }
    }

    router.push({
      pathname: '/VerifyOTP',
      params: { unParsedData : JSON.stringify(d) },
    });
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Main Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {loading ? (
            <View>
                <ActivityIndicator size={'large'} style={{alignItems:'center'}}></ActivityIndicator>
            </View>
        ) : (
        <View>

          <View style={globalStyles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Candidate Details</Text>
              {/* {data.c_verified && (
                <View style={styles.activeTag}>
                  <Text style={styles.activeText}>Active</Text>
                </View>
              )} */}
            </View>
            
            <View style={styles.detailsRow}>
              <Text style={styles.detailLabel}>SI no: <Text style={styles.detailValue}>{data.form_no}</Text></Text>
              <Text style={styles.detailLabel}>Order No: <Text style={styles.detailValue}>{data.order_id}</Text></Text>
            </View>
            
            <Text style={styles.nameText}>{sdDetails?.cname}</Text>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Mobile: <Text style={styles.detailValue}>{sdDetails?.cmobile}</Text></Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Father/Husband Name: <Text style={styles.detailValue}>{sdDetails?.cfamily}</Text></Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Documents id : <Text style={styles.detailValue}>{sdDetails?.cdocument}</Text></Text>
            </View>
          </View>

          <View style={globalStyles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Employer Details</Text>
              <Text style={styles.salaryText}>{sdDetails?.esalary}<Text style={styles.salaryPeriod}>/Mo</Text></Text>
            </View>
            
            <Text style={styles.nameText}>{sdDetails?.ename}</Text>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Mobile: <Text style={styles.detailValue}>{sdDetails?.emoble}</Text></Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Address: <Text style={styles.detailValue}>{sdDetails?.address}</Text></Text>
            </View>
            
            <View style={styles.jobDetailsContainer}>
              <View style={styles.jobDetailItem}>
                <Text style={styles.jobDetailText}>{sdDetails?.ejobcategory}</Text>
              </View>
              
              <View style={styles.jobDetailItem}>
                <Text style={styles.jobDetailText}>Joining date: {sdDetails?.ejoindate}</Text>
              </View>
              
              {/* <View style={styles.jobDetailItem}>
                <Text style={styles.jobDetailText}></Text>
              </View> */}
            </View>
          </View>
          { data.e_verified.toLowerCase() != 'verified' && <TouchableOpacity style={styles.printButton} onPress={()=> VerifyOTP('Employer')}>
            <Ionicons name="document-text-outline" size={20} color="#fff" />
            <Text style={styles.printButtonText}>Verify Employer</Text>
          </TouchableOpacity> }

          { data.c_verified.toLowerCase() != 'verified' &&  <TouchableOpacity style={styles.printButton} onPress={()=> VerifyOTP('Candidate')}>
            <Ionicons name="document-text-outline" size={20} color="#fff" />
            <Text style={styles.printButtonText}>Verify Candidate</Text>
          </TouchableOpacity>}
        
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
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
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activeTag: {
    backgroundColor: '#8BC34A',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  activeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailItem: {
    marginVertical: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    color: '#333',
    fontWeight: '500',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginVertical: 5,
  },
  salaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  salaryPeriod: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
  jobDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  jobDetailItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  jobDetailText: {
    fontSize: 12,
    color: '#555',
  },
  printButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a90e2',
    borderRadius: 5,
    paddingVertical: 12,
    marginTop: 5,
    marginBottom: 20,
  },
  printButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 16,
  },
});

export default DeliveryDetailsScreen;