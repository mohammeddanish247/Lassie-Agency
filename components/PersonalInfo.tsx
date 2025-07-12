import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useLoader } from "../services/LoaderContext";
import { CheckboxList, checkbox } from "./CheckboxList";
import { DatePicker } from "./DatePicker";
import { InputField } from "./InputField";
import { AddCandidateFormLists, CandidateDocuments, IFormData } from "./Interfaces";
import BottomSheet from "./PopupModal";
import ProfileImage from "./ProfileImage";
import { RadioGroup, RadioOption } from "./RadioButton";

interface PersonalInfoProps {
    data: Partial<IFormData>;
    onChange: (field: string, value: string) => void;
    image: CandidateDocuments;
    onDocChange: (field: string, value: string)=>void;
    checkBoxList: AddCandidateFormLists;
    onCheckBoxListChange : (field: string , value: checkbox[])=>void
  }

export const PersonalInfo = ({ data, onChange, image, onDocChange, checkBoxList,  onCheckBoxListChange }: PersonalInfoProps) => {
    
    const { showLoading, showSuccess } = useLoader();
    const [showDatePicker, setDatePicker] = useState(false); 
    const [modalVisible, setModalVisible] = useState(false);
    const [languagelist, setLanguageList] = useState<checkbox[]>([])
    const [profilePic, setprofilePic] = useState('')


    const [modalContent, setModalContent] = useState<{
        title: string;
        content: React.ReactNode;
      }>({ title: '', content: null });

    const genderOptions: RadioOption[] = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ];
    
    const handleDateChanged = (date: Date) => {
        onChange('dob', date.toLocaleString().split(',')[0]);
        setDatePicker(false);
    };

    const hidePopup = () =>{
        setModalVisible(false);
    }


    const handleSelectedValue = (list : checkbox[], type: string)=>{
        switch (type) {
            case 'country':
                let c =list.filter(item=>item.checked==true);
                onChange('jobseeker_nationality', c[0].name);
                onChange('country_code', c[0].id)
                onCheckBoxListChange('countryList', list)
                setModalVisible(false)
                break;
            case 'ethnicity':
                let e =list.filter(item=>item.checked==true);
                onChange('jobseeker_ethnicity', e[0].name);
                onCheckBoxListChange('ethnicityList', list)
                setModalVisible(false)
                break;
            case 'religion':
                let r =list.filter(item=>item.checked==true);
                onChange('religion', r[0].name);
                onCheckBoxListChange('religionList', list)
                setModalVisible(false)
                break;
                
            case 'height':
                let h =list.filter(item=>item.checked==true);
                onChange('height', h[0].name);
                onCheckBoxListChange('heightList', list)
                setModalVisible(false)
                break; 
            case 'weight':
                let w =list.filter(item=>item.checked==true);
                onChange('weight', w[0].name);
                onCheckBoxListChange('weightList', list)
                setModalVisible(false)
                break;
            case 'OpenYourCountry':
                let yc =list.filter(item=>item.checked==true);
                onChange('jobseeker_yourcountry', yc[0].name);
                onCheckBoxListChange('yourCountryList', list)
                setModalVisible(false)
                break;      
            case 'state':
                let s =list.filter(item=>item.checked==true);
                onChange('jobseeker_yourstate', s[0].name);
                onCheckBoxListChange('stateList', list)
                setModalVisible(false)
                break;
            case 'city':
                let city =list.filter(item=>item.checked==true);
                onChange('jobseeker_yourcity', city[0].name);
                onCheckBoxListChange('cityList', list)
                setModalVisible(false)
                break;     
            case 'language':
                let l =list.filter(item=>item.checked==true);
                // setLanguage(l[0].name);
                // setLanguageList(list)
                setModalVisible(false)
                break;
            default:
                break;
        }
    }


    const openModalAccordingly = (modalToOpen: string) =>{        
        switch (modalToOpen) {
            case 'OpenCountry':
                setModalContent({
                    title: 'Select your Nationality',
                    content: 
                    <CheckboxList data={checkBoxList.countryList}
                    returnValue={(list)=>{handleSelectedValue(list, 'country')}}
                    ></CheckboxList>
                    ,
                });
                break; 
            case 'OpenYourCountry':
                setModalContent({
                    title: 'Select Country',
                    content: <CheckboxList data={checkBoxList.yourCountryList}
                    returnValue={(list)=>{handleSelectedValue(list, 'OpenYourCountry')}}
                    ></CheckboxList>,
                });
                break;       
            case "OpenEthnicity":
                setModalContent({
                    title: 'Select your Ethnicity',
                    content: <CheckboxList data={checkBoxList.ethnicityList}
                    returnValue={(id)=>{handleSelectedValue(id, 'ethnicity')}}
                    ></CheckboxList>,
                });
                break;    
            case "OpenReligion":
                setModalContent({
                    title: 'Select your Religion',
                    content: <CheckboxList data={checkBoxList.religionList}
                    returnValue={(id)=>{handleSelectedValue(id, 'religion')}}
                    ></CheckboxList>,
                });         
                break;
            case "OpenHeightList":
                setModalContent({
                     title: 'Select your Height',
                     content: <CheckboxList data={checkBoxList.heightList}
                     returnValue={(id)=>{handleSelectedValue(id, 'height')}}
                      ></CheckboxList>,
                });         
                break;
            case "OpenWeightList":
                setModalContent({
                     title: 'Select your Weight',
                     content: <CheckboxList data={checkBoxList.weightList}
                     returnValue={(id)=>{handleSelectedValue(id, 'weight')}}
                      ></CheckboxList>,
                });         
                break;    
            case "OpenLanguageList":
                setModalContent({
                    title: 'Select your Language',
                    content: <CheckboxList data={languagelist}
                    returnValue={(id)=>{handleSelectedValue(id, 'language')}}
                    ></CheckboxList>,
                });         
                break; 
            case "OpenStateList":
                setModalContent({
                    title: 'Select your State',
                    content: <CheckboxList data={checkBoxList.stateList}
                    returnValue={(id)=>{handleSelectedValue(id, 'state')}}
                    ></CheckboxList>,
                });         
                break;
            case "OpenCityList":
                setModalContent({
                    title: 'Select your City',
                    content: <CheckboxList data={checkBoxList.cityList}
                    returnValue={(id)=>{handleSelectedValue(id, 'city')}}
                    ></CheckboxList>,
                });         
                break;      
            default:
                break;
        }
        setModalVisible(true);
    }

    
    useEffect(()=>{

    },[])


  const handleImagePicked = (newImageUri: string) => {
    setprofilePic(newImageUri);
    onDocChange('canditate_image',newImageUri)
  };

    return (
        <View>
            <ProfileImage imageSrc={image.canditate_image} onImagePicked={handleImagePicked} width={100} height={100}/>
            <InputField 
                lable="First Name" 
                placeholder="Enter First Name" 
                onChangeValue={(value) => onChange('first_name', value)} 
                value={data.first_name}
            />
            <InputField 
                lable="Last Name" 
                placeholder="Enter Last Name" 
                onChangeValue={(value) => onChange('last_name', value)} 
                value={data.last_name}
            />
            <InputField 
                lable={"Mobile Number"} 
                placeholder={"Enter Mobile Number"} 
                onChangeValue={(value) => onChange('mobile_number', value)} 
                keyboardType="numeric"
                value={data.mobile_number}
                maxLength={10}
            />           
            <RadioGroup style={styles.radioButton}
                options={genderOptions}
                title='Gender' 
                selectedValue={data.gender} 
                onValueChange={(value) => onChange('gender', value)} 
            />
            <RadioGroup style={styles.radioButton}
                options={checkBoxList.maritalStatus}
                title='Marriage Status' 
                selectedValue={data.marital_status} 
                onValueChange={(value) => onChange('marital_status', value)} 
            />
            <InputField 
                lable="Date of Birth" 
                placeholder="Enter Date of Birth" 
                onChangeValue={(value) => onChange('dob', value)} 
                value={data.dob}
                hasModal= {true}
                icon="calendar-outline" 
                itemClicked={() => setDatePicker(true)} // Changed prop name to onIconPress
            />
            <InputField 
                lable={"Age"} 
                placeholder={"Enter Age"} 
                onChangeValue={(value) => onChange('age', value)} 
                editable={false}
                value={data.age}

            />
            
            <DatePicker 
                doShow={showDatePicker} 
                onDateChange={handleDateChanged}
            />
            <InputField 
                lable="Nationality" 
                placeholder="Select Nationality" 
                onChangeValue={(value) => onChange('jobseeker_nationality', value)} 
                value={data.jobseeker_nationality}
                hasModal= {true}
                icon="flag-outline" 
                itemClicked={() => openModalAccordingly('OpenCountry')} // Changed prop name to onIconPress
            />
            <InputField 
                lable="Ethnicity" 
                placeholder="Select Ethnicity" 
                onChangeValue={(value) => onChange('jobseeker_ethnicity', value)} 
                value={data.jobseeker_ethnicity}
                hasModal= {true}
                icon="people-outline" 
                itemClicked={() => openModalAccordingly('OpenEthnicity')} // Changed prop name to onIconPress
            />
            <InputField 
                lable="Religion" 
                placeholder="Select Religion" 
                onChangeValue={(value) => onChange('religion', value)} 
                value={data.religion}
                hasModal= {true}
                icon="sparkles-outline" 
                itemClicked={() => openModalAccordingly('OpenReligion')} // Changed prop name to onIconPress
            />
            <InputField 
                lable="Height" 
                placeholder="Select Height" 
                onChangeValue={(value) => onChange('height', value)} 
                value={data.height}
                hasModal= {true}
                icon="resize-outline" 
                itemClicked={() => openModalAccordingly('OpenHeightList')} // Changed prop name to onIconPress
            />
            <InputField 
                lable="Weight" 
                placeholder="Select Weight" 
                onChangeValue={(value) => onChange('weight', value)} 
                value={data.weight}
                hasModal= {true}
                icon="scale-outline" 
                itemClicked={() => openModalAccordingly('OpenWeightList')} // Changed prop name to onIconPress
            />
             <InputField 
                lable="Your Country" 
                placeholder="Select Your Country" 
                onChangeValue={(value) => onChange('jobseeker_yourcountry', value)} 
                value={data.jobseeker_yourcountry}
                hasModal= {true}
                icon="earth-outline" 
                itemClicked={() => openModalAccordingly('OpenYourCountry')} // Changed prop name to onIconPress
            />
            <InputField 
                lable="Your State" 
                placeholder="Select Your State" 
                onChangeValue={(value) => onChange('jobseeker_yourstate', value)} 
                value={data.jobseeker_yourstate}
                hasModal= {true}
                icon="map-outline" 
                itemClicked={() => openModalAccordingly('OpenStateList')} // Changed prop name to onIconPress
            />
            <InputField 
                lable="Your City" 
                placeholder="Select Your City" 
                onChangeValue={(value) => onChange('jobseeker_yourcity', value)} 
                value={data.jobseeker_yourcity}
                hasModal= {true}
                icon="location-outline" 
                itemClicked={() => openModalAccordingly('OpenCityList')} // Changed prop name to onIconPress
            />
            <InputField 
                lable="Your Locality" 
                placeholder="Enter Locality" 
                onChangeValue={(value) => onChange('jobseeker_locality', value)} 
                value={data.jobseeker_locality}
            />
            {/* <InputField 
                lable="Your Country" 
                placeholder="Enter Your Country" 
                onChangeValue={(value) => onChange('jobseeker_yourcountry', value)} 
                value={data.jobseeker_yourcountry}
            /> */}
            {/* <InputField 
                lable="Your State" 
                placeholder="Enter Your Sate" 
                onChangeValue={(value) => onChange('jobseeker_yourstate', value)} 
                value={data.jobseeker_yourstate}
            /> */}
            {/* <InputField 
                lable="Your City" 
                placeholder="Enter Your City" 
                onChangeValue={(value) => onChange('jobseeker_yourcity', value)} 
                value={data.jobseeker_yourcity}
            /> */}
            {/* <InputField 
                lable="Language" 
                placeholder="Select Your Language" 
                onChangeValue={setLanguage}
                value={language}
                hasModal= {true}
                icon="language-outline" 
                itemClicked={() => openModalAccordingly('OpenLanguageList')} // Changed prop name to onIconPress
            />

            <InputField 
                lable="Seeker Locality" 
                placeholder="Enter Seeker Locality" 
                onChangeValue={setSeekerLocality} 
                value={seekerLocality}
            /> */}
             <BottomSheet 
                visible={modalVisible} 
                onClose={hidePopup}
                title={modalContent.title}>{modalContent.content}</BottomSheet>
        </View>
    );
};


const styles = StyleSheet.create({
    radioButton: {
        marginTop: 15,
        marginBottom: 0
    }
})