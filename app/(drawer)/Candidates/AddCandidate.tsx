import AttachmentAndVerification from "@/components/AttachmentAndVerification";
import { checkbox } from "@/components/CheckboxList";
import EducationalInfo from "@/components/EducationalInfo";
import Experiences from "@/components/Experience";
import { AddCandidateFormLists, AddressType, CandidateDocuments, Country, CountryCurrency, Ethnicity, Height, IDProofType, IFormData, JobTitles, JobTypes, Language, Religion, Skills, TypeOfVisa, Weight, salaryList } from "@/components/Interfaces";
import JobDetails from "@/components/JobDetails";
import { PersonalInfo } from "@/components/PersonalInfo";
import { useLoader } from "@/services/LoaderContext";
import { UserContext } from "@/services/userContext";
import { ApiService } from "@/services/userServices";
import { getGlobalStyles } from "@/styles/globalStyles";
import { router } from "expo-router";
import { JSX, useContext, useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, ScrollViewProps, StatusBar, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function AddCandidate() {
    const colorScheme = useColorScheme();
    const globalStyles = getGlobalStyles(colorScheme ?? 'light');
    const { showLoading, showSuccess } = useLoader();
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState<number>(1);
    const totalSteps: number = 5;

    const [lists, setLists] = useState<AddCandidateFormLists>({
        countryList: [],
        ethnicityList:[],
        maritalStatus:[],
        religionList:[],
        heightList:[],
        weightList:[],
        jobTitleList:[],
        jobTypeList:[],
        expectedSalaryList:[],
        currencyList:[],
        readyToWorkCountryList:[],
        languagelist:[],
        skillList:[],
        selectedSkills:[],
        typeOfVisaList:[],
        addressTypeList:[],
        idProofTypeList:[],
      });

    const { userData } = useContext(UserContext);
    const [candidateDocs, setCandidateDocs] = useState<CandidateDocuments>({
        canditate_image: '',
        id_proof_image: '', 
        address_proof_image: '',
    })
    const [formData, setFormData] = useState<Partial<IFormData>>({
        first_name: '',
        last_name: '',
        mobile_number: '',
        gender: '',
        marital_status: '',
        dob: '',
        age: '',
        jobseeker_nationality: '',
        country_code: '',
        jobseeker_ethnicity: '',
        religion: '',
        height: '',
        weight: '',
        job_title: '',
        job_type: '',
        jobseeker_currency: '',
        salary_expected: '',
        jobseeker_ready_to_work_Country: '',
        jobseeker_ready_to_work_State: '',
        jobseeker_ready_to_work_City: '',
        jobseeker_ready_to_work_Locality: '',
        jobseeker_available: '',
        experience: '',
        experience_Job_title: '',
        experience_Location: '',
        experience_Salary: '',
        experience_From_To: '',
        experience_Nature_of_Work: '',
        experience_Reason_for_leaving: '',
        jobseeker_education: '',
        skill: {},
        jobseeker_passport: '',
        type_of_visa: '',
        jobseeker_visa_expiry_date: '',
        jobseeker_visa_Available_from: '',
        languages:'',
        jobseeker_addressproof: '',
        jobseeker_idproof: '',
        jobseeker_pcc: '',
        jobseeker_verification_doc: '',
        jobseeker_doc_impre: '',
        reference_name: "",
        reference_mobile: "",
        reference_relationship: "",
        reference_any_id_number: "",
    })



    const getAllDataFromAPI = async () =>{
       return Promise.all([
            ApiService.countryListCode()
            .then((res)=>{
                if (res.isSuccess == 'true') {
                    const conList = res.result.map((c :Country) =>({
                        id : c.country_id,
                        name : c.country_name,
                        checked : false
                    }));
                    setLists(prevState => ({
                        ...prevState,       
                        countryList: conList,
                        readyToWorkCountryList: conList
                      }));
                }
            })
            .catch((err)=>{
                console.log('country list Error', err);      
            }),   
    
            ApiService.maritalStatus()
            .then((res)=>{
                if (res.isSuccess == 'true') {
                    const marList = res.result.map((m : any)=>({
                        label : m.maritials_name, 
                        value : m.maritials_name
                    }));
                    setLists(prevState => ({
                        ...prevState,        
                        maritalStatus: marList 
                      }));
                }
            })
            .catch((err)=>{
                console.log('Marital status Error', err);      
            }),

            ApiService.religionList()
            .then((res)=>{
                if (res.isSuccess == 'true') {
                    const rejList = res.result.map((r : Religion)=>({
                        id : r.religions_id,
                        name : r.religions_name,
                        checked : false
                    }));
                    setLists(prevState => ({
                        ...prevState,        
                        religionList: rejList 
                      }));
                }
            })
            .catch((err)=>{
                console.log('Religion List Error', err);      
            }),

            ApiService.livingarrangements_list()
            .then((res)=>{
                if (res.isSuccess == 'true') {
                    const list = res.result.map((r : Ethnicity)=>({
                        id : r.livingarrangements_id,
                        name : r.livingarrangements_name,
                        checked : false
                    }));
                    setLists(prevState => ({
                        ...prevState,        
                        ethnicityList: list 
                      }));
                }
            })
            .catch((err)=>{
                console.log('Ethnicity List Error', err);      
            }),

            ApiService.height_List()
            .then((res)=>{
                if (res.isSuccess == 'true') {
                    const hgtList = res.result.map((h : Height)=>({
                        id : h.heights_id,
                        name : h.heights_name,
                        checked : false
                    }));
                    setLists(prevState => ({
                        ...prevState,       
                        heightList: hgtList
                      }));
                }
            })
            .catch((err)=>{
                console.log('Height List Error', err);      
            }),

            ApiService.weight_list()
            .then((res)=>{
                if (res.isSuccess == 'true') {
                    const wtList = res.result.map((h : Weight)=>({
                        id : h.weights_id,
                        name : h.weights_name,
                        checked : false
                    }));
                    setLists(prevState => ({
                        ...prevState,       
                        weightList: wtList 
                      }));
                }
            })
            .catch((err)=>{
                console.log('Weight List Error', err);      
            }),

            // ApiService.languageList()
            // .then((res)=>{
            //     if (res.isSuccess == 'true') {
            //         const lanList = res.result.map((h : Language)=>({
            //             id : h.language_id,
            //             name : h.language_name,
            //             checked : false
            //         }));
            //         setLanguageList(lanList)
            //     }
            // })
            // .catch((err)=>{
            //     console.log('Language List Error', err);      
            // }),

            ApiService.get_job_title()
             .then((res)=>{
                 if (res.isSuccess == 'true') {
                    const joblist = res.result.map((j : JobTitles)=>({
                        id : j.jobtitle_id,
                        name : j.jobtitle_name,
                        checked : false
                    }));
                    setLists(prevState => ({
                        ...prevState,        
                        jobTitleList: joblist 
                      }));
                }}),

                
            ApiService.get_job_type()
            .then((res)=>{
                if (res.isSuccess == 'true') {
                    const jobType = res.result.map((j : JobTypes)=>({
                        id : j.jobtype_id,
                        name : j.jobtype_name,
                        checked : false
                    }));
                    setLists(prevState => ({
                        ...prevState,       
                        jobTypeList: jobType 
                      }));
                }}),

            ApiService.salaryList()
            .then((res)=>{
                if (res.isSuccess == 'true') {
                    const slist = res.result.map((s : salaryList)=>({
                        id : s.salaryexpecteds_id,
                        name : s.salaryexpecteds_name,
                        checked : false
                    }));
                    setLists(prevState => ({
                        ...prevState,       
                        expectedSalaryList: slist 
                      }));
                }}),

            ApiService.curencyList()
            .then((res)=>{
                if (res.isSuccess == 'true') {
                    const clist = res.result.map((c : CountryCurrency)=>({
                        id : c.currency_id,
                        name : c.country_name+` — `+c.currency_name+` — `+c.currency_code,
                        checked : false
                    }));
                    setLists(prevState => ({
                        ...prevState,       
                        currencyList: clist 
                      }));
                }}),

            ApiService.languageList()
            .then((res)=>{
                if (res.isSuccess == 'true') {
                    const lanList = res.result.map((h : Language)=>({
                        id : h.language_id,
                        name : h.language_name,
                        checked : false
                    }));
                    setLists(prevState => ({
                        ...prevState,       
                        languagelist: lanList 
                      }));
                }
            })
            .catch((err)=>{
                console.log('Language List Error', err);      
            }),

            ApiService.get_skills()
            .then((res)=>{
              if (res.isSuccess == 'true') {
                const skills = res.result.map((e :Skills) =>({
                  id : e.skill_id,
                  name : e.skill_name,
                  checked : false
                }));
                setLists(prevState => ({
                    ...prevState,       
                    skillList: skills 
                  }));
              }}),

            ApiService.typeOfVisaList()
            .then((res)=>{
                if (res.isSuccess == 'true') {
                    const visa = res.result.map((v : TypeOfVisa)=>({
                        id : v.typeofvisa_id,
                        name : v.typeofvisa_name,
                        checked : false
                    }));
                    setLists(prevState => ({
                        ...prevState,       
                        typeOfVisaList: visa 
                      }));
                }}),

            ApiService.typeOfAddress()
            .then((res)=>{
                if (res.isSuccess == 'true') {
                    const adrsList = res.result.map((a : AddressType)=>({
                        id : a.addressproofs_id,
                        name : a.addressproofs_name,
                        checked : false
                    }));
                    setLists(prevState => ({
                        ...prevState,       
                        addressTypeList: adrsList 
                      }));
                }}),
                
                ApiService.typeOfIdProof()
                .then((res)=>{
                        if (res.isSuccess == 'true') {
                          const IdList = res.result.map((i : IDProofType)=>({
                              id : i.idproof_id,
                              name : i.idproof_name,
                              checked : false
                          }));
                          setLists(prevState => ({
                            ...prevState,       
                            idProofTypeList: IdList 
                          }));
                    }}),

        ])
    }

    useEffect(()=>{
        showLoading(true)
        getAllDataFromAPI()
        .catch((err) => {
          console.error("getAllDataFromAPI Error:", err);
        })
        .finally(() => {
            showLoading(false)
          });
    },[])


    const defaultScrollViewProps : ScrollViewProps = {
        showsVerticalScrollIndicator : false,
        keyboardShouldPersistTaps: 'handled',
        contentContainerStyle: {
            flexGrow: 1,
        },
    };

    const handlePersonalInfoChange = (field: string, value: string) => {
        console.log(value);
        if (field == 'dob') {
            console.log(value);
            const parts = value.split('/');
            const year = parseInt(parts[2]);
            const month = parseInt(parts[1]) - 1; // Subtract 1 because months are 0-11
            const day = parseInt(parts[0]);
            const dob = new Date(year, month, day);
            const today = new Date();
            let calculated_age = today.getFullYear() - dob.getFullYear();
            let monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                calculated_age--;
            }
            setFormData(prev => ({
            ...prev,
              age: calculated_age.toString()
            }));
        }
        
        setFormData(prev => ({
            ...prev,
              [field]: value
            }));
    };
    
    const handleAddExperience = (newExperience: Partial<IFormData>) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            experience_Job_title: prevFormData.experience_Job_title
                ? `${prevFormData.experience_Job_title}, ${newExperience.experience_Job_title}`
                : newExperience.experience_Job_title,
    
            experience_Location: prevFormData.experience_Location
                ? `${prevFormData.experience_Location}, ${newExperience.experience_Location}`
                : newExperience.experience_Location,
    
            experience_Salary: prevFormData.experience_Salary
                ? `${prevFormData.experience_Salary}, ${newExperience.experience_Salary}`
                : newExperience.experience_Salary,
    
            experience_From_To: prevFormData.experience_From_To
                ? `${prevFormData.experience_From_To}, ${newExperience.experience_From_To}`
                : newExperience.experience_From_To,
    
            experience_Nature_of_Work: prevFormData.experience_Nature_of_Work
                ? `${prevFormData.experience_Nature_of_Work}, ${newExperience.experience_Nature_of_Work}`
                : newExperience.experience_Nature_of_Work,
    
            experience_Reason_for_leaving: prevFormData.experience_Reason_for_leaving
                ? `${prevFormData.experience_Reason_for_leaving}, ${newExperience.experience_Reason_for_leaving}`
                : newExperience.experience_Reason_for_leaving,
        }));
    };
    

    const handleImageChange = (field: string, value: string) => {
        setCandidateDocs(prev => ({
          ...prev,          // Spread existing values
          [field]: value    // Update only the specified field
        }));
      };

    // Handler for updating total experience
    const handleTotalExperienceChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            experience: value
        }));
    };

    
