import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLoader } from "../services/LoaderContext";
import { checkbox, CheckboxList } from "./CheckboxList";
import { InputField } from './InputField';
import { AddCandidateFormLists, IFormData } from './Interfaces';
import BottomSheet from './PopupModal';
import { RadioGroup, RadioOption } from './RadioButton';

interface JobDetailsProps {
    data: Partial<IFormData>;
    onChange: (field: string, value: string) => void;
    onListChange?: (field: string, list: any[]) => void;
    checkBoxList: AddCandidateFormLists;
    onCheckBoxListChange : (field: string , value: checkbox[])=>void
  }

const JobDetails = ({ data, onChange, checkBoxList, onCheckBoxListChange }: JobDetailsProps) => {
    const { showLoading} = useLoader();
    const [modalVisible, setModalVisible] = useState(false);
    const [checkFlag, setCheckFlag] = useState(true);
    const [salaryExpected, setSalaryExpected] = useState<string>('');
    const [salaryTerm, setSalaryTerm] = useState<string>('');


    const [modalContent, setModalContent] = useState<{
        title: string;
        content: React.ReactNode;
    }>({ title: '', content: null });

    const availableOrHiredList: RadioOption[] = [
        { label: 'Available', value: 'available' },
        { label: 'Hired', value: 'hired' },
    ];

      const salaryTermOption: RadioOption[] = [
        { label: 'Per Hour', value: 'Per Hour' },
        { label: 'Per Day', value: 'Per Day' },
        { label: 'Per Week', value: 'Per Week' },
        { label: 'Per Month', value: 'Per Month' },
    ];


    const hidePopup = () =>{
        setModalVisible(false);
    }

    const handleSelectedValue = (list : checkbox[], type: string)=>{
        switch (type) {
            case 'jobTitle':
                let jl =list.filter(item=>item.checked==true);
                onChange('job_title',jl[0].name);
                onCheckBoxListChange('jobTitleList', list)
                setModalVisible(false)
                break;
            case "jobType":
                let jt =list.filter(item=>item.checked==true);
                onChange('job_type',jt[0].name);
                onCheckBoxListChange('jobTypeList', list)
                setModalVisible(false)
                break;
            case "ExpectedSalary":
                let es =list.filter(item=>item.checked==true);
                onChange('salary_expected',es[0].name);
                onCheckBoxListChange('expectedSalaryList', list)
                setModalVisible(false)
                break;
            case "currency":
                let cr =list.filter(item=>item.checked==true);
                onChange('jobseeker_currency',cr[0].name);
                onCheckBoxListChange('currencyList', list)
                setModalVisible(false)
                break;
            case "countryList":
                let  cnt =list.filter(item=>item.checked==true);
                onChange('jobseeker_ready_to_work_Country',cnt[0].name);
                onCheckBoxListChange('readyToWorkCountryList', list)
                setModalVisible(false)
                break;
            default:
                break;
        }
    }

    const openModalAccordingly = (modalToOpen: string) =>{
        showLoading(true)
        switch (modalToOpen) {
            case "OpenJobList":
                setModalContent({
                    title: 'Select Job Title',
                    content: <CheckboxList data={checkBoxList.jobTitleList}
                    returnValue={(list)=>{handleSelectedValue(list, 'jobTitle')}}
                    ></CheckboxList>,
                });
                showLoading(false)
                setModalVisible(true);
                break;
            case "OpenJobType":
                setModalContent({
                    title: 'Select Job Type',
                    content: <CheckboxList data={checkBoxList.jobTypeList}
                    returnValue={(list)=>{handleSelectedValue(list, 'jobType')}}
                    ></CheckboxList>,
                });
                showLoading(false)
                setModalVisible(true);
                break;
            case "SalaryExpected":
                setModalContent({
                    title: 'Select Expected Salary',
                    content: <CheckboxList data={checkBoxList.expectedSalaryList}
                    returnValue={(list)=>{handleSelectedValue(list, 'ExpectedSalary')}}
                    ></CheckboxList>,
                });
                showLoading(false)
                setModalVisible(true);
                break;
            case "OpenCurrency":
                setModalContent({
                    title: 'Select Currecy',
                    content: <CheckboxList data={checkBoxList.currencyList}
                    returnValue={(list)=>{handleSelectedValue(list, 'currency')}}
                    ></CheckboxList>,
                });
                showLoading(false)
                setModalVisible(true);
                break;
            case "CountryList":
                setModalContent({
                    title: 'Select County',
                    content: <CheckboxList data={checkBoxList.readyToWorkCountryList}
                    returnValue={(list)=>{handleSelectedValue(list, 'countryList')}}
                    ></CheckboxList>,
                });
                showLoading(false)
                setModalVisible(true);
                 break;
            default:
                break;
        }    
    }

    

     useEffect(() => {
         if (!checkFlag) {
            if (salaryExpected && salaryTerm) {
            const combined = `${salaryExpected}-${salaryTerm}`;
            onChange('salary_expected', combined);
        }
        }
        if (checkFlag) {
             if (data.salary_expected) {
            const [initialSalary, initialTerm] = data.salary_expected.split('-');
            setSalaryExpected(initialSalary);
            setSalaryTerm(initialTerm);
            setCheckFlag(false)
        }
        }
        // if (data.salary_expected) {
        //     const [initialSalary, initialTerm] = data.salary_expected.split('-');
        //     setSalaryExpected(initialSalary);
        //     setSalaryTerm(initialTerm);
        // }
       
         
    }, [salaryExpected, salaryTerm]);
    
    const salaryExpectedForm=()=>{
        return (
          <>
            <InputField
              lable="Salary Expected"
              placeholder="Enter Salary Expected"
              onChangeValue={(value) => setSalaryExpected(value)}
              // onChangeValue={(value) => onChange('jobseeker_ready_to_work_State', value)}
              value={salaryExpected}
              keyboardType="numeric"
            />
            <RadioGroup
              style={styles.radioButton}
              options={salaryTermOption}
              title="Salary Term"
              selectedValue={salaryTerm}
              // onValueChange={(value) => onChange('jobseeker_available', value)}
              onValueChange={(value) => setSalaryTerm(value)}
            />
            <InputField
              lable="Select Currency"
              placeholder="Select JobSeeker Currency"
              onChangeValue={(value) => onChange("jobseeker_currency", value)}
              value={data.jobseeker_currency}
              hasModal={true}
              icon="cash-outline"
              itemClicked={() => openModalAccordingly("OpenCurrency")}
            />
          </>
        );
    }

    const setMergeSalaryExpected = () =>{
         if (salaryExpected && salaryTerm) {
            const combined = `${salaryExpected}-${salaryTerm}`;
            onChange('salary_expected', combined);
        }
    }

    
  return (
    <View>
        <View style = {styles.group}>
            <View style={styles.Text}>
                <Text style= {styles.inputLabel}>Applying For</Text>
            </View>
            <InputField 
                lable="Job Title" 
                placeholder="Select Job Title" 
                onChangeValue={(value) => onChange('job_title', value)}
                value={data.job_title}
                hasModal= {true}
                icon="briefcase-outline" 
                itemClicked={() => openModalAccordingly('OpenJobList')} // Changed prop name to onIconPress
            />
            <InputField 
                lable="Job Type" 
                placeholder="Select Job Type" 
                onChangeValue={(value) => onChange('job_type', value)}
                value={data.job_type}
                hasModal= {true}
                icon="hourglass-outline" 
                itemClicked={() => openModalAccordingly('OpenJobType')} // Changed prop name to onIconPress
            />
            <RadioGroup style={styles.radioButton}
                options={availableOrHiredList}
                title='Available / Hired' 
                selectedValue={data.jobseeker_available} 
                onValueChange={(value) => onChange('jobseeker_available', value)}
            />
            {/* <InputField 
                lable="Salary Expected" 
                placeholder="Select Salary Expected" 
                onChangeValue={(value) => onChange('salary_expected', value)}
                value={data.salary_expected}
                hasModal= {true}
                icon="wallet-outline" 
                itemClicked={() => openModalAccordingly('SalaryExpected')} // Changed prop name to onIconPress
            /> */}
            <InputField 
                    lable="Salary Expected" 
                    placeholder="Enter Salary Expected" 
                    onChangeValue={(value) => [setSalaryExpected(value), setMergeSalaryExpected()]} 
                    // onChangeValue={(value) => onChange('jobseeker_ready_to_work_State', value)} 
                    value={salaryExpected}
                    keyboardType='numeric'
            />
             <RadioGroup style={styles.radioButton}
                options={salaryTermOption}
                title='Salary Term' 
                selectedValue={salaryTerm} 
                // onValueChange={(value) => onChange('jobseeker_available', value)}
                onValueChange={(value) => [setSalaryTerm(value),setMergeSalaryExpected()]}
            />
            <InputField 
                lable="Select Currency" 
                placeholder="Select JobSeeker Currency" 
                onChangeValue={(value) => onChange('jobseeker_currency', value)}
                value={data.jobseeker_currency}
                hasModal= {true}
                icon="cash-outline" 
                itemClicked={() => openModalAccordingly('OpenCurrency')}
            />
        </View>
        <View style = {styles.group}>
            <View style={styles.Text}>
                <Text style= {styles.inputLabel}>Ready To Work In</Text>
            </View>
            <InputField 
                lable="County" 
                placeholder="Select Country" 
                onChangeValue={(value) => onChange('jobseeker_ready_to_work_Country', value)}
                value={data.jobseeker_ready_to_work_Country}
                hasModal= {true}
                icon="flag-outline" 
                itemClicked={() => openModalAccordingly('CountryList')}
            />
             <InputField 
                    lable="State" 
                    placeholder="Enter State" 
                    onChangeValue={(value) => onChange('jobseeker_ready_to_work_State', value)} 
                    value={data.jobseeker_ready_to_work_State}
                />
             <InputField 
                    lable="City" 
                    placeholder="Enter City" 
                    onChangeValue={(value) => onChange('jobseeker_ready_to_work_City', value)} 
                    value={data.jobseeker_ready_to_work_City}
                />
             <InputField 
                    lable="Location" 
                    placeholder="Enter Location" 
                    onChangeValue={(value) => onChange('jobseeker_ready_to_work_Locality', value)} 
                    value={data.jobseeker_ready_to_work_Locality}
                />
        </View>    
            <BottomSheet 
                visible={modalVisible} 
                onClose={hidePopup}
                title={modalContent.title}>{modalContent.content}</BottomSheet>
        
    </View>
  )
}

export default JobDetails

const styles = StyleSheet.create({
    radioButton: {
        marginTop: 15,
        marginBottom: 0
    },
    Text: {
          alignItems: 'center'
    },

    inputLabel: {
        fontSize: 16,
        fontWeight : '500',
      },
    group: {
        marginTop: 15,
        borderRadius: 8,
        borderColor: 'white',
        borderWidth: 3,   
        paddingHorizontal: 15,
        paddingVertical: 12,
    }
})
