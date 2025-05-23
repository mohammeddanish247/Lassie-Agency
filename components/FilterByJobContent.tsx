import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ApiService } from '../services/userServices';
import { checkbox, CheckboxList } from './CheckboxList';

export interface JobTitles {
  jobtitle_name: string;
  jobtitle_id: string;
  checked: boolean ;
}

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
  
export const FilterByJobContent: React.FC<JobFilterContentProps> = ({onValueChange}) => {
  const [jobsTitles, setJobsTitles] = useState<checkbox[]>([]);

  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        const response = await ApiService.get_job_title();
        const jobsWithCheckboxState = response.result.map((job: JobTitles) => ({
          id: job.jobtitle_id,
          name: job.jobtitle_name,
          checked: false
        }));
        setJobsTitles(jobsWithCheckboxState);
        console.log(response.result);
      } catch (error) {
        console.error('Error fetching job titles:', error);
      }
    }
    fetchJobTitles();
  }, []);

  useEffect(() => {
    let a = jobsTitles.filter(a=>a.checked == true)
    console.log(a[0]);
    if (a.length > 0) {
      let b = {
        job_title : a[0].name
      }
      onValueChange?.(b);
    }
  }, [jobsTitles]);

  const toggleCheckbox = (list: checkbox[]) => {
    setJobsTitles(list)
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {
        jobsTitles.length > 0 ? (
           <CheckboxList data={jobsTitles} returnValue={toggleCheckbox}></CheckboxList>
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