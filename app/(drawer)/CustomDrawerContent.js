

// import {
//   DrawerContentScrollView,
//   DrawerItemList,
//   DrawerItem,
// } from "@react-navigation/drawer";
// import { View, Text, StyleSheet, Image, Linking } from "react-native";
// import { router } from "expo-router";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { useAuth } from "../../context/AuthContext";

// // --- Theme Colors (Re-use from your Home screen) ---
// const THEME_COLORS = {
//   background: "#0A0F1E", 
//   cardBackground: "#1A1F2C", 
//   accentBlue: "#00A3FF", 
//   textPrimary: "#E0E7FF", 
//   textSecondary: "#A0B0C0", 
//   iconColor: "#C0D0E0", 
//   negative: "#F87171", 
//   neutralDark: "#303A52", 
//   activeItemBackground: "rgba(0, 163, 255, 0.15)", 
// };

// export default function CustomDrawerContent(props) {
//   const { logout } = useAuth();

//   return (
//     <DrawerContentScrollView
//       {...props}
//       style={{ backgroundColor: THEME_COLORS.background }}
//     >
     
//       <View style={styles.header}>
  
//         <Text style={styles.title}>PES Electrical Pvt. Ltd.</Text>
//         <Text style={styles.email}>support@pesonline.co.in</Text>
//       </View>

      
//       <DrawerItemList {...props} />

      
//       <View style={styles.divider} />

      
//       <DrawerItem
//         label="About Us"
//         labelStyle={styles.drawerItemLabel}
//         icon={({ focused, size }) => (
//           <Icon
//             name="information-outline"
//             size={size}
//             color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//           />
//         )}
//         onPress={() => {
//           Linking.openURL("https://www.peselectricals.com").catch((err) =>
//             console.error("Failed to open URL:", err)
//           );
//         }}
//         style={styles.drawerItemContainer}
//         activeBackgroundColor={THEME_COLORS.activeItemBackground}
//       />

     
//       <DrawerItem
//         label="Logout"
//         labelStyle={styles.logoutLabel}
    
//         icon={({ focused, size }) => (
//           <Icon
//             name="logout"
//             size={size}
//             color={THEME_COLORS.negative}
//           />
//         )}
//         onPress={async () => {
//           await logout();
//           router.replace("/login");
//         }}
//         style={styles.drawerItemContainer}
//       />
//     </DrawerContentScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     padding: 20,
//     paddingTop: 30,
//     alignItems: "center",
//     backgroundColor: THEME_COLORS.cardBackground,
//     marginBottom: 10,
//   },
//   logo: {
//     width: 100,
//     height: 50,
//     marginBottom: 10,
//   },
//   title: {
//     fontWeight: "bold",
//     fontSize: 18,
//     color: "#FFFFFF", // White for maximum visibility
//     marginBottom: 5,
//   },
//   email: {
//     color: THEME_COLORS.textSecondary,
//     fontSize: 13,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: THEME_COLORS.neutralDark,
//     marginHorizontal: 16,
//     marginVertical: 15,
//   },
//   drawerItemLabel: {
//     fontWeight: "600",
//     fontSize: 16,
//     color: "#FFFFFF", 
//     marginLeft: -10,
//   },
//   logoutLabel: {
//     fontWeight: "600",
//     fontSize: 16,
//     color: "#F87171", 
//     marginLeft: -10,
//   },
//   drawerItemContainer: {
//     marginHorizontal: 10,
//     borderRadius: 10,
//     marginVertical: 2,
 
//   },
// });





import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Linking, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../../context/AuthContext";

// --- Theme Colors (Re-use from your Home screen) ---
const THEME_COLORS = {
  background: "#0A0F1E",
  cardBackground: "#1A1F2C",
  accentBlue: "#00A3FF",
  textPrimary: "#E0E7FF",
  textSecondary: "#A0B0C0",
  iconColor: "#C0D0E0",
  negative: "#F87171",
  neutralDark: "#303A52",
  activeItemBackground: "rgba(0, 163, 255, 0.15)",
};

export default function CustomDrawerContent(props) {
  const { logout } = useAuth();
  const { visibleScreens, navigation } = props; // Receive visibleScreens and navigation from props

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: THEME_COLORS.background }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>PES Electrical Pvt. Ltd.</Text>
        <Text style={styles.email}>support@pesonline.co.in</Text>
      </View>

      {/* Render only the visible screens */}
      {visibleScreens?.map((screen) => (
        <DrawerItem
          key={screen.name}
          label={screen.options.drawerLabel}
          labelStyle={styles.drawerItemLabel}
          icon={screen.options.drawerIcon}
          onPress={() => navigation.navigate(screen.name)}
          style={styles.drawerItemContainer}
          activeBackgroundColor={THEME_COLORS.activeItemBackground}
          activeTintColor={THEME_COLORS.accentBlue}
          inactiveTintColor="#FFFFFF"
        />
      ))}

      <View style={styles.divider} />

      <DrawerItem
        label="About Us"
        labelStyle={styles.drawerItemLabel}
        icon={({ focused, size }) => (
          <Icon
            name="information-outline"
            size={size}
            color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
          />
        )}
        onPress={() => {
          Linking.openURL("https://www.peselectricals.com").catch((err) =>
            console.error("Failed to open URL:", err)
          );
        }}
        style={styles.drawerItemContainer}
        activeBackgroundColor={THEME_COLORS.activeItemBackground}
      />

      <DrawerItem
        label="Logout"
        labelStyle={styles.logoutLabel}
        icon={({ focused, size }) => (
          <Icon name="logout" size={size} color={THEME_COLORS.negative} />
        )}
        onPress={async () => {
          await logout();
          router.replace("/login");
        }}
        style={styles.drawerItemContainer}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 30,
    alignItems: "center",
    backgroundColor: THEME_COLORS.cardBackground,
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 5,
  },
  email: {
    color: THEME_COLORS.textSecondary,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: THEME_COLORS.neutralDark,
    marginHorizontal: 16,
    marginVertical: 15,
  },
  drawerItemLabel: {
    fontWeight: "600",
    fontSize: 16,
    color: "#FFFFFF",
   // marginLeft: -5,
   
  },
  logoutLabel: {
    fontWeight: "600",
    fontSize: 16,
    color: "#F87171",
   // marginLeft: -10,
  },
  drawerItemContainer: {
    marginHorizontal: 10,
    borderRadius: 10,
    marginVertical: 2,
  },
});