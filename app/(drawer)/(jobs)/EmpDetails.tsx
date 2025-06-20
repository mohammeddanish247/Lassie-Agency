import { EmployerDetails } from "@/components/Interfaces";
import { ApiService } from "@/services/userServices";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EmployeeDetailsScreen() {

  const { job_id } : { job_id : string} = useLocalSearchParams();
  console.log(job_id);

  const [EmpDetails, setEmpDetails] = useState<EmployerDetails>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ApiService.get_Employee_Details(job_id);
        if (res.isSuccess === 'true' && res.result && res.result.length > 0) {
            console.log(res.result[0]);
            setEmpDetails(res.result[0]);
        }
      } catch (error) {
        console.error("Error fetching agreement details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [job_id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading agreement details...</Text>
      </SafeAreaView>
    );
  }

  if (!EmpDetails) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>No Employee details found</Text>
        {/* <TouchableOpacity style={styles.backButtonPlain} onPress={handleBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity> */}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={'#5B94E2'} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileCard}>
          {/* Share and Like buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="share-outline" size={24} color="#777" />
              {/* <Ionicons name="share-outline" size={22} color="#777" style={{marginTop: 2, marginLeft: 1}}/> */}
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialCommunityIcons name="cards-heart-outline" size={24} color="#777" />
              {/* <Ionicons name="heart-outline" size={24} color="#777" style={{marginTop: 2, marginLeft: 1}}/> */}
            </TouchableOpacity>
          </View>

          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <Image
              source={require('@/assets/images/profile.png')}
              style={styles.profileImage}
            />
          </View>

          {/* Name and Title */}
          <Text style={styles.name}>{EmpDetails.employer_name}</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{EmpDetails.job_category}</Text>
          </View>

          {/* Personal Details */}
          <Text style={styles.detailsText}>No of Members • {EmpDetails.job_posting_number_of_members}</Text>

          {/* Professional Details */}
          <Text style={styles.detailsText}>Budget • {EmpDetails.job_posting_budget_for_hiring}</Text>

          {/* Work Schedule */}
          <Text style={styles.detailsText}>JobType • {EmpDetails.job_type}</Text>

          {/* Location */}
          <Text style={styles.detailsText}>{EmpDetails.job_posting_locality}, {EmpDetails.job_posting_city}, {EmpDetails.job_posting_state}, {EmpDetails.job_posting_country}</Text>

          {/* Salary */}
          <Text style={styles.salary}>
            ₹{EmpDetails.job_posting_salary}<Text style={styles.salaryPeriod}>/Month</Text>
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity style={styles.primaryButton}>
              <Ionicons name="document-text-outline" size={18} color="white" style={styles.buttonIcon} />
              <Text style={styles.primaryButtonText}>View CV</Text>
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Contact Me</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6eeff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4a90e2",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  optionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 16,
    margin: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  iconButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAEDF2'
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#4a90e2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "white",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  badgeContainer: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
  detailsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  salary: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 12,
  },
  salaryPeriod: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: "#4a90e2",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 8,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  secondaryButton: {
    borderColor: "#4a90e2",
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: "#4a90e2",
    fontWeight: "600",
    fontSize: 16,
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
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    marginBottom: 20,
  },

})
