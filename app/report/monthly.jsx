

// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';
// import { useAuth } from '../../context/AuthContext';

// // --- UI Theme Colors based on the provided image ---
// const theme = {
//   background: '#0F142D', // Dark navy background
//   card: '#1C203A', // Darker card background
//   textPrimary: '#FFFFFF', // White text
//   textSecondary: '#A9A9B2', // Light grey for subtitles
//   accent: '#00A3FF', // Bright blue for highlights
//   gridColor: '#00A3FF', // Blue for Grid data
//   dgColor: '#FFA500', // Orange for DG data
//   error: '#FF6347', // Red for error messages
// };

// // Format date to "MMM 'YY" (e.g., "Jun '25")
// const formatDate = (dateStr) => {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', " '");
// };

// const MonthlyChartScreen = () => {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const payload = { ...user, RechargeType: '0' };
//         const response = await axios.post(
//           'http://www.pesonline.in/webconfig/Android/mETERhISTORYMonthly',
//           payload,
//           { headers: { 'Content-Type': 'application/json' } }
//         );

//         if (response.data.ApiStatus === 'TRUE') {
//           if (response.data.Data && response.data.Data.length > 0) {
//             const sortedData = [...response.data.Data]
//               .sort((a, b) => new Date(a.FromDate) - new Date(b.FromDate))
//               .slice(-6); // Get latest 6 months for better view
//             setChartData(sortedData);
//           } else {
//             const noDataMessage = 'No monthly meter history records found.';
//             setError(noDataMessage);
//             Alert.alert('No Data Available', noDataMessage);
//           }
//         } else {
//           throw new Error(response.data.ApiMessage || 'API request failed');
//         }
//       } catch (err) {
//         const errorMessage = err.response?.data?.ApiMessage || err.message || 'Failed to fetch data';
//         setError(errorMessage);
//         Alert.alert('Error', errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [user]);

//   // Process data for charts
//   const gridData = chartData.map((item) => ({ value: item.UnitConsumedMain, label: formatDate(item.FromDate) }));
//   const dgData = chartData.map((item) => ({ value: item.UnitConsumedDG, label: formatDate(item.FromDate) }));
//   const costGridData = chartData.map((item) => ({ value: item.MainCharges, label: formatDate(item.FromDate) }));
//   const costDgData = chartData.map((item) => ({ value: item.DgCharge, label: formatDate(item.FromDate) }));

//   // Calculate max values for charts
//   const maxConsumption = Math.max(...gridData.map((d) => d.value), ...dgData.map((d) => d.value)) + 50 || 100;
//   const maxCost = Math.max(...costGridData.map((d) => d.value), ...costDgData.map((d) => d.value)) + 100 || 200;

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <View style={styles.centered}>
//           <ActivityIndicator size="large" color={theme.accent} />
//         </View>
//       );
//     }

//     if (error) {
//       return (
//         <View style={styles.centered}>
//           <Ionicons name="cloud-offline-outline" size={64} color={theme.error} />
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       );
//     }

//     return (
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Consumption Chart */}
//         <View style={styles.chartContainer}>
//           <View style={styles.chartHeader}>
//             <Text style={styles.chartTitle}>GRID/DG CONSUMPTION</Text>
//             <TouchableOpacity
//               onPress={() =>
//                 router.push({
//                   pathname: '/report/(chart)/MonthlyFullChart',
//                   params: {
//                     title: 'GRID/DG CONSUMPTION (kWh)',
//                     yAxisSuffix: 'kWh',
//                     color1: theme.gridColor,
//                     color2: theme.dgColor,
//                     data1: JSON.stringify(gridData),
//                     data2: JSON.stringify(dgData),
//                   },
//                 })
//               }
//             >
//               <Ionicons name="expand-outline" size={24} color={theme.accent} />
//             </TouchableOpacity>
//           </View>
//           <LineChart
//             data={gridData}
//             data2={dgData}
//             spacing={45}
//             thickness={3}
//             color={theme.gridColor}
//             color2={theme.dgColor}
//             maxValue={maxConsumption}
//             yAxisTextStyle={{ color: theme.textSecondary }}
//             xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
//             yAxisSuffix=" kWh"
//             isAnimated
//             hideDataPoints
//             rulesColor="#333858"
//             xAxisColor="#333858"
//             yAxisColor="#333858"
//           />
//           <View style={styles.legendBox}>
//             <View style={styles.legendItem}>
//               <View style={[styles.legendIndicator, { backgroundColor: theme.gridColor }]} />
//               <Text style={styles.legendText}>GRID</Text>
//             </View>
//             <View style={styles.legendItem}>
//               <View style={[styles.legendIndicator, { backgroundColor: theme.dgColor }]} />
//               <Text style={styles.legendText}>DG</Text>
//             </View>
//           </View>
//         </View>

