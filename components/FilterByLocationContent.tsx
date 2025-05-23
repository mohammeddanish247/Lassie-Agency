import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import { ApiService } from '../services/userServices';
import { Colors } from '@/constants/Colors';
import { getGlobalStyles } from '../styles/globalStyles';

export interface JobOption {
    jobtype_name: string;
    jobtype_id: string;
    checked: boolean ;
}

// Define interfaces for props
interface CheckboxProps {
    checked: boolean;
    onPress: () => void;
}

interface JobFilterContentProps {
    onValueChange?: (dataForFilter: JobOption[]) => void;
}
  
export const FilterByLocationContent: React.FC<JobFilterContentProps> = ({onValueChange}) => {
  const [jobsTitles, setJobsTitles] = useState<JobOption[]>([]);  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');


  useEffect(() => {
  }, []);

  useEffect(() => {
    let a = jobsTitles.filter(a=>a.checked == true)
    console.log(a);
    onValueChange?.(a);
  }, [jobsTitles]);

  const toggleCheckbox = (id: string) => {
    setJobsTitles(prevJobs => 
      prevJobs.map(job => 
        job.jobtype_id === id 
          ? { ...job, checked: !job.checked } // Toggle the checked state
          : job
      )
    );
  };

  const searchClicked = () => {

  }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

      
        <TouchableOpacity style={globalStyles.loginButton} onPress={searchClicked}>
          <Text style={globalStyles .loginButtonText}>Search</Text>
        </TouchableOpacity>
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