import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ApiService } from '../services/userServices';
import { checkbox, CheckboxList } from './CheckboxList';
import { Skills } from './Interfaces';

// Define interfaces for props
interface CheckboxProps {
    checked: boolean;
    onPress: () => void;
}

interface JobFilterContentProps {
    onValueChange?: (dataForFilter: any) => void;
}

// Reusable Checkbox component
const Checkbox: React.FC<CheckboxProps> = ({ checked, onPress }) => {
    return (
      <TouchableOpacity 
        style={[styles.checkbox, checked && styles.checkboxChecked]} 
        onPress={onPress}
      >
        {checked && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
export const FilterBySkillContent: React.FC<JobFilterContentProps> = ({onValueChange}) => {
  const [skill, setSkills] = useState<checkbox[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await ApiService.get_skills();
        const skillList = response.result.map((skill: Skills) => ({
          id : skill.skill_id,
          name: skill.skill_name,
          checked: false // Initialize all checkboxes as unchecked
        }));
        setSkills(skillList);
      } catch (error) {
        console.error('Error fetching job skills:', error);
      }
    }
    fetchSkills();
  }, []);

  useEffect(() => {
    let a = skill.filter(a=>a.checked == true)
    console.log(a[0]);
    if (a.length > 0) {
      let b = {
        job_type : a[0].name
      }
      onValueChange?.(b);
    }
  }, [skill]);

  const toggleCheckbox = (list: checkbox[]) => {
    setSkills(list)
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {
        skill.length > 0 ? (
           <CheckboxList data={skill} returnValue={toggleCheckbox}></CheckboxList>
        ) : (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" style={{flex: 1}} />
             </View>
        )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginBottom: 20,
  },
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1, // Changed from 0 to 1 for better visual separation
    borderBottomColor: '#f0f0f0',
  },
  jobLabel: {
    fontSize: 16,
    marginLeft: 20,
    color: '#333',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  checkmark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});