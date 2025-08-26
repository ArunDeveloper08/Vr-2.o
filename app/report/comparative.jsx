// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import { BarChart } from "react-native-gifted-charts";
// import { AntDesign } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// const Comparative = () => {
//   const router = useRouter();
//   const gridDGData = [
//     { value: 0, label: "2025-05", frontColor: "#003366" },
//     { value: 70, label: "2024-05", frontColor: "#003366" },
//   ];

//   const costData = [
//     { value: 0, label: "2025-05", frontColor: "#003366" },
//     { value: 50, label: "2024-05", frontColor: "#003366" },
//   ];
//   const currentDate = new Date();
//   const monthNames = [
//     "JAN",
//     "FEB",
//     "MAR",
//     "APR",
//     "MAY",
//     "JUN",
//     "JUL",
//     "AUG",
//     "SEP",
//     "OCT",
//     "NOV",
//     "DEC",
//   ];
//   const currentMonth = monthNames[currentDate.getMonth()];
//   const currentYear = currentDate.getFullYear();

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.replace("/report")}>
//           <Text style={styles.breadcrumb}>{"<"} REPORT {"<"} COMPARATIVE</Text>
//         </TouchableOpacity>
//         <View style={styles.dateBox}>
//           <Text style={styles.dateText}>{currentMonth}</Text>
//           <Text style={styles.yearText}>{currentYear}</Text>
//         </View>
//       </View>

//       <View style={styles.chartContainer}>
//         <View style={styles.chartHeader}>
//           <Text style={styles.chartTitle}>GRID/DG CONSUMPTION</Text>
//           <TouchableOpacity  
//              onPress={() => router.push('/report/(chart)/ComparativeFullChart')} 
//           >
//             <AntDesign name="arrowsalt" size={20} color="black" />
//           </TouchableOpacity>
//         </View>
//         <BarChart
//           data={gridDGData}
//           barWidth={35}
//           spacing={40}
//           hideRules
//           yAxisLabel={"(kWh) "}
//           noOfSections={4}
//           yAxisThickness={0}
//           xAxisColor={"#000"}
//           xAxisLabelTextStyle={{ fontSize: 12 }}
//           yAxisTextStyle={{ fontSize: 12 }}
//         />
//         <View style={styles.legendContainer}>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendDot, { backgroundColor: "#003366" }]} />
//             <Text>GRID</Text>
//           </View>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendDot, { backgroundColor: "#B22222" }]} />
//             <Text>DG</Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.chartContainer}>
//         <View style={styles.chartHeader}>
//           <Text style={styles.chartTitle}>COST CONSUMPTION</Text>
//           <TouchableOpacity
//              onPress={() => router.push('/report/(chart)/ComparativeCostFullChart')} 
//           >
//             <AntDesign name="arrowsalt" size={20} color="black" />
//           </TouchableOpacity>
//         </View>
//         <BarChart
//           data={costData}
//           barWidth={35}
//           spacing={40}
//           hideRules
//           yAxisLabel={"(Rs) "}
//           noOfSections={4}
//           yAxisThickness={0}
//           xAxisColor={"#000"}
//           xAxisLabelTextStyle={{ fontSize: 12 }}
//           yAxisTextStyle={{ fontSize: 12 }}
//         />
//         <View style={styles.legendContainer}>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendDot, { backgroundColor: "#003366" }]} />
//             <Text>GRID</Text>
//           </View>
//           <View style={styles.legendItem}>
//             <View style={[styles.legendDot, { backgroundColor: "#B22222" }]} />
//             <Text>DG</Text>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 10,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   breadcrumb: {
//     color: "#B22222",
//     fontWeight: "bold",
//   },
//   dateBox: {
//     alignItems: "center",
//     backgroundColor: "#B22222",
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 5,
//   },
//   dateText: {
//     color: "#fff",
//     fontSize: 12,
//   },
//   yearText: {
//     color: "#fff",
//     fontSize: 10,
//   },
//   chartContainer: {
//     backgroundColor: "#f5f5f5",
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 10,
//   },
//   chartHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   chartTitle: {
//     fontWeight: "bold",
//     color: "#003366",
//   },
//   legendContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 10,
//   },
//   legendItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 10,
//   },
//   legendDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 5,
//   },
// });

// export default Comparative;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

// --- UI Theme Colors ---
const theme = {
  background: '#0F142D',
  card: '#1C203A',
  textPrimary: '#FFFFFF',
  textSecondary: '#A9A9B2',
  mainColor: '#00A3FF', // Blue for Main/Grid
  dgColor: '#FFA500',   // Orange for DG
  error: '#FF6347',
};

