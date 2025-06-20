// screens/NotificationsScreen.js
import { Colors } from '@/constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { getGlobalStyles } from '../../../styles/globalStyles';

export default function Notifications() {

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = getStyles(colorScheme ?? 'light');
  const globalStyles = getGlobalStyles(colorScheme ?? 'light');

  useFocusEffect(
    useCallback(() => {
    }, [])
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />  
      <View style={globalStyles.circleContainer}>
        <View style={globalStyles.halfCircle} />
      </View>
      <ScrollView style={globalStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Slider */}
      </ScrollView>
    </SafeAreaView>
  );
};


export const getStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
}