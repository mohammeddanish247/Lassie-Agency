import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioOption } from './RadioButton'
import {CheckboxList, checkbox } from './CheckboxList';
import { InputField } from './InputField';
import BottomSheet from './PopupModal';
import RadioButton from './SimpleCheckBox';
import { Chip } from './chip'
import { MultiSelectCheckboxList, MultiCheckboxItem } from './Multiselectlist'
import { useLoader } from '../services/LoaderContext';
import { ApiService } from '../services/userServices';
import { AddCandidateFormLists, AddressType, IDProofType, IFormData, Language, Skills, TypeOfVisa } from './Interfaces';
import { DatePicker } from './DatePicker';


interface EducationAndOtherProps {
  data: Partial<IFormData>;
  onChange: (field: string, value: any) => void;
  onListChange?: (field: string, list: any[]) => void;
  checkBoxList: AddCandidateFormLists;
  onCheckBoxListChange : (field: string , value: checkbox[])=>void
}

const EducationalInfo = ({ data, onChange, checkBoxList,  onCheckBoxListChange }: EducationAndOtherProps) => {
  const { showLoading, showSuccess} = useLoader();
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setDatePicker] = useState(false); 
  const [switchDatePIcker, setSwitchDatePIcker] = useState('');


  const YesNoOption: RadioOption[] = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];


  const datePickerSwitch = (data: string) =>{
    setDatePicker(true)
    setSwitchDatePIcker(data)
  }

  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  }>({ title: '', content: null });

  const eduQualification: RadioOption[] = [
    { label: 'Below 8th', value: 'below8th' },
    { label: '10th', value: '10th' },
    { label: '12th', value: '12th' },
    { label: 'Graduate & Above', value: 'graduate&Above' },
  ];

  const handleSelectedValue = (list : checkbox[], type: string)=>{
    switch (type) {
        case 'language':
            let l =list.filter(item=>item.checked==true);
            onChange('languages',l[0].name);
            onCheckBoxListChange('languagelist', list)
            setModalVisible(false)
            break;
        case "visaList":
          let  v =list.filter(item=>item.checked==true);
          onChange('type_of_visa',v[0].name);
          onCheckBoxListChange('typeOfVisaList', list)
          setModalVisible(false)
          break;
        case "addressProofType":
          let ap =list.filter(item=>item.checked==true);
          onChange('jobseeker_addressproof',ap[0].name);
          onCheckBoxListChange('addressTypeList', list)
          setModalVisible(false)
          break;
        case "idProofType":
          let id =list.filter(item=>item.checked==true);
          onChange('jobseeker_idproof',id[0].name);
          onCheckBoxListChange('idProofTypeList', list)
          setModalVisible(false)
          break;
        default:
            break;
    }
  }

  const handleDateChanged = (date: Date) => {
    const data = switchDatePIcker
    switch (data) {
        case 'availableDate':
            onChange('jobseeker_visa_Available_from',date.toLocaleString().split(',')[0]);
            // setVisalAvlFrom(date.toLocaleString().split(',')[0]); // Format date as YYYY-MM-DD
            setDatePicker(false);       
            break;
        case 'PassportExpDate':
            onChange('jobseeker_visa_expiry_date',date.toLocaleString().split(',')[0]);
            // setVisaExpDate(date.toLocaleString().split(',')[0]); // Format date as YYYY-MM-DD
            setDatePicker(false);  
            break;
        default:
            break;
    }
  };
 
  const openModalAccordingly = (modalToOpen: string) =>{
    switch (modalToOpen) {
        case 'OpenLanguage':
          setModalContent({
            title: 'Select your Language',
            content: <CheckboxList data={checkBoxList.languagelist}
            returnValue={(id)=>{handleSelectedValue(id, 'language')}}
            ></CheckboxList>,
            });
          break;   
        case "TypeOfVisa":
          setModalContent({
              title: 'Select Type Of Visa',
              content: <CheckboxList data={checkBoxList.typeOfVisaList}
              returnValue={(list)=>{handleSelectedValue(list, 'visaList')}}
              ></CheckboxList>,
          });
          showLoading(false)
          setModalVisible(true);
        break;
        case "OpenTypeOfAddress":
          setModalContent({
              title: 'Select Job Type Of Address Proof',
              content: <CheckboxList data={checkBoxList.addressTypeList}
              returnValue={(list)=>{handleSelectedValue(list, 'addressProofType')}}
              ></CheckboxList>,
            });
        break;
        case "OpenIdProofList":
            setModalContent({
                title: 'Select Job Type Of Id Proof',
                content: <CheckboxList data={checkBoxList.idProofTypeList}
                returnValue={(list)=>{handleSelectedValue(list, 'idProofType')}}
                ></CheckboxList>,
              });
        break
        default:
            break;
    }
    setModalVisible(true);
}



