import { Colors } from '@/constants/Colors';
import { ApiService } from '@/services/userServices';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import CurvedHeader from '../components/curvedHeader';
import { useLoader } from '../services/LoaderContext';
import { getGlobalStyles } from '../styles/globalStyles';

interface VerifyOTPProps {}

const VerifyOTP = () => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const globalStyles = getGlobalStyles(colorScheme ?? 'light');
    const { unParsedData } = useLocalSearchParams();
    const formData = unParsedData ? JSON.parse(unParsedData as string) : null;
    const mobileNumber = formData.agency_mobaile;
    const [code, setCode] = React.useState<string[]>(['', '', '', '']);
    const codeInputRefs = React.useRef<(TextInput | null)[]>([]);
    const { showLoading, showSuccess } = useLoader();
    const [OTP, setOTP] = useState('');
    const [isOtpComplete, setIsOtpComplete] = React.useState(false);
    
    const sendOTPSignUp = () =>{
        SendOtpRequest(mobileNumber).then(data=>{
        console.log('requesting otp to '+formData.agency_mobaile);
        if (data.error == false) {
            setCountdown(60);
            setIsSent(true);
            setOTP(data.user_otp)
            } else {
            Alert.alert('OTP Alert',`${data.message}`,[
                {
                text: 'OK',
                onPress: () => {
                    router.back();
                },
                },
            ],
            { cancelable: false })
            }
        }).catch(err=>{
            console.error(JSON.stringify(err));
        }).finally(()=>{
            showLoading(false)
        })
    }

    const sendOTPForgotMPIN = () =>{
        ApiService.sentOTP_ForgotMPIN(mobileNumber).then(data=>{
        console.log('requesting otp to '+formData.agency_mobaile);
        if (data.error == false) {
            setCountdown(60);
            setIsSent(true);
            setOTP(data.user_otp)
            } else {
            Alert.alert('OTP Alert',`${data.message}`,[
                {
                text: 'OK',
                onPress: () => {
                    router.back();
                },
                },
            ],
            { cancelable: false })
            }
        }).catch(err=>{
            console.error(JSON.stringify(err));
        }).finally(()=>{
            showLoading(false)
        })
    }

    useEffect(() => {
        showLoading(true);
        if (formData.user == 'Employer' || formData.user == 'Candidate') {
            console.log('requesting otp to '+formData.mobile_no + " user : "+formData.user);
            SendOtpCandidate(formData.mobile_no, formData.user).then(data=>{
            if (data.error == false) {
                setCountdown(60);
                setIsSent(true);
                setOTP(data.otp)
              } else {
                Alert.alert('OTP Alert',`${data.message}`);
                router.back();
              }
            }).finally(()=>{
                showLoading(false)
            })
        } else {
           if (formData.action == 'signup') {
            sendOTPSignUp();
           }
           if (formData.action == 'MPINChange') {
            sendOTPForgotMPIN();
           }
        }
    }, []);

    const SendOtpRequest = async (phoneNumber : number)=>{
        const formData = new FormData();
        formData.append('phone_number', phoneNumber.toString()); 
        formData.append('user_type', 'Agency'); 
        try {
        const response = await axios.post(
            'https://selectmaids.org/api/signup_by_otp.php',
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

    const SendOtpCandidate = async (phoneNumber : number, user : string)=>{
        let url = '';
        const formData = new FormData();
        if (user === 'Candidate') {
            url = 'https://selectmaids.org/api/candiate_verify_otp_send_delivery_notes.php'
             formData.append('candiatate_phone_number', phoneNumber.toString()); 
        } else {
            url = 'https://selectmaids.org/api/employer_verify_otp_send_delivery_notes.php'
             formData.append('employer_phone_number', phoneNumber.toString()); 
        }
        formData.append('service_delivery_note_id', ''); 
        try {
        const response = await axios.post(
            url,
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

        // Check if all fields are filled
        const allFilled = newCode.every(digit => digit.length === 1);
        setIsOtpComplete(allFilled);
        
        // Auto focus to next input if current input is filled
        if (text.length === 1 && index < 3) {
        codeInputRefs.current[index + 1]?.focus();
        }

        if (allFilled) {
            Next(parseInt(newCode.join('')));
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
                router.back();
            }
            }).catch(err=>{
                console.error(JSON.stringify(err));
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

    const Next = (givenOTP : number) => {
        console.log(givenOTP, OTP);
        if (givenOTP === parseInt(OTP)) {
             if (formData.user == 'Employer' || formData.user == 'Candidate') {
                showLoading(true);
                setTimeout(async () => {
                    if (formData.user == 'Employer') {
                        ApiService.verifyEmployer(formData.formNo).then(res=>{
                            if (res.error == false) {
                                showLoading(false);
                                showSuccess(`${formData.user} is verified Successfully.`);
                                router.dismissAll();
                            }
                        })
                    } else {
                        ApiService.verifyCandidate(formData.formNo).then(res=>{
                            if (res.error == false) {
                                showLoading(false); 
                                showSuccess(`${formData.user} is verified Successfully.`);
                                router.dismissAll();
                            }
                        })
                    }
                }, 500);
             } else {
                router.push({pathname : '/MPIN', params : {
                    unParsedData: JSON.stringify(formData) 
                }})
             }
          } else {
            if (formData.user == 'Employer' || formData.user == 'Candidate') {
                 Alert.alert('OTP Alert!','Please enter the correct OTP.')
            } else {
                 Alert.alert('OTP Alert!','Please enter the correct OTP to login to the app.')
            }
        }
    }
    

    // const wrongNo = ()=> {
    //   router.back();
    // }

    return (
        <SafeAreaView style={globalStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
            {/* Blue curved header */}
            {formData.user == 'Employer' || formData.user == 'Candidate' ? (
            <CurvedHeader subtitle={`Please enter OTP to Verify the ${formData.user}`}></CurvedHeader>
            ): (
            <CurvedHeader subtitle='OTP needed for verification.'></CurvedHeader>
            )}
    
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
            <TouchableOpacity style={globalStyles.loginButton} onPress={ ()=> Next(parseInt(code.join('')))}>
            <Text style={globalStyles.loginButtonText}>Next</Text>
            </TouchableOpacity>

          {/* Sign in text */}
          {/* <View style={globalStyles.signUpContainer}>
            <TouchableOpacity onPress={wrongNo}>
              <Text style={globalStyles.noAccountText}>Entered a Wrong number?</Text>
            </TouchableOpacity>
          </View> */}

        </SafeAreaView>
    );
};

export default VerifyOTP;
