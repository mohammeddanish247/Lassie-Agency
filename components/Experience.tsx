import { StyleSheet, View, Text, Button, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { InputField } from './InputField'
import BottomSheet from './PopupModal'
import { useLoader } from '../services/LoaderContext'
import { ApiService } from '../services/userServices'
import { IFormData } from './Interfaces'
import { checkbox, CheckboxList } from './CheckboxList'
import { Ionicons } from '@expo/vector-icons'


interface ExperienceProps {
  data: Partial<IFormData>;
  onTotalExpChange: (value: string) => void;
  onAddExperience: (newExperience: Partial<IFormData>) => void;
  // onDeleteExperience: (index: number) => void;
}

const Experiences = ({ data, onTotalExpChange, onAddExperience }: ExperienceProps) => {
  const parsedData = {
    experience_From_To: data.experience_From_To?.split(',').map(s => s.trim()) || '',
    experience_Job_title: data.experience_Job_title?.split(',').map(s => s.trim())|| '',
    experience_Location: data.experience_Location?.split(',').map(s => s.trim())|| '',
    experience_Nature_of_Work: data.experience_Nature_of_Work?.split(',').map(s => s.trim())|| '',
    experience_Reason_for_leaving: data.experience_Reason_for_leaving?.split(',').map(s => s.trim())|| '',
    experience_Salary: data.experience_Salary?.split(',').map(s => s.trim())|| '',
  };
  console.log(parsedData);
 
  const experienceCount = parsedData.experience_Job_title?.length || 0
  const [modalVisible, setModalVisible] = useState(false);
  const [totalExperainceList, SetTotalExperiacneList] =  useState<checkbox[]>([])
  const [newExpData, setNewExpData] = useState<Partial<IFormData>>({
    experience_Job_title: '',
    experience_Location: '',
    experience_Salary: '',
    experience_From_To: '',
    experience_Nature_of_Work: '',
    experience_Reason_for_leaving: ''
  });

  const allFieldsFilled = () => {
    return Object.values(newExpData).every(value => value.toString().trim() !== '');
  }


  const handleFieldChange = (field: keyof Partial<IFormData>, value: string) => {
    setNewExpData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddNewExperience = () => {
    onAddExperience(newExpData);
    setModalVisible(false);
  };

  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  }>({ title: '', content: null });

  const openModalAccordingly = (modalToOpen: string) =>{
    switch (modalToOpen) {
      case 'OepnExperianceList':
        setModalContent({
          title: 'Select your Experiance',
          content: <CheckboxList data={totalExperainceList}
              returnValue={(list)=>{handleSelectedValue(list, 'Eperiance')}}
              ></CheckboxList>,
          });
        break;
      case 'AddExp':
        setModalContent({
          title: `Add Experience No ${experienceCount+1}`,
          content: <>
          </>,
          });
        break;
      default:
        break;
    }
    setModalVisible(true);
  }

  const handleSelectedValue = (list : checkbox[], type: string)=>{
      switch (type) {
        case 'Eperiance':
          let c =list.filter(item=>item.checked==true);
          onTotalExpChange(c[0].name);
          SetTotalExperiacneList(list)
          setModalVisible(false)
          break;
          
        default:
          break;
      }
  }


  const hidePopup = () =>{
      setModalVisible(false);
  }

  return (
    <View>

      <BottomSheet 
        visible={modalVisible} 
        onClose={hidePopup}
        title={`Add Experience No ${experienceCount+1}`}>{
          <>
           <View>
            <InputField 
              lable={"Job Title"} 
              placeholder={"Enter Job Title"} 
              onChangeValue={(value) => handleFieldChange('experience_Job_title', value)}
              />    
            <InputField 
              lable={"Location"} 
              placeholder={"Enter Location"} 
              onChangeValue={(value) => handleFieldChange('experience_Location', value)}
              />
            <InputField 
              lable={"Salary"} 
              placeholder={"Enter Salary"} 
              onChangeValue={(value) => handleFieldChange('experience_Salary', value)}
              />
            <InputField 
              lable={"From - To"} 
              placeholder={"Enter From - To"} 
              onChangeValue={(value) => handleFieldChange('experience_From_To', value)}
              />
            <InputField 
              lable={"Nature Of Work"} 
              placeholder={"Enter Nature Of Work"} 
              onChangeValue={(value) => handleFieldChange('experience_Nature_of_Work', value)}
              />
            <InputField 
              lable={"Reason for Leaving"} 
              placeholder={"Enter Reason for Leaving"} 
              onChangeValue={(value) => handleFieldChange('experience_Reason_for_leaving', value)}
              />
            <View style={{marginTop: 20}}>
              <Button 
                title="Save Experience" 
                onPress={handleAddNewExperience}
                disabled={!allFieldsFilled()}
                color={allFieldsFilled() ? '#4630EB' : '#CCCCCC'} 
              />
            </View>
          </View>
          </>
        }</BottomSheet>

      <InputField 
        lable="Total Years of Experience" 
        placeholder="Select Total Years of Experience" 
        onChangeValue={(value) => onTotalExpChange(value)}
        value={data.experience}
        keyboardType='number-pad'
        icon="timer-outline" 
      />

      {Array.from({ length: experienceCount }).map((_, index) => (
        <View style = {styles.group} key={index}>
          <View>
            <Text style= {styles.inputLabel}>Experiences {index+1}</Text>
          </View>
          <View style={{marginTop: 10}}>
            <View style={styles.row}>
              <Text style={styles.label}>Job Title: </Text>
              <Text style={styles.value}>{parsedData.experience_Job_title?.[index]}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Location: </Text>
              <Text style={styles.value}>{parsedData.experience_Location?.[index]}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Salary: </Text>
              <Text style={styles.value}>{parsedData.experience_Salary?.[index]}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>From - To: </Text>
              <Text style={styles.value}>{parsedData.experience_From_To?.[index]}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Nature of Work: </Text>
              <Text style={styles.value}>{parsedData.experience_Nature_of_Work?.[index]}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Reason for Leaving: </Text>
              <Text style={styles.value}>{parsedData.experience_Reason_for_leaving?.[index]}</Text>
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.loginButton} onPress={()=>openModalAccordingly('AddExp')}>
        <Ionicons name='add-outline' size={22} color={"#fff"}></Ionicons>
        <Text style={styles.loginButtonText}> { experienceCount == 0 ? (<>Add Experience</>) : (<>Add More</>)}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Experiences

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 16,
    fontWeight : '500',
  },
  group: {
    marginTop: 15, 
  },
  loginButton: {
    backgroundColor: '#5B94E2',
    padding: 8,
    borderRadius: 8,
    marginTop: 30,
    marginBottom: 30,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    marginRight: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E1EDFC',
    borderWidth: 2
  },
  label: {
    flex: 1,
    padding: 12,
    fontWeight: 'bold',
    backgroundColor: '#E1EDFC',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  value: {
    flex: 2,
    padding: 12,
    color: '#333',
  },
})