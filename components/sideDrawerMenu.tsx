import { Colors } from '@/constants/Colors';
import { ApiService } from '@/services/userServices';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { usePathname, useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { UserContext } from '../services/userContext';
import ProfileImage from './ProfileImage';

const { width } = Dimensions.get('window');

const CustomDrawer = (props : any) => {

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = getStyles(colorScheme ?? 'light');

  const { userData, setUserData } = useContext(UserContext);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);
  
  const menuItems = [
    { name: 'Home', icon: 'home-outline', screen: 'Home' },
    { name: 'My Profile', icon: 'person-outline', screen: 'Account' },
    { name: 'Candidates', icon: 'people-outline', screen: 'Candidates' },
    { name: 'Clients Order', icon: 'document-text-outline', screen: 'ClientsOrder' },
    // { name: 'Wishlist', icon: 'heart-outline', screen: 'Wishlist' },
    { name: 'Service Delivery', icon: 'car-outline', screen: 'ServiceDelivery' },
    { name: 'Agreements', icon: 'receipt-outline', screen: 'Agreements' },
    // { name: 'Invoice', icon: 'receipt-outline', screen: 'Invoice' },
    // { name: 'Receipt', icon: 'wallet-outline', screen: 'Receipt' },
    { name: 'Packages', icon: 'cube-outline', screen: 'Packages' },
    { name: 'Supports', icon: 'help-circle-outline', screen: 'Supports' },
    { name: 'Privacy Policy', icon: 'shield-checkmark-outline', screen: 'PrivacyPolicy' },
  ];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     ApiService.getUserData().then(UserData=>{
  //       setUserData(UserData);
  //     })
  //   };
  //   fetchData();
  // }, [userData]);

  const handleImagePicked = (newImageUri: string) => {
    if (userData) {
      setUserData({
        ...userData,          // Copy current state
        profile_photo: newImageUri // Update just the image
      });
    }
  };

  return (
    <DrawerContentScrollView 
      {...props} 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator= {false}
    >
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <ProfileImage imageSrc={userData?.profile_photo || ''} onImagePicked={handleImagePicked}></ProfileImage>
        <Text style={styles.userName}>{userData?.user_name}</Text>
        <Text style={styles.userEmail}>{userData?.user_email}</Text>
      </View>
      
      <View style={styles.divider} />
      
      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => {
          const isActive = pathname === `/${item.screen}`;
          if (isActive) {
             console.log(pathname, item.screen);
          }
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                isActive && styles.activeMenuItem
              ]}
               onPress={() => {
                if (item.screen === 'Account' || item.screen === 'Home') {
                  router.push(`/(drawer)/(tabs)/${item.screen}`);
                } else {
                  // router.push('/Candidate/CandidatesList')
                  router.push(`/(drawer)/${item.screen}`);
                }}}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={isActive ? colors.primary : colors.text}
              />
              <Text style={[
                styles.menuText,
                isActive && styles.activeMenuText
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}

         <TouchableOpacity style={[ styles.menuItem ]}
               onPress={() => {
                  ApiService.setAuth('false')
                  router.replace('/');                  
                }}
            >
              <Ionicons
                name='log-out-outline'
                size={24}
              />
              <Text style={[
                styles.menuText,
              ]}>
                Log Out
              </Text>
            </TouchableOpacity>

      </View>
      {/* App Version */}
      <Text style={styles.versionText}>App Version 1.0</Text>
    </DrawerContentScrollView>
  );
};

export const getStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: colors.background
    },
    profileSection: {
      alignItems: 'center',
      marginTop: 10
    },
    userName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      // marginTop: 10,
    },
    userEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 5,
    },
    divider: {
      height: 1,
      backgroundColor: colors.secondaryDark,
      marginVertical: 15,
      marginHorizontal: 20,
    },
    menuContainer: {
      zIndex: 100,
      paddingHorizontal: 15,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 8,
      marginBottom: 5,
    },
    activeMenuItem: {
      backgroundColor: colors.tintBackground,
    },
    menuText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 15,
    },
    activeMenuText: {
      color: colors.primary,
      fontWeight: '600',
    },
    versionText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 80,
    },
  });  
}

export default CustomDrawer;