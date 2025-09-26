// import { DrawerActions, useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import { useRouter } from "expo-router";
// import React, { useCallback, useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   Modal,
//   RefreshControl, // Main ScrollView
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { PanGestureHandler, State } from "react-native-gesture-handler";
// import { PieChart } from "react-native-gifted-charts";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { apiUrl } from "../../constant/utils";
// import { useAuth } from "../../context/AuthContext";

// const screenWidth = Dimensions.get("window").width;
// const screenHeight = Dimensions.get("window").height;

// // --- Theme Colors ---
// const THEME_COLORS = {
//   background: "#0A0F1E",
//   cardBackground: "#1A1F2C",
//   accentBlue: "#00A3FF",
//   accentBlueGlow: "rgba(0, 163, 255, 0.5)",
//   textPrimary: "#E0E7FF",
//   textSecondary: "#8A9CB0",
//   iconColor: "#C0D0E0",
//   shadowLight: "rgba(40, 50, 70, 0.7)",
//   shadowDark: "rgba(0, 0, 0, 0.6)",
//   positive: "#34D399",
//   negative: "#F87171",
//   neutralDark: "#303A52",
//   modalOverlay: "rgba(0, 0, 0, 0.8)",
// };

// const DARK_THEME_COLORS = {
//   background: "#0A0F1E",
//   cardBackground: "#1A1F2C",
//   accentBlue: "#00A3FF",
//   accentBlueGlow: "rgba(0, 163, 255, 0.5)",
//   textPrimary: "#E0E7FF",
//   textSecondary: "#8A9CB0",
//   iconColor: "#C0D0E0",
//   shadowLight: "rgba(40, 50, 70, 0.7)",
//   shadowDark: "rgba(0, 0, 0, 0.6)",
//   positive: "#34D399",
//   negative: "#F87171",
//   neutralDark: "#303A52",
//   modalOverlay: "rgba(0, 0, 0, 0.8)",
//   divider: "#303A52", // Added divider for consistent theming
// };

// const LIGHT_THEME_COLORS = {
//   background: "#F0F2F5",
//   cardBackground: "#FFFFFF",
//   accentBlue: "#007BFF",
//   accentBlueGlow: "rgba(0, 123, 255, 0.3)",
//   textPrimary: "#333333",
//   textSecondary: "#666666",
//   iconColor: "#555555",
//   shadowLight: "rgba(0, 0, 0, 0.1)",
//   shadowDark: "rgba(0, 0, 0, 0.1)",
//   positive: "#28A745",
//   negative: "#DC3545",
//   neutralDark: "#E0E0E0",
//   modalOverlay: "rgba(0, 0, 0, 0.5)",
//   divider: "#DDDDDD", // Added divider for consistent theming
// };

// export default function Home() {
//   const navigation = useNavigation();
//   const { user, logout } = useAuth();
//   const router = useRouter();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [timePeriod, setTimePeriod] = useState("Day");
//   const [chargesTimePeriod, setChargesTimePeriod] = useState("Day");
//   const [refreshing, setRefreshing] = useState(false);

//   const [isChartModalVisible, setChartModalVisible] = useState(false);
//   const [selectedChartSegment, setSelectedChartSegment] = useState(null);
//   const [visibleDashboardCards, setVisibleDashboardCards] = useState(new Set());

//     const [isMeterStatusModalVisible, setMeterStatusModalVisible] = useState(false);
//   const [isResetting, setIsResetting] = useState(false); 
//   const [isTogglingMeter, setIsTogglingMeter] = useState(false); 

//   const [focusedPieIndex, setFocusedPieIndex] = useState(-1);
//     // Theme state
//   const [isDarkTheme, setIsDarkTheme] = useState(true);
//   const currentTheme = isDarkTheme ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;

//   useEffect(() => {
//     const loadTheme = async () => {
//       try {
//         const savedTheme = await AsyncStorage.getItem('theme');
//         if (savedTheme !== null) {
//           setIsDarkTheme(savedTheme === 'dark');
//         }
//       } catch (e) {
//         console.error("Failed to load theme from storage", e);
//       }
//     };
//     loadTheme();
//   }, []);

//   const toggleTheme = async () => {
//     const newTheme = !isDarkTheme;
//     setIsDarkTheme(newTheme);
//     try {
//       await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
//     } catch (e) {
//       console.error("Failed to save theme to storage", e);
//     }
//   };


//   const fetchData = useCallback(async () => {
//     if (!user) {
//       setError("User not logged in. Please log in again.");
//       setLoading(false);
//       return;
//     }
//     try {
//       setError(null);
//       const response = await axios.post(
//         `${apiUrl}/WebServicesFinal/Android/MeterDataSingle`,
//         user
//       );
//       if (
//         response.data.ApiStatus === "TRUE" &&
//         response.data.Data &&
//         response.data.Data[0]
//       ) {
//         setData(response.data.Data[0]);
//       } else {
//         setError(response.data.ApiMessage || "Failed to retrieve data.");
//         setData(null);
//       }
//     } catch (err) {
//       setError(
//         "An error occurred. Please check your connection and try again."
//       );
//       console.error("Error fetching data:", err);
//       setData(null);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (!user) return;

//     const fetchDashboardConfig = async () => {
//       try {
//         const response = await axios.post(
//           // Using the specific URL for this endpoint as it may differ from the main apiUrl path
//           "https://www.pesonline.in/webconfig/Android/AndroidAppMenuItem",
//           {
//             siteId: user?.SiteID?.toUpperCase(),
//             vendorID: user?.VendorID,
//           }
//         );

//         if (response.data.ApiMessage === "SUCCESS") {
//           const dashboardTitles = response.data.Data.filter(
//             (item) => item.ParentMenuId === 1
//           ) // Filter for dashboard items
//             .map((item) => item.Title); // Get their titles

//           setVisibleDashboardCards(new Set(dashboardTitles));
//         } else {
//           // Fallback: If API has an issue, show all default cards so the app is still usable.
//           console.error(
//             "API Error fetching dashboard config:",
//             response.data.ApiMessage
//           );
//           setVisibleDashboardCards(
//             new Set([
//               "DashBoard",
//               "AvaliableBalance",
//               "MeterStatus",
//               "SystemStatus",
//               "ConsumptionAnalysis",
//               "ChargeOverview",
//               "Sanctionload",
//             ])
//           );
//         }
//       } catch (error) {
//         // Fallback: On network error, show all default cards.
//         console.error("Axios Error fetching dashboard config:", error);
//         setVisibleDashboardCards(
//           new Set([
//             "DashBoard",
//             "AvaliableBalance",
//             "MeterStatus",
//             "SystemStatus",
//             "ConsumptionAnalysis",
//             "ChargeOverview",
//             "Sanctionload",
//           ])
//         );
//       }
//     };

//     fetchDashboardConfig();
//   }, [user]);

//   useEffect(() => {
//     setLoading(true);
//     fetchData();
//   }, [fetchData]);

//   const handleLogout = () => {
//     Alert.alert(
//       "Confirm Logout",
//       "Are you sure you want to log out?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Logout",
//           style: "destructive",
//           onPress: async () => {
//             await logout();
//             router.replace("/login");
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchData();
//   }, [fetchData]);

//     const handleResetReading = async () => {
//     //console.log("user" , user)
//     if (!user) {
//       Alert.alert("Error", "User information is missing. Cannot proceed.");
//       return;
//     }
//     setIsResetting(true);
//     try {
//       // IMPORTANT: Replace with the actual API endpoint for resetting readings.
//       const response = await axios.post(
//         `https://www.pesonline.in/WebServicesFinal/Android/MeterOn`, // Placeholder URL
//         user 
//       );

//       if (response.data.ApiMessage === "SUCCESS") {
//         Alert.alert("Success", response.data.ApiMessage || "Meter reading has been reset successfully.");
//         setMeterStatusModalVisible(false);
//         onRefresh(); // Refresh the dashboard data to show updated values
//       } else {
//         Alert.alert("Reset Failed", response.data.ApiMessage || "Could not reset meter reading.");
//       }
//     } catch (err) {
//       console.error("Error resetting meter reading:", err);
//       Alert.alert("Error", "An error occurred while trying to reset the reading. Please try again.");
//     } finally {
//       setIsResetting(false);
//     }         
//   };
                                                
//    const handleMeterOff = async () => {
//     if (!user) { Alert.alert("Error", "User information is missing."); return; }
//     setIsTogglingMeter(true);
//     try {
//       // IMPORTANT: Replace with the actual API endpoint for turning the meter off.
//       const response = await axios.post(`https://www.pesonline.in/WebServicesFinal/Android/MeterOFF`, user);

//       if (response.data.ApiMessage === "SUCCESS") {
//         Alert.alert("Success", response.data.ApiMessage || "Meter has been turned off successfully.");
//         setMeterStatusModalVisible(false);
//         onRefresh(); // Refresh dashboard to show the new meter status
//       } else {
//         Alert.alert("Action Failed", response.data.ApiMessage || "Could not turn the meter off.");
//       }
//     } catch (err) {
//       console.error("Error turning meter off:", err);
//       Alert.alert("Error", "An error occurred while performing this action.");
//     } finally {
//       setIsTogglingMeter(false);    
//     }
//   };

//   const dgConsumptionDayToday = parseFloat(data?.DgClosingReading) || 0;
//   const gridConsumptionDayToday = parseFloat(data?.GridClosingReading) || 0;
//   const dgConsumptionDay = parseFloat(data?.DgConsumptionDay) || 0;
//   const gridConsumptionDay = parseFloat(data?.GridConsumptionDay) || 0;
//   const dgConsumptionBilling = parseFloat(data?.DgConsumptionFromBilling) || 0;
//   const gridConsumptionBilling =
//     parseFloat(data?.GridConsumptionFromBilling) || 0;

//   const todayTotal = dgConsumptionDay + gridConsumptionDay;
//   const monthTotal = dgConsumptionBilling + gridConsumptionBilling;

//   const todayLimit = 10;
//   const monthLimit = 500;

//   const todayPercentage =
//     todayLimit > 0 && todayTotal > 0 ? (todayTotal / todayLimit) * 100 : 0;
//   const monthPercentage =
//     monthLimit > 0 && monthTotal > 0 ? (monthTotal / monthLimit) * 100 : 0;

