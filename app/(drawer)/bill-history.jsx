// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ActivityIndicator,
//   ScrollView,
//   useWindowDimensions,
//   StatusBar, // Import StatusBar
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useAuth } from "../../context/AuthContext";
// import { BarChart } from "react-native-gifted-charts";

// // --- Theme Colors ---
// const THEME_COLORS = {
//   background: "#0A0F1E",
//   cardBackground: "#1A1F2C", // Can be used if you decide to wrap chart in a card
//   accentBlue: "#00A3FF",
//   accentBlueGlow: "rgba(0, 163, 255, 0.5)",
//   textPrimary: "#E0E7FF",
//   textSecondary: "#8A9CB0",
//   iconColor: "#C0D0E0",
//   neutralDark: "#303A52",
//   negative: "#F87171",
//   // Chart specific colors - ensure good contrast on dark background
//   chartColorMain1: "#00A3FF", // Primary accent
//   chartColorMain2: "#007BFF", // Darker shade of accent
//   chartColorMain3: "#58C1FF", // Lighter shade of accent
//   chartColorDG1: "#FFA726", // Orange for DG
//   chartColorDG2: "#FB8C00", // Darker orange
//   chartColorDG3: "#FFB74D", // Lighter orange
// };

// export default function BillHistory() {
//   const router = useRouter();
//   const { width, height } = useWindowDimensions();
//   const { user } = useAuth();
//   const [billData, setBillData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     fetchBillHistory();
//   }, [user]); // Add user to dependency array

//   const fetchBillHistory = async () => {
//     if (!user) {
//       setErrorMessage("User not logged in. Redirecting...");
//       setError(true);
//       setLoading(false);
//       setTimeout(() => {
//         router.replace("/login");
//       }, 2000);
//       return;
//     }
//     setLoading(true);
//     setError(false);
//     setErrorMessage("");
//     try {
//       const response = await fetch(
//         "http://www.pesonline.co.in:8080/WebServicesFinal/Android/BillDetailHistorySingle",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(user),
//         }
//       );
//       const json = await response.json();
//       if (json.ApiStatus === "TRUE" && json.Data && json.Data.Table) {
//         setBillData(json.Data.Table);
//       } else {
//         setErrorMessage(json.ApiMessage || "Failed to load bill history.");
//         setError(true);
//       }
//     } catch (error) {
//       console.log("Error fetching bill history:", error);
//       setErrorMessage("An error occurred. Please try again.");
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const months = [
//     "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
//     "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
//   ];

//   // More distinct colors for dark theme
//   const mainColorPalette = [
//     THEME_COLORS.chartColorMain1,
//     THEME_COLORS.chartColorMain2,
//     THEME_COLORS.chartColorMain3,
//   ];
//   const dgColorPalette = [
//     THEME_COLORS.chartColorDG1,
//     THEME_COLORS.chartColorDG2,
//     THEME_COLORS.chartColorDG3,
//   ];

//   const chartData = billData.flatMap((item, index) => {
//     if (!item.FromDate || typeof item.FromDate !== 'string') {
//         console.warn("Invalid FromDate for item:", item);
//         return []; // Skip this item if FromDate is invalid
//     }
//     const dateParts = item.FromDate.split("/");
//     if (dateParts.length < 3) {
//         console.warn("Invalid FromDate format:", item.FromDate);
//         return [];
//     }
//     const monthIndex = parseInt(dateParts[1], 10) - 1;
//     const year = dateParts[2].slice(-2);
//     const label = `${months[monthIndex] || 'N/A'} '${year}`;

//     const mainColor = mainColorPalette[index % mainColorPalette.length];
//     const dgColor = dgColorPalette[index % dgColorPalette.length];

//     const unitConsumedMain = parseFloat(item.UnitConsumedMain) || 0;
//     const unitConsumedDg = parseFloat(item.UnitConsumedDg) || 0;

//     return [
//       {
//         label,
//         value: unitConsumedMain,
//         frontColor: mainColor,
//         spacing: 2, // Keep small spacing between grouped bars
//         topLabelComponent: () => (
//           <Text
//             style={[styles.barValueSmall, { fontSize: width < 400 ? 9 : 10 }]}
//           >
//             {unitConsumedMain.toFixed(1)}
//           </Text>
//         ),
//       },
//       {
//         label: "", // No label for the second bar in a group
//         value: unitConsumedDg,
//         frontColor: dgColor,
//         spacing: width < 400 ? 18 : 25, // Larger spacing between groups of bars
//         topLabelComponent: () => (
//           <Text
//             style={[styles.barValueSmall, { fontSize: width < 400 ? 9 : 10 }]}
//           >
//             {unitConsumedDg.toFixed(1)}
//           </Text>
//         ),
//       },
//     ];
//   }).filter(Boolean); // Filter out any null/undefined entries from invalid dates

//   const maxValue = billData.length > 0
//     ? Math.max(
//         0, // ensure non-negative max
//         ...billData.map((item) =>
//           Math.max(parseFloat(item.UnitConsumedMain) || 0, parseFloat(item.UnitConsumedDg) || 0)
//         )
//       ) + 50
//     : 100; // Default max if no data

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor={THEME_COLORS.background} />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.replace("/(drawer)")} style={styles.headerIcon}>
//           <Ionicons name="arrow-back" size={26} color={THEME_COLORS.iconColor} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Bill History</Text>
//         <View style={{ width: 26 }} />
//       </View>

