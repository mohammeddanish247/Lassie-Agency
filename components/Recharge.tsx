import { Colors } from '@/constants/Colors';
import { UserContext } from '@/services/userContext';
import { ApiService } from '@/services/userServices';
import { getGlobalStyles } from '@/styles/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

interface RechargeOption {
  id: number;
  contacts: number;
  price: string;
}

type RechargeOp = {
    candidateID: string
    closeModal: () => void;
}

const RechargeScreen = ({candidateID, closeModal} : RechargeOp) => {
      const colorScheme = useColorScheme();
      const colors = Colors[colorScheme ?? 'light'];
      const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [candidate, setCandidate] = useState<any>();
  const [isExpired, setisExpired] = useState(true);
  const { userData, setUserData } = useContext(UserContext);

  const rechargeOptions: RechargeOption[] = [
    { id: 1, contacts: 5, price: '₹59' },
    { id: 2, contacts: 10, price: '₹99' },
    { id: 3, contacts: 20, price: '₹149' },
    { id: 4, contacts: 30, price: '₹199' },
    { id: 5, contacts: 40, price: '₹299' },
    { id: 6, contacts: 50, price: '₹399' },
    { id: 7, contacts: 100, price: '₹499' },
  ];

  useEffect(()=>{
    const fetchData = async () => {
      try {
        if (userData) {
            const prePack = await ApiService.PreviousPackage(userData?.user_id);
            if (prePack.isSuccess == 'true') {
                const lastDateForExpire = prePack.result[0].last_date_for_expire; // Your expiry date (YYYY-MM-DD format)
                const currentDate = new Date();
                const expiryDate = new Date(lastDateForExpire);
                if (currentDate > expiryDate) {
                   setisExpired(true)
                } else {
                    setisExpired(false)
                    const res = await ApiService.ViewCandidate(candidateID,userData?.user_id);
                    if (res.isSuccess == 'true') {
                        if (res.canditate_details[0].allow_contact >0) {
                            setBalance(res.canditate_details[0].allow_contact);
                            setCandidate(res.canditate_details[0]);
                        }
                    } else {
                        setisExpired(true)
                    }
                }
            }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Data fetched (success or error)
      }
    };
    fetchData();
  },[])

  const handleRecharge = () => {
    const selected = rechargeOptions.find(option => option.id === selectedOption);
    console.log(`Recharging ${selected?.contacts} contacts for ${selected?.price}`);
    // Add your recharge logic here
  };


  const Callme = () => {
    Linking.openURL(`tel:+91${candidate.canditate_phone}`)
      .catch(err => console.error('Failed to open dialer:', err));
  };

  const upgrade = () => {
    closeModal();
    router.navigate('/(drawer)/Packages');
  };

  const renderRechargeOption = (option: RechargeOption, isWide: boolean = false) => {
    const isSelected = selectedOption === option.id;
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.optionCard,
          isWide && styles.wideCard,
          isSelected && styles.selectedCard,
        ]}
        onPress={() => setSelectedOption(option.id)}
      >
        <View style={styles.coinContainer}>
          {/* <Ionicons name="ellipse" size={20} color="#" /> */}
          <MaterialIcons name='contacts' size={20} color='#5B94E2'></MaterialIcons>
          <Text style={styles.coinAmount}>{option.contacts.toLocaleString()}</Text>
        </View>
        <Text style={styles.priceText}>{option.price}</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop:100 }}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  if (isExpired) {
    return <View>
            <Text style={styles.title}>No Active Package Found</Text>
             <Text style={styles.subtitle}>Want premium access? Activate your Agency App’s full potential by purchasing a package today!</Text>
                       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                       <LottieView
                         style={{width: 200, height: 300, backgroundColor: colors.background}}
                         autoPlay loop = {false}
                         source={require('@/assets/animations/no-package.json')}
                       />
                     </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.rechargeButton} onPress={upgrade}>
                    <Text style={styles.rechargeButtonText}>Upgrade Now</Text>
                    </TouchableOpacity>
                </View>
        </View>
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
         {balance > 0 ? (
        <View>
            <Text style={styles.title}>Contact Candidate</Text>
            <View style={styles.balanceContainer}>
            <View style={styles.balanceRow}>
                <Text style={styles.balanceLabel}>Remaining Balance:</Text>
                <View style={styles.balanceAmount}>
                <MaterialIcons name='contacts' size={20} color='#5B94E2'></MaterialIcons>
                <Text style={styles.balanceNumber}>{balance}</Text>
                </View>
            </View>
            </View>
            <View style={globalStyles.card}>
            <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
                <Image source={{ uri: candidate.canditate_photo}}  style={styles.profileImage} />
            </View>
            
            <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                <Text style={styles.profileName}>{candidate.canditate_name}</Text>
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{candidate.job_title}</Text>
                </View>
                </View>
                
                <View style={styles.detailsRow}>
                <Text style={styles.detailText}>{candidate.canditate_age} Years</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.detailText}>{candidate.canditate_marital_status}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.detailText}>{candidate.registration_type}</Text>
                </View>
                
                <View style={styles.detailsRow}>
                <Text style={styles.roleText}>{candidate.job_title}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.experienceText}>{candidate.canditate_experience} experience</Text>
                </View>

                <View style={styles.detailsRow}>
                <Text style={styles.shiftText}>{candidate.job_type}</Text>
                </View>
                <View>
                <Text style={styles.shiftText}>{candidate.jobseeker_yourcity},{candidate.jobseeker_yourstate},{candidate.jobseeker_yourcountry}</Text>
                </View>
                <View>
                <Text style={styles.phone_no}>Phone No. +91 {candidate.canditate_phone}</Text>
                </View>
            </View>
            </View>
        </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.rechargeButton} onPress={Callme}>
                    <Text style={styles.rechargeButtonText}>Call Me</Text>
                    </TouchableOpacity>
                </View>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Recharge Balance</Text>
          <Text style={styles.subtitle}>Unlock the candidate’s contact details by purchasing or recharging your balance.</Text>
          <View style={styles.balanceContainer}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Remaining Balance:</Text>
            <View style={styles.balanceAmount}>
               <MaterialIcons name='contacts' size={20} color='#5B94E2'></MaterialIcons>
              <Text style={styles.balanceNumber}>{balance}</Text>
            </View>
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <View style={styles.row}>
            {rechargeOptions.slice(0, 3).map(option => renderRechargeOption(option))}
          </View>
          <View style={styles.row}>
            {rechargeOptions.slice(3, 6).map(option => renderRechargeOption(option))}
          </View>
          <View style={styles.row}>
            {renderRechargeOption(rechargeOptions[6], true)}
          </View>
        </View>
        <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.rechargeButton} onPress={handleRecharge}>
            <Text style={styles.rechargeButtonText}>Recharge</Text>
            </TouchableOpacity>
        </View>
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
    subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#5E5E5E80',
    textAlign: 'center',
    marginBottom: 10,
  },
  balanceContainer: {
    marginBottom: 30,
    marginTop: 20
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#999999',
    marginRight: 8,
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceNumber: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 4,
    fontWeight: '500',
  },
  optionsContainer: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    minHeight: 80,
    justifyContent: 'center',
  },
  wideCard: {
    marginHorizontal: 0,
  },
  selectedCard: {
    borderColor: '#5B94E2',
    borderWidth: 2,
    backgroundColor: '#E1EDFC',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coinAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 6,
  },
  priceText: {
    fontSize: 14,
    color: '#999999',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  rechargeButton: {
    backgroundColor: '#5B94E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rechargeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
       profileSection: {
        flexDirection: 'row',
        position: 'relative',
        },
        profileImageContainer: {
        position: 'relative',
        },
        profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        },
        profileInfo: {
        marginLeft: 15,
        flex: 1,
        },
        nameRow: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 5,
        },
        profileName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginRight: 8,
        marginBottom: 5,
        },
        badgeContainer: {
        backgroundColor: '#5B94E2',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 5,
        },
        badgeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
        },
         detailsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 5,
        },
        detailText: {
        fontSize: 12,
        color: '#5E5E5E',
        },
        dot: {
        fontSize: 12,
        color: '#5E5E5E',
        marginHorizontal: 4,
        },
        roleText: {
        fontSize: 12,
        color: '#5E5E5E',
        marginBottom: 2,
        },
        experienceText: {
        fontSize: 12,
        color: '#5E5E5E',
        marginBottom: 2,
        },
        shiftText: {
        fontSize: 12,
        color: '#5E5E5E',
        marginBottom: 3,
        },
        phone_no: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#5E5E5E',
        marginBottom: 3,
        },
                contactButton: {
        backgroundColor: "#fff",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#5E5E5E',
        flex: 1,
        alignItems: 'center',
        width : 100,
        },
        contactText: {
        color: "5E5E5E",
        fontSize: 14,
        fontWeight: '500',
        },
                buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        },
});

export default RechargeScreen;