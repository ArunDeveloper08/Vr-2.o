// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Drawer } from "expo-router/drawer";
// import CustomDrawerContent from "./CustomDrawerContent";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// // --- Theme Colors (Same as CustomDrawerContent) ---
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

// export default function Layout() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Drawer
//         drawerContent={(props) => <CustomDrawerContent {...props} />}
//         screenOptions={{
//           headerShown: false,
//           drawerActiveTintColor: THEME_COLORS.accentBlue, // Vibrant blue for active items
//           drawerInactiveTintColor: "#FFFFFF", // White for inactive item labels
//           drawerActiveBackgroundColor: THEME_COLORS.activeItemBackground, // Subtle glow for active items
//           drawerStyle: {
//             backgroundColor: THEME_COLORS.background,
//           },
//           drawerLabelStyle: {
//             marginLeft: 10,
//             fontSize: 16,
//             fontWeight: "600",
//             color: "#FFFFFF", // White for all labels
//           },
//           drawerIconStyle: {
//             marginRight: 5,
//           },
//           drawerItemStyle: {
//             marginHorizontal: 10,
//             borderRadius: 10,
//             marginVertical: 2,
//           },
//         }}
//       >
//         <Drawer.Screen
//           name="index"
//           options={{
//             headerShown: false,
//             drawerLabel: "Home",
//             drawerIcon: ({ focused, size }) => (
//               <Icon
//                 name="home"
//                 size={size}
//                 color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//               />
//             ),
//           }}
//         />
//         <Drawer.Screen
//           name="charge-detail"
//           options={{
//             headerShown: false,
//             drawerLabel: "Charges Details",
//             drawerIcon: ({ focused, size }) => (
//               <Icon
//                 name="currency-inr"
//                 size={size}
//                 color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//               />
//             ),
//           }}
//         />
//              <Drawer.Screen
//           name="user-recharge-history"
//           options={{
//             headerShown: false,
//             drawerLabel: "User Recharge History",
//             drawerIcon: ({ focused, size }) => (
//               <Icon
//                 name="wallet"
//                 size={size}
//                 color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//               />
//             ),
//           }}
//         />
//         <Drawer.Screen
//           name="bill-history"
//           options={{
//             headerShown: false,
//             drawerLabel: "Bill History",
//             drawerIcon: ({ focused, size }) => (
//               <Icon
//                 name="history"
//                 size={size}
//                 color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//               />
//             ),
//           }}
//         />
//         <Drawer.Screen
//           name="report"
//           options={{
//             headerShown: false,
//             drawerLabel: "Report",
//             drawerIcon: ({ focused, size }) => (
//               <Icon
//                 name="chart-bar"
//                 size={size}
//                 color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//               />
//             ),
//           }}
//         />

//         <Drawer.Screen
//           name="message"
//           options={{
//             headerShown: false,
//             drawerLabel: "Message",
//             drawerIcon: ({ focused, size }) => (
//               <Icon
//                 name="message"
//                 size={size}
//                 color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//               />
//             ),
//           }}
//         />
//         <Drawer.Screen
//           name="bulletin"
//           options={{
//             headerShown: false,
//             drawerLabel: "Bulletin",
//             drawerIcon: ({ focused, size }) => (
//               <Icon
//                 name="bulletin-board"
//                 size={size}
//                 color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//               />
//             ),
//           }}
//         />
//         <Drawer.Screen
//           name="profile"
//           options={{
//             headerShown: false,
//             drawerLabel: "Profile",
//             drawerIcon: ({ focused, size }) => (
//               <Icon
//                 name="account"
//                 size={size}
//                 color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//               />
//             ),
//           }}
//         />
//         <Drawer.Screen
//           name="download-bill"
//           options={{
//             headerShown: false,
//             drawerLabel: "Download Bill",
//             drawerIcon: ({ focused, size }) => (
//               <Icon
//                 name="file-download"
//                 size={size}
//                 color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//               />
//             ),
//           }}
//         />
//         <Drawer.Screen
//           name="change-password"
//           options={{
//             headerShown: false,
//             drawerLabel: "Change Password",
//             drawerIcon: ({ focused, size }) => (
//               <Icon
//                 name="lock-reset"
//                 size={size}
//                 color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//               />
//             ),
//           }}
//         />
//         <Drawer.Screen
//           name="privacy-setting"
//           options={{
//             headerShown: false,
//             drawerLabel: "Privacy Setting",
//             drawerIcon: ({ focused, size }) => (
//               <Icon
//                 name="shield-lock"
//                 size={size}
//                 color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//               />
//             ),
//           }}
//         />
//         <Drawer.Screen
//           name="Notification"
//           options={{
//             headerShown: false,
//             drawerLabel: "Notification",
//             drawerIcon: ({ focused, size }) => (
//               <Icon
//                 name="bell"
//                 size={size}
//                 color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//               />
//             ),
//           }}
//         />
//       </Drawer>
//     </GestureHandlerRootView>
//   );
// }

//conditionally render drawer componenet
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Drawer } from "expo-router/drawer";
// import CustomDrawerContent from "./CustomDrawerContent"; // Fixed import path
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { useAuth } from "../../context/AuthContext";

// // --- Theme Colors (Same as CustomDrawerContent) ---
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

// export default function Layout() {
//   const { user } = useAuth();
//   let meterid = user?.MeterID;

//   // Define all possible screens
//   const allScreens = [
//     {
//       name: "index",
//       options: {
//         headerShown: false,
//         drawerLabel: "Home",
//         drawerIcon: ({ focused, size }) => (
//           <Icon
//             name="home"
//             size={size}
//             color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//           />
//         ),
//       },
//     },
//     {
//       name: "charge-detail",
//       options: {
//         headerShown: false,
//         drawerLabel: "Charges Details",
//         drawerIcon: ({ focused, size }) => (
//           <Icon
//             name="currency-inr"
//             size={size}
//             color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//           />
//         ),
//       },
//     },
//     {
//       name: "user-recharge-history",
//       options: {
//         headerShown: false,
//         drawerLabel: "User Recharge History",
//         drawerIcon: ({ focused, size }) => (
//           <Icon
//             name="wallet"
//             size={size}
//             color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//           />
//         ),
//       },
//     },
//     {
//       name: "bill-history",
//       options: {
//         headerShown: false,
//         drawerLabel: "Bill History",
//         drawerIcon: ({ focused, size }) => (
//           <Icon
//             name="history"
//             size={size}
//             color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//           />
//         ),
//       },
//     },
//     {
//       name: "report",
//       options: {
//         headerShown: false,
//         drawerLabel: "Report",
//         drawerIcon: ({ focused, size }) => (
//           <Icon
//             name="chart-bar"
//             size={size}
//             color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//           />
//         ),
//       },
//     },
//     {
//       name: "message",
//       options: {
//         headerShown: false,
//         drawerLabel: "Message",
//         drawerIcon: ({ focused, size }) => (
//           <Icon
//             name="message"
//             size={size}
//             color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//           />
//         ),
//       },
//     },
//     {
//       name: "bulletin",
//       options: {
//         headerShown: false,
//         drawerLabel: "Bulletin",
//         drawerIcon: ({ focused, size }) => (
//           <Icon
//             name="bulletin-board"
//             size={size}
//             color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//           />
//         ),
//       },
//     },
//     {
//       name: "profile",
//       options: {
//         headerShown: false,
//         drawerLabel: "Profile",
//         drawerIcon: ({ focused, size }) => (
//           <Icon
//             name="account"
//             size={size}
//             color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//           />
//         ),
//       },
//     },
//     {
//       name: "download-bill",
//       options: {
//         headerShown: false,
//         drawerLabel: "Download Bill",
//         drawerIcon: ({ focused, size }) => (
//           <Icon
//             name="file-download"
//             size={size}
//             color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//           />
//         ),
//       },
//     },
//     {
//       name: "change-password",
//       options: {
//         headerShown: false,
//         drawerLabel: "Change Password",
//         drawerIcon: ({ focused, size }) => (
//           <Icon
//             name="lock-reset"
//             size={size}
//             color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//           />
//         ),
//       },
//     },
//     {
//       name: "privacy-setting",
//       options: {
//         headerShown: false,
//         drawerLabel: "Privacy Setting",
//         drawerIcon: ({ focused, size }) => (
//           <Icon
//             name="shield-lock"
//             size={size}
//             color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//           />
//         ),
//       },
//     },
//     // {
//     //   name: "Notification",
//     //   options: {
//     //     headerShown: false,
//     //     drawerLabel: "Notification",
//     //     drawerIcon: ({ focused, size }) => (
//     //       <Icon
//     //         name="bell"
//     //         size={size}
//     //         color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
//     //       />
//     //     ),
//     //   },
//     // },
//   ];

//   // Determine how many screens to show based on meterid
//   let visibleScreens = [];
//   if (meterid === "1102") {
//    visibleScreens = allScreens;
//   } else {
//     visibleScreens = allScreens;
//   }

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Drawer
//         drawerContent={(props) => <CustomDrawerContent {...props} visibleScreens={visibleScreens} />}
//         screenOptions={{
//           headerShown: false,
//           drawerActiveTintColor: THEME_COLORS.accentBlue,
//           drawerInactiveTintColor: "#FFFFFF",
//           drawerActiveBackgroundColor: THEME_COLORS.activeItemBackground,
//           drawerStyle: {
//             backgroundColor: THEME_COLORS.background,
//           },
//           drawerLabelStyle: {
//             marginLeft: 10,
//             fontSize: 16,
//             fontWeight: "600",
//             color: "#FFFFFF",
//           },
//           drawerIconStyle: {
//             marginRight: 5,
//           },
//           drawerItemStyle: {
//             marginHorizontal: 10,
//             borderRadius: 10,
//             marginVertical: 2,
//           },
//         }}
//       >
//         {visibleScreens?.map((screen) => (
//           <Drawer.Screen
//             key={screen.name}
//             name={screen.name}
//             options={screen.options}
//           />
//         ))}
//       </Drawer>
//     </GestureHandlerRootView>
//   );
// }

import axios from "axios";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../../context/AuthContext";
import CustomDrawerContent from "./CustomDrawerContent";

// --- Theme Colors (Same as CustomDrawerContent) ---
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

