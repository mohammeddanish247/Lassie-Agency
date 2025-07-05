import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, InteractionManager, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { JobListing, MaidProfiles } from '../../../components/Interfaces';
import JobCard from '../../../components/JobCard';
import ImageSlider from '../../../components/slider';
import { useLoader } from '../../../services/LoaderContext';
import { ApiService } from '../../../services/userServices';
import { getGlobalStyles } from '../../../styles/globalStyles';

let remoteSlides : { id: string; image: string }[] = []; 

export default function Home({navigation} : {navigation : any}) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = getStyles(colorScheme ?? 'light');
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  const { showLoading } = useLoader();
  const [JobList, setJobList] = useState<JobListing[]>([]);
  const [maidProfiles, setMaidProfiles] = useState<MaidProfiles[]>([]);

  
  const [isReady, setIsReady] = useState(false);

  const getBanners = () => {
    ApiService.getBannersImg().then(res=>{
      if (res.isSuccess == 'true') {
        if (res && res.result) {
          remoteSlides = res.result.map((item:any) => ({
            id: item.id, 
            image: item.banner_image 
          }));
        }
      }
    })
  }

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
      getBanners();
    });
  }, []);

  useEffect(()=>{
    showLoading(true)
    Promise.all([
      ApiService.category_list()
        .then((data) => {
          // console.log('category_list', data.result);
          setMaidProfiles(data.result);
        })
        .catch((err) => console.log('category_list error', err)),
  
      ApiService.job_list(1)
        .then((data) => {
          // console.log('job_list', data.result);
          setJobList(data.result)
        })
        .catch((err) => console.log('job_list error', err)),
    ])
      .finally(() => {
        showLoading(false)
      });
  },[])


  const handleMaidPress = (profile: any) =>{
    console.log(profile);
   router.push({
         pathname: '/(drawer)/(jobs)/Jobs',
         params: { showFilterTab: 'false', profileName: profile.category_name },
       });
  }

  
const ProfileItem: React.FC<{ profile: MaidProfiles }> = ({ profile }) => (
    <TouchableOpacity style={[styles.profileItem, globalStyles.card]} key={profile.category_id} onPress={()=>handleMaidPress(profile)}>
      <View style={styles.profileIconContainer}>
        <Ionicons name='person' size={24} color={'#fff'} style={{alignItems:'center'}}></Ionicons>
        {/* <Text style={styles.profileIcon}>{profile.category_icon}</Text> */}
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.profileTitle}>{profile.category_name}</Text>
        <Text style={styles.profileJobs}>{profile.no_of_profile} jobs available</Text>
      </View>
      <Text style={styles.profileArrow}>→</Text>
    </TouchableOpacity>
  );
  
  const gotoJobListScreen = ()=>{
    router.push({
      pathname: '/(drawer)/(jobs)/Jobs',
      // params: { unParsedData: JSON.stringify(JobList) },
    });
  }

  const GotoViewDetails = useCallback((jobid: string) => {
    router.push({
      pathname: '/(drawer)/(jobs)/EmpDetails',
      params: { job_id: jobid },
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={globalStyles.circleContainer}>
          <View style={globalStyles.halfCircle} />
        </View>
      <ScrollView style={globalStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Slider */}
        {isReady && (
          <View style={{ flex: 1 }}>
          <ImageSlider
            slides={remoteSlides}
            height={200}
            autoPlay={true}
            loop={true}
            showPagination={true}
          />
        </View>
        )}
       
        {/* Find Your Lead/Client Section */}
        <View style={globalStyles.sectionContainer}>
          <Text style={styles.sectionTitle}>Find Your Lead/Client</Text>
          <FlatList data={JobList.slice(0,2)} scrollEnabled={false} renderItem={({item}) => (
              <JobCard
                job={item}
                // onContact={handleContact}
                onViewDetails={()=> GotoViewDetails(item.job_id)}
              />
            )}></FlatList>
        </View>
        <View style={{alignItems: 'center'}}><Text style={{color: colors.primary}} onPress={gotoJobListScreen}>Load more</Text></View>
        
        {/* Maid Profiles Section */}
        {maidProfiles?.length > 0 ? (
          <View style={globalStyles.sectionContainer}>
            <Text style={styles.sectionTitle}>Maid Profiles</Text>
            <FlatList data={maidProfiles} scrollEnabled={false} renderItem={({item}) => (
              <ProfileItem profile={item}></ProfileItem>
            )}></FlatList>
          </View>
        ) : null}
        
        {/* Add some bottom padding */}
        <View style={{ height: 20 }} />
      </ScrollView>
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
  slide: {
    flex: 1,
    position: 'relative',
  },
  categoriesList: {
    flexGrow: 0,
  },
  categoriesContainer: {
    display: 'flex', 
    flexDirection: 'row',
    justifyContent: 'space-between', // Distributes children evenly
    alignItems: 'center',           // Centers vertically
    gap: 10,                        // Adds spacing between items (React Native 0.71+)
    marginLeft: 15
  },
  categoryButton: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  categoryIcon: {
    height: 42,
    borderRadius: 8,
    backgroundColor: colors.secondaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  categoryIconText: {
    padding: 10,
    fontSize: 14,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.tintBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobIcon: {
    width: 24,
    height: 24,
  },
  jobTimePosted: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  jobTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-between',
    marginBottom: 5,
  },
  jobTitle: {
    flex: 0.85,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 10,
  },
  urgentTag: {
    flex: 0.15,
    height: 20,
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  urgentText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  jobSalary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  jobCategory: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  jobDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  jobDetailTag: {
    backgroundColor: colors.secondaryDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  jobDetailText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  jobActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewDetailsButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  contactButton: {
    backgroundColor: colors.card,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  contactText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  favoriteButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryDark
  },
  favoriteIcon: {
    marginTop : 3,
    textAlignVertical: 'center'
  },
  favoriteFilled: {
    color: colors.primary,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  profileIcon: {
    fontSize: 20,
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileJobs: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  profileArrow: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
}