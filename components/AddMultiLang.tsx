import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { checkbox } from './CheckboxList';

interface LanguageSelectorProps {
  data: checkbox[];
  returnValue: (data : any) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ data, returnValue }) => {
    const [dataList, setDataList] = useState<checkbox[]>(data);
  const [languages, setLanguages] = useState([
    {
      id: 1,
      language: '',
      read: false,
      spoken: false,
      written: false,
    },
  ]);

  const updateLanguage = (id : any, field :any, value:any) => {
    setLanguages(prev =>
      prev.map(lang =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    );
  };

  const addLanguage = () => {
    const newId = Math.max(...languages.map(l => l.id)) + 1;
    setLanguages(prev => [
      ...prev,
      {
        id: newId,
        language: '',
        read: false,
        spoken: false,
        written: false,
      },
    ]);
  };

  const removeLanguage = (id :any) => {
    if (languages.length > 1) {
      setLanguages(prev => prev.filter(lang => lang.id !== id));
    }
  };

  const getFormattedData = () => {
    const formattedData : any = {};
    
    languages.forEach((lang, index) => {
      const languageKey = `Language${index + 1}`;
      formattedData[languageKey] = lang.language;
      formattedData[`${languageKey}_read`] = lang.read ? 'on' : 'off';
      formattedData[`${languageKey}_spoken`] = lang.spoken ? 'on' : 'off';
      formattedData[`${languageKey}_written`] = lang.written ? 'on' : 'off';
    });

    return formattedData;
  };

  const showFormattedData = () => {
    const data = getFormattedData();
    returnValue(data)
  };

  const renderLanguageItem = (item :any, index : number) => (
    <View key={item.id} style={styles.languageContainer}>
      <View style={styles.languageHeader}>
        <Text style={styles.languageTitle}>Language {index + 1}</Text>
        {languages.length > 1 && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeLanguage(item.id)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={item.language}
          style={styles.picker}
          onValueChange={(value) => updateLanguage(item.id, 'language', value)}
        >
          <Picker.Item
              key='0'
              label='Please Select'
              value='Please Select'
            />
          {dataList.map((lang) => (
            <Picker.Item
              key={lang.id}
              label={lang.name}
              value={lang.name}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.proficiencyContainer}>
        <Text style={styles.proficiencyTitle}>Proficiency:</Text>
        
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Read:</Text>
          <Switch
            value={item.read}
            onValueChange={(value) => updateLanguage(item.id, 'read', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={item.read ? '#5B94E2' : '#f4f3f4'}
          />
          <Text style={styles.switchValue}>{item.read ? 'YES' : 'NO'}</Text>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Spoken:</Text>
          <Switch
            value={item.spoken}
            onValueChange={(value) => updateLanguage(item.id, 'spoken', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={item.spoken ? '#5B94E2' : '#f4f3f4'}
          />
          <Text style={styles.switchValue}>{item.spoken ? 'YES' : 'NO'}</Text>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Written:</Text>
          <Switch
            value={item.written}
            onValueChange={(value) => updateLanguage(item.id, 'written', value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={item.written ? '#5B94E2' : '#f4f3f4'}
          />
          <Text style={styles.switchValue}>{item.written ? 'YES' : 'NO'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {languages.map((item, index) => renderLanguageItem(item, index))}

      <TouchableOpacity style={styles.addButton} onPress={addLanguage}>
        <Text style={styles.addButtonText}>+ Add More Languages</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.showDataButton} onPress={showFormattedData}>
        <Text style={styles.showDataButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  languageContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  languageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  languageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  proficiencyContainer: {
    marginTop: 10,
  },
  proficiencyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  switchValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
    minWidth: 30,
  },
  addButton: {
    backgroundColor: '#5B94E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  showDataButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  showDataButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LanguageSelector;