const hidePopup = () =>{
  setModalVisible(false);
}

const openMultiCheckboxModal = () =>{
  setModalContent({
    title: 'Select your Skills',
    content: <MultiSelectCheckboxList 
      data={checkBoxList.skillList}
      onAddSelected={(list)=>{handleAddSkills(list)}}
      addButtonLabel="Add Skills"
    />
    });
  setModalVisible(true);
}

const handleAddSkills = (selectedSkills: MultiCheckboxItem[]) => {
  console.log('Added skills:', selectedSkills);
  let c =selectedSkills.filter(item=>item.checked==true);
  const skillNames = c.map(skill => skill.name);
  console.log('selected skill name', skillNames);
    onCheckBoxListChange('skillList', selectedSkills)
    onCheckBoxListChange('selectedSkills', c)
    onChange('skill',skillNames)
    setModalVisible(false)
};

  return (
    <View>
        <RadioGroup style={styles.radioButton}
                options={eduQualification}
                title='Educational Qualification' 
                selectedValue={data.jobseeker_education} 
                onValueChange={(value) => onChange('jobseeker_education', value)}
            />

        <InputField 
            lable="Language Known" 
            placeholder="Select Language" 
            onChangeValue={(value) => onChange('languages', value)}
            value={data.languages}
            hasModal= {true}
            icon="language-outline" 
            itemClicked={() => openModalAccordingly('OpenLanguage')} // Changed prop name to onIconPress
        />

        <View style= {styles.SkillsContainer}>
            <InputField 
              lable='Your Skills'
              placeholder={checkBoxList.selectedSkills.length === 0 ? "Select Your Skills" : "Add More skills"} 
              onChangeValue={()=>{}}
              value={''}
              hasModal= {true}
              icon="code-outline" 
              itemClicked={() => openMultiCheckboxModal()} 
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 16 }}>
                      {checkBoxList.selectedSkills.map(skill => (
                  <Chip
                    key={skill.id}
                    label={skill.name}
                  />
                ))}
            </View>
        </View>
          {/* <View style={styles.checkOuter}>
            <Text style={styles.inputLabel}>Speak</Text>
            <Text style={styles.inputLabel}>Read</Text>
            <Text style={styles.inputLabel}>Write</Text>
          </View>
          <View style={styles.checkOuter}>
            <RadioButton 
                selected={isSelected} 
                onPress={() => setIsSelected(!isSelected)} 
              />
            <RadioButton 
                selected={isSelected} 
                onPress={() => setIsSelected(!isSelected)} 
              />
            <RadioButton 
                selected={isSelected} 
                onPress={() => setIsSelected(!isSelected)} 
              />  
          </View> */}

        <BottomSheet 
                visible={modalVisible} 
                onClose={hidePopup}
                title={modalContent.title}>{modalContent.content}</BottomSheet>

            <RadioGroup style={styles.radioButton}
                    options={YesNoOption}
                    title='Passport Available' 
                    selectedValue={data.jobseeker_passport} 
                    onValueChange={(value) => onChange('jobseeker_passport', value)}
                />

            {data.jobseeker_passport?.toLowerCase() == 'no' ? (null) : (
              <>
            <InputField 
                lable="Type of Visa" 
                placeholder="Select Type pf Visa" 
                onChangeValue={(value) => onChange('type_of_visa', value)}
                value={data.type_of_visa}
                hasModal= {true}
                icon="earth-outline" 
                itemClicked={() => openModalAccordingly('TypeOfVisa')}
            />
            <InputField 
                lable="Visa Available From" 
                placeholder="Enter Visa Available Date" 
                onChangeValue={(value) => onChange('jobseeker_visa_Available_from', value)}
                value={data.jobseeker_visa_Available_from}
                hasModal= {true}
                icon="calendar-outline" 
                itemClicked={() => datePickerSwitch('availableDate')} // Changed prop name to onIconPress
            />
            <InputField 
                    lable="Visa Expiry Date" 
                    placeholder="Enter Visa Expiry Date" 
                    onChangeValue={(value) => onChange('jobseeker_visa_Available_from', value)}
                    value={data.jobseeker_visa_expiry_date}
                    hasModal= {true}
                    icon="calendar-outline" 
                    itemClicked={() => datePickerSwitch('PassportExpDate')} // Changed prop name to onIconPress
                />
              </>
            )}

            <RadioGroup style={styles.radioButton}
              options={YesNoOption}
              title='PCC' 
              selectedValue={data.jobseeker_pcc} 
              onValueChange={(value) => onChange('jobseeker_pcc', value)}
            />

            <RadioGroup style={styles.radioButton}
              options={YesNoOption}
              title='Verification' 
              selectedValue={data.jobseeker_verification_doc} 
              onValueChange={(value) => onChange('jobseeker_verification_doc', value)}
            />

            <RadioGroup style={styles.radioButton}
              options={YesNoOption}
              title='Thumb/Finger Impression' 
              selectedValue={data.jobseeker_doc_impre} 
              onValueChange={(value) => onChange('jobseeker_doc_impre', value)}
            /> 

            <InputField 
              lable="Type Of Address Proof" 
              placeholder="Select Type Of Address Proof" 
              onChangeValue={(value) => onChange('jobseeker_addressproof', value)}
              value={data.jobseeker_addressproof}
              hasModal= {true}
              icon="document-outline" 
              itemClicked={() => openModalAccordingly('OpenTypeOfAddress')} // Changed prop name to onIconPress
            />

            <InputField 
              lable="Type Of ID Proof" 
              placeholder="Select Type Of ID Proof" 
              onChangeValue={(value) => onChange('jobseeker_idproof', value)}
              value={data.jobseeker_idproof}
              hasModal= {true}
              icon="id-card-outline" 
              itemClicked={() => openModalAccordingly('OpenIdProofList')} // Changed prop name to onIconPress
            />
            <View style={{marginBottom : 30}}></View>
            <DatePicker 
                doShow={showDatePicker} 
                onDateChange={handleDateChanged}
            />
    </View>
  )
}

export default EducationalInfo

const styles = StyleSheet.create({
      radioButton: {
        marginTop: 15,
        marginBottom: 0
    },
    checkOuter: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        paddingHorizontal: 10,
        padding: 10
    },
    inputLabel: {
      fontSize: 16,
      fontWeight : '500',
      textAlign: 'center'
    },
    Inner: {
      flex: 1, 
      flexDirection: 'column', 
    },
    container: { 
        marginTop: 15,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 3,   
        paddingHorizontal: 12,
        display: 'none' //....remove this to show the Language
    },
    Text: {
      alignItems: 'center',
      marginTop: 5
},
heading: {
  fontSize: 16,
  fontWeight : '500',
  textAlign: 'center'
},
SkillsContainer:{
marginTop: 20,
marginBottom: 20,
borderRadius: 8,
borderColor: 'white',
borderWidth: 3,   
paddingHorizontal: 15,
paddingVertical: 12,
},
skills: {
borderColor: 'white',
borderRadius: 8,
borderWidth: 3,   
},
skillText: {
fontSize: 10,
fontWeight : '300',
textAlign: 'center'
}

})