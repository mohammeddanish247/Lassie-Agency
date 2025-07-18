import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { InputField } from './InputField'
import { IFormData } from './Interfaces'


interface Reference {
 title: string;       
  location: string;     
  salary: string; 
  fromto: string;     
  NOF: string;          
  RFL: string; 
}

interface ExperienceProps {
  data: Partial<IFormData>;
  onTotalExpChange: (value: string) => void;
  onChange: (field: string, value: any) => void;
}

const Experiences = ({ data, onTotalExpChange, onChange }: ExperienceProps) => {
 const [references, setReferences] = useState<Reference[]>([{
        title: '',     
        location: '',   
        salary: '', 
        fromto: '',   
        NOF: '',        
        RFL: '' 
    }])
  // Initialize references from existing data
  useEffect(() => {
    if (data.experience_Job_title || data.experience_Location || data.experience_Salary || data.experience_From_To || data.experience_Nature_of_Work || data.experience_Reason_for_leaving) {
      const title = data.experience_Job_title?.split(",").filter((n) => n.trim()) || [""]
      const location = data.experience_Location?.split(",").filter((m) => m.trim()) || [""]
      const salary = data.experience_Salary?.split(",").filter((r) => r.trim()) || [""]
      const fromto = data.experience_From_To?.split(",").filter((id) => id.trim()) || [""]
      const NOF = data.experience_Nature_of_Work?.split(",").filter((id) => id.trim()) || [""]
      const RFL = data.experience_Reason_for_leaving?.split(",").filter((id) => id.trim()) || [""]

      const maxLength = Math.max(title.length, location.length, salary.length, fromto.length,NOF.length,RFL.length, 1)

      const initialReferences: Reference[] = []
      for (let i = 0; i < maxLength; i++) {
        initialReferences.push({
          title: title[i] || "",
          location: location[i] || "",
          salary: salary[i] || "",
          fromto: fromto[i] || "",
          NOF: NOF[i] || "",
          RFL: RFL[i] || "",
        })
      }

      setReferences(initialReferences)
    }
  }, [])

    const updateFormData = (refs: Reference[]) => {
    const title = refs
      .map((ref) => ref.title)
      .filter((title) => title.trim() !== "")
      .join(",")
    const location = refs
      .map((ref) => ref.location)
      .filter((location) => location.trim() !== "")
      .join(",")
    const salary = refs
      .map((ref) => ref.salary)
      .filter((salary) => salary.trim() !== "")
      .join(",")
    const fromto = refs
      .map((ref) => ref.fromto)
      .filter((fromto) => fromto.trim() !== "")
      .join(",")
    const NOF = refs
      .map((ref) => ref.NOF)
      .filter((NOF) => NOF.trim() !== "")
      .join(",")
    const RFL = refs
      .map((ref) => ref.RFL)
      .filter((RFL) => RFL.trim() !== "")
      .join(",")

    // Update parent component with comma-separated values
    onChange("experience_Job_title", title)
    onChange("experience_Location", location)
    onChange("experience_Salary", salary)
    onChange("experience_From_To", fromto)
    onChange("experience_Nature_of_Work", NOF)
    onChange("experience_Reason_for_leaving", RFL)

  }

  const updateReference = (index: number, field: keyof Reference, value: string) => {
    const newReferences = [...references]
    newReferences[index][field] = value
    setReferences(newReferences)
    updateFormData(newReferences)
  }

  const removeReference = (index: number) => {
    if (references.length > 1) {
      Alert.alert("Remove Reference", "Are you sure you want to remove this reference?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const newReferences = references.filter((_, i) => i !== index)
            setReferences(newReferences)
            updateFormData(newReferences)
          },
        },
      ])
    }
  }

  const addReference = () => {
    const newReferences = [...references, { 
      title: '',     
        location: '',   
        salary: '', 
        fromto: '',   
        NOF: '',        
        RFL: '' 
     }]
    setReferences(newReferences)
    updateFormData(newReferences)
  }


  return (
    <View>
      <InputField 
        lable="Total Years of Experience" 
        placeholder="Select Total Years of Experience" 
        onChangeValue={(value) => onTotalExpChange(value)}
        value={data.experience}
        keyboardType='number-pad'
        icon="timer-outline" 
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Experience Information</Text>
      </View>

      {references.map((reference, index) => (
        <View key={index} style={styles.referenceCard}>
          <View style={styles.referenceHeader}>
            <Text style={styles.referenceTitle}>Experience {index + 1}</Text>
            {references.length > 1 && (
              <TouchableOpacity style={styles.removeButton} onPress={() => removeReference(index)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>

          <InputField
            lable={"Experience Job Title"}
            placeholder={"Enter Job Title or Designation"}
            onChangeValue={(value) => updateReference(index, "title", value)}
            value={reference.title}
          />

          <InputField
            lable={"Experience Location"}
            placeholder={"Enter work location"}
            onChangeValue={(value) => updateReference(index, "location", value)}
            value={reference.location}
          />

          <InputField
            lable={"Experience Salary"}
            placeholder={"Enter previous Salary"}
            onChangeValue={(value) => updateReference(index, "salary", value)}
            value={reference.salary}
          />

          <InputField
            lable={"Experience From_To"}
            placeholder={"Enter employment period"}
            onChangeValue={(value) => updateReference(index, "fromto", value)}
            value={reference.fromto}
          />

          <InputField
            lable={"Experience Nature of Work"}
            placeholder={"Describe your role"}
            onChangeValue={(value) => updateReference(index, "NOF", value)}
            value={reference.NOF}
          />

          <InputField
            lable={"Experience Reason for Leaving"}
            placeholder={"Describe Reason for leaving"}
            onChangeValue={(value) => updateReference(index, "RFL", value)}
            value={reference.RFL}
          />
        </View>
      ))}

      {/* Add More Reference Button */}
      <TouchableOpacity style={styles.addButton} onPress={addReference}>
        <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
        <Text style={styles.addButtonText}>Add More Reference</Text>
      </TouchableOpacity>

    </View>
  )
}

export default Experiences

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },
  referenceCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  referenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3B82F6",
    marginLeft: 8,
  },
  debugSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
})