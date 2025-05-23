import React, { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, FlatList, Modal, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, useColorScheme, View } from 'react-native';
import CurvedHeader from '../components/curvedHeader';
import { useLoader } from '../services/LoaderContext';
import { ApiService } from '../services/userServices';
import { getGlobalStyles } from '../styles/globalStyles';

const logo = require('../assets/images/logo.png');

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = getStyles(colorScheme ?? 'light');
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  const { showLoading } = useLoader();
  const [code, setCode] = React.useState<string[]>(['', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [OTP, setOTP] = useState(0);
  const [countryCodes, setCountryCodes] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState({
    country_name: 'INDIA',
    country_code: '91'
  });
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const codeInputRefs = React.useRef<(TextInput | null)[]>([]);
  const [isOtpComplete, setIsOtpComplete] = React.useState(false);

  useEffect(()=>{
    const initializeApp = async () => {
      ApiService.checkAuth()
      .then((token)=>{
        console.log('token.',token);
        
        if (token && token == 'true') { // do token == 'true'
          gotoMPINscreen();
        } else {
          console.log('Do nothing');
        }
      })
      .catch(err=>{

      }).finally(()=>{
        // hideLoader();
      })
    };

    const fetchCountryCodes = () => {
      ApiService.countryListCode()
      .then((data)=> setCountryCodes(data.result))
      .catch((error)=> console.log('Error fetching country codes:', error))
      .finally()
    }
  
    fetchCountryCodes();
    initializeApp();
  },[])

  useEffect(()=>{
    console.log(phoneNumber.length);
    if (phoneNumber.length == 10) {
      handleSendCode();
    }
  },[phoneNumber])

  const gotoMPINscreen = ()=>{
    ApiService.getUserData().then(data=>{
      router.replace({
      pathname: '/MPIN',
      params : {
          mobile : data.user_phone,
          isUserLoggedIn : 'true'
        }
      })
    })
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

  const SignUp = () => {
     router.push({
      pathname: '/Signup',
      params: {
      countryCodes: JSON.stringify(countryCodes), // must be string
    },
});
  };

  const LoginClicked = async (givenOTP : number) => {
    console.log(""+ givenOTP);
    if (isOtpComplete || givenOTP.toString().length == 4) {
      console.log(givenOTP);
      console.log(OTP);
      if (givenOTP === OTP) {
        ApiService.setAuth('true')
        gotoMPINscreen();
      } else {
        Alert.alert('OTP Alert!',`The OTP you entered doesn't match. Please check and try again.`)
      }
    } else {
      Alert.alert('OTP Alert!','Please enter the OTP to login to the app.')
    }
  };

  const handleCodeChange = (text : any, index : any) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    
    // Check if all fields are filled
    const allFilled = newCode.every(digit => digit.length === 1);
    setIsOtpComplete(allFilled);
    console.log(allFilled);
    
    // Auto focus to next input if current input is filled
    if (text.length === 1 && index < 3) {
      codeInputRefs.current[index + 1]?.focus();
    }
    if (allFilled) {
      LoginClicked(parseInt(newCode.join('')));
    }
  };

  const [countdown, setCountdown] = useState(0);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    let timer : any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = () => {
    if (phoneNumber.length === 10) {
      if (countdown === 0) {
        showLoading(true);
        ApiService.getOTPbyPhoneNumber(phoneNumber).then((data)=>{
          console.log(data);
          if (data.error == false) {
            setCountdown(60);
            setIsSent(true);
            setOTP(parseInt(data.user_otp));
            let userdata = {
              user_phone : phoneNumber,
              user_type : 'Agency'
            }
            ApiService.setUserData(userdata);
          } else {
            Alert.alert('Login Error',`Looks like this phone number isn't registered yet. Please sign up to get started.`);
          } 
        }).catch((err)=>{
            Alert.alert('OTP Error',(err.message+" "+err.name))
        }).finally(()=>{
          showLoading(false)
          codeInputRefs.current[0]?.focus();
        });
      }
    } else {
      ToastAndroid.show(`Please enter a valid mobile no.`, ToastAndroid.SHORT);
    }
  };

  const formatTime = (seconds : any) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  


  
  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        
        {/* Blue curved header */}
        <CurvedHeader subtitle='Please login to continue.'></CurvedHeader>
        
        {/* Phone number input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.InputContainer}>
          <TouchableOpacity 
            style={styles.countryCodeButton}
            onPress={() => setIsDropdownVisible(true)}>
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
        
        {/* Verification code */}
        <View style={globalStyles.verificationContainer}>
          <Text style={globalStyles.verificationText}>
            Please enter the 4 digit code sent to you
          </Text>
          <View style={globalStyles.codeInputContainer}>
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                style={globalStyles.codeInput}
                keyboardType="number-pad"
                maxLength={1}
                editable={phoneNumber.length == 10}
                value={code[index]}
                onChangeText={(text) => handleCodeChange(text, index)}
                ref={(ref) => {
                  codeInputRefs.current[index] = ref;
                }}
              />
            ))}
          </View>
        </View>
        
        {/* Resend code button */}
        <TouchableOpacity style={globalStyles.resendContainer} onPress={handleSendCode} disabled={countdown > 0}>
          <View style={[globalStyles.resendIconContainer, countdown > 0 && globalStyles.disabledIcon]}>
          {isSent ? <Ionicons name={'refresh-outline'}  style={globalStyles.resendIcon}></Ionicons> : 
          <Ionicons name={'arrow-forward-outline'}  style={globalStyles.resendIcon}></Ionicons>}
          </View>
          <Text style={[globalStyles.resendText, countdown > 0 && globalStyles.disabledButton]}>
            {countdown > 0 
              ? `Resend in ${formatTime(countdown)}` 
              : isSent ? 'Resend Code' : 'Send Code'}
          </Text>
        </TouchableOpacity>
        
        {/* Login button */}
        <TouchableOpacity style={globalStyles.loginButton} onPress={()=> LoginClicked(parseInt(code.join('')))}>
          <Text style={globalStyles .loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        {/* Sign up text */}
        <View style={globalStyles.signUpContainer}>
          <Text style={globalStyles.noAccountText}>Don't have an account? </Text>
          <TouchableOpacity onPress={SignUp}>
            <Text style={globalStyles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
      inputContainer: {
        marginTop: 80,
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
        fontSize: 20,
        fontWeight : 'bold',
        color: colors.text
      },
      countryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
      countryName: {
        fontSize: 16,
        color: colors.text,
      },
      countryCode: {
        fontSize: 16,
        color: colors.text,
      },
      closeButton: {
        padding: 15,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.border,
      },
      closeButtonText: {
        fontSize: 16,
        color: colors.primary,
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      dropdownContainer: {
        backgroundColor: colors.background,
        marginHorizontal: 20,
        borderRadius: 8,
        maxHeight: '60%',
      },
    })
  }