//       {loading ? (
//         <View style={styles.centerStatus}>
//           <ActivityIndicator size="large" color={THEME_COLORS.accentBlue} />
//           <Text style={styles.statusText}>Loading Bill History...</Text>
//         </View>
//       ) : error ? (
//         <View style={styles.centerStatus}>
//           <Ionicons name="alert-circle-outline" size={60} color={THEME_COLORS.negative} />
//           <Text style={[styles.statusText, {color: THEME_COLORS.negative, textAlign: 'center'}]}>{errorMessage}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={fetchBillHistory}>
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : billData.length > 0 && chartData.length > 0 ? ( // Check chartData too
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <View style={styles.chartContainer}>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               <BarChart
//                 data={chartData}
//                 width={Math.max(width * 0.9, chartData.length * (width < 400 ? 25 : 35))} // Dynamic width
//                 height={height * 0.55} // Adjusted height
//                 barWidth={width < 400 ? 16 : 22} // Adjusted bar width
//                 // spacing is handled per bar in chartData
//                 noOfSections={5}
//                 maxValue={maxValue}
//                 yAxisTextStyle={{ color: THEME_COLORS.textSecondary, fontSize: 10 }}
//                 xAxisLabelTextStyle={{ color: THEME_COLORS.textSecondary, fontSize: 10, marginTop: 5 }}
//                 yAxisLabelSuffix=" U"
//                 yAxisColor={THEME_COLORS.neutralDark}
//                 xAxisColor={THEME_COLORS.neutralDark}
//                 rulesColor={THEME_COLORS.neutralDark}
//                 rulesType="dashed" // Softer rules
//                 showLine={false} // Hiding the connecting line for bar charts usually
//                 hideRules={false} // Show rules for better readability
//                 isAnimated
//                 initialSpacing={10} // Space before the first bar
//                 // renderTooltip={(item) => ...} // If you want tooltips
//               />
//             </ScrollView>
//           </View>

//           <View style={styles.legendMainContainer}>
//             <View style={styles.legendContainer}>
//               <View style={[styles.legendColor, { backgroundColor: THEME_COLORS.chartColorMain1 }]} />
//               <Text style={styles.legendText}>Main Units</Text>
//             </View>
//             <View style={styles.legendContainer}>
//               <View style={[styles.legendColor, { backgroundColor: THEME_COLORS.chartColorDG1 }]} />
//               <Text style={styles.legendText}>DG Units</Text>
//             </View>
//           </View>

//           <Text style={styles.subtitle}>
//             Bill usage  history(Units consumed)
//           </Text>
//         </ScrollView>
//       ) : (
//         <View style={styles.centerStatus}>
//             <Ionicons name="document-text-outline" size={60} color={THEME_COLORS.textSecondary} />
//             <Text style={styles.statusText}>No bill history available.</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: THEME_COLORS.background,
//   },
//   header: {
//     backgroundColor: THEME_COLORS.background,
//     paddingVertical: 15,
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: THEME_COLORS.neutralDark,
//   },
//   headerIcon: {
//     padding: 5,
//   },
//   headerTitle: {
//     color: THEME_COLORS.textPrimary,
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   centerStatus: { // For loading, error, no data messages
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   statusText: {
//     marginTop: 15,
//     fontSize: 16,
//     color: THEME_COLORS.textSecondary,
//   },
//   retryButton: {
//     marginTop: 20,
//     backgroundColor: THEME_COLORS.accentBlue,
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     shadowColor: THEME_COLORS.accentBlueGlow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   retryButtonText: {
//     color: THEME_COLORS.textPrimary,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   scrollContent: {
//     paddingVertical: 20,
//     paddingHorizontal: 8, // Less horizontal padding for scrollview
//   },
//   chartContainer: { // Optional: if you want to add card-like styling around the chart
//     backgroundColor: THEME_COLORS.cardBackground, // Or THEME_COLORS.background
//     borderRadius: 15,
//     paddingVertical: 15,
//     paddingHorizontal: 5, // Minimal padding for horizontal scroll
//     marginBottom: 20,
//     // Neumorphic shadow if using cardBackground
//     shadowColor: THEME_COLORS.shadowDark, // Assuming you have shadowDark in THEME_COLORS
//     shadowOffset: { width: 4, height: 4 },
//     shadowOpacity: 0.7,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   barValueSmall: {
//     color: THEME_COLORS.textSecondary, // Lighter color for values on bars
//     marginBottom: 3,
//     textAlign: "center",
//     fontWeight: "500",
//   },
//   legendMainContainer: {
//     flexDirection: "row",
//     justifyContent: "space-evenly", // Space out legend items
//     alignItems: "center",
//     marginTop: 20,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   legendContainer: { // Individual legend item
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   legendColor: {
//     width: 14,
//     height: 14,
//     borderRadius: 3, // Slightly rounded square
//     marginRight: 8,
//   },
//   legendText: {
//     color: THEME_COLORS.textSecondary,
//     fontSize: 13,
//     fontWeight: "500",
//   },
//   subtitle: {
//     textAlign: "center",
//     color: THEME_COLORS.textSecondary,
//     fontSize: 14,
//     fontWeight: '500',
//     marginTop: 15,
//     marginBottom: 10,
//   },
// });

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { BarChart } from "react-native-gifted-charts";
import { apiUrl } from "../../constant/utils";

// --- Theme Colors ---
const THEME_COLORS = {
  background: "#0A0F1E",
  cardBackground: "#1A1F2C",
  accentBlue: "#00A3FF",
  accentBlueGlow: "rgba(0, 163, 255, 0.5)",
  textPrimary: "#E0E7FF",
  textSecondary: "#8A9CB0",
  iconColor: "#C0D0E0",
  neutralDark: "#303A52",
  negative: "#F87171", 
  shadowDark: "#000000",

  // Main units are BLUE
  chartColorMain1: "#00A3FF",
  chartColorMain2: "#007BFF",
  // DG units are ORANGE
  chartColorDG1: "#FFA726",
  chartColorDG2: "#FB8C00",
  // Amount text is RED
  chartAmountText: "white", 
};

export default function BillHistory() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { user } = useAuth();
  const [billData, setBillData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchBillHistory();
  }, [user]);

  const fetchBillHistory = async () => {
    if (!user) {
      setErrorMessage("User not logged in. Redirecting...");
      setError(true);
      setLoading(false);
      setTimeout(() => router.replace("/login"), 2000);
      return;
    }
    setLoading(true);
    setError(false);
    setErrorMessage("");
    try {
      const response = await fetch(
        `${apiUrl}/WebServicesFinal/Android/BillDetailHistorySingle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );
      const json = await response.json();
      if (json.ApiStatus === "TRUE" && json.Data && json.Data.Table) {
        setBillData(json.Data.Table);
      } else {
        setErrorMessage(json.ApiMessage || "Failed to load bill history.");
        setError(true);
      }
    } catch (error) {
      console.log("Error fetching bill history:", error);
      setErrorMessage("An error occurred. Please try again.");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const TopLabel = ({ unit, amount, labelWidth }) => (
    <View style={{ width: labelWidth, alignItems: "center", marginBottom: 5 }}>
      {amount != null && amount > 0 && (
        <Text style={styles.barValueAmount}>{`₹${amount.toFixed(0)}`}</Text>
      )}
      <Text style={styles.barValueSmall}>{`${unit.toFixed(1)} kwh`}</Text>
    </View>
  );

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const mainColorPalette = [
    THEME_COLORS.chartColorMain1,
    THEME_COLORS.chartColorMain2,
  ];
  const dgColorPalette = [
    THEME_COLORS.chartColorDG1,
    THEME_COLORS.chartColorDG2,
  ];

  const barWidth = width < 400 ? 16 : 22;

  const chartData = billData
    .flatMap((item, index) => {
      if (!item.FromDate || typeof item.FromDate !== "string") {
        return [];
      }
      const dateParts = item.FromDate.split("/");
      if (dateParts.length < 3) {
        return [];
      }
      const monthIndex = parseInt(dateParts[1], 10) - 1;
      const year = dateParts[2].slice(-2);
      const label = `${months[monthIndex] || "N/A"} '${year}`;

      const mainColor = mainColorPalette[index % mainColorPalette.length];
      const dgColor = dgColorPalette[index % dgColorPalette.length];

      const unitConsumedMain = parseFloat(item.UnitConsumedMain) || 0;
      const unitConsumedDg = parseFloat(item.UnitConsumedDg) || 0;
      const totalBillAmount = parseFloat(item.BillAmount) || 0;

      return [
        {
          label,
          value: unitConsumedMain,
          frontColor: mainColor, // Main = Blue
          spacing: 2,
          topLabelComponent: () => (
            <TopLabel
              unit={unitConsumedMain}
              amount={totalBillAmount}
              labelWidth={barWidth * 2}
            />
          ),
        },
        {
          label: "",
          value: unitConsumedDg,
          frontColor: dgColor, // DG = Orange
          spacing: width < 400 ? 18 : 25,
          topLabelComponent: () => (
            <TopLabel unit={unitConsumedDg} labelWidth={barWidth * 2} />
          ),
        },
      ];
    })
    .filter(Boolean);

  const maxValue =
    billData.length > 0
      ? Math.ceil(
          Math.max(
            0,
            ...billData.map((item) =>
              Math.max(
                parseFloat(item.UnitConsumedMain) || 0,
                parseFloat(item.UnitConsumedDg) || 0
              )
            )
          ) / 50
        ) *
          50 +
        50
      : 100;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={THEME_COLORS.background}
      />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(drawer)")}
          style={styles.headerIcon}
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color={THEME_COLORS.iconColor}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill History</Text>
        <View style={{ width: 26 }} />
      </View>

      {loading ? (
        <View style={styles.centerStatus}>
          <ActivityIndicator size="large" color={THEME_COLORS.accentBlue} />
          <Text style={styles.statusText}>Loading Bill History...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerStatus}>
          <Ionicons
            name="alert-circle-outline"
            size={60}
            color={THEME_COLORS.negative}
          />
          <Text
            style={[
              styles.statusText,
              { color: THEME_COLORS.negative, textAlign: "center" },
            ]}
          >
            {errorMessage}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchBillHistory}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : billData.length > 0 && chartData.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.chartContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={chartData}
                width={Math.max(
                  width * 0.9,
                  chartData.length * (width < 400 ? 25 : 35)
                )}
                height={height * 0.55}
                barWidth={barWidth}
                noOfSections={5}
                maxValue={maxValue}
                yAxisTextStyle={{
                  color: THEME_COLORS.textSecondary,
                  fontSize: 10,
                }}
                xAxisLabelTextStyle={{
                  color: THEME_COLORS.textSecondary,
                  fontSize: 10,
                  marginTop: 5,
                }}
                yAxisLabelSuffix=" kwh"
                yAxisColor={THEME_COLORS.neutralDark}
                xAxisColor={THEME_COLORS.neutralDark}
                rulesColor={THEME_COLORS.neutralDark}
                rulesType="dashed"
                showLine={false}
                hideRules={false}
                isAnimated
                initialSpacing={10}
              />
            </ScrollView>
          </View>

        
          <View style={styles.legendMainContainer}>
            <View style={styles.legendContainer}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: THEME_COLORS.chartColorMain1 },
                ]}
              />
              <Text style={styles.legendText}>Main Units</Text>
            </View>
            <View style={styles.legendContainer}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: THEME_COLORS.chartColorDG1 },
                ]}
              />
              <Text style={styles.legendText}>DG Units</Text>
            </View>
            <View style={styles.legendContainer}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: THEME_COLORS.chartAmountText },
                ]}
              />
              <Text style={styles.legendText}>Total Bill Amount</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>
            Bill usage history (Units consumed)
          </Text>
        </ScrollView>
      ) : (
        <View style={styles.centerStatus}>
          <Ionicons
            name="document-text-outline"
            size={60}
            color={THEME_COLORS.textSecondary}
          />
          <Text style={styles.statusText}>No bill history available.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  header: {
    backgroundColor: THEME_COLORS.background,
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.neutralDark,
  },
  headerIcon: {
    padding: 5,
  },
  headerTitle: {
    color: THEME_COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
  },
  centerStatus: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  statusText: {
    marginTop: 15,
    fontSize: 16,
    color: THEME_COLORS.textSecondary,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: THEME_COLORS.accentBlue,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: THEME_COLORS.accentBlueGlow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  retryButtonText: {
    color: THEME_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  chartContainer: {
    backgroundColor: THEME_COLORS.cardBackground,
    borderRadius: 15,
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 5,
    marginBottom: 20,
    shadowColor: THEME_COLORS.shadowDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  barValueSmall: {
    color: THEME_COLORS.textSecondary,
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  barValueAmount: {
    color: THEME_COLORS.chartAmountText, 
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  legendMainContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 8,
  },
  legendText: {
    color: THEME_COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  subtitle: {
    textAlign: "center",
    color: THEME_COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 15,
    marginBottom: 10,
  },
});
