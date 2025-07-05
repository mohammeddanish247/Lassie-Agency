import { Colors } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ApiService } from '../services/userServices';
import { getGlobalStyles } from '../styles/globalStyles';
import { checkbox, CheckboxList } from './CheckboxList';
import { CityList, Country, StateList } from './Interfaces';


interface JobFilterContentProps {
    onValueChange?: (dataForFilter: any[]) => void;
}
  
export const FilterByLocationContent: React.FC<JobFilterContentProps> = ({onValueChange}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  const [coutryList, setCoutryList] = useState<checkbox[]>([]);
  const [stateList, setStateList] = useState<checkbox[]>([]);
  const [cityList, setCityList] = useState<checkbox[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [countryExpanded,setCountryExpanded] =useState<boolean>(false)
  const [stateExpanded,setStateExpanded] =useState<boolean>(false)
  const [cityExpanded,setCityExpanded] =useState<boolean>(false)
  
  

  useEffect(() => {
     Promise.all([
       ApiService.countryListCode().then(countryList => {
         const countryListWithCheckbox = countryList.result.map((country: Country)=>({
          id : country.country_id,
          name: country.country_name,
          checked: false // Initialize all checkboxes as unchecked
        }))
        setCoutryList(countryListWithCheckbox)
       }),
       ApiService.stateList().then(stateList=>{
          const stateListWithCheckbox = stateList.result.map((state: StateList, index: number)=>({
          id : index,
          name: state.job_posting_state,
          checked: false // Initialize all checkboxes as unchecked
        }))
        setStateList(stateListWithCheckbox)
        }),
         ApiService.cityList().then(cityList=>{
          const cityListWithCheckbox = cityList.result.map((city: CityList, index: number)=>({
          id : index,
          name: city.job_posting_city,
          checked: false // Initialize all checkboxes as unchecked
        }))
        setCityList(cityListWithCheckbox)
      })
      
    ])
    .then(res=>{console.log('data responce',res)})
    .catch(err=>{console.log('data error',err)})
    .finally(()=>{setIsLoading(false)})
  }, []);

  const toggleCheckbox = (id: string,list: checkbox[], type: string) => {
    if (type == 'countryList') {
        setCoutryList(list)
      }
    if (type == 'stateList'){
      setStateList(list)
    }
    if (type =='cityList'){
      setCityList(list)
    }
  };

  const searchClicked = () => {
    let filterData : any = {} 
     
    let selectedCountry = coutryList.filter(x=>x.checked == true);
    let selectedState = stateList.filter(x=>x.checked == true);
    let selectedCity = cityList.filter(x=>x.checked == true);

    if (selectedCountry.length > 0) {
      filterData.country = selectedCountry[0].name
    }
    if (selectedState.length > 0) {
      filterData.state = selectedState[0].name
    }
    if (selectedCity.length > 0) {
      filterData.city = selectedCity[0].name
    }
    onValueChange?.(filterData)
  }

  return (
    // <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
    //  {isLoading == true ? (
    //   <View>
    //     <ActivityIndicator size={'large'} style={{justifyContent: 'center'}}></ActivityIndicator>
    //   </View>
    //  ) : (
    //   <View>
    //               <AccordionItem title='Select Country'
    //         children = {
    //           coutryList.length > 0 ? (
    //             <CheckboxList data={coutryList} returnValue={(list)=>toggleCheckbox('',list, 'countryList')}></CheckboxList>
    //          ) : (
    //              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //              <ActivityIndicator size="large" style={{flex: 1}} />
    //               </View>
    //          )}
    //         ></AccordionItem>

    //          <AccordionItem title='Select State'
    //         children = {
    //           stateList.length > 0 ? (
    //             <CheckboxList data={stateList} returnValue={(list)=>toggleCheckbox('',list, 'stateList')}></CheckboxList>
    //          ) : (
    //              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //              <ActivityIndicator size="large" style={{flex: 1}} />
    //               </View>
    //          )}
    //         ></AccordionItem>
    //        <AccordionItem title='Select City'
    //         children = {
    //           cityList.length > 0 ? (
    //             <CheckboxList data={cityList} returnValue={(list)=>toggleCheckbox('',list, 'cityList')}></CheckboxList>
    //          ) : (
    //              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //              <ActivityIndicator size="large" style={{flex: 1}} />
    //               </View>
    //          )}
    //           ></AccordionItem>      
    //     <TouchableOpacity style={globalStyles.loginButton} onPress={searchClicked}>
    //       <Text style={globalStyles .loginButtonText}>Search</Text>
    //     </TouchableOpacity>
    //   </View>
    //  )}
    // </ScrollView>
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
  {isLoading ? (
    <View style={styles.loaderWrapper}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View>
      {/* Country Section */}
      <TouchableOpacity onPress={() => setCountryExpanded(!countryExpanded)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Select Country</Text>
      </TouchableOpacity>
      {countryExpanded && (
        coutryList.length > 0 ? (
          <CheckboxList
            data={coutryList}
            returnValue={(list) => toggleCheckbox('', list, 'countryList')}
          />
        ) : (
          <ActivityIndicator size="large" style={styles.inlineLoader} />
        )
      )}

      {/* State Section */}
      <TouchableOpacity onPress={() => setStateExpanded(!stateExpanded)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Select State</Text>
      </TouchableOpacity>
      {stateExpanded && (
        stateList.length > 0 ? (
          <CheckboxList
            data={stateList}
            returnValue={(list) => toggleCheckbox('', list, 'stateList')}
          />
        ) : (
          <ActivityIndicator size="large" style={styles.inlineLoader} />
        )
      )}

      {/* City Section */}
      <TouchableOpacity onPress={() => setCityExpanded(!cityExpanded)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Select City</Text>
      </TouchableOpacity>
      {cityExpanded && (
        cityList.length > 0 ? (
          <CheckboxList
            data={cityList}
            returnValue={(list) => toggleCheckbox('', list, 'cityList')}
          />
        ) : (
          <ActivityIndicator size="large" style={styles.inlineLoader} />
        )
      )}

      {/* Search Button */}
      <TouchableOpacity style={globalStyles.loginButton} onPress={searchClicked}>
        <Text style={globalStyles.loginButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  )}
</ScrollView>

  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex:1,
    padding:12,
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
  sectionHeader: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  inlineLoader: {
    marginVertical: 20,
    alignSelf: 'center',
  },
});