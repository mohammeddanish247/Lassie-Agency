import { checkbox, CheckboxList } from "@/components/CheckboxList";
import { DatePicker } from "@/components/DatePicker";
import { InputField } from "@/components/InputField";
import { AddDeliveryNotes, DNEmployerData, JobTitles, JobTypes, salaryList } from "@/components/Interfaces";
import BottomSheet from "@/components/PopupModal";
import { Colors } from "@/constants/Colors";
import { useLoader } from "@/services/LoaderContext";
import { UserContext } from "@/services/userContext";
import { ApiService } from "@/services/userServices";
import { getGlobalStyles } from "@/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

export default function DeliveryNoteScreen() {
  const { showLoading, showSuccess } = useLoader();
  const { userData } = useContext(UserContext)
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');

  const [EmpData, setEmpData] = useState<DNEmployerData | null>(null);
  const [formData, setFormData] = useState<AddDeliveryNotes>({
    ciof_no: '',
    canditate_name: '',
    canditate_mobile: '',
    canditate_family: '',
    canditate_address: '',
    canditate_document_no: '',
    esalary: '',
    ejoindate: '',
    ejobcategory: '',
    // ejobtype : '', //.....also commented from interface
    registrationcharge: '',
    transportcharge: '',
    consultantcharges: '',
  });
  const [jobTypeList, setJobTypeList] = useState<checkbox[]>([]);
  const [SalaryList, setSalaryList] = useState<checkbox[]>([]);
  const [jobTitleList, setJobTitleList] = useState<checkbox[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  }>({ title: '', content: null });
  const [showDatePicker, setDatePicker] = useState(false); 

  const SearchButtonPress = () =>{
    if (!formData.ciof_no.trim()) {
      Alert.alert('Error', 'Please enter a valid CIOF no and search');
      return;
    }

    setEmpData(null)
    showLoading(true);
    ApiService.getEmployerDetailsByCiof(formData.ciof_no).then(res=>{
      if (res.isSuccess == 'true') {
        setEmpData({
          name: res.result[0].name || '',
          mobile: res.result[0].mobile || '',
          address: res.result[0].address || '',
        });
      showLoading(false)
      } else{
        console.log(res);
        Alert.alert('Error', 'Please enter valid CIOF number');
        showLoading(false)
      }
    })
    .finally(()=>{
      showLoading(false)
    })
  }

  const handleSelectedValue = (list : checkbox[], type: string)=>{
    switch (type) {
        case 'jobCategory':
          let jl =list.filter(item=>item.checked==true);
          setFormData(prev => ({ ...prev, ejobcategory: jl[0].name }));
          setJobTitleList(list)
          setModalVisible(false)
        break;
        case "jobType":
            let jt =list.filter(item=>item.checked==true);
            setFormData(prev => ({ ...prev, ejobtype: jt[0].name }));
            setJobTypeList(list)
            setModalVisible(false)
            break;
        case "Salary":
            let es =list.filter(item=>item.checked==true);
            setFormData(prev => ({ ...prev, esalary: es[0].name }));
            setSalaryList(list)
            setModalVisible(false)
            break;
        default:
            break;
    }
  }

  const getAllDataFromAPI = () =>{
    return Promise.all([
      ApiService.get_job_type()
        .then((res)=>{
          if (res.isSuccess == 'true') {
              const jobType = res.result.map((j : JobTypes)=>({
                  id : j.jobtype_id,
                  name : j.jobtype_name,
                  checked : false
              }));
              setJobTypeList(jobType)
        }}),

        ApiService.salaryList()
        .then((res)=>{
          if (res.isSuccess == 'true') {
              const slist = res.result.map((s : salaryList)=>({
                  id : s.salaryexpecteds_id,
                  name : s.salaryexpecteds_name,
                  checked : false
              }));
              setSalaryList(slist)
        }}),
        ApiService.get_job_title()
        .then((res)=>{
          if (res.isSuccess == 'true') {
            const joblist = res.result.map((j : JobTitles)=>({
                id : j.jobtitle_id,
                name : j.jobtitle_name,
                checked : false
            }));
            setJobTitleList(joblist)
        }}),
  ]);
  }

  useEffect(()=>{
    showLoading(true)
    getAllDataFromAPI()
    .catch((err) => {
      console.error("getAllDataFromAPI Error:", err);
    })
    .finally(() => {
      showLoading(false);
    });
  },[])

  const openModalAccordingly = (modalToOpen: string) =>{
    switch (modalToOpen) {
        case "OpenJobCategory":
          setModalContent({
              title: 'Select Job Category',
              content: <CheckboxList data={jobTitleList}
              returnValue={(list)=>{handleSelectedValue(list, 'jobCategory')}}
              ></CheckboxList>,
          });
          setModalVisible(true);
        break;
        case "OpenJobType":
            setModalContent({
                title: 'Select Job Type',
                content: <CheckboxList data={jobTypeList}
                returnValue={(list)=>{handleSelectedValue(list, 'jobType')}}
                ></CheckboxList>,
            });
            setModalVisible(true);
            break;
        case "OpenSalary":
            setModalContent({
                title: 'Select Expected Salary',
                content: <CheckboxList data={SalaryList}
                returnValue={(list)=>{handleSelectedValue(list, 'Salary')}}
                ></CheckboxList>,
            });
            setModalVisible(true);
            break;
        default:
            break;
    }    
  }
  const handleDateChanged = (date: Date) => {
    setFormData(prev => ({ ...prev, ejoindate: date.toLocaleString().split(',')[0] }));
    setDatePicker(false);
  };

  const validateForm = () => {
    if (!EmpData?.name.trim()) {
      Alert.alert('Error', 'Please enter and search a valid CIOF number');
      return false;
    }
    if (!formData.canditate_name.trim()) {
      Alert.alert('Error', 'Please enter candidate name');
      return false;
    }
    if (!formData.canditate_mobile.trim() || formData.canditate_mobile.length !== 10 || !/^\d+$/.test(formData.canditate_mobile)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }
    if (!formData.canditate_family.trim()) {
      Alert.alert('Error', 'Please enter Father/Husband name');
      return false;
    }
    if (!formData.canditate_address.trim()) {
      Alert.alert('Error', 'Please enter address');
      return false;
    }
    if (!formData.canditate_document_no.trim()) {
      Alert.alert('Error', 'Please enter document number');
      return false;
    }
    if (!formData.esalary.trim()) {
      Alert.alert('Error', 'Please enter your state');
      return false;
    }
    if (!formData.ejoindate.trim()) {
      Alert.alert('Error', 'Please select joining date');
      return false;
    }
    if (!formData.ejobcategory.trim()) {
      Alert.alert('Error', 'Please select job category');
      return false;
    }   
    // if (!formData.ejobtype.trim()) {
    //   Alert.alert('Error', 'Please select job type');
    //   return false;
    // }
    if (!formData.registrationcharge.trim()) {
      Alert.alert('Error', 'Please enter registration charge');
      return false;
    }
    if (!formData.transportcharge.trim()) {
      Alert.alert('Error', 'Please enter transport charge');
      return false;
    }
    if (!formData.consultantcharges.trim()) {
      Alert.alert('Error', 'Please enter consultant charge');
      return false;
    }
    return true;
  };
  


  const SubmitClick = () => {
    if (!validateForm()) return;
    if (userData) {
       showLoading(true)
    ApiService.addServiceDeliveryNote(formData, userData?.user_id)
    .then((res)=>{
      console.log('final responce', res); 
      if (res.error == false) {
        showSuccess(res.message)    
        router.dismissAll();
      }
    })
    .catch((err)=>{console.log('add delivery note error', err)})
    .finally(()=>showLoading(false))
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <StatusBar barStyle="light-content"/>
      <ScrollView style={styles.scrollView}>
        <View style={[globalStyles.container, {marginTop: 30,  paddingHorizontal: 25}]}>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by CIOF No"
                value={formData.ciof_no}
                keyboardType= 'number-pad'
                onChangeText={(ciof) => setFormData(prev => ({ ...prev, ciof_no: ciof }))}
              />
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={SearchButtonPress}>
              <Ionicons name="search" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 30}}>Employer Details</Text>
          </View>

          <InputField value={EmpData?.name} lable="Name of Employer" placeholder="Name of Employer" editable={false}/>
          <InputField value={EmpData?.mobile} lable="Employer Mobile No" placeholder="Employer Mobile No" editable={false} maxLength={10} keyboardType='numeric'/>
          <InputField value={EmpData?.address} lable="Address/WorkLocation" placeholder="Address/WorkLocation" multiline numberOfLines={4} editable={false}/>

{EmpData ? (<>
  <View>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 30}}>Candidate Details</Text>
          </View>

          <InputField value={formData.canditate_name} lable="Candidate Name" placeholder="Candidate Name"  onChangeValue={(text:any) => setFormData(prev => ({...prev, canditate_name: text}))}/>
          <InputField value={formData.canditate_mobile} lable="Mobile No" maxLength={10} placeholder="Mobile No" keyboardType='number-pad' onChangeValue={(text:any) => setFormData(prev => ({...prev, canditate_mobile: text}))}/>
          <InputField value={formData.canditate_family} lable="Father/Husband Name" placeholder="Father/Husband Name" onChangeValue={(text:any) => setFormData(prev => ({...prev, canditate_family: text}))}/>
          <InputField value={formData.canditate_address} lable="Address" placeholder="Address" multiline numberOfLines={4} onChangeValue={(text:any) => setFormData(prev => ({...prev, canditate_address: text}))}/>
          <InputField value={formData.canditate_document_no} lable="Aadhar/Passport/V.ID No" placeholder="Aadhar/Passport/V.ID No" onChangeValue={(text:any) => setFormData(prev => ({...prev, canditate_document_no: text}))}/>

          <View>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 30}}>Others Details</Text>
          </View>

          <InputField value={formData.esalary} lable="Monthly Salary" placeholder="Enter Monthly Salary" 
          onChangeValue={(value) => setFormData(prev => ({ ...prev, esalary:  value}))} keyboardType="number-pad"/>

          {/* <InputField lable="Monthly Salary" placeholder="Monthly Salary" onChangeValue={(value) => setFormData(prev => ({ ...prev, esalary:  value}))} 
          value={formData.esalary} hasModal={true} icon="cash-outline" itemClicked={() => openModalAccordingly('OpenSalary')} /> */}

          <InputField 
            lable="Joining Data" 
            placeholder="Enter Date of Joining" 
            onChangeValue={(value) => setFormData(prev => ({ ...prev, ejoindate: value}))} 
            value={formData.ejoindate}
            hasModal= {true}
            icon="calendar-outline" 
            itemClicked={() => setDatePicker(true)}
          />

          <InputField lable="Job Category" placeholder="Job Category" onChangeValue={(value) => setFormData(prev => ({ ...prev, ejobcategory:  value}))} 
          value={formData.ejobcategory} hasModal={true} icon="briefcase-outline" itemClicked={() => openModalAccordingly('OpenJobCategory')} />

          {/* <InputField lable="Job Type" placeholder="Job Type" onChangeValue={(value) => setFormData(prev => ({ ...prev, ejobtype:  value}))} 
          value={formData.ejobtype} hasModal={true} icon="hourglass-outline" itemClicked={() => openModalAccordingly('OpenJobType')} /> */}

          <View>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 30}}>Terms and Condition</Text>
          </View>

          <InputField value={formData.registrationcharge} lable="Registation Charge" placeholder="Registation Charge" 
          onChangeValue={(value) => setFormData(prev => ({ ...prev, registrationcharge:  value}))} keyboardType="number-pad"/>
          <InputField value={formData.transportcharge} lable="Transport Charge" placeholder="Transport Charge" 
          onChangeValue={(value) => setFormData(prev => ({ ...prev, transportcharge:  value}))} keyboardType="number-pad"/>
          <InputField value={formData.consultantcharges} lable="Consultant Charge" placeholder="Consultant Charge" 
          onChangeValue={(value) => setFormData(prev => ({ ...prev, consultantcharges:  value}))}  keyboardType="number-pad"/>

          <TouchableOpacity style={[globalStyles.loginButton, {marginBottom: 28}]} onPress={SubmitClick}>
            <Text style={globalStyles .loginButtonText}>Submit Now</Text>
          </TouchableOpacity>
              <View style={{marginBottom: 50}}></View>
          <BottomSheet visible={modalVisible} onClose={()=> setModalVisible(false)} title={modalContent.title}>{modalContent.content}</BottomSheet>
          <DatePicker doShow={showDatePicker} onDateChange={handleDateChanged}/>

</>):(<Text style={{textAlign: 'center', margin: 20}}>Please search a valid CIOF number to add delivery note</Text>)}
       
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
  },
  searchInputContainer: {
    flex: 1,
    height: 46,
    backgroundColor: Colors.light.card,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  searchInput: {
    fontSize: 15,
  },
  searchButton: {
    width: 46,
    height: 46,
    backgroundColor: Colors.light.primary,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
