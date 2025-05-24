import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import CurvedHeader from '../components/curvedHeader';
import { useLoader } from '../services/LoaderContext';
import { getGlobalStyles } from '../styles/globalStyles';

interface VerifyOTPProps {}

const VerifyOTP = ({route, navigation}: {route : any, navigation :any}) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const globalStyles = getGlobalStyles(colorScheme ?? 'light');
    const { unParsedData } = useLocalSearchParams();
    const formData = unParsedData ? JSON.parse(unParsedData as string) : null;
    const mobileNumber = formData.agency_mobaile;
    const [code, setCode] = React.useState<string[]>(['', '', '', '']);
    const codeInputRefs = React.useRef<(TextInput | null)[]>([]);
    const { showLoading } = useLoader();
    const [OTP, setOTP] = useState('');

    useEffect(() => {
        showLoading(true);
        if (formData.user == 'Employer' || formData.user == 'Candidate') {
            console.log('requesting otp to '+formData.mobile_no);
            SendOtpRequest(formData.mobile_no).then(data=>{
            if (data.error == false) {
                setCountdown(60);
                setIsSent(true);
                setOTP(data.user_otp)
              } else {
                Alert.alert('OTP Alert',`${data.message}`);
                navigation.goBack();
              }
            }).finally(()=>{
                showLoading(false)
            })
        } else {
            SendOtpRequest(mobileNumber).then(data=>{
            console.log('requesting otp to '+formData.mobile_no);
            if (data.error == false) {
                setCountdown(60);
                setIsSent(true);
                setOTP(data.user_otp)
              } else {
                Alert.alert('OTP Alert',`${data.message}`);
                navigation.goBack();
              }
            }).finally(()=>{
                showLoading(false)
            })
        }
    }, []);

    const SendOtpRequest = async (phoneNumber : number)=>{
        const formData = new FormData();
        formData.append('phone_number', phoneNumber.toString()); 
        formData.append('user_type', 'Agency'); 
        try {
        const response = await axios.post(
            'https://lassie.ltd/selectmaids/api/get_otp_by_phone_number_for_login.php',
            formData,
            {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            }
        );
        return response.data;
        } catch (error) {
        throw error;
        }
    }
    
    const handleCodeChange = (text : any, index : any) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
        
        // Auto focus to next input if current input is filled
        if (text.length === 1 && index < 3) {
        codeInputRefs.current[index + 1]?.focus();
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
        if (countdown === 0) {
            showLoading(true);
            SendOtpRequest(parseInt(mobileNumber)).then(data => {
            console.log((data));
            if (data.error == false) {
                setCountdown(60);
                setIsSent(true);
                setOTP(data.user_otp)
            } else {
                Alert.alert(`${data.message}`);
            }
            }).finally(()=>{
                showLoading(false)
            })
        }
    };
    
    const formatTime = (seconds : any) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const Next = () => {
        let givenOTP = parseInt(code.join(''));
        console.log(givenOTP, OTP);
        if (givenOTP === parseInt(OTP)) {
            navigation.navigate('MPIN',{
                formData: formData 
            });
          } else {
          Alert.alert('OTP Alert!','Please enter the correct OTP to login to the app.')
        }
    }
    

    const wrongNo = ()=> {
      navigation.goBack();
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
            {/* Blue curved header */}
            {formData.user == 'Employer' || formData.user == 'Candidate' ? (<>
            <CurvedHeader subtitle={`Please enter OTP to Verify the ${formData.user}`}></CurvedHeader>
            </>): (<>
            <CurvedHeader subtitle='Please enter OTP to register.'></CurvedHeader>
            </>)}
    
            {/* Verification code */}
            <View style={[globalStyles.verificationContainer, {marginTop : 100}]}>
            <Text style={globalStyles.verificationText}>
                Please enter the 4 digit code 
            </Text>
            <Text style={globalStyles.verificationText}>
                sent to your mobile no {formData.country_code}{mobileNumber}
            </Text>
            <View style={[globalStyles.codeInputContainer, {marginTop: 30}]}>
                {[0, 1, 2, 3].map((index) => (
                <TextInput
                    key={index}
                    style={globalStyles.codeInput}
                    keyboardType="number-pad"
                    maxLength={1}
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
            <TouchableOpacity style={[globalStyles.resendContainer]} onPress={handleSendCode} disabled={countdown > 0}>
            <View style={[globalStyles.resendIconContainer, countdown > 0 && globalStyles.disabledIcon]}>
                <Ionicons name={'refresh-outline'}  style={globalStyles.resendIcon}></Ionicons>
            </View>
            <Text style={[globalStyles.resendText, countdown > 0 && globalStyles.disabledButton]}>
                {countdown > 0 
                ? `Resend in ${formatTime(countdown)}` 
                : isSent ? 'Resend Code' : 'Send Code'}
            </Text>
            </TouchableOpacity>
            
            {/* Login button */}
            <TouchableOpacity style={globalStyles.loginButton} onPress={Next}>
            <Text style={globalStyles.loginButtonText}>Next</Text>
            </TouchableOpacity>

          {/* Sign in text */}
          <View style={globalStyles.signUpContainer}>
            <TouchableOpacity onPress={wrongNo}>
              <Text style={globalStyles.noAccountText}>Entered a Wrong number?</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
    );
};

export default VerifyOTP;
