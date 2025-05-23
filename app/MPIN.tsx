import { Colors } from '@/constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useContext, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import CurvedHeader from '../components/curvedHeader';
import { useLoader } from '../services/LoaderContext';
import { UserContext } from '../services/userContext';
import { ApiService } from '../services/userServices';

const MPIN = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = getStyles(colorScheme ?? 'light');
  const { mobile, isUserLoggedIn } = useLocalSearchParams();
  const formData  = { 
    mobile : mobile,
    isUserLoggedIn: isUserLoggedIn,
    mipn : ''
  }
  const { showLoading } = useLoader();
  const [mpin, setMpin] = useState<string>('');
  const [confirmMpin, setConfirmMpin] = useState<string>('');
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(isUserLoggedIn == 'true');
  
  // Refs for the TextInputs to handle focus
  const mpinInputRef = useRef<TextInput>(null);
  const confirmMpinInputRef = useRef<TextInput>(null);

  const { userData, setUserData } = useContext(UserContext);
  
  // Handle MPIN input
  const handleMpinChange = (text: string) => {
    // Only allow numbers and limit to 4 digits
    const newMpin = text.replace(/[^0-9]/g, '').slice(0, 4);
    setMpin(newMpin);
    if (isUserLoggedIn == 'true') {
      setConfirmMpin(newMpin)
    }
    // Auto focus to confirm MPIN when 4 digits are entered
    if (newMpin.length === 4) {
      confirmMpinInputRef.current?.focus();
    }
  };
  
  // Handle Confirm MPIN input
  const handleConfirmMpinChange = (text: string) => {
    // Only allow numbers and limit to 4 digits
    const newConfirmMpin = text.replace(/[^0-9]/g, '').slice(0, 4);
    setConfirmMpin(newConfirmMpin);
    
    // Hide keyboard when 4 digits are entered
    if (newConfirmMpin.length === 4) {
      Keyboard.dismiss();
    }
  };
  
  // Toggle terms agreement
  const toggleAgreeToTerms = () => {
    setAgreeToTerms(!agreeToTerms);
  };
  
  // Handle submit
  const handleSubmit = () => {
    // Validate inputs
    if (mpin.length !== 4) {
      Alert.alert('Please enter a 4-digit MPIN');
      return;
    }
    
    if (confirmMpin.length !== 4) {
      Alert.alert('Please confirm your MPIN');
      return;
    }
    
    if (mpin !== confirmMpin) {
      Alert.alert('MPINs do not match');
      return;
    }
    
    if (!agreeToTerms) {
      Alert.alert('Please agree to the terms and conditions');
      return;
    }
    console.log('MPIN created successfully:', mpin);
    formData.mipn = mpin
    if (isUserLoggedIn == 'true') {
      handleLogin(mobile, formData.mipn);
    } else {
      handleAgenctRegistration();
    }
  };

  const handleLogin = async (mobile : any, mpin: string) => {
    showLoading(true)
    console.log("Danish"+mobile, mpin);
    await ApiService.loginUsingMPIN(mobile,mpin).then(async (userData) =>{
      if (userData.error == false) {
        setUserData(userData);
        router.replace('/(drawer)/(tabs)/Home');
      } else {
        Alert.alert('Login Failed', userData.message);
        showLoading(false)
      }
    });
  }
  
  // Navigate to sign in
  const handleAgenctRegistration = async () => {
    showLoading(true)
    ApiService.agencyRegistration(formData)
    .then((response)=>{
      if (response.error == false) {
        Alert.alert('Success', 'Success! Your account is ready. Use your credentials to log in now.');
        router.replace('/Login')
        // navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [{ name: 'Login' }],
        //   })
        // );
      } else {
        Alert.alert('Registration Failed', response.message);
      }
      console.log('API Response:', response);
      // You can navigate to another screen or reset form here
    })
    .catch((error)=>{
      console.error('API Error:', error.message);
      Alert.alert('Error', 'Failed to submit registration. Please try again.');
    })
    .finally(()=>{
      showLoading(false)
    })


  };
  // Render masked MPIN
  const renderMaskedPin = (pin: string) => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <Text key={i} style={[styles.pinDot, i < pin.length ? styles.pinDotFilled : {}]}>
          *
        </Text>
      );
    }
    return dots;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content"  backgroundColor={colors.primary}/>
        
        {/* Blue curved header */}
        <CurvedHeader subtitle={isUserLoggedIn == 'true' ? 'Please Enter MPIN' : 'Please Create MPIN'}></CurvedHeader>
        
        {/* MPIN Form */}
        <View style={styles.formContainer}>
          {/* Create MPIN */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
            {isUserLoggedIn == 'true' ? 'Enter MPIN' : 'Create MPIN'}</Text>
            <TouchableOpacity 
              style={styles.pinContainer}
              onPress={() => mpinInputRef.current?.focus()}
            >
              <View style={styles.pinDotsContainer}>
                {renderMaskedPin(mpin)}
              </View>
              <TextInput
                ref={mpinInputRef}
                style={styles.hiddenInput}
                value={mpin}
                onChangeText={handleMpinChange}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </TouchableOpacity>
          </View>

          {/* Only show Confirm MPIN if user is not logged in */}
          {isUserLoggedIn != 'true' && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm MPIN</Text>
            <TouchableOpacity 
              style={styles.pinContainer}
              onPress={() => confirmMpinInputRef.current?.focus()}
            >
              <View style={styles.pinDotsContainer}>
                {renderMaskedPin(confirmMpin)}
              </View>
              <TextInput
                ref={confirmMpinInputRef}
                style={styles.hiddenInput}
                value={confirmMpin}
                onChangeText={handleConfirmMpinChange}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                />
              </TouchableOpacity>
            </View>
          )}
      
          {/* Only show Terms and Conditions if user is not logged in */}
          {isUserLoggedIn != 'true' && (
            <TouchableOpacity 
              style={styles.termsContainer}
              onPress={toggleAgreeToTerms}
              activeOpacity={0.7}
            >
              <View style={styles.checkbox}>
                {agreeToTerms && <View style={styles.checkboxInner} />}
              </View>
              <Text style={styles.termsText}>
                I agree with{' '}
                <Text style={styles.termsLink}>terms & conditions</Text>
              </Text>
            </TouchableOpacity>
          )}
          
          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, (!agreeToTerms || mpin.length !== 4 || confirmMpin.length !== 4) ? styles.submitButtonDisabled : {}]}
            onPress={handleSubmit}
            disabled={!agreeToTerms || mpin.length !== 4 || confirmMpin.length !== 4}
          >
            <Text style={styles.submitButtonText}>{isUserLoggedIn == 'true' ? 'Login' : 'Submit Now'}</Text>
          </TouchableOpacity>
          
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export const getStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.secondary,
    },
    formContainer: {
      marginTop: 50,
      paddingHorizontal: 20,
      paddingTop: 30,
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      color: '#222222',
      fontWeight: '500',
      marginBottom: 8,
    },
    pinContainer: {
      height: 50,
      borderRadius: 10,
      backgroundColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    pinDotsContainer: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    pinDot: {
      fontSize: 38,
      color: '#ccc',
      marginTop: 5
    },
    pinDotFilled: {
      color: '#333',
    },
    hiddenInput: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0,
    },
    termsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: '#4A90E2',
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxInner: {
      width: 12,
      height: 12,
      backgroundColor: '#4A90E2',
    },
    termsText: {
      fontSize: 14,
      color: '#333',
    },
    termsLink: {
      color: '#4A90E2',
      textDecorationLine: 'underline',
    },
    submitButton: {
      backgroundColor: '#4A90E2',
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    submitButtonDisabled: {
      opacity: 0.7,
    },
    submitButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
}

export default MPIN;