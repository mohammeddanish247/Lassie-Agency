import { UserContext } from "@/services/userContext"
import { ApiService } from "@/services/userServices"
import { getGlobalStyles } from "@/styles/globalStyles"
import { FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useLocalSearchParams } from "expo-router"
import type React from "react"
import { useContext, useEffect, useState } from "react"
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface CandidateData {
  registration_type: string
  canditate_name: string
  job_title: string
  job_type: string
  canditate_location: string
  canditate_salary: string
  canditate_experience: string
  canditate_marital_status: string
  canditate_currency: string
  canditate_age: string
  jobseeker_ethnicity: string
  jobseeker_skills: string
  jobseeker_gender: string
  jobseeker_passport: string
  jobseeker_yourcity: string
  jobseeker_yourstate: string
  jobseeker_yourcountry: string
  iswishlisted: boolean
  jobseeker_religion: string
  jobseeker_height: string
  jobseeker_weight: string
  jobseeker_experience: string
  jobseeker_visa_type: string
  jobseeker_visa_expiry_date: string
  jobseeker_visa_Available_from: string
  jobseeker_languages: string
  jobseeker_ready_to_work_Country: string
  jobseeker_ready_to_work_State: string
  jobseeker_ready_to_work_City: string
  jobseeker_ready_to_work_Locality: string
  jobseeker_education: string
  jobseeker_addressproof: string
  jobseeker_idproof: string
  jobseeker_pcc: string
}

const sampleData: CandidateData = {
  registration_type: "By Self",
  canditate_name: "Kylian Mbappe",
  job_title: "Governess",
  job_type: "8 HR-Morning Shift",
  canditate_location: "NA",
  canditate_salary: "95000-100000",
  canditate_experience: "5",
  canditate_marital_status: "Unmarried",
  canditate_currency: "France — EUR — €",
  canditate_age: "31",
  jobseeker_ethnicity: "Tribes / Advasi",
  jobseeker_skills: "All Rounder Cook, Computer Skills, Continental Cook, Cooking",
  jobseeker_gender: "male",
  jobseeker_passport: "yes",
  jobseeker_yourcity: "Norte Dam",
  jobseeker_yourstate: "Paris",
  jobseeker_yourcountry: "France",
  iswishlisted: false,
  jobseeker_religion: "Christian",
  jobseeker_height: "183 cm",
  jobseeker_weight: "74 kg",
  jobseeker_experience: "5",
  jobseeker_visa_type: "Visit",
  jobseeker_visa_expiry_date: "19/06/2027",
  jobseeker_visa_Available_from: "19/06/2023",
  jobseeker_languages: "French",
  jobseeker_ready_to_work_Country: "BAHAMAS",
  jobseeker_ready_to_work_State: "Any state",
  jobseeker_ready_to_work_City: "Any",
  jobseeker_ready_to_work_Locality: "Any Location",
  jobseeker_education: "graduate & Above",
  jobseeker_addressproof: "Driving License",
  jobseeker_idproof: "PAN Card",
  jobseeker_pcc: "yes",
}

const InfoRow = ({
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
    <Ionicons name={icon as any} size={20} color={iconColor} style={styles.icon} />
    <View style={styles.infoContent}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
)

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

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.content}>
    {children}
  </View>
)

const parseCurrency = (currencyString: string) => {
  const parts = currencyString.split(" — ")
  return parts.length >= 3 ? parts[2] : "€"
}

const formatSalary = (salary: string, currency: string = '') => {
  const currencySymbol = parseCurrency(currency)
  return `${currencySymbol}${salary}`
}

export default function CandidateProfile() {
  //  const colorScheme = useColorScheme();
      const params : any = useLocalSearchParams();
      console.log(params.id);
      const { userData } = useContext(UserContext);
      const [ candidate, setCV ] = useState<any>();
      
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
  // const candidate = sampleData

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
          <TouchableOpacity style={styles.shareButton}>
            <FontAwesome6 name='share' size={20} color='#5B94E2'></FontAwesome6>
            {/* <Ionicons name="share-outline" size={20} color="#6B9EFF" /> */}
          </TouchableOpacity>
        </View>

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
          <InfoRow
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
          <InfoRow icon="build-outline" label="Skills" value={candidate?.jobseeker_skills} iconColor="#e67e22" />

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
    height: 300,
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
})