const Comparative = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [consumptionData, setConsumptionData] = useState([]);
  const [costData, setCostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  useEffect(() => {
    const fetchDataAndProcess = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const payload = { ...user, RechargeType: '0' };
        const response = await axios.post(
          'http://www.pesonline.in/webconfig/Android/mETERhISTORYMonthly',
          payload
        );

        if (response.data.ApiStatus === 'TRUE' && response.data.Data?.length > 0) {
          // Step 1: Aggregate data into yearly totals for Main and DG separately
          const totals = {
            [currentYear]: { mainConsumption: 0, dgConsumption: 0, mainCost: 0, dgCost: 0 },
            [previousYear]: { mainConsumption: 0, dgConsumption: 0, mainCost: 0, dgCost: 0 },
          };

          response.data.Data.forEach(item => {
            const itemYear = new Date(item.FromDate).getFullYear();
            if (itemYear === currentYear || itemYear === previousYear) {
              totals[itemYear].mainConsumption += item.UnitConsumedMain || 0;
              totals[itemYear].dgConsumption += item.UnitConsumedDG || 0;
              totals[itemYear].mainCost += item.MainCharges || 0;
              totals[itemYear].dgCost += item.DgCharge || 0;
            }
          });

          // Step 2: Create the correct data structure for a grouped bar chart using 'stacks'
          const finalConsumptionData = [
            {
              stacks: [
                { value: totals[previousYear].mainConsumption, color: theme.mainColor },
                { value: totals[previousYear].dgConsumption, color: theme.dgColor },
              ],
              label: String(previousYear),
            },
            {
              stacks: [
                { value: totals[currentYear].mainConsumption, color: theme.mainColor },
                { value: totals[currentYear].dgConsumption, color: theme.dgColor },
              ],
              label: String(currentYear),
            },
          ];

          const finalCostData = [
            {
              stacks: [
                { value: totals[previousYear].mainCost, color: theme.mainColor },
                { value: totals[previousYear].dgCost, color: theme.dgColor },
              ],
              label: String(previousYear),
            },
            {
              stacks: [
                { value: totals[currentYear].mainCost, color: theme.mainColor },
                { value: totals[currentYear].dgCost, color: theme.dgColor },
              ],
              label: String(currentYear),
            },
          ];

          setConsumptionData(finalConsumptionData);
          setCostData(finalCostData);

        } else {
          throw new Error(response.data.ApiMessage || 'No comparative data found.');
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch data';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndProcess();
  }, [user]);

  // Dynamically calculate max value from all stacked values
  const allConsumptionValues = consumptionData.flatMap(d => d.stacks?.map(s => s.value));
  const allCostValues = costData.flatMap(d => d.stacks?.map(s => s.value));
  
  const maxConsumption = Math.max(...allConsumptionValues) + 100 || 200;
  const maxCost = Math.max(...allCostValues) + 1000 || 2000;


  const renderContent = () => {
    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color={theme.mainColor} /></View>;
    if (error) return <View style={styles.centered}><Ionicons name="cloud-offline-outline" size={64} color={theme.error} /><Text style={styles.errorText}>{error}</Text></View>;

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Consumption Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>YEARLY CONSUMPTION (kWh)</Text>
          </View>
          <BarChart
            data={consumptionData}
            barWidth={30} // Width of each individual bar
            spacing={60} // Spacing between the groups (e.g., between 2024 and 2025)
            noOfSections={4}
            stackData={consumptionData} // Important: Use stackData prop with this structure
            maxValue={maxConsumption}
            yAxisTextStyle={{ color: theme.textSecondary }}
            xAxisLabelTextStyle={{ color: theme.textSecondary, textAlign: 'center' }}
            rulesColor="#333858"
            xAxisColor="#333858"
            yAxisColor="#333858"
            yAxisThickness={1}
            xAxisThickness={1}
            isAnimated
          />
          <View style={styles.legendBox}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: theme.mainColor }]} />
              <Text style={styles.legendText}>Grid</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: theme.dgColor }]} />
              <Text style={styles.legendText}>DG</Text>
            </View>
          </View>
        </View>

        {/* Cost Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>YEARLY COST (₹)</Text>
          </View>
          <BarChart
            data={costData}
            barWidth={30}
            spacing={60}
            noOfSections={4}
            stackData={costData} // Important: Use stackData prop with this structure
            maxValue={maxCost}
            yAxisTextStyle={{ color: theme.textSecondary }}
            xAxisLabelTextStyle={{ color: theme.textSecondary, textAlign: 'center' }}
            rulesColor="#333858"
            xAxisColor="#333858"
            yAxisColor="#333858"
            yAxisThickness={1}
            xAxisThickness={1}
            isAnimated
          />
          <View style={styles.legendBox}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: theme.mainColor }]} />
              <Text style={styles.legendText}>Grid</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: theme.dgColor }]} />
              <Text style={styles.legendText}>DG</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/report')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.mainTitle}>Comparative Report</Text>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  backButton: { marginRight: 16 },
  mainTitle: { fontSize: 20, fontWeight: 'bold', color: theme.textPrimary },
  scrollContent: { padding: 16, paddingBottom: 30 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: theme.error, textAlign: 'center', marginTop: 10 },
  chartContainer: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  chartTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: theme.textSecondary,
    textTransform: 'uppercase',
  },
  legendBox: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendIndicator: { width: 12, height: 12, borderRadius: 3, marginRight: 8 },
  legendText: { color: theme.textPrimary, fontSize: 14, fontWeight: '500' },
});

export default Comparative;