//         {/* Cost Chart */}
//         <View style={styles.chartContainer}>
//           <View style={styles.chartHeader}>
//             <Text style={styles.chartTitle}>COST CONSUMPTION</Text>
//             <TouchableOpacity
//               onPress={() =>
//                 router.push({
//                   pathname: '/report/(chart)/MonthlyCostFullChart',
//                   params: {
//                     title: 'COST CONSUMPTION (₹)',
//                     yAxisSuffix: '₹',
//                     color1: theme.gridColor,
//                     color2: theme.dgColor,
//                     data1: JSON.stringify(costGridData),
//                     data2: JSON.stringify(costDgData),
//                   },
//                 })
//               }
//             >
//               <Ionicons name="expand-outline" size={24} color={theme.accent} />
//             </TouchableOpacity>
//           </View>
//           <LineChart
//             data={costGridData}
//             data2={costDgData}
//             spacing={45}
//             thickness={3}
//             color={theme.gridColor}
//             color2={theme.dgColor}
//             maxValue={maxCost}
//             yAxisTextStyle={{ color: theme.textSecondary }}
//             xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
//             yAxisSuffix=" ₹"
//             isAnimated
//             hideDataPoints
//             rulesColor="#333858"
//             xAxisColor="#333858"
//             yAxisColor="#333858"
//           />
//           <View style={styles.legendBox}>
//             <View style={styles.legendItem}>
//               <View style={[styles.legendIndicator, { backgroundColor: theme.gridColor }]} />
//               <Text style={styles.legendText}>GRID</Text>
//             </View>
//             <View style={styles.legendItem}>
//               <View style={[styles.legendIndicator, { backgroundColor: theme.dgColor }]} />
//               <Text style={styles.legendText}>DG</Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.replace('/report')} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
//         </TouchableOpacity>
//         <Text style={styles.mainTitle}>Monthly Report</Text>
//       </View>
//       {renderContent()}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.background,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: 50,
//     paddingBottom: 15,
//     paddingHorizontal: 16,
//     backgroundColor: theme.background,
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   mainTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: theme.textPrimary,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 30,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   chartContainer: {
//     backgroundColor: theme.card,
//     borderRadius: 12,
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     marginBottom: 20,
//   },
//   chartHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   chartTitle: {
//     fontWeight: '600',
//     fontSize: 14,
//     color: theme.textSecondary,
//     textTransform: 'uppercase',
//   },
//   legendBox: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 20,
//     marginTop: 20,
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   legendIndicator: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 8,
//   },
//   legendText: {
//     color: theme.textPrimary,
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   errorText: {
//     fontSize: 16,
//     color: theme.error,
//     textAlign: 'center',
//     marginTop: 10,
//   },
// });

// export default MonthlyChartScreen;

import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useAuth } from '../../context/AuthContext';

// --- UI Theme Colors based on the provided image ---
const theme = {
  background: '#0F142D', // Dark navy background
  card: '#1C203A', // Darker card background
  textPrimary: '#FFFFFF', // White text
  textSecondary: '#A9A9B2', // Light grey for subtitles
  accent: '#00A3FF', // Bright blue for highlights
  gridColor: '#00A3FF', // Blue for Grid data
  dgColor: '#FFA500', // Orange for DG data
  error: '#FF6347', // Red for error messages
};

// Format date to "MMM 'YY" (e.g., "Jun '25")
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', " '");
};

const MonthlyChartScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = { ...user, RechargeType: '0' };
        const response = await axios.post(
          'http://www.pesonline.in/webconfig/Android/mETERhISTORYMonthly',
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data.ApiStatus === 'TRUE') {
          if (response.data.Data && response.data.Data.length > 0) {
            const sortedData = [...response.data.Data]
              .sort((a, b) => new Date(a.FromDate) - new Date(b.FromDate))
              .slice(-6); // Get latest 6 months for better view
            setChartData(sortedData);
          } else {
            const noDataMessage = 'No monthly meter history records found.';
            setError(noDataMessage);
            Alert.alert('No Data Available', noDataMessage);
          }
        } else {
          throw new Error(response.data.ApiMessage || 'API request failed');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.ApiMessage || err.message || 'Failed to fetch data';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);                  

  // Process data for charts with values
  const gridData = chartData.map((item) => ({
    value: item.UnitConsumedMain || 0,  
    label: formatDate(item.FromDate) || 'N/A',
    dataPointText: (item.UnitConsumedMain || 0).toString(), // Ensure value exists
  }));
  const dgData = chartData.map((item) => ({
    value: item.UnitConsumedDG || 0,
    label: formatDate(item.FromDate) || 'N/A',
    dataPointText: (item.UnitConsumedDG || 0).toString(), // Ensure value exists
  }));
  const costGridData = chartData.map((item) => ({
    value: item.MainCharges || 0,
    label: formatDate(item.FromDate) || 'N/A',
    dataPointText: (item.MainCharges || 0).toString(), // Ensure value exists
  }));
  const costDgData = chartData.map((item) => ({
    value: item.DgCharge || 0,
    label: formatDate(item.FromDate) || 'N/A',
    dataPointText: (item.DgCharge || 0).toString(), // Ensure value exists
  }));

  // Calculate max values for charts
  const maxConsumption = Math.max(...gridData.map((d) => d.value), ...dgData.map((d) => d.value)) + 50 || 100;
  const maxCost = Math.max(...costGridData.map((d) => d.value), ...costDgData.map((d) => d.value)) + 100 || 200;

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={64} color={theme.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (gridData.length === 0 || dgData.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>No data available to display.</Text>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Consumption Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>GRID/DG CONSUMPTION</Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/report/(chart)/MonthlyFullChart',
                  params: {
                    title: 'GRID/DG CONSUMPTION (kWh)',
                    yAxisSuffix: 'kWh',
                    color1: theme.gridColor,
                    color2: theme.dgColor,
                    data1: JSON.stringify(gridData),
                    data2: JSON.stringify(dgData),
                  },
                })
              }
            >
              <Ionicons name="expand-outline" size={24} color={theme.accent} />
            </TouchableOpacity>
          </View>
          <LineChart
            data={gridData}
            data2={dgData}
            spacing={45}
            thickness={3}
            color={theme.gridColor}
            color2={theme.dgColor}
            maxValue={maxConsumption}
            yAxisTextStyle={{ color: theme.textSecondary }}
            xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
            yAxisSuffix=" kWh"
            isAnimated
            hideDataPoints={true} // Removes the blue and black dots
            textColor1={theme.textPrimary} // Color for GRID values
            textColor2={theme.textPrimary} // Color for DG values
            textFontSize={10} // Size of the text
            textShiftY={-10} // Adjust vertical position of text above the line
            textShiftX={-5} // Adjust horizontal position of text
            rulesColor="#333858"
            xAxisColor="#333858"
            yAxisColor="#333858"
            showTextWhileHidingDataPoints={true} // Explicitly enable text display
          />
          <View style={styles.legendBox}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: theme.gridColor }]} />
              <Text style={styles.legendText}>GRID</Text>
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
            <Text style={styles.chartTitle}>COST CONSUMPTION</Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/report/(chart)/MonthlyCostFullChart',
                  params: {
                    title: 'COST CONSUMPTION (₹)',
                    yAxisSuffix: '₹',
                    color1: theme.gridColor,
                    color2: theme.dgColor,
                    data1: JSON.stringify(costGridData),
                    data2: JSON.stringify(costDgData),
                  },
                })
              }
            >
              <Ionicons name="expand-outline" size={24} color={theme.accent} />
            </TouchableOpacity>
          </View>
          <LineChart
            data={costGridData}
            data2={costDgData}
            spacing={45}
            thickness={3}
            color={theme.gridColor}
            color2={theme.dgColor}
            maxValue={maxCost}
            yAxisTextStyle={{ color: theme.textSecondary }}
            xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
            yAxisSuffix=" ₹"
            isAnimated
            hideDataPoints={true} // Removes the blue and black dots
            textColor1={theme.textPrimary} // Color for GRID values
            textColor2={theme.textPrimary} // Color for DG values
            textFontSize={10} // Size of the text
            textShiftY={-10} // Adjust vertical position of text above the line
            textShiftX={-5} // Adjust horizontal position of text
            rulesColor="#333858"
            xAxisColor="#333858"
            yAxisColor="#333858"
            showTextWhileHidingDataPoints={true} // Explicitly enable text display
          />
          <View style={styles.legendBox}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, { backgroundColor: theme.gridColor }]} />
              <Text style={styles.legendText}>GRID</Text>
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
        <Text style={styles.mainTitle}>Monthly Report</Text>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
    backgroundColor: theme.background,
  },
  backButton: {
    marginRight: 16,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  chartContainer: {
    backgroundColor: theme.card,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
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
  legendBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: theme.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: theme.error,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default MonthlyChartScreen;