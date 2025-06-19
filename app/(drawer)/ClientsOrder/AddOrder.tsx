import { getStyles } from "@/app/index";
import { checkbox } from "@/components/CheckboxList";
import { AccordionItem } from "@/components/CollapsibleAccordion";
import { InputField } from "@/components/InputField";
import { JobTitles, Order } from "@/components/Interfaces";
import { RadioGroup, RadioOption } from "@/components/RadioButton";
import { Colors } from "@/constants/Colors";
import { useLoader } from "@/services/LoaderContext";
import { ApiService } from "@/services/userServices";
import { getGlobalStyles } from "@/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";

const AddOrder = () => {

    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const globalStyles = getGlobalStyles(colorScheme ?? 'light');
    const loginStyles = getStyles(colorScheme ?? 'light');
    const { showLoading, showSuccess } = useLoader();
    const [typeOfMaidService, SetTypeOfMaidService] = useState('');
    const [serventOption, SetServentOption] = useState('');
    const [budget, SetBudget] = useState('');
    const [member, SetMember] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [jobTitles, setJobTitles] = useState<checkbox[]>([]);
    const [orderList, setOrderList] = useState<Order>({
        mobile: '',
        email: '',
        address: '',
        name: '',
        looking_for: '',
        service_required: '',
        servant_quarter: '',
        hiring_budget: '',
        number_of_member: '',
        description: '',
    });

    const typeOfMaidServiceOptions: RadioOption[] = [
        { label: '24 Hours Live In', value: '24 Hours Live In' },
        { label: '10-12 Hours', value: '10-12 Hours' },
      ];

    const YesNoOption: RadioOption[] = [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
    ];

    const BudgetOption: RadioOption[] = [
        { label: 'Little Prior Experience (Rs.8500-12500)', value: 'Little Prior Experience (Rs.8500-12500)' },
        { label: 'Semi-Skilled (Rs.12500-14500)', value: 'Semi-Skilled (Rs.12500-14500)' },
        { label: 'Experienced and Premium(Rs.14500-18500)', value: 'Experienced and Premium(Rs.14500-18500)' },
    ];

    const NumberOfMemberOption: RadioOption[] = [
        { label: '1-2', value: '1-2' },
        { label: '3-5', value: '3-5' },
        { label: '5+', value: '5+' },
    ];

    const toggleCheckbox = (list : checkbox[]) =>{
        setJobTitles(list);
    }

    const SubmitClicked = () =>{
       showLoading(true)
        ApiService.addOrder(orderList)
        .then((res)=>{
        console.log('final responce', res); 
        if (res.error == false) {
            showSuccess(res.message)    
            router.dismissAll();
        }
        })
        .catch((err)=>{console.log('add Order error', err)})
        .finally(()=>showLoading(false))
    }

    useEffect(() => {
        const fetchJobTitles = async () => {
          try {
            const response = await ApiService.get_job_title();
            const jobsWithCheckboxState = response.result.map((job: JobTitles) => ({
              id : job.jobtitle_id,
              name: job.jobtitle_name,
              checked: false // Initialize all checkboxes as unchecked
            }));
            setJobTitles(jobsWithCheckboxState);
          } catch (error) {
            console.error('Error fetching job titles:', error);
          }
        }
        fetchJobTitles();
    },[]);

    const sendLinktoMobileNo = ()=> {
        showLoading(true);
            ApiService.create_employer_order_by_share_link(phoneNumber).then(res=>{
                if (res.error == false) {
                    showLoading(false);
                    showSuccess(res.message)
                }
            })
    }

    const onValueChange = (value: string) =>{
        setJobTitles(prevData => 
            prevData.map(item => 
            item.name === value 
                ? { ...item, checked: true } 
                : { ...item, checked: false}
            )
        );
        setOrderList(prevData =>({
            ...prevData,
            looking_for: value
        }))
    }
    
    return (
        <SafeAreaView style={globalStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor={'#5B94E2'} />
        <ScrollView>
            <View style={[globalStyles.container, {marginTop: 30,  paddingHorizontal: 25}]}>
                {/* Phone number input */}
                <Text style={loginStyles.inputLabel}>Phone Number</Text>
                <View style={globalStyles.InputContainer}>
                    <TouchableOpacity 
                        style={loginStyles.countryCodeButton}
                        onPress={sendLinktoMobileNo}
                        >
                        <Ionicons name="send" size={24} color={'#fff'}></Ionicons>
                    </TouchableOpacity>
                    
                    <TextInput
                        style={loginStyles.textInput}
                        placeholder="Send to Mobile No."
                        placeholderTextColor={colors.textSecondary}
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        maxLength={10}
                    />
                </View>

            <InputField lable="Name of Employer" placeholder="Name of Employer" value={orderList.name} 
                onChangeValue={ (value) => setOrderList(data => ({...data, name: value}))}></InputField>
            <InputField lable="Employer Mobile No" placeholder="Employer Mobile No" value={orderList.mobile} 
                onChangeValue={ (value) => setOrderList(data => ({...data, mobile: value}))}></InputField>
            <InputField lable="Employer Email Id" placeholder="Employer Email Id" value={orderList.email} 
                onChangeValue={ (value) => setOrderList(data => ({...data, email: value}))}></InputField>
            <InputField lable="Employer Address" placeholder="Employer Address" value={orderList.address} multiline={true}
                onChangeValue={ (value) => setOrderList(data => ({...data, address: value}))}></InputField>

            <View style={{marginTop: 30}}>
                <AccordionItem title='Select That You Are looking For' 
                    children = {
                        jobTitles.length > 0 ? (
                            <View style={styles.container}>
                                {jobTitles.map((item) => (
                                <View key={item.id} style={styles.jobItem}>
                                    <Checkbox
                                    value={item.checked}
                                    onValueChange={() => onValueChange(item.name)}
                                    color={item.checked ? '#4630EB' : undefined}
                                    style={styles.checkbox}
                                    />
                                    <Text style={styles.jobLabel} onPress={() => onValueChange(item.name)}>{item.name}</Text>
                                </View>
                                ))}
                            </View>
                        // <CheckboxList data={jobTitles} returnValue={(list)=>toggleCheckbox(list)}></CheckboxList>
                    ) : (
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" style={{flex: 1}} />
                            </View>
                    )}
                    // isCollapsedd={false}
                ></AccordionItem>
            </View>

            <RadioGroup selectedValue={orderList.service_required} onValueChange={(value)=>(setOrderList(preD=>({...preD, service_required: value})))} options={typeOfMaidServiceOptions} title="Type of Maid Service You Required" ></RadioGroup>
            <RadioGroup selectedValue={orderList.servant_quarter} onValueChange={(value)=>(setOrderList(preD=>({...preD, servant_quarter: value})))} options={YesNoOption} title="Does your house have a servant quarter?" ></RadioGroup>
            <RadioGroup selectedValue={orderList.hiring_budget} onValueChange={(value)=>(setOrderList(preD=>({...preD, hiring_budget: value})))} options={BudgetOption} title="Budget for Hiring a maid?" ></RadioGroup>
            <RadioGroup selectedValue={orderList.number_of_member} onValueChange={(value)=>(setOrderList(preD=>({...preD, number_of_member: value})))} options={NumberOfMemberOption} title="Number of member in the house" ></RadioGroup>

            <InputField lable="Describe your requirement in Detail" placeholder="Describe your requirement in Detail" multiline={true} numberOfLines={5} value={orderList.description} 
                onChangeValue={ (value) => setOrderList(data => ({...data, description: value}))}></InputField>

            {/* Login button */}
            <TouchableOpacity style={globalStyles.loginButton} onPress={()=> SubmitClicked()}>
            <Text style={globalStyles .loginButtonText}>Submit</Text>
            </TouchableOpacity>

            <View style={{marginBottom: 50}}></View>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}

export default AddOrder;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: '100%',
  },
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    marginRight: 12,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#ddd',
    width: 20,
    height: 20,
  },
  jobLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});