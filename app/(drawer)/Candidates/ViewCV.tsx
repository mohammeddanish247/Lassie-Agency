import { JobSeeker } from '@/components/Interfaces';
import { Colors } from '@/constants/Colors';
import { UserContext } from '@/services/userContext';
import { ApiService } from '@/services/userServices';
import { getGlobalStyles } from '@/styles/globalStyles';
import { FontAwesome6 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
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

const ViewCVScreen = () => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const globalStyles = getGlobalStyles(colorScheme ?? 'light');
    const params : any = useLocalSearchParams();
    console.log(params.id);
    const { userData } = useContext(UserContext);
    const [ CVdata, setCV ] = useState<JobSeeker>();
    
    const getCVDetails = () => {
      if(userData){
         ApiService.getCV(params.id, userData.user_id).then(res=>{
          if (res.isSuccess == "true") {
            setCV(res.result[0]);
          }
         })
      } else {
        Alert.alert('Data Not Available','User data context not Available')
      }
    }

    useEffect(()=>{
      getCVDetails();
    },[])
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5B94E2" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: CVdata?.canditate_photo
            }}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.shareButton}>
            <FontAwesome6 name='share' size={20} color='#5B94E2'></FontAwesome6>
            {/* <Ionicons name="share-outline" size={20} color="#6B9EFF" /> */}
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{CVdata?.canditate_name}</Text>
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{CVdata?.job_title}</Text>
            </View>
          </View>

          <Text style={styles.basicInfo}>{CVdata?.canditate_age} Years • {CVdata?.canditate_marital_status} • {CVdata?.registration_type}</Text>
          
          <Text style={styles.experience}>{CVdata?.job_title} • {CVdata?.canditate_experience} Years Experience</Text>
          
          <Text style={styles.shift}>{CVdata?.job_type}</Text>
          
          <Text style={styles.location}>India, Uttar Pradesh, Noida</Text>
          
          <Text style={styles.salary}>{CVdata?.canditate_salary}<Text style={styles.salaryPeriod}>/Month</Text></Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      {/* <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.viewCVButton}>
          <Text style={styles.viewCVButtonText}>View Full CV</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: '#F5F5F5',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  shareButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    padding: 20,
    paddingBottom: 100,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginRight: 12,
  },
  tagContainer: {
    backgroundColor: '#6B9EFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  basicInfo: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  experience: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  shift: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  location: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  salary: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  salaryPeriod: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666666',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  viewCVButton: {
    backgroundColor: '#6B9EFF',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCVButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default ViewCVScreen;

