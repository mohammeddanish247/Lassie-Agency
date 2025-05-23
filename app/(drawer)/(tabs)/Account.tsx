import { AccordionItem } from '@/components/CollapsibleAccordion';
import { InputField } from '@/components/InputField';
import BottomSheet from '@/components/PopupModal';
import ProfileImage from '@/components/ProfileImage';
import { Colors } from '@/constants/Colors';
import { useLoader } from '@/services/LoaderContext';
import { UserContext } from '@/services/userContext';
import { ApiService } from '@/services/userServices';
import { getGlobalStyles } from '@/styles/globalStyles';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useContext, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

export default function Account() {

  const { showSuccess, showLoading } = useLoader();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = getStyles(colorScheme ?? 'light');
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');

  const { userData, setUserData } = useContext(UserContext);
  const [ showPopup, setshowPopup] = useState(false);
  let oldMPIN : string = '';
  let newMPIN : string = '';
  let confirmNewMPIN : string = '';
  
  useFocusEffect(
    useCallback(() => {
    }, [])
  );

  const gotoMyProfile= ()=>{
    router.push('/MyProfile')
  }

  const handleImagePicked = (newImageUri: string) => {
    if (userData) {
      setUserData({
        ...userData,
        profile_photo: newImageUri
      });
      ApiService.uploadProfilePhoto(userData.user_id, newImageUri).then((res=>{
        console.log(res);
      })).catch((err)=>{
        console.log(err);
      })
    }    
  };

  const OpenPopupforChangeMPIN = () => {
    setshowPopup(true)
  }

  const hidePopup = () =>{
    setshowPopup(false)
  }

  const ChangeMPIN = async () =>{
    if (newMPIN === confirmNewMPIN) {
      hidePopup();
      if (userData) {
        showLoading(true);
        const resposnce = await ApiService.changeMPIN(oldMPIN, newMPIN, userData?.user_id)
        if (resposnce.error == false) {
          showSuccess(resposnce.message);
        } else {
          Alert.alert('Update MPIN Error',resposnce.message)
        }
        showLoading(false);
      }
    } else {
      Alert.alert('MPIN Error',"The new MPIN you entered does not match the confirmation MPIN. Please re-enter both.")
    }
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={globalStyles.circleContainer}>
          <View style={globalStyles.halfCircle} />
        </View>
      <ScrollView style={globalStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Personal Details Card */}
        <View style={globalStyles.sectionContainer}>
          <View style={globalStyles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Personal Details</Text>
              <TouchableOpacity style={styles.editButton} onPress={gotoMyProfile}>
                <FontAwesome6 name="user-pen" size={22} color={colors.primary} style={{marginLeft:6}}/>
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileSection}>
              <ProfileImage imageSrc={userData?.profile_photo||''} onImagePicked={handleImagePicked} width={100} height={100}></ProfileImage>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData?.user_name}</Text>
                <Text style={styles.profileEmail}>{userData?.user_email}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            {/* Company Details */}
            <View style={styles.companySection}>
              <Image 
                source={{
                  uri : userData?.company_logo
                }} 
                style={styles.companyLogo} 
              />
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{userData?.company_name}</Text>
                <Text style={styles.companyLocation}>{userData?.company_Address}</Text>
                <Text style={styles.companyExperience}>{userData?.experience} Years Experience</Text>
                <Text style={styles.companyGST}>GST: {userData?.company_gst_no}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            {/* Certificate */}
              <Image 
                source={{
                  uri : userData?.agency_certificate
                }} 
                style={styles.certificateImage}
              />
          </View>
        </View>
        
        {/* Policy Cards */}
        <View style={globalStyles.sectionContainer}>

          <AccordionItem title='Replacement Policy' children={(
            <Text>{userData?.replacement_policy}</Text>
          )}></AccordionItem>
          
          <AccordionItem title='Refund Policy' children={(
            <Text>{userData?.refund_policy}</Text>
          )}></AccordionItem>
          
          <AccordionItem title='Business Information' children={(
            <Text>{userData?.business_Information}</Text>
          )}></AccordionItem>
          
          {/* Change MPIN */}
          <TouchableOpacity style={styles.policyCard} onPress={OpenPopupforChangeMPIN}>
            <Text style={styles.policyTitle}>Change MPIN</Text>
            <Ionicons name='arrow-forward' size={20}></Ionicons>
          </TouchableOpacity>
            <BottomSheet maxHeight={70} visible={showPopup} onClose={hidePopup} children={
              (
                <View>
                <InputField lable='Confirm Old MPIN' placeholder='Enter Old MPIN' maxLength={4} onChangeValue={(pin)=>(oldMPIN = pin)} keyboardType='number-pad' secureTextEntry={true}></InputField>

                <InputField lable='Enter New MPIN' placeholder='Enter New MPIN' maxLength={4} onChangeValue={(pin)=>(newMPIN = pin)} keyboardType='number-pad' secureTextEntry={true}></InputField>
                <InputField lable='Confirm New MPIN' placeholder='Confirm New MPIN' maxLength={4} onChangeValue={(pin)=>(confirmNewMPIN = pin)} keyboardType='number-pad' secureTextEntry={true}></InputField>

                <TouchableOpacity style={globalStyles.loginButton} onPress={ChangeMPIN}>
                  <Text style={globalStyles .loginButtonText}>Change MPIN</Text>
                </TouchableOpacity>
                </View>
              )}>
            </BottomSheet>
        </View>

        {/* Extra space at bottom */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};


export const getStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  return StyleSheet.create({
    scrollView: {
      flex: 1,
      padding: 15,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    editButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.secondaryDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    profileInfo: {
      marginLeft: 15,
    },
    profileName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    profileEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    divider: {
      height: 1,
      backgroundColor: colors.secondaryDark,
      marginVertical: 15,
    },
    companySection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    companyLogo: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    companyInfo: {
      marginLeft: 15,
      flex: 1,
    },
    companyName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    companyLocation: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    companyExperience: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    companyGST: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    certificateContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      borderRadius: 10,
    },
    certificateImage: {
      width: '100%',
      height: 200,
      borderRadius: 10
    },
    policyCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    policyTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    expandIcon: {
      fontSize: 14,
      color: colors.primary,
    },
    arrowIcon: {
      fontSize: 16,
      color: colors.primary,
    },
    bottomSpace: {
      height: 80,
    },
  });
}