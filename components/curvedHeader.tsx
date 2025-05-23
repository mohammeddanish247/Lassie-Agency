import { Colors } from '@/constants/Colors';
import React from 'react';
import { Image, StyleSheet, Text, useColorScheme, View } from 'react-native';
// import colors from '/colors';

const CurvedHeader = ({ subtitle } : {subtitle : string}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = getStyles(colorScheme ?? 'light');
  
  return (
    <>
      {/* Blue curved header with logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/logo.png')} />
        </View>
      </View>
      
      {/* Title and subtitle text */}
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>Welcome</Text>
        <Text style={styles.subtitleText}>{subtitle}</Text>
      </View>
    </>
  );
};

export const getStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  return StyleSheet.create({
    header: {
      height: 270,
      backgroundColor: colors.primary,
      borderBottomLeftRadius: 200,
      borderBottomRightRadius: 200,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ scale: 1.2 }],
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 120,
      height: 120,
      backgroundColor: 'transparent',
      marginBottom: 70,
    },
    textContainer: {
      alignItems: 'center',
      marginTop: -100,
    },
    titleText: {
      fontFamily: 'SF-Pro-Display-Regular',
      fontSize: 40,
      fontWeight: '700',
      color: colors.white,
    },
    subtitleText: {
      fontSize: 16,
      color: colors.white,
      marginTop: 5,
      lineHeight: 20,
    },
  });
}

export default CurvedHeader;