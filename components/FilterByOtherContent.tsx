import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import { ApiService } from '../services/userServices';
import { Colors } from '@/constants/Colors';
import { getGlobalStyles } from '../styles/globalStyles';
import { RadioGroup } from './RadioButton';

export interface OtherOption {
    jobseeker_gender: string;
    jobseeker_passport: string;
}

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

interface FilterByOtherContentProps {
    FilerByOtherChange?: (dataForFilter: OtherOption) => void;
}
  
export const FilterByOtherContent: React.FC<FilterByOtherContentProps> = ({FilerByOtherChange}) => {
  const [gender, setGender] = useState<string>('male');
  const [passport, setPassport] = useState<string>('yes');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');

  const genderOptions: RadioOption[] = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  const passportOptions: RadioOption[] = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  useEffect(() => {
  }, []);

  const toggleCheckbox = (id: string) => {
    
  };

  const searchClicked = () => {
    let a : OtherOption = {
      jobseeker_gender : gender,
      jobseeker_passport: passport
    }
    FilerByOtherChange?.(a);
  }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <RadioGroup options={genderOptions}
        title='Gender' selectedValue={gender} onValueChange={setGender}></RadioGroup>
        <RadioGroup options={passportOptions}
        title='Passport' selectedValue={passport} onValueChange={setPassport}></RadioGroup>
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
});
