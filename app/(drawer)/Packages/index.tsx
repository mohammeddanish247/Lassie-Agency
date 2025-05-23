import { Package } from '@/components/Interfaces';
import { useLoader } from '@/services/LoaderContext';
import { ApiService } from '@/services/userServices';
import { getGlobalStyles } from '@/styles/globalStyles';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Packages = () => {
  const colorScheme = useColorScheme();
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  const colors = Colors[colorScheme ?? 'light'];
  const [packageList, setPackageList] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const { showLoading, showSuccess } = useLoader();
  


  useEffect(()=>{
    setLoading(true)
    showLoading(true)
    ApiService.getPackages()
    .then((res)=>{
        if (res.isSuccess === 'true') {
             console.log('package resp', res.result);
                let packages: Package[] = res.result;
                packages.sort((b, a) => {
                    const amountA = parseFloat(a.package_amount);
                    const amountB = parseFloat(b.package_amount);
                    return amountB - amountA;
                });
                setPackageList(packages);  
        }
    })
    .catch((err)=>{console.log('packages error', err);
    })
    .finally(()=>{
      setLoading(false);
      showLoading(false)
    })
  },[])


  return (
   <SafeAreaView style={globalStyles.container}>
  <StatusBar barStyle="light-content" backgroundColor={'#5B94E2'} />
  <ScrollView>
    <View style={{padding: 18}}>
      <View style={styles.headingContainer}>
        <Text style={styles.headingTextStyle}>Our Packages</Text>
        <Text style={styles.subtitleTextStyle}>Choose what works best for you</Text>
      </View>
    { !loading && packageList.length == 0 ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LottieView
            style={{width: 200, height: 200, backgroundColor: colors.background}}
            autoPlay loop = {false}
            source={require('@/assets/animations/no-record-found.json')}
          />
          <Text style={{fontSize: 16, color: 'gray'}}>No Records Found</Text>
        </View>
        ) : (
        packageList.map((pkg: Package) => (
        <View key={pkg.package_id} style={[styles.packageCard, {backgroundColor: '#FFFFFF'}]}>
          <View style={styles.cardContent}>
            <Text style={styles.titleText}>{pkg.package_title}</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Validity:</Text>
              <Text style={styles.detailValue}>{pkg.package_valid_days} Days</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Contacts Allowed:</Text>
              <Text style={styles.detailValue}>{pkg.package_contact_allow}</Text>
            </View>
            
            <View style={styles.descriptionContainer}>
              <Text style={styles.detailLabel}>Description: </Text>
              <Text style={styles.descriptionText}>
                {pkg.package_description.replace(/\r\n/g, '\n')}
              </Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>₹{pkg.package_amount}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.buyButton}
            onPress={() => console.log('Buy package:', pkg.package_id)}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      )))}
     
    </View>
  </ScrollView>            
</SafeAreaView>
  )
}

export default Packages

const styles = StyleSheet.create({
      headingContainer: {
       justifyContent: 'center', 
       alignItems: 'center',
       marginBottom: 22
    }, 
     headingTextStyle: {
        fontSize: 32,
        fontWeight: '700',
        color: 'black', 
        marginBottom: 8,
    },
     subtitleTextStyle: {
        fontSize: 18,
        fontWeight: '400',
        color: '#555', 
        textAlign: 'center',
    },
  packageCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardContent: {
    marginBottom: 12,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#34495e',
    marginRight: 6,
  },
  detailValue: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '400',
  },
  descriptionContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: '#2c3e50',
    flex: 1,
    flexShrink: 1,
    lineHeight: 20,
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  priceText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#27ae60',
  },
  usdPriceText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  buyButton: {
    backgroundColor: '#5B94E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});