//   const chartData = React.useMemo(() => {
//     const dailyGridVal = gridConsumptionDay;
//     const dailyDGVal = dgConsumptionDay;
//     const monthlyGridVal = gridConsumptionBilling;
//     const monthlyDGVal = dgConsumptionBilling;
//     let currentData = [];

//     if (timePeriod === "Day") {
//       if (dailyGridVal > 0)
//         currentData.push({
//           label: "Grid",
//           value: dailyGridVal,
//           color: THEME_COLORS.accentBlue,
//           gradientCenterColor: THEME_COLORS.accentBlue,
//           focused: focusedPieIndex === currentData.length,
//         });
//       if (dailyDGVal > 0)
//         currentData.push({
//           label: "DG",
//           value: dailyDGVal,
//           color: "#FFA726",
//           gradientCenterColor: "#FFA726",
//           focused: focusedPieIndex === currentData.length,
//         });
//     } else {
//       // Month
//       if (monthlyGridVal > 0)
//         currentData.push({
//           label: "Grid",
//           value: monthlyGridVal,
//           color: THEME_COLORS.accentBlue,
//           gradientCenterColor: THEME_COLORS.accentBlue,
//           focused: focusedPieIndex === currentData.length,
//         });
//       if (monthlyDGVal > 0)
//         currentData.push({
//           label: "DG",
//           value: monthlyDGVal,
//           color: "#FFA726",
//           gradientCenterColor: "#FFA726",
//           focused: focusedPieIndex === currentData.length,
//         });
//     }
//     return currentData;
//   }, [
//     timePeriod,
//     focusedPieIndex,
//     gridConsumptionDay,
//     dgConsumptionDay,
//     gridConsumptionBilling,
//     dgConsumptionBilling,
//   ]);

//   const legendData = React.useMemo(
//     () =>
//       timePeriod === "Day"
//         ? [
//             {
//               label: "Grid",
//               value: gridConsumptionDay,
//               color: THEME_COLORS.accentBlue,
//             },
//             { label: "DG", value: dgConsumptionDay, color: "#FFA726" },
//           ]
//         : [
//             {
//               label: "Grid",
//               value: gridConsumptionBilling,
//               color: THEME_COLORS.accentBlue,
//             },
//             { label: "DG", value: dgConsumptionBilling, color: "#FFA726" },
//           ],
//     [
//       gridConsumptionDay,
//       dgConsumptionDay,
//       gridConsumptionBilling,
//       dgConsumptionBilling,
//       timePeriod,
//     ]
//   );

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return "Invalid Date";
//     return new Intl.DateTimeFormat("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(date);
//   };

//   const onConsumptionChartSwipeHandlerStateChange = (event) => {
//     if (event.nativeEvent.state === State.END) {
//       const { translationX, translationY } = event.nativeEvent;
//       if (Math.abs(translationX) > Math.abs(translationY) + 20) {
//         if (translationX > 50 && timePeriod !== "Month") setTimePeriod("Month");
//         else if (translationX < -50 && timePeriod !== "Day")
//           setTimePeriod("Day");
//       }
//     }
//   };

//   const onChargesSwipeHandlerStateChange = (event) => {
//     if (event.nativeEvent.state === State.END) {
//       const { translationX, translationY } = event.nativeEvent;
//       if (Math.abs(translationX) > Math.abs(translationY) + 20) {
//         if (translationX > 50 && chargesTimePeriod !== "Month")
//           setChargesTimePeriod("Month");
//         else if (translationX < -50 && chargesTimePeriod !== "Day")
//           setChargesTimePeriod("Day");
//       }
//     }
//   };

//   const handleChartPress = (item, index) => {
//     if (!item || item.value <= 0) return; // Don't open modal for zero/placeholder segments
//     setSelectedChartSegment(item);
//     setFocusedPieIndex(index);
//     setChartModalVisible(true);
//   };

//   const closeModal = () => {
//     setChartModalVisible(false);
//     setSelectedChartSegment(null);
//     setFocusedPieIndex(-1);
//   };

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.centeredContainer}>
//         <ActivityIndicator size="large" color={THEME_COLORS.accentBlue} />
//         <Text style={styles.infoText}>Loading Dashboard...</Text>
//       </View>
//     );
//   }
//   if (error) {
//     return (
//       <View style={styles.centeredContainer}>
//         <Icon
//           name="alert-circle-outline"
//           size={60}
//           color={THEME_COLORS.negative}
//         />
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.button} onPress={fetchData}>
//           <Text style={styles.buttonText}>Retry</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.button, styles.logoutButton]}
//           onPress={handleLogout}
//         >
//           <Text style={styles.buttonText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
//   if (!data) {
//     return (
//       <ScrollView
//         contentContainerStyle={styles.centeredContainer}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={THEME_COLORS.accentBlue}
//             colors={[THEME_COLORS.accentBlue]}
//           />
//         }
//       >
//         <Icon
//           name="information-outline"
//           size={60}
//           color={THEME_COLORS.textSecondary}
//         />
//         <Text style={styles.infoText}>No data available. Pull to refresh.</Text>
//       </ScrollView>
//     );
//   }

//   const currentTotalConsumption =
//     timePeriod === "Day" ? todayTotal : monthTotal;
//   const currentLimit = timePeriod === "Day" ? todayLimit : monthLimit;
//   const currentPercentage =
//     timePeriod === "Day" ? todayPercentage : monthPercentage;
//   const showConsumptionChart = chartData.length > 0;

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar
//         barStyle="light-content"
//         backgroundColor={THEME_COLORS.background}
//       />
      
//       <ScrollView // MAIN SCROLL VIEW FOR THE ENTIRE SCREEN
//         style={styles.container}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={THEME_COLORS.accentBlue}
//             colors={[THEME_COLORS.accentBlue]}
//           />
//         }
//       >
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
//             style={styles.iconButton}
//           >
//             <Icon name="menu" size={30} color={THEME_COLORS.iconColor} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>PES Online</Text>
//           <View style={{ display: "flex", flexDirection: "row" }}>
//             <TouchableOpacity
//               onPress={() => router.replace("/Notification")}
//               style={[styles.iconButton, { marginRight: 15 }]}
//             >
//               <Icon
//                 name="bell-outline"
//                 size={26}
//                 color={THEME_COLORS.iconColor}
//               />
//             </TouchableOpacity>
//             <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
//               <Icon
//                 name="logout-variant"
//                 size={28}
//                 color={THEME_COLORS.iconColor}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {visibleDashboardCards.has("DashBoard") && (
//           <View style={[styles.card, styles.welcomeCard]}>
//             <Text style={styles.dashboard}>Dashboard</Text>
//             <Text style={styles.greetingText}>
//               Hello, {data.MeterName || "User"}!
//             </Text>
//             {/* <Text style={styles.updateText}>Last updated: {formatDate(data.ClosingDateTime)}</Text> */}
//           </View>
//         )}

//         {/* Balance Card */}
//         {visibleDashboardCards.has("AvaliableBalance") && (
//           <View style={[styles.card, styles.balanceCard]}>
//             <View style={styles.balanceTextContainer}>
//               <Text style={styles.balanceLabel}>Available Balance</Text>
//               <Text style={styles.balanceAmount}>
//                 {data.balance|| "0.00"}
//                 {/* ₹{parseFloat(data.balance)?.toFixed(2) || "0.00"} */}
//               </Text>
//             </View>
//             <Icon
//               name="wallet-outline"
//               size={screenWidth * 0.12}
//               color={THEME_COLORS.accentBlue}
//               style={styles.balanceIconStyle}
//             />
//           </View>
//         )}
//         {/* Today's Consumption Card (formerly Live Readings) */}
//         {visibleDashboardCards.has("MeterStatus") && (
//           // <View style={styles.card}>
//           //   <View
//           //     style={{
//           //       display: "flex",
//           //       flexDirection: "row",
//           //       justifyContent: "space-between",
//           //     }}
//           //   >
//           //     <Text style={styles.cardTitle}>Meter Status</Text>
//           //     <View
//           //       style={[
//           //         styles.statusBadge,
//           //         {
//           //           backgroundColor: data.MeterStatus
//           //             ? THEME_COLORS.positive
//           //             : THEME_COLORS.negative,
//           //         },
//           //       ]}
//           //     >
//           //       <Text style={styles.statusText}>
//           //         {data.MeterStatus ? "ON" : "OFF"}
//           //       </Text>
//           //     </View>
//           //   </View>

//           //   <Text style={styles.cardTitle}>
//           //     Updated On: {formatDate(data.ClosingDateTime)}
//           //   </Text>
//           //   <View style={styles.readingContainer}>
//           //     <View style={styles.readingBox}>
//           //       <Icon
//           //         name="transmission-tower"
//           //         size={32}
//           //         color={THEME_COLORS.accentBlue}
//           //       />
//           //       <Text style={styles.readingLabel}>Grid (kWh)</Text>
//           //       <Text style={styles.readingValue}>
//           //         {gridConsumptionDayToday?.toFixed(2)}
//           //       </Text>
//           //     </View>
//           //     <View style={styles.separator} />
//           //     <View style={styles.readingBox}>
//           //       <Icon name="engine-outline" size={32} color={"#FFA726"} />
//           //       <Text style={styles.readingLabel}>DG (kWh)</Text>
//           //       <Text style={styles.readingValue}>
//           //         {dgConsumptionDayToday?.toFixed(2)}
//           //       </Text>
//           //     </View>
//           //   </View>
//           // </View>
//           <TouchableOpacity 
//             style={styles.card}
//             activeOpacity={0.8}
//             onPress={() => setMeterStatusModalVisible(true)}
//           >
//             <View
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Text style={styles.cardTitle}>Meter Status</Text>
//               <View
//                 style={[
//                   styles.statusBadge,
//                   {
//                     backgroundColor: data.MeterStatus
//                       ? THEME_COLORS.positive
//                       : THEME_COLORS.negative,
//                   },
//                 ]}
//               >
//                 <Text style={styles.statusText}>
//                   {data.MeterStatus ? "ON" : "OFF"}
//                 </Text>
//               </View>
//             </View>

