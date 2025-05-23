import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

const defaultProfileImage = require('../assets/images/profile.png');

interface ProfileImagePickerProps {
  imageSrc: string;
  height?: number;
  width?:number;
  onImagePicked?: (uri: string) => void;
}

const ProfileImage: React.FC<ProfileImagePickerProps> = ({ 
  imageSrc = '', 
  height = 120,
  width = 120,
  onImagePicked 
}) => {

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [profileImage, setProfileImage] = useState<string>('');

  useEffect(()=>{
    setProfileImage(imageSrc)
  },[imageSrc])
  

  const pickProfileImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'You need to allow access to your photos to upload an image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImageUri = result.assets[0].uri;
        setProfileImage(newImageUri);
        if (onImagePicked) {
          onImagePicked(newImageUri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const styles = StyleSheet.create({
    profileImageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    ImageWrapperWithBorder: {
      alignItems: 'center',
      justifyContent: 'center',
      width: width,
      height: height,
      borderRadius: 60,
      borderWidth: 1.5,
      borderColor: colors.primary,
      transform: [
        { scale: 1.1 }
      ]
    },
    profileImage: {
      width: width,
      height: height,
      borderRadius: 60,
      transform: [
        { scale: 0.9 }
      ]
    },
    cameraButton: {
      backgroundColor: colors.primary,
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 70,
      marginTop: -30
    },
  });

  return (
    <View style={styles.profileImageContainer}>
      <View style={styles.ImageWrapperWithBorder}>
        <Image 
          source={
            profileImage ? { uri: profileImage } : defaultProfileImage
          }
          style={styles.profileImage}
        />
      </View>
      <TouchableOpacity style={styles.cameraButton} onPress={pickProfileImage}>
        <Ionicons name='camera' style={{color: colors.white}} size={20} />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileImage;