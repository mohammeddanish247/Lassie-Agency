import { Colors } from "@/constants/Colors";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function CandidatesLayout() {
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
      <Stack.Screen name="index" options={{ 
        title: "Candidates" ,
        headerLeft: () => <DrawerToggleButton tintColor={Colors[colorScheme ?? 'light'].white} />,
        }} />
      <Stack.Screen name="AddCandidate" options={{ title: "Add Candidate" }} />
      <Stack.Screen name="ViewCV" options={{ title: "Candidate CV" }} />
    </Stack>
  )
}