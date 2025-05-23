import CustomDrawer from "@/components/sideDrawerMenu";
import { Colors } from "@/constants/Colors";
import { Drawer } from "expo-router/drawer";
import { Dimensions, useColorScheme } from "react-native";
const { width } = Dimensions.get('window');


export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light']
  return (
    <Drawer drawerContent={(props) => <CustomDrawer {...props} />} 
          screenOptions={{
            headerShown: false
          }}
      //   screenOptions={({ route }:{route : any}) => ({
      //   drawerPosition: 'left',
      //   drawerType: 'front',
      //   drawerStyle: {
      //     backgroundColor: colors.background,
      //     width: width * 0.85,
      //   },
      //   // headerTitle: route.name, // Use the dynamic header,
      //   headerStyle: {
      //     backgroundColor: colors.primary, // Header background color
      //     elevation: 0, // Remove shadow on Android
      //     shadowOpacity: 0, // Remove shadow on iOS
      //   },
      //   headerTintColor:  colors.white, // Color of back button and title
      //   headerTitleStyle: {
      //     fontWeight: 'bold',
      //   },
      //   headerTitleAlign: 'center',
      // })}
        >
    <Drawer.Screen name="(tabs)" options={{headerShown: false}}/>
    <Drawer.Screen name="Candidates"/>
    <Drawer.Screen name="Agreements"/>
    <Drawer.Screen name="ClientsOrder"/>
    <Drawer.Screen name="ServiceDelivery"/>
    <Drawer.Screen name="Packages"/>
      {/* <Drawer.Screen name="settings" options={{headerShown: true}} /> */}
    </Drawer>
  );
}