import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function CandidateLayout() {
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
       <Stack.Screen name="index" options={{  title: "All Candidates"}} />
       <Stack.Screen name="AddCandidate" options={{ title: "Add Candidate" }} />
       <Stack.Screen name="ViewCV" options={{ title: "Candidate CV" }} />
    </Stack>
  )
}