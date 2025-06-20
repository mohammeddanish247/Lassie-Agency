import { UserData } from '@/components/Interfaces';
import ProfileImage from '@/components/ProfileImage';
import { Colors } from '@/constants/Colors';
import { useLoader } from '@/services/LoaderContext';
import { UserContext } from '@/services/userContext';
import { ApiService } from '@/services/userServices';
import { getGlobalStyles } from '@/styles/globalStyles';
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const MyProfileScreen = ({ navigation }: { navigation: any }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');

  const { userData : currentUser, setUserData : setUserDataContext } = useContext(UserContext);
  const [ userData, setUserData] = useState<UserData | null>(currentUser ?? null)
  const { showLoading, showSuccess } = useLoader();


  // Handle logo picker
  const pickLogo = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'You need to allow access to your photos to upload a logo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        if (userData) {
          setUserDataContext({
            ...userData,
            company_logo: result.assets[0].uri,
          });
          setUserData({
            ...userData,
            company_logo: result.assets[0].uri,
          });
          ApiService.uploadAgencyLogo(userData.user_id, result.assets[0].uri).then((res=>{
            console.log(res);
          })).catch((err)=>{
            console.log(err);
          })
        }
      }
    } catch (error) {
      console.error('Error picking logo:', error);
      Alert.alert('Error', 'Failed to pick logo. Please try again.');
    }
  };

  // Handle certificate picker
  const pickCertificate = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'You need to allow access to your files to upload a certificate.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        if (userData) {
          setUserDataContext({
            ...userData,
            agency_certificate: result.assets[0].uri,
          });
          setUserData({
            ...userData,
            agency_certificate: result.assets[0].uri,
          });
          ApiService.uploadCertificate(userData.user_id, result.assets[0].uri).then((res=>{
            console.log(res);
          })).catch((err)=>{
            console.log(err);
          })
        }
      }
    } catch (error) {
      console.error('Error picking certificate:', error);
      Alert.alert('Error', 'Failed to pick certificate. Please try again.');
    }
  };

  // Handle text input changes
  const handleInputChange = (field: keyof UserData, value: string) => {
    console.log(field,value);
    if (userData) {
      setUserData({
        ...userData,
        [field]: value,
      });
    }
  };

  const saveProfile = () => {
    if (userData) {
      showLoading(true)
        ApiService.updateProfile(userData).then(res=>{
          console.log(res);
          if (res.error === false) {
            showLoading(false)
            showSuccess(res.message)
            setUserDataContext(userData)
          } else {
            showLoading(false)
            Alert.alert('Success', res.message);
          }
        }).catch(err=>{
          console.error(JSON.stringify(err));
        }).finally(()=>{

        })
    }
  };

  const handleImagePicked = (newImageUri: string) => {
    if (userData) {
      setUserDataContext({
        ...userData,
        profile_photo: newImageUri,
      });
      setUserData({
        ...userData,
        profile_photo: newImageUri,
      });
      ApiService.uploadProfilePhoto(userData.user_id, newImageUri).then((res=>{
        console.log(res);
      })).catch((err)=>{
        console.log(err);
      })
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary}/>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={{marginTop:30}}></View>
          {/* Profile Image */}
          <ProfileImage imageSrc={userData?.profile_photo || ''} onImagePicked={handleImagePicked}></ProfileImage>
          
          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Upload Logo */}
            <Text style={styles.fieldLabel}>Upload Company Logo</Text>

            <View style={{flexDirection: 'row'}}>
              <Image source={{uri:userData?.company_logo}} style={styles.logoImage}></Image>
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={pickLogo}
              >
                <Text style={styles.uploadIcon}>📤</Text>
                <Text style={styles.uploadText}>
                  {userData?.company_logo ? 'Logo uploaded' : 'Upload your logo'}
                </Text>
              </TouchableOpacity>
            </View>
            {/* Company Name */}
            <Text style={styles.fieldLabel}>Company Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Company name"
              value={userData?.company_name}
              onChangeText={(text) => handleInputChange('company_name', text)}
            />
            
            {/* Company Address */}
            <Text style={styles.fieldLabel}>Company Address</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="Address"
              value={userData?.company_Address}
              onChangeText={(text) => handleInputChange('company_Address', text)}
              multiline
              numberOfLines={3}
            />
            
            {/* Years Of Establishment */}
            {/* <Text style={styles.fieldLabel}>Years Of Establishment</Text>
            <TextInput
              style={styles.textInput}
              placeholder="YYYY"
              value={userData?.year_of_establishment}
              onChangeText={(text) => {
                // Only allow 4-digit year
                const year = text.replace(/[^0-9]/g, '').slice(0, 4);
                handleInputChange('year_of_establishment', year);
              }}
              keyboardType="numeric"
              maxLength={4}
            /> */}
            
            {/* Experience */}
            <Text style={styles.fieldLabel}>Experience</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Experience"
              value={userData?.experience}
              onChangeText={(text) => handleInputChange('experience', text)}
            />
            
            {/* GST Number */}
            <Text style={styles.fieldLabel}>GST Number</Text>
            <TextInput
              style={styles.textInput}
              placeholder="GSTN _ _ _ _ _ _ _ _ _ _ _ _ _ _ _"
              value={userData?.company_gst_no}
              onChangeText={(text) => handleInputChange('company_gst_no', text)}
              keyboardType="default"
              autoCapitalize="characters"
            />
            
            {/* Certificate */}
            <Text style={styles.fieldLabel}>Certificate</Text>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={pickCertificate}
            >
              <Text style={styles.uploadIcon}>📤</Text>
              <Text style={styles.uploadText}>
                {userData?.agency_certificate ? 'Certificate uploaded' : 'Upload your certificate'}
              </Text>
            </TouchableOpacity>

            <View>
              <Image source={{uri: userData?.agency_certificate}} style={styles.certificateImage}></Image>
            </View>
            
            {/* Replacement Policy */}
            <Text style={styles.fieldLabel}>Replacement Policy</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="Replacement policy"
              value={userData?.replacement_policy}
              onChangeText={(text) => handleInputChange('replacement_policy', text)}
              multiline
              numberOfLines={4}
            />
            
            {/* Refund Policy */}
            <Text style={styles.fieldLabel}>Refund Policy</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="Refund policy"
              value={userData?.refund_policy}
              onChangeText={(text) => handleInputChange('refund_policy', text)}
              multiline
              numberOfLines={4}
            />
            
            {/* Business Information */}
            <Text style={styles.fieldLabel}>Business Information</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="Business information"
              value={userData?.business_Information}
              onChangeText={(text) => handleInputChange('business_Information', text)}
              multiline
              numberOfLines={4}
            />
            
            {/* Save Button */}
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveProfile}
            >
              <Text style={styles.saveButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    // paddingBottom: insets.bottom
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    fontSize: 24,
    color: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  settingsButton: {
    padding: 5,
  },
  settingsIcon: {
    fontSize: 24,
    color: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  certificateImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  logoImage:{
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  uploadIcon: {
    fontSize: 20,
    marginRight: 10,
    color: '#4A90E2',
  },
  uploadText: {
    fontSize: 16,
    color: '#999',
  },
  mpinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  mpinText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#4A90E2',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyProfileScreen;