"use client"

import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from "react"
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { InputField } from "./InputField"
import type { CandidateDocuments, IFormData } from "./Interfaces"
// import { __DEV__ } from "react-native"

interface Reference {
  name: string
  mobile: string
  relationship: string
  idNumber: string
}

interface AttachmentAndVerification {
  data: Partial<IFormData>
  onChange: (field: string, value: string) => void
  image: CandidateDocuments
  onDocChange: (field: string, value: string) => void
}

const AttachmentAndVerification = ({ data, onChange, image, onDocChange }: AttachmentAndVerification) => {
  const [IDProofImageName, setIDProofImageName] = useState("")
  const [addressProofImageName, setAddressProofImageName] = useState("")

  // Dynamic references state
  const [references, setReferences] = useState<Reference[]>([{ name: "", mobile: "", relationship: "", idNumber: "" }])

  useEffect(() => {
    if (image.id_proof_image != "" && image.id_proof_image != null && image.id_proof_image != undefined) {
      const idProof: any = image.id_proof_image.split("/").pop()
      setIDProofImageName(idProof)
    }
    if (
      image.address_proof_image != "" &&
      image.address_proof_image != null &&
      image.address_proof_image != undefined
    ) {
      const addProof: any = image.address_proof_image.split("/").pop()
      setAddressProofImageName(addProof)
    }
  }, [image.id_proof_image, image.address_proof_image])

  // Initialize references from existing data
  useEffect(() => {
    if (data.reference_name || data.reference_mobile || data.reference_relationship || data.reference_any_id_number) {
      const names = data.reference_name?.split(",").filter((n) => n.trim()) || [""]
      const mobiles = data.reference_mobile?.split(",").filter((m) => m.trim()) || [""]
      const relationships = data.reference_relationship?.split(",").filter((r) => r.trim()) || [""]
      const idNumbers = data.reference_any_id_number?.split(",").filter((id) => id.trim()) || [""]

      const maxLength = Math.max(names.length, mobiles.length, relationships.length, idNumbers.length, 1)

      const initialReferences: Reference[] = []
      for (let i = 0; i < maxLength; i++) {
        initialReferences.push({
          name: names[i] || "",
          mobile: mobiles[i] || "",
          relationship: relationships[i] || "",
          idNumber: idNumbers[i] || "",
        })
      }

      setReferences(initialReferences)
    }
  }, [])

  const pickProfileImage = async (pick: string) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "You need to allow access to your photos to upload an image.")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.8,
      })

      if (!result.canceled) {
        const uri = result.assets[0].uri
        const filename: any = uri.split("/").pop()
        switch (pick) {
          case "IDproof":
            onDocChange("id_proof_image", uri)
            break
          case "AddressProof":
            onDocChange("address_proof_image", uri)
            break
          default:
            break
        }
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image. Please try again.")
    }
  }

  // Add a new reference entry
  const addReference = () => {
    const newReferences = [...references, { name: "", mobile: "", relationship: "", idNumber: "" }]
    setReferences(newReferences)
    updateFormData(newReferences)
  }

  // Remove a reference entry
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

  // Update a specific reference field
  const updateReference = (index: number, field: keyof Reference, value: string) => {
    const newReferences = [...references]
    newReferences[index][field] = value
    setReferences(newReferences)
    updateFormData(newReferences)
  }

  // Convert references array to comma-separated strings and update parent
  const updateFormData = (refs: Reference[]) => {
    const names = refs
      .map((ref) => ref.name)
      .filter((name) => name.trim() !== "")
      .join(",")
    const mobiles = refs
      .map((ref) => ref.mobile)
      .filter((mobile) => mobile.trim() !== "")
      .join(",")
    const relationships = refs
      .map((ref) => ref.relationship)
      .filter((rel) => rel.trim() !== "")
      .join(",")
    const idNumbers = refs
      .map((ref) => ref.idNumber)
      .filter((id) => id.trim() !== "")
      .join(",")

    // Update parent component with comma-separated values
    onChange("reference_name", names)
    onChange("reference_mobile", mobiles)
    onChange("reference_relationship", relationships)
    onChange("reference_any_id_number", idNumbers)
  }

  return (
    <View>
      {/* Dynamic Reference Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Reference Information</Text>
      </View>

      {references.map((reference, index) => (
        <View key={index} style={styles.referenceCard}>
          <View style={styles.referenceHeader}>
            <Text style={styles.referenceTitle}>Reference {index + 1}</Text>
            {references.length > 1 && (
              <TouchableOpacity style={styles.removeButton} onPress={() => removeReference(index)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>

          <InputField
            lable={"Reference Name"}
            placeholder={"Enter Reference Name"}
            onChangeValue={(value) => updateReference(index, "name", value)}
            value={reference.name}
          />

          <InputField
            lable={"Reference Mobile No"}
            placeholder={"Enter Reference Mobile No"}
            keyboardType="numeric"
            onChangeValue={(value) => {
              const numericValue = value.replace(/\D/g, "")
              updateReference(index, "mobile", numericValue)
            }}
            value={reference.mobile}
            maxLength={10}
          />

          <InputField
            lable={"Reference Relation"}
            placeholder={"Enter Reference Relation"}
            onChangeValue={(value) => updateReference(index, "relationship", value)}
            value={reference.relationship}
          />

          <InputField
            lable={"Reference ID Number"}
            placeholder={"Enter ID Number"}
            onChangeValue={(value) => updateReference(index, "idNumber", value)}
            value={reference.idNumber}
          />
        </View>
      ))}

      {/* Add More Reference Button */}
      <TouchableOpacity style={styles.addButton} onPress={addReference}>
        <Ionicons name="add-circle-outline" size={24} color="#3B82F6" />
        <Text style={styles.addButtonText}>Add More Reference</Text>
      </TouchableOpacity>

      {/* Document Upload Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Document Upload</Text>
      </View>

      <InputField
        lable={"Upload ID Proof"}
        placeholder={"Upload Your ID Proof"}
        icon="id-card-outline"
        hasModal={true}
        itemClicked={() => pickProfileImage("IDproof")}
        value={IDProofImageName}
      />
      {image.id_proof_image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.id_proof_image }} style={styles.docImage} />
        </View>
      )}

      <InputField
        lable={"Upload Address Proof"}
        placeholder={"Upload Your Address Proof"}
        icon="home-outline"
        hasModal={true}
        itemClicked={() => pickProfileImage("AddressProof")}
        value={addressProofImageName}
      />
      {image.address_proof_image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image.address_proof_image }} style={styles.docImage} />
        </View>
      )}

      {/* Preview Section (Optional - for debugging) */}
      {/* {__DEV__ && (
        <View style={styles.debugSection}>
          <Text style={styles.debugTitle}>Debug - Comma-separated values:</Text>
          <Text style={styles.debugText}>Names: {data.reference_name || "None"}</Text>
          <Text style={styles.debugText}>Mobiles: {data.reference_mobile || "None"}</Text>
          <Text style={styles.debugText}>Relations: {data.reference_relationship || "None"}</Text>
          <Text style={styles.debugText}>IDs: {data.reference_any_id_number || "None"}</Text>
        </View>
      )} */}
    </View>
  )
}

export default AttachmentAndVerification

const styles = StyleSheet.create({
  docImage: {
    width: "auto",
    height: 233,
    borderRadius: 10,
    borderColor: "white",
  },
  imageContainer: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "white",
    marginTop: 15,
  },
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
