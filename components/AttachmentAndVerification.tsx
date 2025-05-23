import { StyleSheet, View, Text, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { InputField } from './InputField'
import * as ImagePicker from 'expo-image-picker';
import { CandidateDocuments, IFormData } from './Interfaces';


interface AttachmentAndVerification {
  data: Partial<IFormData>;
  onChange: (field: string, value: string) => void;
  image: CandidateDocuments;
  onDocChange: (field: string, value: string)=>void;
}

const AttachmentAndVerification = ({ data, onChange, image, onDocChange }: AttachmentAndVerification) => {
    const [IDProofImageName, setIDProofImageName] = useState('') 
    const [addressProofImageName, setAddressProofImageName] = useState('') 

    useEffect(() => {
        if (image.id_proof_image!=''&& image.id_proof_image != null && image.id_proof_image != undefined) {
          const idProof : any = image.id_proof_image.split('/').pop();
          setIDProofImageName(idProof)
        }

        if (image.address_proof_image!=''&& image.address_proof_image != null && image.address_proof_image != undefined) {
          const addProof : any = image.address_proof_image.split('/').pop();
          setAddressProofImageName(addProof)
        }

    },[image.id_proof_image, image.address_proof_image])

    const pickProfileImage = async (pick: string) => {      
      try {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
          Alert.alert('Permission Required', 'You need to allow access to your photos to upload an image.');
          return;
        }
  
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'images',
          allowsEditing: true,
          quality: 0.8,
        });
  
        if (!result.canceled) {
          const uri = result.assets[0].uri;
          const filename : any = uri.split('/').pop();
          switch (pick) {
            case 'IDproof':
              // onChange('id_proof_image',uri)
              onDocChange('id_proof_image',uri)
              break;
            case 'AddressProof':
              onDocChange('address_proof_image',uri)
              break;    
          
            default:
              break;
          }
        }
      } catch (error) {
        console.error('Error picking image:', error);
        Alert.alert('Error', 'Failed to pick image. Please try again.');
      }
    };

  return (
    <View>
      <InputField 
        lable={"Reference Name"} 
        placeholder={"Enter Reference Name"} 
        onChangeValue={(value)=>{onChange('reference_name',value)}}
        value={data.reference_name}
        />    
      <InputField 
        lable={"Reference Mobile No"} 
        placeholder={"Enter Reference Mobile No"}
        keyboardType='numeric' 
        onChangeValue={(value)=>{onChange('reference_mobile',value)}}
        value={data.reference_mobile}
        maxLength={10}
        />
      <InputField 
        lable={"Reference Relation"} 
        placeholder={"Enter Reference Relation"} 
        onChangeValue={(value)=>{onChange('reference_relationship',value)}}
        value={data.reference_relationship}
        />
        <InputField 
        lable={"Reference ID Number"} 
        placeholder={"Enter ID Number"} 
        onChangeValue={(value)=>{onChange('reference_any_id_number',value)}}
        value={data.reference_any_id_number}
        />
      <InputField 
        lable={"Upload ID Proof"} 
        placeholder={"Upload Your ID Proof"}
        icon='id-card-outline'
        hasModal= {true}
        itemClicked={() => pickProfileImage('IDproof')}
        value={IDProofImageName}
      />
      {image.id_proof_image && (
        <View style = {styles.imageContainer}>
          <Image
            source={{ uri: image.id_proof_image }}
            style={styles.docImage}
          />
        </View>
      )}
      <InputField 
        lable={"Upload Address Proof"} 
        placeholder={"Upload Your Address Proof"}
        icon='home-outline'
        hasModal= {true}
        itemClicked={() => pickProfileImage('AddressProof')}
        value={addressProofImageName}
      />
      {image.address_proof_image && (
        <View style = {styles.imageContainer}>
          <Image
            source={{ uri: image.address_proof_image}}
            style={styles.docImage}
          />
        </View>
      )}
     
    </View>
  )
}

export default AttachmentAndVerification

const styles = StyleSheet.create({
  docImage: {
    width: 'auto',
    height: 233,
    borderRadius: 10,
    borderColor: 'white',
  },
  imageContainer :{
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'white',
    marginTop: 15
  }
})