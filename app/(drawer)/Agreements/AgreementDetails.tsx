import { AgreementDetails } from '@/components/Interfaces';
import { ApiService } from '@/services/userServices';
import { getGlobalStyles } from '@/styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

const AgreementsDetails = () => {
   const { form_id } : {form_id : string} = useLocalSearchParams();
  console.log(form_id);

  const [agreementDetails, setAgreementDetails] = useState<AgreementDetails | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
        const colorScheme = useColorScheme();
        const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ApiService.get_Full_Agreement_Details(form_id);
        if (res.isSuccess === 'true' && res.result && res.result.length > 0) {
            console.log(res.result[0]);
          setAgreementDetails(res.result[0]);
        }
      } catch (error) {
        console.error("Error fetching agreement details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [form_id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading agreement details...</Text>
      </SafeAreaView>
    );
  }

  if (!agreementDetails) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>No agreement details found</Text>
        {/* <TouchableOpacity style={styles.backButtonPlain} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity> */}
      </SafeAreaView>
    );
  }

  const DownloadAgreement = async (form_id : string) =>{
    try {
        await Linking.openURL(`http://selectmaids.org/api/agreement_print.php?form_id=${form_id}`);
    } catch (error) {
        console.error('Failed to open URL:', error);
    }
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView style={styles.scrollView}>
        <View style={[globalStyles.card, {margin: 15, marginBottom: 50}]}>
          {/* Candidate Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Candidate Details</Text>
            <View style={styles.divider} />
            
            <Text style={styles.name}>{agreementDetails.canditate_name}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mobile: </Text>
              <Text style={styles.detailValue}>{agreementDetails.canditate_mobile}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address: </Text>
              <Text style={styles.detailValue}>{agreementDetails.canditate_address}</Text>
            </View>
          </View>
          
          {/* Employer Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employer Details</Text>
            <View style={styles.divider} />
            
            <View style={styles.employerHeader}>
              <Text style={styles.name}>{agreementDetails.employer_name}</Text>
              <Text style={styles.salary}>{agreementDetails.employer_salary}/Mo</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mobile: </Text>
              <Text style={styles.detailValue}>{agreementDetails.employer_moble}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address: </Text>
              <Text style={styles.detailValue}>{agreementDetails.employer_address}</Text>
            </View>
            
            <View style={styles.tagsContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{agreementDetails.employer_ejobcategory}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{agreementDetails.employer_working_hour}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Joining date: {agreementDetails.employer_joindate}</Text>
              </View>
            </View>
          </View>
          
          {/* Extra Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Extra Details</Text>
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Food Living Arrangement: </Text>
              <Text style={styles.detailValue}>{agreementDetails.food && agreementDetails.living ? 'Yes' : 'No'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Working Hour: </Text>
              <Text style={styles.detailValue}>{agreementDetails.employer_working_hour}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Free Replacement: </Text>
              <Text style={styles.detailValue}>{agreementDetails.free_replacment}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Aggrement Validity: </Text>
              <Text style={styles.detailValue}>{agreementDetails.aggrement_validity}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Consulting Charge: </Text>
              <Text style={styles.detailValue}>₹{agreementDetails.consulting_charge}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Month Deduction: </Text>
              <Text style={styles.detailValue}>{agreementDetails.month_deduction}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Place: </Text>
              <Text style={styles.detailValue}>{agreementDetails.place}</Text>
            </View>
          </View>
          
          {/* Agreements List Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Agreements List Fields are</Text>
            <View style={styles.divider} />
            
            <View style={styles.twoColumnLayout}>
              <View style={styles.column}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>SI. No: </Text>
                  <Text style={styles.detailValue}>#{agreementDetails.order_id}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Candidate Name: </Text>
                  <Text style={styles.detailValue}>{agreementDetails.canditate_name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Mobile: </Text>
                  <Text style={styles.detailValue}>{agreementDetails.canditate_mobile}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Employer Name: </Text>
                  <Text style={styles.detailValue}>{agreementDetails.employer_name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Mobile: </Text>
                  <Text style={styles.detailValue}>{agreementDetails.employer_moble}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Consultation Charge: </Text>
                  <Text style={styles.detailValue}>₹{agreementDetails.consulting_charge}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Aggrement Validity: </Text>
                  <Text style={styles.detailValue}>{agreementDetails.aggrement_validity}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Pay Type: </Text>
                  <Text style={styles.detailValue}>{agreementDetails.pay_type}</Text>
                </View>
              </View>
              <View style={styles.column}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Form Number: </Text>
                  <Text style={styles.detailValue}>{form_id}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Download Button */}
          <TouchableOpacity style={styles.downloadButton} onPress={()=> DownloadAgreement(form_id)}>
            <Ionicons name="download-outline" size={20} color="white" style={styles.downloadIcon} />
            <Text style={styles.downloadText}>Download</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF2FA',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#EBF2FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A90E2',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginBottom: 20,
  },

  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15, 
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 70
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
    flexWrap: 'wrap'
  },
  detailLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
  },
  employerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  salary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  tag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  twoColumnLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  downloadButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  downloadIcon: {
    marginRight: 8,
  },
  downloadText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AgreementsDetails;