import { Colors } from '@/constants/Colors';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { getGlobalStyles } from '../styles/globalStyles';
import { ICandidate } from './Interfaces';

type  CandidateListItems = {
  candidate: ICandidate;
  AddWishlist: (value : boolean, id: string)=> void;
  ViewCVClicked : (candidateID : string) => void;
  ContactClicked : (candidateID : string) => void;
  isWishlistView? : boolean;
}
const CandidateCard = ({ candidate, AddWishlist, ViewCVClicked,ContactClicked, isWishlistView }:  CandidateListItems ) => {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme ?? 'light');
  const colors = Colors[colorScheme ?? 'light'];
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  const [isWishlisted, setisWishlisted] = useState(candidate.iswishlisted || false);

  const clickWishlist = () =>{
    setisWishlisted(!isWishlisted);
    AddWishlist(!isWishlisted, candidate.canditate_id);
  }

  return (
    <View style={globalStyles.card}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image source={{ 
                uri: candidate.canditate_photo
              }}  style={styles.profileImage} />
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{candidate.canditate_name}</Text>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{candidate.job_title}</Text>
              </View>
            </View>
            
            <View style={styles.detailsRow}>
              <Text style={styles.detailText}>{candidate.canditate_age} Years</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.detailText}>{candidate.canditate_marital_status}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.detailText}>{candidate.registration_type}</Text>
            </View>
            
            <View style={styles.detailsRow}>
              <Text style={styles.roleText}>{candidate.job_title}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.experienceText}>{candidate.canditate_experience} experience</Text>
            </View>

            <Text style={styles.shiftText}>{candidate.job_type}</Text>
            <Text style={styles.locationText}>{candidate.canditate_location}, {candidate.jobseeker_yourcity}, {candidate.jobseeker_yourstate}</Text>
            <Text style={styles.locationText}>{candidate.jobseeker_yourcountry}</Text>
            <Text style={styles.salaryText}>{candidate.canditate_salary}</Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.viewCvButton} onPress={()=>ViewCVClicked(candidate.canditate_id)}>
                <Ionicons name='document-outline' color={colors.white} size={20} style={{marginRight: 5}}></Ionicons>
                <Text style={styles.viewCvText}>View CV</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}onPress={()=>ContactClicked(candidate.canditate_id)} >
                <Text style={styles.contactText}>Contact Me</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity style={styles.favoriteButton} onPress={clickWishlist}>
            {isWishlistView ? (
              // <Ionicons name='trash-bin-outline' size={30} color={"#ff7676"} style={styles.favoriteIcon}/>
              <FontAwesome name='trash' size={26} color={"#ff7676"}></FontAwesome>
            ) : (
              isWishlisted ? (
                <Ionicons name='heart' size={30} color={"#ff7676"} style={styles.favoriteIcon}/>
              ) : (
                <Ionicons name='heart-outline' size={30}  color={colors.tint} style={styles.favoriteIcon}/>
              )
            )}
        </TouchableOpacity>
        </View>
    </View>
  );
};

export default CandidateCard;

export const getStyles = (colorScheme: 'light' | 'dark') => {
    const colors = Colors[colorScheme];
    return StyleSheet.create({
        listContainer: {
        padding: 15,
        paddingBottom: 80, // Extra space at bottom to account for navigation
        },
        profileSection: {
        flexDirection: 'row',
        position: 'relative',
        },
        profileImageContainer: {
        position: 'relative',
        },
        profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        },
        profileInfo: {
        marginLeft: 15,
        flex: 1,
        },
        nameRow: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 5,
        },
        profileName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginRight: 8,
        marginBottom: 5,
        },
        badgeContainer: {
        backgroundColor: colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 5,
        },
        badgeText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
        },
        detailsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 5,
        },
        detailText: {
        fontSize: 12,
        color: colors.textSecondary,
        },
        dot: {
        fontSize: 12,
        color: colors.textSecondary,
        marginHorizontal: 4,
        },
        roleText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
        },
        experienceText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
        },
        shiftText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
        },
        locationText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 5,
        },
        salaryText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
        },
        buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        },
        viewCvButton: {
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width : 100,
        },
        viewCvText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '500',
        textAlign : 'center',
        },
        contactButton: {
        backgroundColor: colors.white,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.primary,
        flex: 1,
        alignItems: 'center',
        width : 100,
        },
        contactText: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: '500',
        },
        favoriteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 35,
        height: 35,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondaryDark
        },
        favoriteIcon: {
         marginTop : 3,
        textAlignVertical: 'center'
        },
    });
}