//             <Text style={styles.cardTitle}>
//               Updated On: {formatDate(data.ClosingDateTime)}
//             </Text>
//             <View style={styles.readingContainer}>
//               <View style={styles.readingBox}>
//                 <Icon
//                   name="transmission-tower"
//                   size={32}
//                   color={THEME_COLORS.accentBlue}
//                 />
//                 <Text style={styles.readingLabel}>Grid (kWh)</Text>
//                 <Text style={styles.readingValue}>
//                   {gridConsumptionDayToday?.toFixed(2)}
//                 </Text>
//               </View>
//               <View style={styles.separator} />
//               <View style={styles.readingBox}>
//                 <Icon name="engine-outline" size={32} color={"#FFA726"} />
//                 <Text style={styles.readingLabel}>DG (kWh)</Text>
//                 <Text style={styles.readingValue}>
//                   {dgConsumptionDayToday?.toFixed(2)}
//                 </Text>
//               </View>
//             </View>
//           </TouchableOpacity>
//         )}
//         {/* System Status Card */}
//         {visibleDashboardCards.has("SystemStatus") && (
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>System Status</Text>

//             <View style={styles.statusRow}>
//               <Text style={styles.statusLabel}>DG Status</Text>
//               <View
//                 style={[
//                   styles.statusBadge,
//                   {
//                     backgroundColor: data.MeterStatus
//                       ? THEME_COLORS.accentBlue
//                       : "#FFA726",
//                   },
//                 ]}
//               >
//                 <Text style={styles.statusText}>
//                   {data.MeterStatus ? "OFF" : "ON"}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         )}

//         {/* Consumption Analysis Card */}
//         {visibleDashboardCards.has("ConsumptionAnalysis") && (
//           <View style={styles.card}>
//             <PanGestureHandler
//               onHandlerStateChange={onConsumptionChartSwipeHandlerStateChange}
//               activeOffsetX={[-20, 20]}
//             >
//               <View>
//                 <Text style={styles.cardTitle}>Consumption Analysis</Text>
//                 <View style={styles.chartToggleAndLegendContainer}>
//                   <View style={styles.toggleContainer}>
//                     {["Day", "Month"].map((period) => (
//                       <TouchableOpacity
//                         key={period}
//                         style={[
//                           styles.toggleButton,
//                           timePeriod === period && styles.toggleButtonActive,
//                         ]}
//                         onPress={() => setTimePeriod(period)}
//                       >
//                         <Text
//                           style={[
//                             styles.toggleText,
//                             timePeriod === period && styles.toggleTextActive,
//                           ]}
//                         >
//                           {period}
//                         </Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                   <View style={styles.legendContainer}>
//                     {legendData.map((item, index) => (
//                       <View key={index} style={styles.legendItem}>
//                         <View
//                           style={[
//                             styles.legendColor,
//                             { backgroundColor: item.color },
//                           ]}
//                         />
//                         <Text style={styles.legendText}>{item.label}</Text>
//                       </View>
//                     ))}
//                   </View>
//                 </View>
//                 <View style={styles.chartWrapper}>
//                   <View style={styles.chartOuterContainer}>
//                     {showConsumptionChart ? (
//                       <PieChart
//                         data={chartData}
//                         donut
//                         innerRadius={screenWidth * 0.18}
//                         radius={screenWidth * 0.25}
//                         showGradient
//                         focusOnPress
//                         onPress={handleChartPress}
//                         backgroundColor={THEME_COLORS.cardBackground}
//                         centerLabelComponent={() => (
//                           <View style={styles.chartCenterLabel}>
//                             <Text style={styles.chartValueBig}>
//                               {currentTotalConsumption.toFixed(1)}
//                             </Text>
//                             <Text style={styles.chartUnit}>kWh</Text>
//                             {/* <Text style={styles.chartPercentageSmall}>{currentPercentage.toFixed(0)}% of limit</Text> */}
//                           </View>
//                         )}
//                       />
//                     ) : (
//                       <View style={styles.noDataChartContainer}>
//                         <Icon
//                           name="chart-pie"
//                           size={60}
//                           color={THEME_COLORS.neutralDark}
//                         />
//                         <Text style={styles.noDataText}>
//                           No consumption data.
//                         </Text>
//                       </View>
//                     )}
//                   </View>
//                 </View>
//                 {showConsumptionChart && (
//                   <View style={styles.consumptionDetailsBelowChartContainer}>
//                     <View style={styles.consumptionDetailItem}>
//                       <View
//                         style={[
//                           styles.detailColorBox,
//                           { backgroundColor: THEME_COLORS.accentBlue },
//                         ]}
//                       />
//                       <Text style={styles.detailLabelText}>Grid:</Text>
//                       <Text style={styles.detailValueText}>
//                         {(timePeriod === "Day"
//                           ? gridConsumptionDay
//                           : gridConsumptionBilling
//                         )?.toFixed(1)}{" "}
//                         kWh
//                       </Text>
//                     </View>
//                     <View style={styles.consumptionDetailItem}>
//                       <View
//                         style={[
//                           styles.detailColorBox,
//                           { backgroundColor: "#FFA726" },
//                         ]}
//                       />
//                       <Text style={styles.detailLabelText}>DG:</Text>
//                       <Text style={styles.detailValueText}>
//                         {(timePeriod === "Day"
//                           ? dgConsumptionDay
//                           : dgConsumptionBilling
//                         )?.toFixed(1)}{" "}
//                         kWh
//                       </Text>
//                     </View>
//                   </View>
//                 )}
//               </View>
//             </PanGestureHandler>
//           </View>
//         )}

//         {/* Prediction Card */}
//         {/* <View style={styles.card}>
//             <Text style={styles.cardTitle}>Monthly Forecast</Text>
//             <View style={styles.predictionRow}>
//               <View style={styles.predictionItem}><Icon name="lightning-bolt-outline" size={28} color={THEME_COLORS.accentBlue} /><Text style={styles.predictionLabel}>Projected Units</Text><Text style={styles.predictionValue}>{monthTotal.toFixed(1)} kWh</Text></View>
//               <View style={styles.separatorVertical} />
//               <View style={styles.predictionItem}><Icon name="currency-inr" size={28} 
//               //color={THEME_COLORS.accentBlue}
//               color={"#FFA726"}
//                /><Text style={styles.predictionLabel}>Estimated Bill</Text><Text style={styles.predictionValue}>₹{parseFloat(data.TotalCharges)?.toFixed(2) || "0.00"}</Text></View>
//             </View>
//         </View> */}

//         {/* Deductions Card */}
//         {(visibleDashboardCards.has("ChargeOverview") ||
//           visibleDashboardCards.has("Sanctionload")) && (
//           <View style={styles.card}>
//             <PanGestureHandler
//               onHandlerStateChange={onChargesSwipeHandlerStateChange}
//               activeOffsetX={[-20, 20]}
//             >
//               <View>
//                 <View style={styles.deductionsHeaderContainer}>
//                   <Text style={styles.cardTitle}>Charges Overview (₹)</Text>
//                   <View style={styles.toggleContainer}>
//                     {["Day", "Month"].map((period) => (
//                       <TouchableOpacity
//                         key={period}
//                         style={[
//                           styles.toggleButtonSmall,
//                           chargesTimePeriod === period &&
//                             styles.toggleButtonActiveSmall,
//                         ]}
//                         onPress={() => setChargesTimePeriod(period)}
//                       >
//                         <Text
//                           style={[
//                             styles.toggleTextSmall,
//                             chargesTimePeriod === period &&
//                               styles.toggleTextActiveSmall,
//                           ]}
//                         >
//                           {period}
//                         </Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 </View>
//                 {chargesTimePeriod === "Day" ? (
//                   <>
//                     <Text style={styles.subTitle}>Today's Charges</Text>
//                     {renderDeductionRow("Grid", data.GridChargesToday)}
//                     {renderDeductionRow("DG", data.DgChargeTodays)}
//                     {renderDeductionRow("Fixed", data.FixedChargesToday)}
//                     <View style={styles.totalRow}>
//                       {renderDeductionRow(
//                         "Total Today",
//                         data.TotalChargesToday,
//                         true
//                       )}
//                     </View>
//                   </>
//                 ) : (
//                   <>
//                     <Text style={styles.subTitle}>Current Billing Cycle</Text>
//                     {renderDeductionRow("Grid", data.GridCharges)}
//                     {renderDeductionRow("DG", data.DgCharges)}
//                     {renderDeductionRow("Fixed", data.FixedCharges)}
//                     <View style={styles.totalRow}>
//                       {renderDeductionRow(
//                         "Total This Cycle",
//                         data.TotalCharges,
//                         true
//                       )}
//                     </View>
//                   </>
//                 )}
//                 <View style={styles.divider} />
//                 <Text style={styles.subTitle}>Sanctioned Load (kW)</Text>
//                 {renderDeductionRow("Grid", data.SanctionLoad, false, "kW")}
//                 {renderDeductionRow("DG", data.SanctionLoadDG, false, "kW")}
//               </View>
//             </PanGestureHandler>
//           </View>
//         )}

//         <View style={{ height: 40 }} />
//       </ScrollView>

//         {/* <Modal
//         animationType="fade"
//         transparent={true}
//         visible={isMeterStatusModalVisible}
//         onRequestClose={() => setMeterStatusModalVisible(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setMeterStatusModalVisible(false)}
//         >
//           <TouchableOpacity
//             style={styles.modalContainer}
//             activeOpacity={1}
//             onPress={() => {}} // Prevents modal from closing when tapping inside
//           >
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Meter Actions</Text>
//               <TouchableOpacity
//                 onPress={() => setMeterStatusModalVisible(false)}
//                 style={styles.modalCloseButton}
//               >
//                 <Icon name="close" size={24} color={THEME_COLORS.iconColor} />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.modalContent}>
//               <Icon name="restart-alert" size={50} color={THEME_COLORS.negative} />
//               <Text style={styles.modalActionText}>
//                 Are you sure you want to reset the meter ? This action cannot be undone.
//               </Text>
//               <TouchableOpacity 
//                 style={[styles.button, styles.modalActionButton]} 
//                 onPress={handleResetReading}
//                 disabled={isResetting}
//               >
//                 {isResetting ? (
//                   <ActivityIndicator color={THEME_COLORS.textPrimary} />
//                 ) : (
//                   <Text style={styles.buttonText}>Reset </Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal> */}
//        <Modal
//         animationType="fade"
//         transparent={true}
//         visible={isMeterStatusModalVisible}
//         onRequestClose={() => setMeterStatusModalVisible(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setMeterStatusModalVisible(false)}
//         >
//           <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={() => {}}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Meter Actions</Text>
//               <TouchableOpacity onPress={() => setMeterStatusModalVisible(false)} style={styles.modalCloseButton}>
//                 <Icon name="close" size={24} color="white" />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.modalContent}>
//               <Icon name="cogs" size={50} color="white" />
//               <Text style={styles.modalActionText}>
//                 Choose an action for this meter. These actions cannot be undone.
//               </Text>
              
