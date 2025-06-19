import { Colors } from '@/constants/Colors';
import { ApiService } from '@/services/userServices';
import { getGlobalStyles } from '@/styles/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

const OrderCard = ({ data } :  {data:any}) => {
  const colorScheme = useColorScheme();
  const styles = getStyle(colorScheme ?? 'light')
  const globalStyles = getGlobalStyles(colorScheme ?? 'light')

  const onViewDetails= (data : any) => {
     router.push({
      pathname: '/ClientsOrder/OrderDetails',
      params: { unParsedData: JSON.stringify(data) },
    });
  }

  const onDownloadDetails= async (item : any) => {
    try {
      await Linking.openURL(`https://selectmaids.org/api/order_print.php?id=${item.form_id}`);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  }
  
  return (
    <View style={globalStyles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardLabel}>SI no: #</Text>
          <Text style={styles.cardValue}>{data.sharelink_id}</Text>
          <Text style={styles.cardLabel}>  Form No: </Text>
          <Text style={styles.cardValue}>{data.form_id}</Text>
        </View>
        <View style={styles.activeTag}>
          <Text style={styles.activeText}>Active</Text>
        </View>
      </View>
      
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Mobile: </Text>
        <Text style={styles.cardValue}>{data.mobile}</Text>
      </View>
      
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Email: </Text>
        <Text style={styles.cardValue}>{data.email}</Text>
      </View>
      
      <View style={styles.cardRow}>
        <Text style={styles.cardLabel}>Address: </Text>
        <Text style={styles.cardValue}>{data.address}</Text>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.printButton} onPress={() => onDownloadDetails(data)}>
          <Ionicons name="document-text-outline" size={18} color="#fff" />
          <Text style={styles.printButtonText}>Print/Download</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => onViewDetails(data)}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ClientsOrder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  const styles = getStyle(colorScheme ?? 'light');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  const filteredOrders = orders.filter(order => 
    order.form_id.toString().includes(searchQuery.toLowerCase())
  );

  const loadOrders = async() => {
    setLoading(true);
    const response = await ApiService.get_order();
    if (response.isSuccess === 'true') {
      setOrders(response.result)
    }
    setLoading(false)
  };

  useEffect(()=>{
    loadOrders();
  },[])

  const gotoAddOrder = () =>{
    router.push({
        pathname: '/ClientsOrder/AddOrder',
        // params: { job_id: jobid },
      });
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'#5B94E2'}/>
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
      {/* Content */}
        <View style={globalStyles.sectionContainer}>
          {loading ? (
            <ActivityIndicator size={'large'} style={{alignItems:'center'}}></ActivityIndicator>
          ) : (
            <FlatList data={filteredOrders} keyExtractor={(item : any, index) => item.form_id} contentContainerStyle={styles.listContainer}
              renderItem={({item})=> <OrderCard data={item}></OrderCard>}
               refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={()=>loadOrders()}
                    colors={['#0066CC']} // Customize for iOS (Android uses progress background)
                    tintColor="#0066CC" // iOS only
                  />
                }
              ></FlatList>
          )}
        </View>
        <View style={styles.bottomPadding} />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={gotoAddOrder}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Styles remain the same as in the previous implementation
export const getStyle = (colorScheme : 'light' | 'dark') =>{
  const colors = Colors[colorScheme];
  return StyleSheet.create({
    listContainer: {
      paddingBottom: 150, // Extra space at bottom to account for 
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    cardHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardRow: {
      flexDirection: 'row',
      marginBottom: 6,
      flexWrap: 'wrap'
    },
    cardLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    cardValue: {
      fontSize: 14,
      color: colors.textSecondary,
      flexWrap: 'wrap'
    },
    activeTag: {
      backgroundColor: colors.success,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    activeText: {
      color: colors.white,
      fontSize: 12,
      fontWeight: '500',
    },
    cardActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    printButton: {
      backgroundColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      flex: 1,
      marginRight: 8,
    },
    printButtonText: {
      color: colors.white,
      marginLeft: 6,
      fontSize: 14,
      fontWeight: '500',
    },
    viewButton: {
      borderColor: colors.primary,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      flex: 1,
      marginLeft: 8,
    },
    viewButtonText: {
      color: colors.primary,
      fontSize: 14,
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
      backgroundColor: colors.primary,
      borderRadius: 28,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    bottomPadding: {
      height: 80,
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
  });
}

export default ClientsOrder;