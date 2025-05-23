import { Colors } from "@/constants/Colors";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function ServiceDeliveryLayout() {
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
        title: "Service Delivery" ,
        headerLeft: () => <DrawerToggleButton tintColor={Colors[colorScheme ?? 'light'].white} />,
        }} />
      <Stack.Screen name="AddDeliveryNote" options={{ title: "Add Delivery Note" }} />
      <Stack.Screen name="ServiceDeliveryDetails" options={{ title: "Delivery Details" }} />
    </Stack>
  )
}