//               {/* Container for the two buttons */}
//               <View style={styles.modalButtonContainer}>
//                 {/* Button 1: Reset */}
//                 <TouchableOpacity 
//                   style={[styles.button, styles.modalButton, styles.modalResetButton]} 
//                   onPress={handleResetReading}
//                   // Disable if either action is in progress
//                   disabled={isResetting || isTogglingMeter}
//                 >
//                   {isResetting ? (
//                     <ActivityIndicator color={"#FFFFFF"} />
//                   ) : (
//                     <Text style={styles.buttonText}>Reset</Text>
//                   )}
//                 </TouchableOpacity>

//                 {/* Button 2: Meter Off */}
//                 <TouchableOpacity 
//                   style={[styles.button, styles.modalButton, styles.modalMeterOffButton]} 
//                   onPress={handleMeterOff}
//                   // Disable if either action is in progress
//                   disabled={isResetting || isTogglingMeter}
//                 >
//                   {isTogglingMeter ? (
//                     <ActivityIndicator color={"#FFFFFF"} />
//                   ) : (
//                     <Text style={styles.buttonText}>Meter Off</Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>

//       {/* Chart Detail Modal */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={isChartModalVisible}
//         onRequestClose={closeModal}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={closeModal}
//         >
//           <TouchableOpacity
//             style={styles.modalContainer}
//             activeOpacity={1}
//             onPress={() => {}}
//           >
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>
//                 {timePeriod} Consumption Details
//                 {selectedChartSegment ? ` (${selectedChartSegment.label})` : ""}
//               </Text>
//               <TouchableOpacity
//                 onPress={closeModal}
//                 style={styles.modalCloseButton}
//               >
//                 <Icon name="close" size={24} color={THEME_COLORS.iconColor} />
//               </TouchableOpacity>
//             </View>
//             <View style={styles.modalContent}>
//               {chartData.length > 0 ? (
//                 <PieChart
//                   data={chartData.map((segment) => ({
//                     ...segment,
//                     focused:
//                       selectedChartSegment &&
//                       segment.label === selectedChartSegment.label,
//                     text: `${segment.label}\n${segment.value.toFixed(1)} kWh`,
//                   }))}
//                   donut
//                   innerRadius={screenWidth * 0.22}
//                   radius={screenWidth * 0.32}
//                   showGradient
//                   backgroundColor={THEME_COLORS.cardBackground}
//                   centerLabelComponent={() => (
//                     <View style={styles.chartCenterLabel}>
//                       <Text style={styles.chartValueBig}>
//                         {selectedChartSegment
//                           ? selectedChartSegment.value.toFixed(1)
//                           : currentTotalConsumption.toFixed(1)}
//                       </Text>
//                       <Text style={styles.chartUnit}>kWh</Text>
//                       {selectedChartSegment && (
//                         <Text style={styles.chartPercentageSmall}>
//                           {selectedChartSegment.label}
//                         </Text>
//                       )}
//                     </View>
//                   )}
//                   showText
//                   textColor={THEME_COLORS.textPrimary}
//                   textSize={screenWidth * 0.028}
//                   textBackgroundColor={THEME_COLORS.neutralDark}
//                   textBackgroundRadius={4}
//                 />
//               ) : (
//                 <Text style={styles.noDataText}>
//                   No detailed consumption data.
//                 </Text>
//               )}
//               {selectedChartSegment && (
//                 <View style={styles.modalDetails}>
//                   <Text style={styles.modalDetailText}>
//                     Source: {selectedChartSegment.label}
//                   </Text>
//                   <Text style={styles.modalDetailText}>
//                     Consumption: {selectedChartSegment.value.toFixed(2)} kWh
//                   </Text>
//                   <Text style={styles.modalDetailText}>
//                     Percentage of Total ({timePeriod}):{" "}
//                     {currentTotalConsumption > 0
//                       ? (
//                           (selectedChartSegment.value /
//                             currentTotalConsumption) *
//                           100
//                         ).toFixed(1)
//                       : 0}
//                     %
//                   </Text>
//                 </View>
//               )}
//               <View style={styles.modalOverallSummary}>
//                 <Text style={styles.modalSummaryTitle}>
//                   Overall {timePeriod} Summary
//                 </Text>
//                 <Text style={styles.modalSummaryText}>
//                   Total Consumption: {currentTotalConsumption.toFixed(2)} kWh
//                 </Text>
//                 {/* <Text style={styles.modalSummaryText}>Usage Target/Limit: {currentLimit} kWh</Text> */}
//                 {/* <Text style={styles.modalSummaryText}>Percentage of Target Used: {currentPercentage.toFixed(1)}%</Text> */}
//               </View>
//             </View>
//           </TouchableOpacity>
//         </TouchableOpacity>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const renderDeductionRow = (label, value, isTotal = false, unit = "") => (
//   <View style={styles.deductionRow}>
//     <Text style={isTotal ? styles.deductionLabelTotal : styles.deductionLabel}>
//       {label}
//     </Text>
//     <Text style={isTotal ? styles.deductionValueTotal : styles.deductionValue}>
//       {value !== undefined && value !== null
//         ? parseFloat(value)?.toFixed(isTotal ? 2 : 1)
//         : "0.00"}{" "}
//       {unit}
//     </Text>
//   </View>
// );

