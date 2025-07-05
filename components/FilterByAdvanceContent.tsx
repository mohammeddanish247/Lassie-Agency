import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ApiService } from '../services/userServices';
import { getGlobalStyles } from '../styles/globalStyles';
import { checkbox, CheckboxList } from './CheckboxList';
import { AccordionItem } from './CollapsibleAccordion';
import { JobTitles, JobTypes, Skills } from './Interfaces';
import { RadioGroup, RadioOption } from './RadioButton';


interface JobFilterContentProps {
    onValueChange?: (dataForFilter: any[]) => void;
    isCandidate?: boolean
}
  
export const FilterByAdvanceContent: React.FC<JobFilterContentProps> = ({onValueChange, isCandidate = true}) => {
  const [regType, setRegType] = React.useState('All');
  const [jobTitles, setJobTitles] = useState<checkbox[]>([]);
  const [jobType, setJobType] = useState<checkbox[]>([]);
  const [Skills, setSkills] = useState<checkbox[]>([]);
  const globalStyles = getGlobalStyles('light');

  const CandRegType : RadioOption[] = [
    { label: 'All', value: 'All' },
    { label: 'Self', value: 'Self' },
    { label: 'By Agency', value: 'By Agency' },
  ];

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
    const fetchJobTypes = async () => {
      try {
        const response = await ApiService.get_job_type();
        const jobsWithCheckboxState = response.result.map((job: JobTypes) => ({
          id : job.jobtype_id,
          name: job.jobtype_name,
          checked: false // Initialize all checkboxes as unchecked
        }));
        setJobType(jobsWithCheckboxState);
      } catch (error) {
        console.error('Error fetching job titles:', error);
      }
    }
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
    fetchJobTitles();
    fetchJobTypes();
    fetchSkills();
  }, []);

  const toggleCheckbox = (list: checkbox[], type: string) => {
    if (type == 'JobTitle') {
      setJobTitles(list)
    }
    if (type == 'JobType') {
      setJobType(list)
    }
    if (type == 'Skill') {
      setSkills(list)
    }
  };

  const searchClicked = () => {
     let filterData : any = {} 
    if (isCandidate) {
      filterData.registration_type = regType
    }

    let selectedJobTitle = jobTitles.filter(a=>a.checked == true);
    let selectedJobType = jobType.filter(a=>a.checked == true);
    let slectedSkill = Skills.filter(a=>a.checked == true);

    if (selectedJobTitle.length>0) {
      filterData.job_title = selectedJobTitle[0].name
    }
    if (selectedJobType.length>0) {
      filterData.job_type = selectedJobType[0].name
    }
    if (slectedSkill.length>0) {
      filterData.jobseeker_skills = slectedSkill[0].name
    }
    onValueChange?.(filterData);
  }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {isCandidate && (      <RadioGroup
        title="Candidate Registration Type"
        options={CandRegType}
        selectedValue={regType}
        onValueChange={setRegType}
      />)}
      <View style={{marginTop: 20}}></View>
      <AccordionItem title='Job Title'
      children = {
        jobTitles.length > 0 ? (
          <CheckboxList data={jobTitles} returnValue={(list)=>toggleCheckbox(list, 'JobTitle')}></CheckboxList>
       ) : (
           <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
           <ActivityIndicator size="large" style={{flex: 1}} />
            </View>
       )}
      ></AccordionItem>
      <AccordionItem title='Job Type'
      children = {
        jobType.length > 0 ? (
          <CheckboxList data={jobType} returnValue={(id)=>toggleCheckbox(id, 'JobType')}></CheckboxList>
       ) : (
           <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
           <ActivityIndicator size="large" style={{flex: 1}} />
            </View>
       )
      }
      ></AccordionItem>
      <AccordionItem title='Skills'
        children = {
          Skills.length > 0 ? (
            <CheckboxList data={Skills} returnValue={(id)=>toggleCheckbox(id, 'Skill')}></CheckboxList>
        ) : (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" style={{flex: 1}} />
              </View>
        )
        }
      ></AccordionItem>
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