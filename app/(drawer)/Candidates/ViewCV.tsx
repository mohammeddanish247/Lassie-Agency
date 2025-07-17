import { Chip } from "@/components/chip";
import PDFGenerator, { type PDFGeneratorRef } from "@/components/PdfGenerator";
import { UserContext } from "@/services/userContext";
import { ApiService } from "@/services/userServices";
import { getGlobalStyles } from "@/styles/globalStyles";
import { FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import type React from "react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const InfoRow = ({
  icon,
  label,
  value,
  iconColor = "#666",
}: {
  icon: string
  label: string
  value: string | string []
  iconColor?: string
}) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon as any} size={20} color={iconColor} style={styles.icon} />
    <View style={styles.infoContent}>
      <Text style={styles.label}>{label}</Text>
       {Array.isArray(value) ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2, marginTop: 10 }}>
          {value.map((item, index) => (
            <Chip
              key={`${index}`} // Use label + index as key
              label={item}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  </View>
)

const LanguageRow = ({
  icon,
  label,
  value,
  iconColor = "#666",
}: {
  icon: string;
  label: string;
  value: any;
  iconColor?: string;
}) => {
  // Transform the language object into an array of formatted languages
  const formatLanguages = (languages: any) => {
    const result = [];
    let i = 1;

    while (languages[`Language${i}`]) {
      result.push({
        name: languages[`Language${i}`],
        read: languages[`Language${i}_read`] === "on",
        spoken: languages[`Language${i}_spoken`] === "on",
        written: languages[`Language${i}_written`] === "on",
      });
      i++;
    }

    return result;
  };

  const formattedLanguages = formatLanguages(value);

  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon as any} size={20} color={iconColor} style={styles.icon} />
      <View style={styles.infoContent}>
        {/* <Text style={styles.label}>{label}</Text> */}
          <View style={styles.header}>
            <Text style={[styles.column, styles.languageColumn, {color: "#7f8c8d", fontWeight:'500'}]}>
              Language
            </Text>
            <Text style={styles.column}>Read</Text>
            <Text style={styles.column}>Speak</Text>
            <Text style={styles.column}>Write</Text>
          </View>
        
          {/* Language Rows */}
          {formattedLanguages.map((lang, index) => (
            <View 
              key={index} 
              style={[
                styles.roww, 
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}
            >
              <Text style={[styles.column, styles.languageColumn]}>
                {lang.name}
              </Text>
              <Text style={[styles.column, lang.read ? styles.tick : styles.cross]}>
                {lang.read ? '✓' : '✗'}
              </Text>
              <Text style={[styles.column, lang.spoken ? styles.tick : styles.cross]}>
                {lang.spoken ? '✓' : '✗'}
              </Text>
              <Text style={[styles.column, lang.written ? styles.tick : styles.cross]}>
                {lang.written ? '✓' : '✗'}
              </Text>
            </View>
          ))}
      </View>
    </View>
  )
}

const MaterialInfoRow = ({
    icon,
    label,
    value,
    iconColor = "#666",
  }: {
    icon: string
    label: string
    value: string
    iconColor?: string
  }) => (
    <View style={styles.infoRow}>
      <MaterialIcons name={icon as any} size={20} color={iconColor} style={styles.icon} />
      <View style={styles.infoContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
)

const FontAwesome5InfoRow = ({
    icon,
    label,
    value,
    iconColor = "#666",
  }: {
    icon: string
    label: string
    value: string
    iconColor?: string
  }) => (
    <View style={styles.infoRow}>
      <FontAwesome5 name={icon as any} size={18} color={iconColor} style={styles.icon} />
      <View style={styles.infoContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
)

// const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
//   <View style={styles.content}>
//     {children}
//   </View>
// )

const parseCurrency = (currencyString: string) => {
  const parts = currencyString.split(" — ")
  return parts.length >= 3 ? parts[2] : "€"
}

const formatSalary = (salary: string, currency: string = '') => {
  const currencySymbol = parseCurrency(currency)
  return `${currencySymbol}${salary}`
}

export default function CandidateProfile() {
  
  const pdfGeneratorRef = useRef<PDFGeneratorRef>(null);
  const params = useLocalSearchParams<any>();
  const { userData } = useContext(UserContext);
  const [candidate, setCV] = useState<any>();
  const [isLoading, setisLoading] = useState(true);

  const getCVDetails = useCallback(async () => {
    if (!userData) {
      Alert.alert('Data Not Available', 'User data context not Available');
      setisLoading(false);
      return;
    }

    try {
      const res = await ApiService.getCV(params.id, userData.user_id);
      if (res.isSuccess === "true") {
        setCV(res.result[0]);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load CV details');
    } finally {
      setisLoading(false);
    }
  }, [userData, params.id]);

  useEffect(() => {
    getCVDetails();
  }, [getCVDetails]);


  const handleSharePress = async () => {
    try {
      await pdfGeneratorRef.current?.sharePDF()
    } catch (error) {
      console.error("Error sharing PDF:", error)
    }
  }


  if(isLoading) {
    return(
      <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading CV Details...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={getGlobalStyles('light').container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: candidate?.canditate_photo
            }}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.shareButton} onPress={handleSharePress}>
            <FontAwesome6 name='share' size={20} color='#5B94E2'></FontAwesome6>
            {/* <Ionicons name="share-outline" size={20} color="#6B9EFF" /> */}
          </TouchableOpacity>
        </View>

        <PDFGenerator ref={pdfGeneratorRef} candidate={candidate} />

        <View style={styles.headerInfo}>
          <View style={styles.row}>
            <Text style={styles.name}>{candidate?.canditate_name}</Text>
          <Text style={styles.jobTitle}>{candidate?.job_title}</Text>
          </View>
            <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.location}>
              {candidate?.jobseeker_yourcity}, {candidate?.jobseeker_yourstate}
            </Text>
          </View> 
        </View>

        {/* Personal Information */}
       <View style={styles.content}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <InfoRow
            icon="person-add-outline"
            label="Registration Type"
            value={candidate?.registration_type}
            iconColor="#95a5a6"
          />
          <InfoRow icon="person-outline" label="Age" value={`${candidate?.canditate_age} years`} iconColor="#3498db" />
          <InfoRow icon="male-female-outline" label="Gender" value={candidate?.jobseeker_gender} iconColor="#9b59b6" />
          <InfoRow
            icon="heart-outline"
            label="Marital Status"
            value={candidate?.canditate_marital_status}
            iconColor="#e74c3c"
          />
          <FontAwesome5InfoRow icon="pray" label="Religion" value={candidate?.jobseeker_religion} iconColor="#f39c12" />
          <InfoRow icon="people-outline" label="Ethnicity" value={candidate?.jobseeker_ethnicity} iconColor="#2ecc71" />
          <MaterialInfoRow icon="height" label="Height" value={candidate?.jobseeker_height} iconColor="#34495e" />
          <FontAwesome5InfoRow icon="weight" label="Weight" value={candidate?.jobseeker_weight} iconColor="#95a5a6" />
          <LanguageRow
            icon="language-outline"
            label="Languages"
            value={candidate?.jobseeker_languages}
            iconColor="#16a085"
          />
        {/* Job Information */}
           <Text style={styles.cardTitle}>Job Information</Text>
          <InfoRow icon="briefcase-outline" label="Job Type" value={candidate?.job_type} iconColor="#3498db" />
          <InfoRow
            icon="time-outline"
            label="Experience"
            value={`${candidate?.canditate_experience} years`}
            iconColor="#2ecc71"
          />
          <InfoRow
            icon="cash-outline"
            label="Expected Salary"
            value={formatSalary(candidate?.canditate_salary, candidate?.canditate_currency)}
            iconColor="#27ae60"
          />
          <InfoRow icon="build-outline" label="Skills" value={candidate?.jobseeker_skills.jobseeker_skills} iconColor="#e67e22" />

          {/* Experience Info */}
          <Text style={styles.cardTitle}>Experience</Text>
           <InfoRow
            icon="briefcase-outline"
            label="Job Title"
            value={`${candidate?.experience_Job_title}`}
            iconColor="#3498db"
          />
          <InfoRow
            icon="location-outline"
            label="Location"
            value={candidate?.experience_Location}
            iconColor="#9b59b6"
          />
          <InfoRow icon="cash-outline" label="Salary" value={candidate?.experience_Salary} iconColor="#e74c3c" />
          <InfoRow icon="calendar-outline" label="Duration" value={candidate?.experience_From_To} iconColor="#f39c12" />
          <InfoRow
            icon="document-text-outline"
            label="Nature of Work"
            value={candidate?.experience_Nature_of_Work}
            iconColor="#2ecc71"
          />
          <InfoRow
            icon="exit-outline"
            label="Reason for Leaving"
            value={candidate?.experience_Reason_for_leaving}
            iconColor="#34495e"
          />

        {/* Visa & Travel Information */}
           <Text style={styles.cardTitle}>Visa & Travel Information</Text>
          <InfoRow
            icon="document-outline"
            label="Passport"
            value={candidate?.jobseeker_passport === "yes" ? "Available" : "Not Available"}
            iconColor="#3498db"
          />
          <InfoRow
            icon="airplane-outline"
            label="Visa Type"
            value={candidate?.jobseeker_visa_type}
            iconColor="#9b59b6"
          />
          <InfoRow
            icon="calendar-outline"
            label="Visa Expiry"
            value={candidate?.jobseeker_visa_expiry_date}
            iconColor="#e74c3c"
          />
          <InfoRow
            icon="calendar-outline"
            label="Available From"
            value={candidate?.jobseeker_visa_Available_from}
            iconColor="#2ecc71"
          />
          <InfoRow
            icon="globe-outline"
            label="Ready to Work"
            value={`${candidate?.jobseeker_ready_to_work_Country}, ${candidate?.jobseeker_ready_to_work_State}`}
            iconColor="#f39c12"
          />

        {/* Documentation */}
          <Text style={styles.cardTitle}>Documentation</Text>
          <InfoRow icon="school-outline" label="Education" value={candidate?.jobseeker_education} iconColor="#3498db" />
          <InfoRow
            icon="card-outline"
            label="Address Proof"
            value={candidate?.jobseeker_addressproof}
            iconColor="#2ecc71"
          />
          <InfoRow icon="id-card-outline" label="ID Proof" value={candidate?.jobseeker_idproof} iconColor="#e67e22" />
          <InfoRow
            icon="shield-checkmark-outline"
            label="Police Clearance"
            value={candidate?.jobseeker_pcc === "yes" ? "Available" : "Not Available"}
            iconColor="#27ae60"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
    marginRight: 20
  },
  jobTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
    backgroundColor: '#5B94E2',
    padding: 10,
    borderRadius: 8
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  wishlistButton: {
    padding: 8,
  },
  content: {
    backgroundColor: "#F5F9FF",
    padding: 20,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 15,
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#ecf0f1",
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
    width: 24,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "400",
    lineHeight: 22,
  },
    imageContainer: {
    position: 'relative',
    height: 500,
    backgroundColor: '#F5F5F5',
    marginBottom: 16,
     shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#EBF2FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A90E2',
  },
  header: {
    flexDirection: 'row',
    // backgroundColor: '#5B94E2',
    paddingVertical: 5,
    // borderTopLeftRadius: 8,
    // borderTopRightRadius: 8,
  },
  roww: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  evenRow: {
    // backgroundColor: '#f9f9f9',
  },
  oddRow: {
    // backgroundColor: '#ffffff',
  },
  column: {
    flex: 1,
    color: "#7f8c8d",
    fontWeight:'500',
    textAlign: 'center',
    fontSize: 16,
  },
  languageColumn: {
    color : '#000',
    flex: 2,
    textAlign: 'left',
    // paddingLeft: 16,
    fontWeight: '400',
  },
  tick: {
    color: 'green',
    fontWeight: 'bold',
  },
  cross: {
    color: 'red',
    fontWeight: 'bold',
  },
})