// // --- Styles ---
// // (Your existing styles object should be here. Ensure it's complete.)
// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: THEME_COLORS.background , paddingTop : 10 , paddingBottom : 10},
//   container: { flex: 1, backgroundColor: THEME_COLORS.background },
//   centeredContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: THEME_COLORS.background,
//   },
//   infoText: {
//     marginTop: 15,
//     fontSize: 18,
//     color: THEME_COLORS.textSecondary,
//     textAlign: "center",
//   },
//   errorText: {
//     marginTop: 15,
//     fontSize: 18,
//     color: THEME_COLORS.negative,
//     textAlign: "center",
//     fontWeight: "500",
//   },
//   button: {
//     backgroundColor: THEME_COLORS.accentBlue,
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     marginTop: 20,
//     shadowColor: THEME_COLORS.accentBlueGlow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   logoutButton: { backgroundColor: THEME_COLORS.negative },
//   buttonText: {
//     color: THEME_COLORS.textPrimary,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingTop: 15,
//     paddingBottom: 15,
//     backgroundColor: THEME_COLORS.background,
//   },
//   iconButton: { padding: 5 },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: THEME_COLORS.textPrimary,
//   },
//   welcomeCard: {
//     backgroundColor: THEME_COLORS.accentBlue,
//     shadowColor: THEME_COLORS.accentBlueGlow,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.7,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   dashboard: {
//     fontSize: 13,
//     color: "rgba(255,255,255,0.7)",
//     fontWeight: "600",
//     marginBottom: 4,
//   },
//   greetingText: {
//     fontSize: 22,
//     color: THEME_COLORS.textPrimary,
//     fontWeight: "600",
//   },
//   updateText: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 6 },
//   card: {
//     backgroundColor: THEME_COLORS.cardBackground,
//     borderRadius: 16,
//     padding: 18,
//     marginHorizontal: 16,
//     marginBottom: 16,
//     shadowColor: THEME_COLORS.shadowDark,
//     shadowOffset: { width: 3, height: 3 },
//     shadowOpacity: 0.7,
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   cardTitle: {
//     fontSize: 17,
//     fontWeight: "600",
//     color: THEME_COLORS.textPrimary,
//     marginBottom: 16,
//   },
//   balanceCard: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   balanceTextContainer: { flex: 1 },
//   balanceLabel: {
//     fontSize: 16,
//     color: THEME_COLORS.textSecondary,
//     marginBottom: 4,
//   },
//   balanceAmount: {
//     fontSize: screenWidth * 0.04,
//     fontWeight: "bold",
//     color: THEME_COLORS.textPrimary,
//   },
//   balanceIconStyle: {
//     /* marginLeft: 15, // Not needed with space-between */
//   },
//   readingContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//   },
//   readingBox: { flex: 1, alignItems: "center", gap: 6 },
//   readingLabel: { fontSize: 13, color: THEME_COLORS.textSecondary },
//   readingValue: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: THEME_COLORS.textPrimary,
//   },
//   separator: {
//     width: 1,
//     height: "60%",
//     backgroundColor: THEME_COLORS.neutralDark,
//     alignSelf: "center",
//   },
//   statusRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 10,
//   },
//   statusLabel: { fontSize: 15, color: THEME_COLORS.textSecondary },
//   statusBadge: {
//     paddingVertical: 7,
//     paddingHorizontal: 14,
//     borderRadius: 10,
//     minWidth: 40,
//     alignItems: "center",
//     height: 30,
//   },
//   statusText: {
//     fontWeight: "600",
//     fontSize: 13,
//     color: THEME_COLORS.textPrimary,
//   },
//   chartToggleAndLegendContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   toggleContainer: {
//     flexDirection: "row",
//     backgroundColor: THEME_COLORS.background,
//     borderRadius: 20,
//     padding: 3,
//   },
//   toggleButton: {
//     paddingVertical: 7,
//     paddingHorizontal: 14,
//     borderRadius: 18,
//     marginHorizontal: 1,
//   },
//   toggleButtonActive: {
//     backgroundColor: THEME_COLORS.accentBlue,
//     shadowColor: THEME_COLORS.accentBlueGlow,
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   toggleText: {
//     fontSize: 13,
//     color: THEME_COLORS.textSecondary,
//     fontWeight: "600",
//   },
//   toggleTextActive: { color: THEME_COLORS.textPrimary, fontWeight: "bold" },
//   legendContainer: { flexDirection: "row" },
//   legendItem: { flexDirection: "row", alignItems: "center", marginLeft: 10 },
//   legendColor: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
//   legendText: {
//     fontSize: 12,
//     color: THEME_COLORS.textSecondary,
//     fontWeight: "500",
//   },
//   chartWrapper: { alignItems: "center", marginVertical: 10 },
//   chartOuterContainer: {
//     /* No specific styles needed here unless for padding/background */
//   },
//   chartCenterLabel: {
//     justifyContent: "center",
//     alignItems: "center",
//     textAlign: "center",
//   },
//   chartValueBig: {
//     fontSize: screenWidth * 0.07,
//     color: THEME_COLORS.textPrimary,
//     fontWeight: "bold",
//   },
//   chartUnit: {
//     fontSize: screenWidth * 0.035,
//     color: THEME_COLORS.textSecondary,
//     fontWeight: "500",
//     marginTop: -5,
//   },
//   chartPercentageSmall: {
//     fontSize: screenWidth * 0.03,
//     color: THEME_COLORS.textSecondary,
//     marginTop: 3,
//   },
//   noDataChartContainer: {
//     height: screenWidth * 0.5,
//     width: screenWidth * 0.5,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   noDataText: {
//     fontSize: 13,
//     color: THEME_COLORS.textSecondary,
//     textAlign: "center",
//     marginTop: 10,
//     paddingHorizontal: 20,
//   },
//   consumptionDetailsBelowChartContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     marginTop: 15,
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     borderTopWidth: 1,
//     borderTopColor: THEME_COLORS.neutralDark,
//   },
//   consumptionDetailItem: { flexDirection: "row", alignItems: "center" },
//   detailColorBox: { width: 12, height: 12, borderRadius: 3, marginRight: 8 },
//   detailLabelText: {
//     fontSize: 13,
//     color: THEME_COLORS.textSecondary,
//     fontWeight: "500",
//     marginRight: 5,
//   },
//   detailValueText: {
//     fontSize: 14,
//     color: THEME_COLORS.textPrimary,
//     fontWeight: "600",
//   },
//   predictionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: THEME_COLORS.textPrimary,
//     marginBottom: 15,
//   },
//   predictionRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//   },
//   predictionItem: {
//     alignItems: "center",
//     gap: 8,
//     flex: 1,
//     paddingVertical: 10,
//   },
//   predictionLabel: {
//     fontSize: 13,
//     color: THEME_COLORS.textSecondary,
//     textAlign: "center",
//   },
//   predictionValue: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: THEME_COLORS.textPrimary,
//   },
//   separatorVertical: {
//     width: 1,
//     height: "80%",
//     backgroundColor: THEME_COLORS.neutralDark,
//     alignSelf: "center",
//   },
//   deductionsHeaderContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   toggleButtonSmall: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 16,
//     marginHorizontal: 1,
//   },
//   toggleButtonActiveSmall: { backgroundColor: THEME_COLORS.accentBlue },
//   toggleTextSmall: {
//     fontSize: 12,
//     color: THEME_COLORS.textSecondary,
//     fontWeight: "500",
//   },
//   toggleTextActiveSmall: { color: THEME_COLORS.textPrimary, fontWeight: "600" },
//   subTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: THEME_COLORS.textPrimary,
//     marginTop: 12,
//     marginBottom: 8,
//   },
//   deductionRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 7,
//   },
//   deductionLabel: { fontSize: 14, color: THEME_COLORS.textSecondary },
//   deductionValue: {
//     fontSize: 14,
//     color: THEME_COLORS.textPrimary,
//     fontWeight: "500",
//   },
//   totalRow: {
//     borderTopWidth: 1,
//     borderTopColor: THEME_COLORS.neutralDark,
//     marginTop: 6,
//     paddingTop: 6,
//   },
//   deductionLabelTotal: {
//     fontSize: 15,
//     color: THEME_COLORS.textPrimary,
//     fontWeight: "bold",
//   },
//   deductionValueTotal: {
//     fontSize: 15,
//     color: THEME_COLORS.textPrimary,
//     fontWeight: "bold",
//   },
//   divider: {
//     height: 1,
//     backgroundColor: THEME_COLORS.neutralDark,
//     marginVertical: 12,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: THEME_COLORS.modalOverlay,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContainer: {
//     width: screenWidth * 0.9,
//     maxHeight: screenHeight * 0.8,
//     backgroundColor: THEME_COLORS.cardBackground,
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: THEME_COLORS.shadowDark,
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.5,
//     shadowRadius: 15,
//     elevation: 20,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: THEME_COLORS.neutralDark,
//     paddingBottom: 12,
//     marginBottom: 15,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: THEME_COLORS.textPrimary,
//     flex: 1,
//   },
//   modalCloseButton: { padding: 8 },
//   modalContent: { alignItems: "center" },
//   modalDetails: { marginTop: 20, width: "100%", paddingHorizontal: 10 },
//   modalDetailText: {
//     fontSize: 14,
//     color: THEME_COLORS.textPrimary,
//     marginBottom: 8,
//     lineHeight: 20,
//   },
//    modalActionText: {
//     fontSize: 15,
//     color: "white",
//     textAlign: 'center',
//     marginVertical: 20,
//     lineHeight: 22,
//     paddingHorizontal: 10,
//   },
//    modalActionButton: {
//     width: '90%',
//     alignItems: 'center',
//     backgroundColor: THEME_COLORS.negative, // Red for destructive action
//     shadowColor: THEME_COLORS.negative,
//   },
//   modalOverallSummary: {
//     marginTop: 15,
//     paddingTop: 15,
//     borderTopWidth: 1,
//     borderTopColor: THEME_COLORS.neutralDark,
//     width: "100%",
//   },
//   modalSummaryTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: THEME_COLORS.textPrimary,
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   modalSummaryText: {
//     fontSize: 14,
//     color: THEME_COLORS.textSecondary,
//     marginBottom: 5,
//     textAlign: "center",
//   },
//    modalButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginTop: 10,
//   },
//   // General style for modal buttons to set their size
//   modalButton: {
//     width: '48%', // Each button takes up slightly less than half the space
//     marginVertical: 0, // Override default margin from global button style
//   },
//   // Specific style for the reset button (destructive)
//   modalResetButton: {
//     backgroundColor: THEME_COLORS.negative,
//   },
//   // Specific style for the meter off button
//   modalMeterOffButton: {
//     backgroundColor: '#8B0000', // A different, darker red for distinction
//   },
// });

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerActions, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { PieChart } from "react-native-gifted-charts";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { apiUrl } from "../../constant/utils";
import { useAuth } from "../../context/AuthContext";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// --- Theme Colors ---
const DARK_THEME_COLORS = {
  background: "#0A0F1E",
  cardBackground: "#1A1F2C",
  accentBlue: "#00A3FF",
  accentBlueGlow: "rgba(0, 163, 255, 0.5)",
  textPrimary: "#E0E7FF",
  textSecondary: "#8A9CB0",
  iconColor: "#C0D0E0",
  shadowLight: "rgba(40, 50, 70, 0.7)",
  shadowDark: "rgba(0, 0, 0, 0.6)",
  positive: "#34D399",
  negative: "#F87171",
  neutralDark: "#303A52",
  modalOverlay: "rgba(0, 0, 0, 0.8)",
  divider: "#303A52",
};

const LIGHT_THEME_COLORS = {
  background: "#F8FAFF",
  cardBackground: "#FFFFFF",
  accentBlue: "#2D68FF",
  accentBlueGlow: "rgba(45, 104, 255, 0.2)",
  textPrimary: "#1E293B",
  textSecondary: "#64748B",
  iconColor: "#475569",
  shadowLight: "rgba(148, 163, 184, 0.15)",
  shadowDark: "rgba(0, 0, 0, 0.1)",
  positive: "#10B981",
  negative: "#EF4444",
  neutralDark: "#E2E8F0",
  modalOverlay: "rgba(255, 255, 255, 0.9)",
  divider: "#E2E8F0",
  gradientStart: "#F1F5F9",
  gradientEnd: "#E0F2FE",
  chartGrid: "#2D68FF",
  chartDG: "#FF8A00",
};

export default function Home() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState("Day");
  const [chargesTimePeriod, setChargesTimePeriod] = useState("Day");
  const [refreshing, setRefreshing] = useState(false);

  const [isChartModalVisible, setChartModalVisible] = useState(false);
  const [selectedChartSegment, setSelectedChartSegment] = useState(null);
  const [visibleDashboardCards, setVisibleDashboardCards] = useState(new Set());

  const [isMeterStatusModalVisible, setMeterStatusModalVisible] = useState(false);
  const [isResetting, setIsResetting] = useState(false); 
  const [isTogglingMeter, setIsTogglingMeter] = useState(false); 

  const [focusedPieIndex, setFocusedPieIndex] = useState(-1);
  
  // Theme state
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const currentTheme = isDarkTheme ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDarkTheme(savedTheme === 'dark');
        }
      } catch (e) {
        console.error("Failed to load theme from storage", e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (e) {
      console.error("Failed to save theme to storage", e);
    }
  };

  const fetchData = useCallback(async () => {
    if (!user) {
      setError("User not logged in. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const response = await axios.post(
        `${apiUrl}/WebServicesFinal/Android/MeterDataSingle`,
        user
      );
      if (
        response.data.ApiStatus === "TRUE" &&
        response.data.Data &&
        response.data.Data[0]
      ) {
        setData(response.data.Data[0]);
      } else {
        setError(response.data.ApiMessage || "Failed to retrieve data.");
        setData(null);
      }
    } catch (err) {
      setError(
        "An error occurred. Please check your connection and try again."
      );
      console.error("Error fetching data:", err);
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardConfig = async () => {
      try {
        const response = await axios.post(
          "https://www.pesonline.in/webconfig/Android/AndroidAppMenuItem",
          {
            siteId: user?.SiteID?.toUpperCase(),
            vendorID: user?.VendorID,
          }
        );

        if (response.data.ApiMessage === "SUCCESS") {
          const dashboardTitles = response.data.Data.filter(
            (item) => item.ParentMenuId === 1
          ).map((item) => item.Title);

          setVisibleDashboardCards(new Set(dashboardTitles));
        } else {
          console.error(
            "API Error fetching dashboard config:",
            response.data.ApiMessage
          );
          setVisibleDashboardCards(
            new Set([
              "DashBoard",
              "AvaliableBalance",
              "MeterStatus",
              "SystemStatus",
              "ConsumptionAnalysis",
              "ChargeOverview",
              "Sanctionload",
            ])
          );
        }
      } catch (error) {
        console.error("Axios Error fetching dashboard config:", error);
        setVisibleDashboardCards(
          new Set([
            "DashBoard",
            "AvaliableBalance",
            "MeterStatus",
            "SystemStatus",
            "ConsumptionAnalysis",
            "ChargeOverview",
            "Sanctionload",
          ])
        );
      }
    };

    fetchDashboardConfig();
  }, [user]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
  }, [fetchData]);

  const handleResetReading = async () => {
    if (!user) {
      Alert.alert("Error", "User information is missing. Cannot proceed.");
      return;
    }
    setIsResetting(true);
    try {
      const response = await axios.post(
        `https://www.pesonline.in/WebServicesFinal/Android/MeterOn`,
        user 
      );

      if (response.data.ApiMessage === "SUCCESS") {
        Alert.alert("Success", response.data.ApiMessage || "Meter reading has been reset successfully.");
        setMeterStatusModalVisible(false);
        onRefresh();
      } else {
        Alert.alert("Reset Failed", response.data.ApiMessage || "Could not reset meter reading.");
      }
    } catch (err) {
      console.error("Error resetting meter reading:", err);
      Alert.alert("Error", "An error occurred while trying to reset the reading. Please try again.");
    } finally {
      setIsResetting(false);
    }         
  };
                                                
  const handleMeterOff = async () => {
    if (!user) { Alert.alert("Error", "User information is missing."); return; }
    setIsTogglingMeter(true);
    try {
      const response = await axios.post(`https://www.pesonline.in/WebServicesFinal/Android/MeterOFF`, user);

      if (response.data.ApiMessage === "SUCCESS") {
        Alert.alert("Success", response.data.ApiMessage || "Meter has been turned off successfully.");
        setMeterStatusModalVisible(false);
        onRefresh();
      } else {
        Alert.alert("Action Failed", response.data.ApiMessage || "Could not turn the meter off.");
      }
    } catch (err) {
      console.error("Error turning meter off:", err);
      Alert.alert("Error", "An error occurred while performing this action.");
    } finally {
      setIsTogglingMeter(false);    
    }
  };

  const dgConsumptionDayToday = parseFloat(data?.DgClosingReading) || 0;
  const gridConsumptionDayToday = parseFloat(data?.GridClosingReading) || 0;
  const dgConsumptionDay = parseFloat(data?.DgConsumptionDay) || 0;
  const gridConsumptionDay = parseFloat(data?.GridConsumptionDay) || 0;
  const dgConsumptionBilling = parseFloat(data?.DgConsumptionFromBilling) || 0;
  const gridConsumptionBilling =
    parseFloat(data?.GridConsumptionFromBilling) || 0;

  const todayTotal = dgConsumptionDay + gridConsumptionDay;
  const monthTotal = dgConsumptionBilling + gridConsumptionBilling;

  const todayLimit = 10;
  const monthLimit = 500;

  const todayPercentage =
    todayLimit > 0 && todayTotal > 0 ? (todayTotal / todayLimit) * 100 : 0;
  const monthPercentage =
    monthLimit > 0 && monthTotal > 0 ? (monthTotal / monthLimit) * 100 : 0;

  const chartData = React.useMemo(() => {
    const dailyGridVal = gridConsumptionDay;
    const dailyDGVal = dgConsumptionDay;
    const monthlyGridVal = gridConsumptionBilling;
    const monthlyDGVal = dgConsumptionBilling;
    let currentData = [];

    if (timePeriod === "Day") {
      if (dailyGridVal > 0)
        currentData.push({
          label: "Grid",
          value: dailyGridVal,
          color: currentTheme.accentBlue,
          gradientCenterColor: currentTheme.accentBlue,
          focused: focusedPieIndex === currentData.length,
        });
      if (dailyDGVal > 0)
        currentData.push({
          label: "DG",
          value: dailyDGVal,
          color: currentTheme.chartDG,
          gradientCenterColor: currentTheme.chartDG,
          focused: focusedPieIndex === currentData.length,
        });
    } else {
      if (monthlyGridVal > 0)
        currentData.push({
          label: "Grid",
          value: monthlyGridVal,
          color: currentTheme.accentBlue,
          gradientCenterColor: currentTheme.accentBlue,
          focused: focusedPieIndex === currentData.length,
        });
      if (monthlyDGVal > 0)
        currentData.push({
          label: "DG",
          value: monthlyDGVal,
          color: currentTheme.chartDG,
          gradientCenterColor: currentTheme.chartDG,
          focused: focusedPieIndex === currentData.length,
        });
    }
    return currentData;
  }, [
    timePeriod,
    focusedPieIndex,
    gridConsumptionDay,
    dgConsumptionDay,
    gridConsumptionBilling,
    dgConsumptionBilling,
    currentTheme
  ]);

  const legendData = React.useMemo(
    () =>
      timePeriod === "Day"
        ? [
            {
              label: "Grid",
              value: gridConsumptionDay,
              color: currentTheme.accentBlue,
            },
            { label: "DG", value: dgConsumptionDay, color: currentTheme.chartDG },
          ]
        : [
            {
              label: "Grid",
              value: gridConsumptionBilling,
              color: currentTheme.accentBlue,
            },
            { label: "DG", value: dgConsumptionBilling, color: currentTheme.chartDG },
          ],
    [
      gridConsumptionDay,
      dgConsumptionDay,
      gridConsumptionBilling,
      dgConsumptionBilling,
      timePeriod,
      currentTheme
    ]
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const onConsumptionChartSwipeHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY } = event.nativeEvent;
      if (Math.abs(translationX) > Math.abs(translationY) + 20) {
        if (translationX > 50 && timePeriod !== "Month") setTimePeriod("Month");
        else if (translationX < -50 && timePeriod !== "Day")
          setTimePeriod("Day");
      }
    }
  };

  const onChargesSwipeHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY } = event.nativeEvent;
      if (Math.abs(translationX) > Math.abs(translationY) + 20) {
        if (translationX > 50 && chargesTimePeriod !== "Month")
          setChargesTimePeriod("Month");
        else if (translationX < -50 && chargesTimePeriod !== "Day")
          setChargesTimePeriod("Day");
      }
    }
  };

  const handleChartPress = (item, index) => {
    if (!item || item.value <= 0) return;
    setSelectedChartSegment(item);
    setFocusedPieIndex(index);
    setChartModalVisible(true);
  };

  const closeModal = () => {
    setChartModalVisible(false);
    setSelectedChartSegment(null);
    setFocusedPieIndex(-1);
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.centeredContainer, {backgroundColor: currentTheme.background}]}>
        <ActivityIndicator size="large" color={currentTheme.accentBlue} />
        <Text style={[styles.infoText, {color: currentTheme.textSecondary}]}>Loading Dashboard...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.centeredContainer, {backgroundColor: currentTheme.background}]}>
        <Icon
          name="alert-circle-outline"
          size={60}
          color={currentTheme.negative}
        />
        <Text style={[styles.errorText, {color: currentTheme.negative}]}>{error}</Text>
        <TouchableOpacity style={[styles.button, {backgroundColor: currentTheme.accentBlue}]} onPress={fetchData}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.logoutButton, {backgroundColor: currentTheme.negative}]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (!data) {
    return (
      <ScrollView
        contentContainerStyle={[styles.centeredContainer, {backgroundColor: currentTheme.background}]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={currentTheme.accentBlue}
            colors={[currentTheme.accentBlue]}
          />
        }
      >
        <Icon
          name="information-outline"
          size={60}
          color={currentTheme.textSecondary}
        />
        <Text style={[styles.infoText, {color: currentTheme.textSecondary}]}>No data available. Pull to refresh.</Text>
      </ScrollView>
    );
  }

  const currentTotalConsumption =
    timePeriod === "Day" ? todayTotal : monthTotal;
  const currentLimit = timePeriod === "Day" ? todayLimit : monthLimit;
  const currentPercentage =
    timePeriod === "Day" ? todayPercentage : monthPercentage;
  const showConsumptionChart = chartData.length > 0;

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: currentTheme.background}]}>
      <StatusBar
        barStyle={isDarkTheme ? "light-content" : "dark-content"}
        backgroundColor={currentTheme.background}
      />
      
      <ScrollView
        style={[styles.container, {backgroundColor: currentTheme.background}]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={currentTheme.accentBlue}
            colors={[currentTheme.accentBlue]}
          />
        }
      >
        {/* Header */}
        <View style={[styles.header, {backgroundColor: currentTheme.background}]}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={styles.iconButton}
          >
            <Icon name="menu" size={30} color={currentTheme.iconColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, {color: currentTheme.textPrimary}]}>PES Online</Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => router.replace("/Notification")}
              style={[styles.iconButton, { marginRight: 15 }]}
            >
              <Icon
                name="bell-outline"
                size={26}
                color={currentTheme.iconColor}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTheme} style={[styles.iconButton, { marginRight: 15 }]}>
              <Icon
                name={isDarkTheme ? "weather-sunny" : "weather-night"}
                size={26}
                color={currentTheme.iconColor}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
              <Icon
                name="logout-variant"
                size={28}
                color={currentTheme.iconColor}
              />
            </TouchableOpacity>
          </View>
        </View>

        {visibleDashboardCards.has("DashBoard") && (
          <View style={[styles.card, styles.welcomeCard, {backgroundColor: currentTheme.accentBlue}]}>
            <Text style={styles.dashboard}>Dashboard</Text>
            <Text style={styles.greetingText}>
              Hello, {data.MeterName || "User"}!
            </Text>
          </View>
        )}

        {/* Balance Card */}
        {visibleDashboardCards.has("AvaliableBalance") && (
          <View style={[styles.card, styles.balanceCard, {backgroundColor: currentTheme.cardBackground}]}>
            <View style={styles.balanceTextContainer}>
              <Text style={[styles.balanceLabel, {color: currentTheme.textSecondary}]}>Available Balance</Text>
              <Text style={[styles.balanceAmount, {color: currentTheme.textPrimary}]}>
                {data.balance|| "0.00"}
              </Text>
            </View>
            <Icon
              name="wallet-outline"
              size={screenWidth * 0.12}
              color={currentTheme.accentBlue}
              style={styles.balanceIconStyle}
            />
          </View>
        )}
        
        {/* Meter Status Card */}
        {visibleDashboardCards.has("MeterStatus") && (
          <TouchableOpacity 
            style={[styles.card, {backgroundColor: currentTheme.cardBackground}]}
            activeOpacity={0.8}
            //onPress={() => setMeterStatusModalVisible(true)}
             onPress={() => {
      // Add an additional check here for clarity, though the outer `&&` should prevent this if the card isn't visible
      if (visibleDashboardCards.has("MeterAction")) {
        setMeterStatusModalVisible(true);
      }
    }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.cardTitle, {color: currentTheme.textPrimary}]}>Meter Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: data.MeterStatus
                      ? currentTheme.positive
                      : currentTheme.negative,
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {data.MeterStatus ? "ON" : "OFF"}
                </Text>
              </View>
            </View>

            <Text style={[styles.cardTitle, {color: currentTheme.textSecondary, fontSize: 14}]}>
              Updated On: {formatDate(data.ClosingDateTime)}
            </Text>
            <View style={styles.readingContainer}>
              <View style={styles.readingBox}>
                <Icon
                  name="transmission-tower"
                  size={32}
                  color={currentTheme.accentBlue}
                />
                <Text style={[styles.readingLabel, {color: currentTheme.textSecondary}]}>Grid (kWh)</Text>
                <Text style={[styles.readingValue, {color: currentTheme.textPrimary}]}>
                  {gridConsumptionDayToday?.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.separator, {backgroundColor: currentTheme.divider}]} />
              <View style={styles.readingBox}>
                <Icon name="engine-outline" size={32} color={currentTheme.chartDG} />
                <Text style={[styles.readingLabel, {color: currentTheme.textSecondary}]}>DG (kWh)</Text>
                <Text style={[styles.readingValue, {color: currentTheme.textPrimary}]}>
                  {dgConsumptionDayToday?.toFixed(2)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        
        {/* System Status Card */}
        {visibleDashboardCards.has("SystemStatus") && (
          <View style={[styles.card, {backgroundColor: currentTheme.cardBackground}]}>
            <Text style={[styles.cardTitle, {color: currentTheme.textPrimary}]}>System Status</Text>

            <View style={styles.statusRow}>
              <Text style={[styles.statusLabel, {color: currentTheme.textSecondary}]}>DG Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: data.MeterStatus
                      ? currentTheme.accentBlue
                      : currentTheme.chartDG,
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {data.MeterStatus ? "OFF" : "ON"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Consumption Analysis Card */}
        {visibleDashboardCards.has("ConsumptionAnalysis") && (
          <View style={[styles.card, {backgroundColor: currentTheme.cardBackground}]}>
            <PanGestureHandler
              onHandlerStateChange={onConsumptionChartSwipeHandlerStateChange}
              activeOffsetX={[-20, 20]}
            >
              <View>
                <Text style={[styles.cardTitle, {color: currentTheme.textPrimary}]}>Consumption Analysis</Text>
                <View style={styles.chartToggleAndLegendContainer}>
                  <View style={[styles.toggleContainer, {backgroundColor: currentTheme.neutralDark}]}>
                    {["Day", "Month"].map((period) => (
                      <TouchableOpacity
                        key={period}
                        style={[
                          styles.toggleButton,
                          timePeriod === period && [styles.toggleButtonActive, {backgroundColor: currentTheme.accentBlue}],
                        ]}
                        onPress={() => setTimePeriod(period)}
                      >
                        <Text
                          style={[
                            styles.toggleText,
                            timePeriod === period && styles.toggleTextActive,
                            {color: timePeriod === period ? currentTheme.textPrimary : currentTheme.textSecondary}
                          ]}
                        >
                          {period}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.legendContainer}>
                    {legendData.map((item, index) => (
                      <View key={index} style={styles.legendItem}>
                        <View
                          style={[
                            styles.legendColor,
                            { backgroundColor: item.color },
                          ]}
                        />
                        <Text style={[styles.legendText, {color: currentTheme.textSecondary}]}>{item.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.chartWrapper}>
                  <View style={styles.chartOuterContainer}>
                    {showConsumptionChart ? (
                      <PieChart
                        data={chartData}
                        donut
                        innerRadius={screenWidth * 0.18}
                        radius={screenWidth * 0.25}
                        showGradient
                        focusOnPress
                        onPress={handleChartPress}
                        backgroundColor={currentTheme.cardBackground}
                        centerLabelComponent={() => (
                          <View style={styles.chartCenterLabel}>
                            <Text style={[styles.chartValueBig, {color: currentTheme.textPrimary}]}>
                              {currentTotalConsumption.toFixed(1)}
                            </Text>
                            <Text style={[styles.chartUnit, {color: currentTheme.textSecondary}]}>kWh</Text>
                          </View>
                        )}
                      />
                    ) : (
                      <View style={styles.noDataChartContainer}>
                        <Icon
                          name="chart-pie"
                          size={60}
                          color={currentTheme.neutralDark}
                        />
                        <Text style={[styles.noDataText, {color: currentTheme.textSecondary}]}>
                          No consumption data.
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                {showConsumptionChart && (
                  <View style={[styles.consumptionDetailsBelowChartContainer, {borderTopColor: currentTheme.divider}]}>
                    <View style={styles.consumptionDetailItem}>
                      <View
                        style={[
                          styles.detailColorBox,
                          { backgroundColor: currentTheme.accentBlue },
                        ]}
                      />
                      <Text style={[styles.detailLabelText, {color: currentTheme.textSecondary}]}>Grid:</Text>
                      <Text style={[styles.detailValueText, {color: currentTheme.textPrimary}]}>
                        {(timePeriod === "Day"
                          ? gridConsumptionDay
                          : gridConsumptionBilling
                        )?.toFixed(1)}{" "}
                        kWh
                      </Text>
                    </View>
                    <View style={styles.consumptionDetailItem}>
                      <View
                        style={[
                          styles.detailColorBox,
                          { backgroundColor: currentTheme.chartDG },
                        ]}
                      />
                      <Text style={[styles.detailLabelText, {color: currentTheme.textSecondary}]}>DG:</Text>
                      <Text style={[styles.detailValueText, {color: currentTheme.textPrimary}]}>
                        {(timePeriod === "Day"
                          ? dgConsumptionDay
                          : dgConsumptionBilling
                        )?.toFixed(1)}{" "}
                        kWh
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </PanGestureHandler>
          </View>
        )}

        {/* Deductions Card */}
        {(visibleDashboardCards.has("ChargeOverview") ||
          visibleDashboardCards.has("Sanctionload")) && (
          <View style={[styles.card, {backgroundColor: currentTheme.cardBackground}]}>
            <PanGestureHandler
              onHandlerStateChange={onChargesSwipeHandlerStateChange}
              activeOffsetX={[-20, 20]}
            >
              <View>
                <View style={styles.deductionsHeaderContainer}>
                  <Text style={[styles.cardTitle, {color: currentTheme.textPrimary}]}>Charges Overview (₹)</Text>
              
                  <View style={[styles.toggleContainer, {backgroundColor: currentTheme.neutralDark}]}>
                    {["Day", "Month"].map((period) => (
                      <TouchableOpacity
                        key={period}
                        style={[
                          styles.toggleButtonSmall,
                          chargesTimePeriod === period &&
                            [styles.toggleButtonActiveSmall, {backgroundColor: currentTheme.accentBlue}],
                        ]}
                        onPress={() => setChargesTimePeriod(period)}
                      >
                        <Text
                          style={[
                            styles.toggleTextSmall,
                            chargesTimePeriod === period && styles.toggleTextActiveSmall,
                            {color: chargesTimePeriod === period ? currentTheme.textPrimary : currentTheme.textSecondary}
                          ]}
                        >
                          {period}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                {chargesTimePeriod === "Day" ? (
                  <>
                    <Text style={[styles.subTitle, {color: currentTheme.textPrimary}]}>Today's Charges</Text>
                    {renderDeductionRow("Grid", data.GridChargesToday, false, "", currentTheme)}
                    {renderDeductionRow("DG", data.DgChargeTodays, false, "", currentTheme)}
                    {renderDeductionRow("Fixed", data.FixedChargesToday, false, "", currentTheme)}
                    <View style={[styles.totalRow, {borderTopColor: currentTheme.divider}]}>
                      {renderDeductionRow(
                        "Total Today",
                        data.TotalChargesToday,
                        true,
                        "",
                        currentTheme
                      )}
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={[styles.subTitle, {color: currentTheme.textPrimary}]}>Current Billing Cycle</Text>
                    {renderDeductionRow("Grid", data.GridCharges, false, "", currentTheme)}
                    {renderDeductionRow("DG", data.DgCharges, false, "", currentTheme)}
                    {renderDeductionRow("Fixed", data.FixedCharges, false, "", currentTheme)}
                    <View style={[styles.totalRow, {borderTopColor: currentTheme.divider}]}>
                      {renderDeductionRow(
                        "Total This Cycle",
                        data.TotalCharges,
                        true,
                        "",
                        currentTheme
                      )}
                    </View>
                  </>
                )}
                <View style={[styles.divider, {backgroundColor: currentTheme.divider}]} />
                <Text style={[styles.subTitle, {color: currentTheme.textPrimary}]}>Sanctioned Load (kW)</Text>
                {renderDeductionRow("Grid", data.SanctionLoad, false, "kW", currentTheme)}
                {renderDeductionRow("DG", data.SanctionLoadDG, false, "kW", currentTheme)}
              </View>
            </PanGestureHandler>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Meter Status Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMeterStatusModalVisible}
        onRequestClose={() => setMeterStatusModalVisible(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, {backgroundColor: currentTheme.modalOverlay}]}
          activeOpacity={1}
          onPress={() => setMeterStatusModalVisible(false)}
        >
          <TouchableOpacity style={[styles.modalContainer, {backgroundColor: currentTheme.cardBackground}]} activeOpacity={1} onPress={() => {}}>
            <View style={[styles.modalHeader, {borderBottomColor: currentTheme.divider}]}>
              <Text style={[styles.modalTitle, {color: currentTheme.textPrimary}]}>Meter Actions</Text>
              <TouchableOpacity onPress={() => setMeterStatusModalVisible(false)} style={styles.modalCloseButton}>
                <Icon name="close" size={24} color={currentTheme.iconColor} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Icon name="cogs" size={50} color={currentTheme.accentBlue} />
              <Text style={[styles.modalActionText, {color: currentTheme.textSecondary}]}>
                Choose an action for this meter. These actions cannot be undone.
              </Text>
              
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.modalButton, styles.modalResetButton, {backgroundColor: currentTheme.negative}]} 
                  onPress={handleResetReading}
                  disabled={isResetting || isTogglingMeter}
                >
                  {isResetting ? (
                    <ActivityIndicator color={"#FFFFFF"} />
                  ) : (
                    <Text style={styles.buttonText}>Reset</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.button, styles.modalButton, styles.modalMeterOffButton, {backgroundColor: "#8B0000"}]} 
                  onPress={handleMeterOff}
                  disabled={isResetting || isTogglingMeter}
                >
                  {isTogglingMeter ? (
                    <ActivityIndicator color={"#FFFFFF"} />
                  ) : (
                    <Text style={styles.buttonText}>Meter Off</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Chart Detail Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isChartModalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, {backgroundColor: currentTheme.modalOverlay}]}
          activeOpacity={1}
          onPress={closeModal}
        >
          <TouchableOpacity
            style={[styles.modalContainer, {backgroundColor: currentTheme.cardBackground}]}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={[styles.modalHeader, {borderBottomColor: currentTheme.divider}]}>
              <Text style={[styles.modalTitle, {color: currentTheme.textPrimary}]}>
                {timePeriod} Consumption Details
                {selectedChartSegment ? ` (${selectedChartSegment.label})` : ""}
              </Text>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.modalCloseButton}
              >
                <Icon name="close" size={24} color={currentTheme.iconColor} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              {chartData.length > 0 ? (
                <PieChart
                  data={chartData.map((segment) => ({
                    ...segment,
                    focused:
                      selectedChartSegment &&
                      segment.label === selectedChartSegment.label,
                    text: `${segment.label}\n${segment.value.toFixed(1)} kWh`,
                  }))}
                  donut
                  innerRadius={screenWidth * 0.22}
                  radius={screenWidth * 0.32}
                  showGradient
                  backgroundColor={currentTheme.cardBackground}
                  centerLabelComponent={() => (
                    <View style={styles.chartCenterLabel}>
                      <Text style={[styles.chartValueBig, {color: currentTheme.textPrimary}]}>
                        {selectedChartSegment
                          ? selectedChartSegment.value.toFixed(1)
                          : currentTotalConsumption.toFixed(1)}
                      </Text>
                      <Text style={[styles.chartUnit, {color: currentTheme.textSecondary}]}>kWh</Text>
                      {selectedChartSegment && (
                        <Text style={[styles.chartPercentageSmall, {color: currentTheme.textSecondary}]}>
                          {selectedChartSegment.label}
                        </Text>
                      )}
                    </View>
                  )}
                  showText
                  textColor={currentTheme.textPrimary}
                  textSize={screenWidth * 0.028}
                  textBackgroundColor={currentTheme.neutralDark}
                  textBackgroundRadius={4}
                />
              ) : (
                <Text style={[styles.noDataText, {color: currentTheme.textSecondary}]}>
                  No detailed consumption data.
                </Text>
              )}
              {selectedChartSegment && (
                <View style={styles.modalDetails}>
                  <Text style={[styles.modalDetailText, {color: currentTheme.textPrimary}]}>
                    Source: {selectedChartSegment.label}
                  </Text>
                  <Text style={[styles.modalDetailText, {color: currentTheme.textPrimary}]}>
                    Consumption: {selectedChartSegment.value.toFixed(2)} kWh
                  </Text>
                  <Text style={[styles.modalDetailText, {color: currentTheme.textPrimary}]}>
                    Percentage of Total ({timePeriod}):{" "}
                    {currentTotalConsumption > 0
                      ? (
                          (selectedChartSegment.value /
                            currentTotalConsumption) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </Text>
                </View>
              )}
              <View style={[styles.modalOverallSummary, {borderTopColor: currentTheme.divider}]}>
                <Text style={[styles.modalSummaryTitle, {color: currentTheme.textPrimary}]}>
                  Overall {timePeriod} Summary
                </Text>
                <Text style={[styles.modalSummaryText, {color: currentTheme.textSecondary}]}>
                  Total Consumption: {currentTotalConsumption.toFixed(2)} kWh
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const renderDeductionRow = (label, value, isTotal = false, unit = "", theme) => (
  <View style={styles.deductionRow}>
    <Text style={[
      isTotal ? styles.deductionLabelTotal : styles.deductionLabel,
      {color: isTotal ? theme.textPrimary : theme.textSecondary}
    ]}>
      {label}
    </Text>
    <Text style={[
      isTotal ? styles.deductionValueTotal : styles.deductionValue,
      {color: theme.textPrimary}
    ]}>
      {value !== undefined && value !== null
        ? parseFloat(value)?.toFixed(isTotal ? 2 : 1)
        : "0.00"}{" "}
      {unit}
    </Text>
  </View>
);

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: 10, paddingBottom: 10 },
  container: { flex: 1 },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  infoText: {
    marginTop: 15,
    fontSize: 18,
    textAlign: "center",
  },
  errorText: {
    marginTop: 15,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "500",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButton: {},
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 15,
  },
  iconButton: { padding: 5 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  welcomeCard: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  dashboard: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    marginBottom: 4,
  },
  greetingText: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  updateText: { fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 6 },
  card: {
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 16,
  },
  balanceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceTextContainer: { flex: 1 },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: screenWidth * 0.04,
    fontWeight: "bold",
  },
  balanceIconStyle: {},
  readingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  readingBox: { flex: 1, alignItems: "center", gap: 6 },
  readingLabel: { fontSize: 13 },
  readingValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  separator: {
    width: 1,
    height: "60%",
    alignSelf: "center",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  statusLabel: { fontSize: 15 },
  statusBadge: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 40,
    alignItems: "center",
    height: 30,
  },
  statusText: {
    fontWeight: "600",
    fontSize: 13,
    color: "#FFFFFF",
  },
  chartToggleAndLegendContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  toggleContainer: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 3,
  },
  toggleButton: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginHorizontal: 1,
  },
  toggleButtonActive: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "600",
  },
  toggleTextActive: { fontWeight: "bold" },
  legendContainer: { flexDirection: "row" },
  legendItem: { flexDirection: "row", alignItems: "center", marginLeft: 10 },
  legendColor: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  legendText: {
    fontSize: 12,
    fontWeight: "500",
  },
  chartWrapper: { alignItems: "center", marginVertical: 10 },
  chartOuterContainer: {},
  chartCenterLabel: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  chartValueBig: {
    fontSize: screenWidth * 0.07,
    fontWeight: "bold",
  },
  chartUnit: {
    fontSize: screenWidth * 0.035,
    fontWeight: "500",
    marginTop: -5,
  },
  chartPercentageSmall: {
    fontSize: screenWidth * 0.03,
    marginTop: 3,
  },
  noDataChartContainer: {
    height: screenWidth * 0.5,
    width: screenWidth * 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  consumptionDetailsBelowChartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  consumptionDetailItem: { flexDirection: "row", alignItems: "center" },
  detailColorBox: { width: 12, height: 12, borderRadius: 3, marginRight: 8 },
  detailLabelText: {
    fontSize: 13,
    fontWeight: "500",
    marginRight: 5,
  },
  detailValueText: {
    fontSize: 14,
    fontWeight: "600",
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },
  predictionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  predictionItem: {
    alignItems: "center",
    gap: 8,
    flex: 1,
    paddingVertical: 10,
  },
  predictionLabel: {
    fontSize: 13,
    textAlign: "center",
  },
  predictionValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  separatorVertical: {
    width: 1,
    height: "80%",
    alignSelf: "center",
  },
  // deductionsHeaderContainer: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: 10,
  // },
  deductionsHeaderContainer: {
  flexDirection: "column",
  alignItems: "flex-start", // heading left aligned, buttons below
  marginBottom: 10,
},
  toggleButtonSmall: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 1,
  },
  toggleButtonActiveSmall: {},
  toggleTextSmall: {
    fontSize: 10,
    fontWeight: "500",
  },
  toggleTextActiveSmall: { fontWeight: "600" },
  subTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 8,
  },
  deductionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
  },
  deductionLabel: { fontSize: 14 },
  deductionValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    marginTop: 6,
    paddingTop: 6,
  },
  deductionLabelTotal: {
    fontSize: 15,
    fontWeight: "bold",
  },
  deductionValueTotal: {
    fontSize: 15,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
    borderRadius: 20,
    padding: 20,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  modalCloseButton: { padding: 8 },
  modalContent: { alignItems: "center" },
  modalDetails: { marginTop: 20, width: "100%", paddingHorizontal: 10 },
  modalDetailText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  modalActionText: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  modalActionButton: {
    width: '90%',
    alignItems: 'center',
    shadowColor: '#EF4444',
  },
  modalOverallSummary: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    width: "100%",
  },
  modalSummaryTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSummaryText: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    width: '48%',
    marginVertical: 0,
  },
  modalResetButton: {},
  modalMeterOffButton: {},
});