const personalInfoValid = (): boolean => {        
    return Boolean(
        candidateDocs.canditate_image?.trim() &&
        formData.first_name?.trim() &&
        formData.last_name?.trim() &&
        (formData.mobile_number && /^\d{10}$/.test(formData.mobile_number.trim())) &&
        formData.gender?.trim() &&
        formData.marital_status?.trim() &&
        formData.age?.trim() &&
        formData.dob?.trim() &&
        formData.jobseeker_nationality?.trim() &&
        formData.jobseeker_ethnicity?.trim() &&
        formData.religion?.trim() &&
        formData.height?.trim() &&
        formData.weight?.trim()
    );
}

    const personalInfoValidationCheck = (): boolean  =>{        
        if (!candidateDocs.canditate_image?.trim()) {
            Alert.alert('Error', 'Please upload a profile Image');
            return false;
          }
          if (!formData.first_name?.trim()) {
            Alert.alert('Error', 'Please enter candidate first name');
            return false;
          }
          if (!formData.last_name?.trim()) {
            Alert.alert('Error', 'Please enter candidate last name');
            return false;
          }
          if (!formData.mobile_number?.trim() || !/^\d{10}$/.test(formData.mobile_number?.trim()) || !/^\d+$/.test(formData.mobile_number)) {
            Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
            return false;
          }
          if (!formData.gender?.trim()) {
            Alert.alert('Error', 'Please select gender');
            return false;
          }
          if (!formData.marital_status?.trim()) {
            Alert.alert('Error', 'Please select marriage status');
            return false;
          }        
          if (!formData.dob?.trim()) {
            Alert.alert('Error', 'Please select date of birth');
            return false;
          }
          if (!formData.age?.trim()) {
            Alert.alert('Error', 'Please enter age');
            return false;
          }
          if (!formData.jobseeker_nationality?.trim()) {
            Alert.alert('Error', 'Please select nationality');
            return false;
          }
          if (!formData.jobseeker_ethnicity?.trim()) {
            Alert.alert('Error', 'Please select ethnicity');
            return false;
          }
          if (!formData.religion?.trim()) {
            Alert.alert('Error', 'Please select religion');
            return false;
          }
          if (!formData.height?.trim()) {
            Alert.alert('Error', 'Please select height');
            return false;
          }
          if (!formData.weight?.trim()) {
            Alert.alert('Error', 'Please select weight');
            return false;
          }
          return true;
    }

    const jobDetailsValid = (): boolean => {
    return Boolean(
        formData.job_title?.trim() &&
        formData.job_type?.trim() &&
        formData.jobseeker_available?.trim() &&
        formData.salary_expected?.trim() &&
        formData.jobseeker_currency?.trim() &&
        formData.jobseeker_ready_to_work_Country?.trim() &&
        formData.jobseeker_ready_to_work_State?.trim() &&
        formData.jobseeker_ready_to_work_City?.trim() &&
        formData.jobseeker_ready_to_work_Locality?.trim()
        );
    }

   const jobDetailsValidatoionCheck = (): boolean=>{
        if (!formData.job_title?.trim()) {
            Alert.alert('Error', 'Please select job title');
            return false;
        }
        if (!formData.job_type?.trim()) {
            Alert.alert('Error', 'Please select job type');
            return false;
        }
        if (!formData.jobseeker_available?.trim()) {
            Alert.alert('Error', 'Please select available / hired');
            return false;
        }
        if (!formData.salary_expected?.trim()) {
            Alert.alert('Error', 'Please select expected salary');
            return false;
        }
        if (!formData.jobseeker_currency?.trim()) {
            Alert.alert('Error', 'Please select currency');
            return false;
        }
        if (!formData.jobseeker_ready_to_work_Country?.trim()) {
            Alert.alert('Error', 'Please select ready to work country');
            return false;
        }
        if (!formData.jobseeker_ready_to_work_State?.trim()) {
            Alert.alert('Error', 'Please type ready to work state');
            return false;
        }
        if (!formData.jobseeker_ready_to_work_City?.trim()) {
            Alert.alert('Error', 'Please type ready to work city');
            return false;
        }
        if (!formData.jobseeker_ready_to_work_Locality?.trim()) {
            Alert.alert('Error', 'Please type ready to work location');
            return false;
        }

    return true;
   }


   const experienceValid = (): boolean => {
    return Boolean(
        formData.experience?.trim() &&
        (formData.experience_Job_title?.trim() || 
         formData.experience_Location?.trim() || 
         formData.experience_Salary?.trim() ||
         formData.experience_From_To?.trim() || 
         formData.experience_Nature_of_Work?.trim() || 
         formData.experience_Reason_for_leaving?.trim())
    );
};

   const experienceValidationCheck = (): boolean=>{
         if (!formData.experience?.trim()) {
            Alert.alert('Error', 'Please enter total years of experience');
            return false;
        }
          if (!formData.experience_Job_title?.trim() && !formData.experience_Location?.trim() && !formData.experience_Salary?.trim() &&
         !formData.experience_From_To?.trim() && !formData.experience_Nature_of_Work?.trim() && !formData.experience_Reason_for_leaving?.trim()) {
            Alert.alert('Error', 'Please add your experience');
            return false;
        }
    return true
   }


   const educationAndOtherValid = (): boolean => {
    const passportValid = formData.jobseeker_passport !== 'yes' || (
        formData.type_of_visa?.trim() &&
        formData.jobseeker_visa_Available_from?.trim() &&
        formData.jobseeker_visa_expiry_date?.trim()
    );

    return Boolean(
        formData.jobseeker_education?.trim() &&
        formData.languages?.trim() &&
        formData.skill &&
        formData.jobseeker_passport?.trim() &&
        passportValid &&
        formData.jobseeker_pcc?.trim() &&
        formData.jobseeker_verification_doc?.trim() &&
        formData.jobseeker_doc_impre?.trim() &&
        formData.jobseeker_addressproof?.trim() &&
        formData.jobseeker_idproof?.trim()
    );
};

   const educationAndOtherValidationCheck = (): boolean=>{
         if (!formData.jobseeker_education?.trim()) {
            Alert.alert('Error', 'Please select education qualification');
            return false;
        }
         if (!formData.languages?.trim()) {
            Alert.alert('Error', 'Please select language');
            return false;
        }
        if (!formData.skill) {
        Alert.alert('Error', 'Please select skills');
        return false;
        }
         if (!formData.jobseeker_passport?.trim()) {
            Alert.alert('Error', 'Please select passport available');
            return false;
        }
        if (formData.jobseeker_passport == 'yes') {
         if (!formData.type_of_visa?.trim()) {
            Alert.alert('Error', 'Please select type of visa');
            return false;
        }
         if (!formData.jobseeker_visa_Available_from?.trim()) {
            Alert.alert('Error', 'Please select date of visa available from');
            return false;
        }
         if (!formData.jobseeker_visa_expiry_date?.trim()) {
            Alert.alert('Error', 'Please select visa exoiry date');
            return false;
        }   
        }
         if (!formData.jobseeker_pcc?.trim()) {
            Alert.alert('Error', 'Please select PCC');
            return false;
        }
         if (!formData.jobseeker_verification_doc?.trim()) {
            Alert.alert('Error', 'Please select verification');
            return false;
        }
         if (!formData.jobseeker_doc_impre?.trim()) {
            Alert.alert('Error', 'Please select Thumb/Finger Impression');
            return false;
        }
         if (!formData.jobseeker_addressproof?.trim()) {
            Alert.alert('Error', 'Please select type of address proof documents');
            return false;
        }
         if (!formData.jobseeker_idproof?.trim()) {
            Alert.alert('Error', 'Please select type of ID proof documents');
            return false;
        }
    return true
   }


      const attachmentValidationCheck = (): boolean=>{
           if (!formData.reference_name?.trim()) {
            Alert.alert('Error', 'Please enter reference name');
            return false;
        }

           if (!formData.reference_mobile?.trim() || !/^\d{10}$/.test(formData.reference_mobile?.trim()) || !/^\d+$/.test(formData.reference_mobile)) {
            Alert.alert('Error', 'Please enter a valid 10-digit reference mobile number');
            return false;
        }
           if (!formData.reference_relationship?.trim()) {
            Alert.alert('Error', 'Please enter reference relation');
            return false;
        }
           if (!formData.reference_any_id_number?.trim()) {
            Alert.alert('Error', 'Please enter reference ID number');
            return false;
        }
           if (!candidateDocs.id_proof_image?.trim()) {
            Alert.alert('Error', 'Please upload an ID proof Image');
            return false;
        }
           if (!candidateDocs.address_proof_image?.trim()) {
            Alert.alert('Error', 'Please upload an Address proof Image');
            return false;
        }
       
    return true
   }

    const onSubmit = () => {
        if (!attachmentValidationCheck()) return;
        if (userData) {
            showLoading(true);
            ApiService.addCandidate(formData, userData.user_id).then(res=>{
                if (res.error == false) {
                    console.log('add candidate', res);
                    ApiService.uploadCandidateDocPics(userData.user_id, res.canditate_id, candidateDocs)
                    .then(res=>{
                        if (res.error == false) {
                        showLoading(false);
                        showSuccess(res.message)
                        router.dismissAll();
                        }else {
                        Alert.alert('Error',res.message)
                        }
                    })
                    .catch(err=>{
                           console.error(err)
                    }).finally(()=>{
                           showLoading(false)
                    })
                } else {
                    Alert.alert('Error',res.message)
                }
                console.log(res);
            }).catch(err=>{
                console.error(err)
            }).finally(()=>{
            })
        }
    }

    const handleListsChange = (field: string, value: checkbox[]) => {
        console.log('list', field,'---', value);
        setLists(prevState => ({
            ...prevState,        
            [field]: value 
          }));
        
    }


  const handleNext = (): void => { 
    if (step===1 && !personalInfoValidationCheck()) {
        return
    }
    if (step===2 && !jobDetailsValidatoionCheck()) {
        return
    }
    if (step===3 && !experienceValidationCheck()) {
        return
    }
    if (step===4 && !educationAndOtherValidationCheck()) {
        return
    }
    setStep(prevStep => Math.min(prevStep + 1, totalSteps));
  };

  const handlePrevious = (): void => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const getStepTitle = (currentStep: number): string => {
  switch(currentStep) {
    case 1:
      return 'Personal Information';
    case 2:
      return 'Jobs Details';
    case 3:
      return 'Experiences';
    case 4:
      return 'Education & Others';
    case 5:
      return 'Attachments & Verification';
    default:
      return '';
  }
};

  const renderStepIndicator = (): JSX.Element => {
    const indicators: JSX.Element[] = [];
    for (let i = 1; i <= totalSteps; i++) {
      indicators.push(
        <View key={i} style={styles.stepContainer}>
          <View style={[styles.stepIndicator, i <= step && styles.activeStep]}>
            <Text style={[styles.stepText, i <= step && styles.activeStepText]}>{i}</Text>
          </View>
          {i < totalSteps && <View style={[styles.line, i < step && styles.activeLine]} />}
        </View>
      );
    }
    return <View style={styles.indicatorContainer}>{indicators}</View>;
  };


    return (
        <SafeAreaView style={globalStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor={'#5B94E2'} />
        <View style={globalStyles.container}>
             <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.formText}>{getStepTitle(step)}</Text>
                </View>                
                <View style={styles.buttonContainer}>
                    {renderStepIndicator()}
                </View>

      <View style={styles.container}>
       {/* personal Information */}
        {step === 1 && 
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                <ScrollView>
                    <PersonalInfo data={formData} 
                        onChange={(field, value)=> handlePersonalInfoChange(field, value)}
                        image= {candidateDocs}
                        onDocChange = {(field, value)=> handleImageChange(field, value)}
                        checkBoxList = {lists}
                        onCheckBoxListChange = {(field, value)=>handleListsChange(field, value)}
                    ></PersonalInfo>  
                </ScrollView>
        </KeyboardAvoidingView>                          
        }
        {/* Job Details */}
        {step === 2 && 
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                <ScrollView>
                    <JobDetails data={formData} 
                        onChange={(field, value)=> handlePersonalInfoChange(field, value)}
                        checkBoxList = {lists}
                        onCheckBoxListChange = {(field, value)=>handleListsChange(field, value)}
                    ></JobDetails>
                </ScrollView>
        </KeyboardAvoidingView> 
        }
        {/* Experiance */}
        {step === 3 && 
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                <ScrollView>
                    <Experiences  data={formData}
                        onTotalExpChange={handleTotalExperienceChange}
                        onAddExperience={handleAddExperience}></Experiences>
                </ScrollView>
        </KeyboardAvoidingView> 
        }
        {/* Education Info */}
        {step === 4 && 
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                <ScrollView>
                   <EducationalInfo data={formData} 
                        onChange={(field, value)=> handlePersonalInfoChange(field, value)}
                        checkBoxList = {lists}
                        onCheckBoxListChange = {(field, value)=>handleListsChange(field, value)}
                    ></EducationalInfo>
                </ScrollView>
        </KeyboardAvoidingView> 
        }
        {/* Attachment */}
        {step === 5 && 
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
                <ScrollView>
                   <AttachmentAndVerification data={formData} 
                            onChange={(field, value)=> handlePersonalInfoChange(field, value)}
                            image= {candidateDocs}
                            onDocChange = {(field, value)=> handleImageChange(field, value)}
                            />
                </ScrollView>
        </KeyboardAvoidingView> 
        }
      </View>

      <View style={[styles.buttonContainer,{marginBottom: insets.bottom+10}]}>
        {step > 1 && (
          <TouchableOpacity onPress={handlePrevious} style={[styles.button, styles.backButton]}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        {step < totalSteps ? (
          <TouchableOpacity onPress={handleNext} style={[styles.button, styles.nextButton]}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onSubmit} style={[styles.button, styles.nextButton]}>
            <Text style={styles.nextButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>

            
            {/* <ProgressSteps  topOffset={20} completedCheckColor="#fff" activeLabelColor="#5B94E2" activeStepIconBorderColor="#5B94E2" activeStepNumColor="#5B94E2" completedLabelColor="#5B94E2" completedProgressBarColor="#5B94E2" completedStepIconColor="#5B94E2" >
                <ProgressStep label="Personal Info" buttonFillColor="#5B94E2" 
                    buttonBorderColor="#5B94E2" scrollViewProps={defaultScrollViewProps}
                    errors={!personalInfoValid()} 
                    onNext={personalInfoValidationCheck} 
                    >
                    <View>
                        <PersonalInfo data={formData} 
                        onChange={(field, value)=> handlePersonalInfoChange(field, value)}
                        image= {candidateDocs}
                        onDocChange = {(field, value)=> handleImageChange(field, value)}
                        checkBoxList = {lists}
                        onCheckBoxListChange = {(field, value)=>handleListsChange(field, value)}
                        ></PersonalInfo>
                    </View>
                </ProgressStep>
                <ProgressStep label="Jobs Details" buttonFillColor="#5B94E2" buttonPreviousTextColor="#5B94E2"
                    buttonBorderColor="#5B94E2" scrollViewProps={defaultScrollViewProps}
                    errors={!jobDetailsValid()} 
                    onNext={jobDetailsValidatoionCheck}
                    >
                    <View>
                        <JobDetails data={formData} 
                        onChange={(field, value)=> handlePersonalInfoChange(field, value)}
                        checkBoxList = {lists}
                        onCheckBoxListChange = {(field, value)=>handleListsChange(field, value)}
                        ></JobDetails>
                    </View>
                </ProgressStep>
                <ProgressStep label="Experiences" buttonFillColor="#5B94E2" buttonPreviousTextColor="#5B94E2"
                    buttonBorderColor="#5B94E2" scrollViewProps={defaultScrollViewProps}
                    errors={!experienceValid()} 
                    onNext={experienceValidationCheck}
                    >
                    <View>
                        <Experiences  data={formData}
                        onTotalExpChange={handleTotalExperienceChange}
                        onAddExperience={handleAddExperience}></Experiences>
                    </View>
                </ProgressStep>
                <ProgressStep label="Education & Others" buttonFillColor="#5B94E2" buttonPreviousTextColor="#5B94E2"
                    buttonBorderColor="#5B94E2" scrollViewProps={defaultScrollViewProps}
                    errors={!educationAndOtherValid()} 
                    onNext={educationAndOtherValidationCheck}
                    >
                    <View>
                        <EducationalInfo data={formData} 
                        onChange={(field, value)=> handlePersonalInfoChange(field, value)}
                        checkBoxList = {lists}
                        onCheckBoxListChange = {(field, value)=>handleListsChange(field, value)}
                        ></EducationalInfo>
                    </View>
                </ProgressStep>
                <ProgressStep label="Attachments & Verification" buttonFillColor="#5B94E2" buttonPreviousTextColor="#5B94E2"
                    buttonBorderColor="#5B94E2" scrollViewProps={defaultScrollViewProps}
                    onSubmit={()=>{onSubmit()}}
                    >
                    <View>
                        <AttachmentAndVerification data={formData} 
                            onChange={(field, value)=> handlePersonalInfoChange(field, value)}
                            image= {candidateDocs}
                            onDocChange = {(field, value)=> handleImageChange(field, value)}
                            />
                    </View>
                </ProgressStep>
            </ProgressSteps> */}


        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
   flex:1, width:'100%', padding:10,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  formText:{
    fontSize: 16,
    color: '#5B94E2',
    marginBottom: 10,
    fontWeight : 'bold',
    textAlign: 'center',
    // textDecorationLine: 'underline',
    // textDecorationColor: '#222222'
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIndicator: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E7E7E7',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    borderColor: '#E1EDFC',
    backgroundColor: '#5B94E2',
  },
  stepText: {
    color: '#E7E7E7',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeStepText: {
    color: 'white',
  },
  line: {
    width: 20,
    height: 2,
    backgroundColor: '#E7E7E7',
    marginHorizontal: 10,
  },
  activeLine: {
    backgroundColor: '#5B94E2',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width:'100%',
    justifyContent:'center',
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  backButton: {
    backgroundColor: '#E7E7E7',
    marginRight: 10,
  },
  backButtonText: {
    color: 'gray',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#5B94E2',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
})