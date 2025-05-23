import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import { checkbox, CheckboxList } from "../../../components/CheckboxList";
import { DatePicker } from "../../../components/DatePicker";
import { InputField } from "../../../components/InputField";
import { AgreementData, AgreementFormData, JobTypes } from "../../../components/Interfaces";
import BottomSheet from "../../../components/PopupModal";
import { useLoader } from "../../../services/LoaderContext";
import { ApiService } from "../../../services/userServices";
import { getGlobalStyles } from "../../../styles/globalStyles";

export default function AddAgreementScreen() {
  const { showLoading, showSuccess } = useLoader();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  const [AgreementData, setAgreementData] = useState<AgreementData| null>(null);
  const [formData, setFormData] = useState<AgreementFormData>({
    form_id: '',
    food: '',
    living: '',
    working_hour: '',
    free_replacment: '',  // Note: Typo in "replacment" (should be "replacement")
    agr_validity: '',     // Note: Short for "agreement_validity"?
    consulting_charge: '',
    pay_type: '',
    month_deduction: '',  // Note: "deduction" or "deductions"?
    place: '',
  });
  const [ReplacementList, setReplacementList] = useState<checkbox[]>([]);
  const [HoursList, setHoursList] = useState<checkbox[]>([]);
  const [foodList, setfoodList] = useState<checkbox[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  }>({ title: '', content: null });
  const [showDatePicker, setDatePicker] = useState(false); 

  const SearchButtonPress = () =>{
    if (!formData.form_id.trim()) {
      Alert.alert('Error', 'Please enter a Form ID first');
      return;
    }
  
    setAgreementData(null); 
    showLoading(true);
    ApiService.getAgreementDetailsByFormid(formData.form_id).then(res=>{
      if (res.isSuccess == 'true') {
        console.log(res);
        setAgreementData(res.result[0]);
      } else{
        console.log(res);
        Alert.alert('Error', 'Please enter valid Form number');
      }
    })
    .finally(()=>{
      showLoading(false)
    })
  }

  const handleDateChanged = (date: Date) => {
    setFormData(prev => ({ ...prev, agr_validity: date.toLocaleString().split(',')[0] }));
    setDatePicker(false);
  };

  const handleSelectedValue = (list : checkbox[], type: string)=>{
    switch (type) {
        case 'food':
          let jl =list.filter(item=>item.checked==true);
          setFormData(prev => ({ ...prev, food: jl[0].name }));
          setfoodList(list)
          setModalVisible(false)
        break;
         case 'working_hour':
          let wh =list.filter(item=>item.checked==true);
          setFormData(prev => ({ ...prev, working_hour: wh[0].name }));
          setHoursList(list)
          setModalVisible(false)
        break;
         case 'free_replacment':
          let fr =list.filter(item=>item.checked==true);
          setFormData(prev => ({ ...prev, free_replacment: fr[0].name }));
          setReplacementList(list)
          setModalVisible(false)
        break;
        default:
            break;
    }
  }

  const getAllDataFromAPI = () =>{
    return Promise.all([
      ApiService.livingarrangements_list()
        .then((res)=>{
          if (res.isSuccess == 'true') {
              const LivingType = res.result.map((j : any)=>({
                  id : j.livingarrangements_id,
                  name : j.livingarrangements_name,
                  checked : false
              }));
              setfoodList(LivingType)
        }}),
        ApiService.get_job_type()
        .then((res)=>{
          if (res.isSuccess == 'true') {
            const joblist = res.result.map((j : JobTypes)=>({
                id : j.jobtype_id,
                name : j.jobtype_name,
                checked : false
            }));
            setHoursList(joblist)
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
        case "food":
          setModalContent({
              title: 'Select Food Living Arrangements',
              content: <CheckboxList data={foodList}
              returnValue={(list)=>{handleSelectedValue(list, 'food')}}
              ></CheckboxList>,
          });
          setModalVisible(true);
        break;
        case "working_hour":
          setModalContent({
              title: 'Select Working Hours',
              content: <CheckboxList data={HoursList}
              returnValue={(list)=>{handleSelectedValue(list, 'working_hour')}}
              ></CheckboxList>,
          });
          setModalVisible(true);
        break;
        case "free_replacment":
          setModalContent({
              title: 'Select Free Replacement',
              content: <CheckboxList data={ReplacementList}
              returnValue={(list)=>{handleSelectedValue(list, 'free_replacment')}}
              ></CheckboxList>,
          });
          setModalVisible(true);
        break;
        default:
            break;
    }    
  }

  const validateForm = (): boolean =>{
   if (!formData.food.trim()) {
    Alert.alert('Error', 'Please select food living arrangments');
    return false
   }
   if (!formData.working_hour.trim()) {
    Alert.alert('Error', 'Please select select working hours');
    return false
   }
   if (!formData.free_replacment.trim()) {
    Alert.alert('Error', 'Please enter free replacements');
    return false
   }
   if (!formData.agr_validity.trim()) {
    Alert.alert('Error', 'Please select date of agreement validaity');
    return false
   }
   if (!formData.pay_type.trim()) {
    Alert.alert('Error', 'Please mention type of payment');
    return false
   }
   if (!formData.month_deduction.trim()) {
    Alert.alert('Error', 'Please enter monthly deduction');
    return false
   }
   if (!formData.place.trim()) {
    Alert.alert('Error', 'Please enter place');
    return false
   }
    return true;
  }

  const SubmitClick = () => {
    if(!validateForm()) return;
    showLoading(true)
    ApiService.addAgreemnet(formData)
    .then((res)=>{
      console.log('final responce', res); 
      if (res.error == false) {
        showSuccess(res.message)    
        router.dismissAll();
      }
    })
    .catch((err)=>{console.log('add delivery note error', err)})
    .finally(()=>showLoading(false))
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
                placeholder="Search by Form No"
                value={formData.form_id}
                keyboardType= 'number-pad'
                onChangeText={(value) => setFormData(prev => ({ ...prev, form_id:  value}))}
              />
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={SearchButtonPress}>
              <Ionicons name="search" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 30}}>Employer Details</Text>
          </View>

          <InputField value={AgreementData?.ename} lable="Name of Employer" placeholder="Name of Employer" editable={false}/>
          <InputField value={AgreementData?.emoble} lable="Employer Mobile No" placeholder="Employer Mobile No" editable={false} maxLength={10} keyboardType='numeric'/>
          <InputField value={AgreementData?.address} lable="Address/WorkLocation" placeholder="Address/WorkLocation" multiline numberOfLines={4} editable={false}/>
          <InputField lable="Monthly Salary" placeholder="Monthly Salary" editable={false}
          value={AgreementData?.esalary} icon="cash-outline"/>

          <InputField lable="Date of Joining" placeholder="Date of Joining" editable={false}
          value={AgreementData?.ejoindate} icon="calendar-outline"/>

          <InputField lable="Job Category" placeholder="Monthly Salary" editable={false}
          value={AgreementData?.ejobcategory} icon="time-outline"/>

          <InputField lable="Consultant Charges" placeholder="Consultant Charges" editable={false}
          value={AgreementData?.consultantcharges} icon="cash-outline"/>

          <InputField lable="Registration Charges" placeholder="Registration Charges" editable={false}
          value={AgreementData?.registrationcharge} icon="cash-outline"/>

          <InputField lable="Transport Charges" placeholder="Transport Charges" editable={false}
          value={AgreementData?.transportcharge} icon="cash-outline"/>


          <View>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 30}}>Candidate Details</Text>
          </View>

          <InputField value={AgreementData?.cname} lable="Candidate Name" placeholder="Candidate Name" editable={false}/>
          <InputField value={AgreementData?.cmobile} lable="Candidate Mobile No" placeholder="Mobile No" editable={false}/>
          <InputField value={AgreementData?.caddress} lable="Candidate Address" placeholder="Address" multiline numberOfLines={4} editable={false}/>
    {AgreementData ?(
      <>
    <View>
      <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 30}}>Extra Details</Text>
    </View>

    <InputField lable="Food Living Arrangments" placeholder="Select Food Living Arrangments" onChangeValue={(value) => setFormData(prev => ({ ...prev, food:  value}))} 
    value={formData.food} hasModal={true} icon="fast-food-outline" itemClicked={() => openModalAccordingly('food')} />

   <InputField lable="Working Hours" placeholder="Select Working Hours" onChangeValue={(value) => setFormData(prev => ({ ...prev, working_hour:  value}))} 
    value={formData.working_hour} hasModal={true} icon="alarm-outline" itemClicked={() => openModalAccordingly('working_hour')} />

    <InputField lable="Free Replacment" placeholder="Enter Free Replacment" onChangeValue={(value) => setFormData(prev => ({ ...prev, free_replacment:  value}))} 
    value={formData.free_replacment} icon="repeat-outline"/>

    <InputField 
      lable="Agreement Validity" 
      placeholder="Enter Date of Validity" 
      onChangeValue={(value) => {
          console.log(value);
          
      }} 
      value={formData.agr_validity}
      hasModal= {true}
      icon="calendar-outline" 
      itemClicked={() => setDatePicker(true)}
    />

    <InputField value={formData.pay_type} lable="Payment Type" placeholder="Mention Type of the Payment" 
    onChangeValue={(value) => setFormData(prev => ({ ...prev, pay_type:  value}))}/>

    <InputField value={formData.month_deduction} lable="Monthly Deduction" placeholder="Monthly Deduction" 
    onChangeValue={(value) => setFormData(prev => ({ ...prev, month_deduction:  value}))} keyboardType="number-pad"/>


    <InputField value={formData.place} lable="Place" placeholder="Enter Place" 
    onChangeValue={(value) => setFormData(prev => ({ ...prev, place:  value}))}/>

    <TouchableOpacity style={[globalStyles.loginButton, {marginBottom: 28}]} onPress={SubmitClick}>
      <Text style={globalStyles .loginButtonText}>Submit Now</Text>
    </TouchableOpacity>

    <BottomSheet visible={modalVisible} onClose={()=> setModalVisible(false)} title={modalContent.title}>{modalContent.content}</BottomSheet>
    <DatePicker doShow={showDatePicker} onDateChange={handleDateChanged}/>
   </>

    ):( <Text style={{textAlign: 'center', margin: 20}}>No agreement data available please search for a valid form no</Text>)}
          
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
