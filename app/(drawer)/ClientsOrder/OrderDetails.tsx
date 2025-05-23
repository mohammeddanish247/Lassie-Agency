import { Colors } from '@/constants/Colors';
import { getGlobalStyles } from '@/styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const OrderDetailsScreen = () => {
  const colorScheme = useColorScheme();
  const styles = getStyle(colorScheme ?? 'light')
  const globalStyles = getGlobalStyles(colorScheme ?? 'light')
  // Get the order data passed from the previous screen
  const { unParsedData } = useLocalSearchParams();
  const orderData = unParsedData ? JSON.parse(unParsedData as string) : null;

  const onDownloadDetails= async () => {
    try {
      await Linking.openURL(`https://selectmaids.org/api/order_print.php?id=${orderData.form_id}`);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Content */}
      <View style={{flex: 1, padding: 15}}>
        <View style={globalStyles.card}>
          <View style={styles.topRow}>
            <View style={styles.idContainer}>
              <Text style={styles.label}>SI no: </Text>
              <Text style={styles.value}>#{orderData.sharelink_id}</Text>
            </View>
            <View style={styles.idContainer}>
              <Text style={styles.label}>Form No: </Text>
              <Text style={styles.value}>{orderData.form_id}</Text>
            </View>
          </View>
          
          <View style={styles.nameRow}>
            <Text style={styles.enterpriseName}>{orderData.name}</Text>
            <View style={styles.activeTag}>
              <Text style={styles.activeText}>Active</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Mobile: </Text>
            <Text style={styles.value}>{orderData.mobile}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Email: </Text>
            <Text style={styles.value}>{orderData.email}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Address: </Text>
            <Text style={styles.value}>{orderData.address}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Does your house have a servant quarter?: </Text>
            <Text style={styles.value}>{orderData.servant_quarter}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Budget for Hiring: </Text>
            <Text style={styles.value}>{orderData.hiring_budget}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Number of member in the house: </Text>
            <Text style={styles.value}>{orderData.number_of_member}</Text>
          </View>
          
          <View style={styles.jobDetails}>
            <View style={styles.jobTypeTag}>
              <Text style={styles.jobTypeText}>{orderData.description}</Text>
            </View>
            <View style={styles.jobTypeTag}>
              <Text style={styles.jobTypeText}>{orderData.service_required}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.printButton} onPress={() => onDownloadDetails()}>
            <Ionicons name="document-text-outline" size={18} color="#fff" />
            <Text style={styles.printButtonText}>Print/Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export const getStyle = (colorScheme : 'light' | 'dark') =>{
  const colors = Colors[colorScheme];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    idContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    enterpriseName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    activeTag: {
      backgroundColor: '#8bc34a',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    activeText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: '500',
    },
    detailRow: {
      flexDirection: 'row',
      marginBottom: 10,
      flexWrap: 'wrap',
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    value: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    jobDetails: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 10,
      marginBottom: 20,
    },
    jobTypeTag: {
      backgroundColor: '#f5f5f5',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      marginRight: 10,
    },
    jobTypeText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    printButton: {
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 6,
      alignSelf: 'center',
      width: '80%',
    },
    printButtonText: {
      color: colors.white,
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '500',
    },
  });
}


export default OrderDetailsScreen;