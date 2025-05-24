import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import CurvedHeader from '../components/curvedHeader';
import { getGlobalStyles } from '../styles/globalStyles';


const logo = require('../assets/images/logo.png');

const SignUp = () => {
   const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = getStyles(colorScheme ?? 'light');
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  const params = useLocalSearchParams();
  const [countryCodes, setCountryCodes] = useState<any[]>([]);  
  // console.log(countryCodes);
  
  const [selectedCountry, setSelectedCountry] = useState({
    country_name: 'INDIA',
    country_code: '91'
  });
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    if (params.countryCodes) {
      try {
        const parsed = JSON.parse(params.countryCodes as string);
        setCountryCodes(parsed);
        console.log(countryCodes);
      } catch (error) {
        console.error('Failed to parse countryCodes:', error);
      }
    }
  }, [params.countryCodes]);

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!phoneNumber.trim() || phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }
    if (!businessName.trim()) {
      Alert.alert('Error', 'Please enter your business name');
      return false;
    }
    if (!industry.trim()) {
      Alert.alert('Error', 'Please enter your industry');
      return false;
    }
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter your city');
      return false;
    }
    if (!state.trim()) {
      Alert.alert('Error', 'Please enter your state');
      return false;
    }
    if (!country.trim()) {
      Alert.alert('Error', 'Please enter your country');
      return false;
    }
    return true;
  };
  
  const LogIn = () => {
    // navigation.goBack()
  }

  const Next = () => {
    if (!validateForm()) return;
    let formData = {
        agency_name: fullName,
        agency_email_id: email,
        agency_mobaile: phoneNumber,
        business_name: businessName,
        industry: industry,
        city: city,
        state: state,
        country_name: country,
        country_code: '+91',
        mipn: '0'
      }
    router.push({
      pathname: '/VerifyOTP',
      params: {
      unParsedData: JSON.stringify(formData), // must be string
    },
    });
  }
  
  const renderCountryItem = ({item } : {item : any}) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        setSelectedCountry(item);
        setIsDropdownVisible(false);
      }}
    >
      <Text style={styles.countryName}>{item.country_name}</Text>
      <Text style={styles.countryCode}>{item.country_code}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
        {/* Blue curved header */}
        <CurvedHeader subtitle='Please Enter Details to Register.'></CurvedHeader>
        
        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, {marginTop: 50}]}>Full Name</Text>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="John Doe"
              placeholderTextColor={colors.textSecondary}
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Id</Text>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="JohnDoe@gmail.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

         {/* Phone number input */}
         <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.InputContainer}>
          <TouchableOpacity 
          style={styles.countryCodeButton}
          onPress={() => setIsDropdownVisible(true)}
        >
          <Text style={styles.countryCodeText}>+{selectedCountry.country_code}</Text>
          <Text style={styles.downArrow}>▼</Text>
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          placeholder="9 1 2 3 4 5 6 7 8 0"
          placeholderTextColor={colors.textSecondary}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          maxLength={10}
        />
        </View>

        <Modal
          visible={isDropdownVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsDropdownVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.dropdownContainer}>
                <FlatList
                  data={countryCodes}
                  renderItem={renderCountryItem}
                  keyExtractor={(item : any) => item.country_id}
                  keyboardShouldPersistTaps="handled"
                />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsDropdownVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        </View>

        {/* Business Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Business Name</Text>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="John Doe Pvt Ldt."
              placeholderTextColor={colors.textSecondary}
              value={businessName}
              onChangeText={setBusinessName}
            />
          </View>
        </View>

        {/* Industry Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Industry</Text>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Industry"
              placeholderTextColor={colors.textSecondary}
              value={industry}
              onChangeText={setIndustry}
            />
          </View>
        </View>
        
          {/* City Name */}
          <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>City Name</Text>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter City Name"
              placeholderTextColor={colors.textSecondary}
              value={city}
              onChangeText={setCity}
            />
          </View>
        </View>

          {/* State Name */}
          <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>State</Text>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter State Name"
              placeholderTextColor={colors.textSecondary}
              value={state}
              onChangeText={setState}
            />
          </View>
        </View>

          {/* Country Name */}
          <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Country</Text>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter Country"
              placeholderTextColor={colors.textSecondary}
              value={country}
              onChangeText={setCountry}
            />
          </View>
        </View>
        
        {/* Login button */}
        <TouchableOpacity style={styles.loginButton} onPress={Next}>
          <Text style={styles.loginButtonText}>Next</Text>
        </TouchableOpacity>
        
        {/* Sign in text */}
        <View style={globalStyles.signUpContainer}>
          <Text style={globalStyles.noAccountText}>Do you already have an account? </Text>
          <TouchableOpacity onPress={LogIn}>
            <Text style={globalStyles.signUpText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default SignUp

const getStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    inputContainer: {
      marginTop: 25,
      paddingHorizontal: 25,
    },
    inputLabel: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
      fontWeight : '500',
    },
    InputContainer: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.card,
      overflow: 'hidden',
  
      // Shadow for iOS
        shadowColor: colors.border,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
  
        // Shadow for Android
        elevation: 1,
    },
    countryCodeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 15,
      paddingVertical: 15,
    },
    countryCodeText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: 'bold',
    },
    downArrow: {
      color: colors.white,
      fontSize: 10,
      marginLeft: 5,
    },
    textInput: {
      flex: 1,
      paddingHorizontal: 15,
      fontSize: 16,
      color: colors.text
    },
    loginButton: {
      backgroundColor: colors.primary,
      borderRadius: 25,
      paddingVertical: 15,
      marginHorizontal: 20,
      alignItems: 'center',
      marginTop: 40,
    },
    loginButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    countryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    countryName: {
      fontSize: 16,
    },
    countryCode: {
      fontSize: 16,
      color: '#666',
    },
    closeButton: {
      padding: 15,
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    closeButtonText: {
      fontSize: 16,
      color: '#007AFF',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    dropdownContainer: {
      backgroundColor: 'white',
      marginHorizontal: 20,
      borderRadius: 8,
      maxHeight: '60%',
    },
  });
}