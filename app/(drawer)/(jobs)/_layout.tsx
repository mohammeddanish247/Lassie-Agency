import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function PackagesLayout() {
   const colorScheme = useColorScheme();
  return (
    <Stack screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].primary, // Header background color
            },
            headerTintColor:  Colors[colorScheme ?? 'light'].white, // Color of back button and title
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
            headerShadowVisible: false,
        }}>
      <Stack.Screen name="Jobs" options={{ title: "Jobs"}} />
      <Stack.Screen name="EmpDetails" options={{ title: "Employer Details"}} />
    </Stack>
  )
}