export default function Layout() {
  const { user } = useAuth();
  // let meterid = user?.MeterID; 
    
  // Define all possible screens
  const allScreens = [
    {
      name: "index",
      options: {
        headerShown: false,
        drawerLabel: "Home",
        drawerIcon: ({ focused, size }) => (
          <Icon
            name="home"
            size={size}
            color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
          />
        ),
      },
    },
    {
      name: "charge-detail",
      options: {
        headerShown: false,
        drawerLabel: "Charges Details",
        drawerIcon: ({ focused, size }) => (
          <Icon
            name="currency-inr"
            size={size}
            color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
          />
        ),
      },
    },
    {
      name: "user-recharge-history",
      options: {
        headerShown: false,
        drawerLabel: "User Recharge History",
        drawerIcon: ({ focused, size }) => (
          <Icon
            name="wallet"
            size={size}
            color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
          />
        ),
      },
    },
    {
      name: "bill-history",
      options: {
        headerShown: false,
        drawerLabel: "Bill History",
        drawerIcon: ({ focused, size }) => (
          <Icon
            name="history"
            size={size}
            color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
          />
        ),
      },
    },
    {
      name: "report",
      options: {
        headerShown: false,
        drawerLabel: "Report",
        drawerIcon: ({ focused, size }) => (
          <Icon
            name="chart-bar"
            size={size}
            color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
          />
        ),
      },
    },
    {
      name: "message",
      options: {
        headerShown: false,
        drawerLabel: "Message",
        drawerIcon: ({ focused, size }) => (
          <Icon
            name="message"
            size={size}
            color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
          />
        ),
      },
    },
    {
      name: "bulletin",
      options: {
        headerShown: false,
        drawerLabel: "Bulletin",
        drawerIcon: ({ focused, size }) => (
          <Icon
            name="bulletin-board"
            size={size}
            color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
          />
        ),
      },
    },
    {
      name: "profile",
      options: {
        headerShown: false,
        drawerLabel: "Profile",
        drawerIcon: ({ focused, size }) => (
          <Icon
            name="account"
            size={size}
            color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
          />
        ),
      },
    },
    {
      name: "download-bill",
      options: {
        headerShown: false,
        drawerLabel: "Download Bill",
        drawerIcon: ({ focused, size }) => (
          <Icon
            name="file-download"
            size={size}
            color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
          />
        ),
      },
    },
    {
      name: "change-password",
      options: {
        headerShown: false,
        drawerLabel: "Change Password",
        drawerIcon: ({ focused, size }) => (
          <Icon
            name="lock-reset"
            size={size}
            color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
          />
        ),
      },
    },
    {
      name: "privacy-setting",
      options: {
        headerShown: false,
        drawerLabel: "Privacy Setting",
        drawerIcon: ({ focused, size }) => (
          <Icon
            name="shield-lock"
            size={size}
            color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
          />
        ),
      },
    },
    {
      name: "payment", // This name should match the screen component you register
      options: {
        headerShown: false,
        drawerLabel: "Payment", // The text label you see in the drawer
        drawerIcon: ({ focused, size }) => (
          <Icon
            name="credit-card" // A suitable icon for payments
            size={size}
            color={focused ? THEME_COLORS.accentBlue : THEME_COLORS.iconColor}
          />
        ),
      },
    },
  ];

  // State to manage visible screens
  const [visibleScreens, setVisibleScreens] = useState([]);

  // Fetch menu items from API and filter screens
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.post(
          "https://www.pesonline.in/webconfig/Android/AndroidAppMenuItem",
          {
            siteId: user?.SiteID?.toUpperCase(),
            vendorID: user?.VendorID,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        // console.log("data", data);

        if (data.ApiMessage === "SUCCESS") {
          const allowedTitles = data.Data.filter(
            (item) => item.ParentMenuId === 2
          ).map((item) =>
            item.Title.replace(/([a-z])([A-Z])/g, "$1 $2").trim()
          );

          const filteredScreens = allScreens.filter((screen) => {
            const label = screen.options.drawerLabel;
            return allowedTitles.includes(label);
          });

          setVisibleScreens(filteredScreens);
        } else {
          console.error("API Error:", data.ApiMessage);
          setVisibleScreens(allScreens);0.
           
        }
      } catch (error) {
        console.error("Axios Error:", error.message || error);
        setVisibleScreens(allScreens); //
      }
    };

    if (user) {
      fetchMenuItems();
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <CustomDrawerContent {...props} visibleScreens={visibleScreens} />
        )}
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: THEME_COLORS.accentBlue,
          drawerInactiveTintColor: "#FFFFFF",
          drawerActiveBackgroundColor: THEME_COLORS.activeItemBackground,
          drawerStyle: {
            backgroundColor: THEME_COLORS.background,
          },
          drawerLabelStyle: {
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "600",
            color: "#FFFFFF",
          },
          drawerIconStyle: {
            marginRight: 5,
          },
          drawerItemStyle: {
            marginHorizontal: 10,
            borderRadius: 10,
            marginVertical: 2,
          },
        }}
      >
        {visibleScreens?.map((screen) => (
          <Drawer.Screen
            key={screen.name}
            name={screen.name}
            options={screen.options}
          />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  );
}
