import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import ResponseProvider from '@/services/LoaderContext';
import { UserProvider } from '@/services/userContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ResponseProvider>
        <UserProvider>
          <Stack initialRouteName='index' screenOptions={{
            headerTintColor:  Colors[colorScheme ?? 'light'].white, // Color of back button and title
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: Colors[colorScheme ?? 'light'].primary
            }}}>
            <Stack.Screen name="index" options={{ headerTitle: '' }}/>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="(jobs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="MPIN"  options={{ headerTitle: '' }}/>
            <Stack.Screen name="Signup"  options={{ headerTitle: '' }}/>
            <Stack.Screen name="ViewCV"  options={{ headerTitle: 'Candidate CV' }}/>
          </Stack>
          <StatusBar style="auto" />
        </UserProvider>
      </ResponseProvider>
    </ThemeProvider>
  );
}
