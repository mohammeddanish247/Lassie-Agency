import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { ApiService } from '../services/userServices';
import { getGlobalStyles } from '../styles/globalStyles';
import { JobListing } from './Interfaces';

interface JobCardProps {
  job: JobListing;
  onViewDetails?: () => void;
  // onContact: (jobID : string) => void;
  onToggleFavorite?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({job, onViewDetails, 
  // onContact, 
  onToggleFavorite,}) => {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const styles = getStyles(colorScheme ?? 'light');
    const globalStyles = getGlobalStyles(colorScheme ?? 'light');
  return (  
    <View style={globalStyles.card} key={job.job_id}>
      <View style={styles.jobCardHeader}>
        <View style={styles.jobIconContainer}>
          <Image
            source={require('../assets/images/LogoTiny.png')}
            style={styles.jobIcon}
            defaultSource={require('../assets/images/LogoTiny.png')}
          />
        </View>
        <Text style={styles.jobTimePosted}>
          {ApiService.getRelativeTime(job.employer_job_posting_time)}
        </Text>
      </View>
      
      <View style={styles.jobTitleContainer}>
        <Text style={styles.jobTitle}>{job.job_title}</Text>
        {job.job_posting_urgent_is === 'yes' && (
          <View style={styles.urgentTag}>
            <Text style={styles.urgentText}>Urgent</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.jobCategory}>{job.job_category} • {job.job_type}</Text>
      <Text style={styles.jobCategory}>{job.job_posting_city}, {job.job_posting_state}, {job.job_posting_country}</Text>
      
      <View style={styles.jobDetailsContainer}>
        {/* <View style={styles.jobDetailTag}>
          <Text style={styles.jobDetailText}>{job.experience}</Text>
        </View> */}
        <View style={styles.jobDetailTag}>
          <Text style={styles.jobDetailText}>Family Member: {job.job_posting_number_of_members}</Text>
        </View>
        <View style={styles.jobDetailTag}>
          <Text style={styles.jobDetailText}>{job.job_posting_salary}/Mo</Text>
        </View>
      </View>
      
      <View style={styles.jobActionsContainer}>
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={onViewDetails}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity 
          style={styles.contactButton}
          onPress={()=>onContact(job.job_id)}
        >
          <Text style={styles.contactText}>Contact</Text>
        </TouchableOpacity> */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
        >
          <Ionicons 
            name={true ? 'heart' : 'heart-outline'} 
            size={30} 
            color={true ? colors.primary : colors.tint} 
            style={styles.favoriteIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const getStyles = (colorScheme: 'light' | 'dark') => {
    const colors = Colors[colorScheme];
    return StyleSheet.create({
    jobCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    jobIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.tintBackground,
        alignItems: 'center',
        justifyContent: 'center',
    },
    jobIcon: {
        width: 24,
        height: 24,
    },
    jobTimePosted: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    jobTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'space-between',
        marginBottom: 5,
    },
    jobTitle: {
        flex: 0.85,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginRight: 10,
    },
    urgentTag: {
        flex: 0.15,
        height: 20,
        backgroundColor: colors.success,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 5,
    },
    urgentText: {
        textAlign: 'center',
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    jobCategory: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 10,
    },
    jobDetailsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
    },
    jobDetailTag: {
        backgroundColor: colors.secondaryDark,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
        marginRight: 8,
        marginBottom: 8,
    },
    jobDetailText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    jobActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    viewDetailsButton: {
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    viewDetailsText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    contactButton: {
        backgroundColor: colors.card,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    contactText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    favoriteButton: {
        width: 35,
        height: 35,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondaryDark
    },
    favoriteIcon: {
        marginTop: 3,
        textAlignVertical: 'center'
    },
    });
}

export default JobCard;