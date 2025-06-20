import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const getGlobalStyles = (colorScheme: 'light' | 'dark') => {
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingBottom: insets.bottom
    },
    InputContainer: {
      flexDirection: 'row-reverse',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      backgroundColor: colors.card,
      overflow: 'hidden',

      // Shadow for iOS
        shadowColor: colors.border,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,

        // Shadow for Android
        elevation: 1,
    },
    sectionContainer: {
      paddingVertical: 20,
      paddingHorizontal: 15,
    },
    headerWrapper: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      paddingHorizontal: 15,
    },
    header: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    menuButton: {
      padding: 5,
    },
    menuIcon: {
      fontSize: 24,
      color: 'white',
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
    },
    notificationButton: {
      padding: 5,
    },
    notificationIcon: {
      fontSize: 24,
      color: 'white',
    },
    scrollView: {
      flex: 1,
    },
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 30,
    },
    noAccountText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
    signUpText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
    },
    loginButton: {
      backgroundColor: colors.primary,
      borderRadius: 25,
      paddingVertical: 15,
      marginHorizontal: 20,
      alignItems: 'center',
      marginTop: 40,
    },
    loginButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    disabledButton: {
      color: colors.tint,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
      shadowColor: colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      // overflow: 'hidden',
    },
    resendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30,
    },
    resendIconContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 5,
    },
    resendIcon: {
      color: colors.white,
      fontSize: 16,
      fontWeight: 'bold'
    },
    resendText: {
      color: colors.primary,
      fontSize: 16,
    },
    disabledIcon: {
      backgroundColor: colors.tint,
    },
    verificationContainer: {
      marginTop: 30,
      alignItems: 'center',
    },
    verificationText: {
      fontSize: 16,
      color: colors.text,
      // fontWeight: '500'
    },
    codeInputContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 15,
    },
    codeInput: {
      width: 50,
      height: 50,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 20,
      marginHorizontal: 5,
      backgroundColor: colors.card,
    },
    circleContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 20,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    },
    halfCircle: {
      width: '100%',
      height: 70,
      borderRadius: '50%', // full circle
      backgroundColor: '#5B94E2',
      position: 'absolute',
      bottom: 10,
      transform: [{scale: 1.25}]
    },
});
}