

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

// // Format date to "DD MMM"
// const formatDate = (dateStr) => {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
// };

// const DailyReport = () => {
//   const router = useRouter();
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuth();

//   // Fetch data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const payload = { ...user, RechargeType: '0' };
//         const response = await axios.post(
//           'http://www.pesonline.in/webconfig/Android/mETERhISTORYwEEKLY',
//           payload,
//           {
//             headers: { 'Content-Type': 'application/json' },
//           }
//         );

//         if (response.data.ApiStatus === 'TRUE') {
//           if (response.data.Data && response.data.Data.length > 0) {
//             setChartData(response.data.Data);
//           } else {
//             const noDataMessage = 'No meter history records found for this period.';
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
//   const gridData = chartData.map((item, index) => ({
//     value: index === 0 ? 0 : +(item.kwhMainActual - chartData[index - 1].kwhMainActual).toFixed(1),
//     label: formatDate(item.RecordDate),
//   }));

//   const dgData = chartData.map((item, index) => ({
//     value: index === 0 ? 0 : +(item.kwhdgActual - chartData[index - 1].kwhdgActual).toFixed(1),
//     label: formatDate(item.RecordDate),
//   }));

//   const costData = chartData.map((item, index) => ({
//     value: index === 0 ? 0 : +(item.mAINcHARGES - chartData[index - 1].mAINcHARGES).toFixed(1),
//     label: formatDate(item.RecordDate),
//   }));

//   const dgCostData = chartData.map((item, index) => ({
//     value: index === 0 ? 0 : +(item.dgcharges - chartData[index - 1].dgcharges).toFixed(1),
//     label: formatDate(item.RecordDate),
//   }));

//   // ChartBox component
//   const ChartBox = ({
//     title,
//     unit,
//     onPressArrow,
//     data1,
//     data2,
//     color1,
//     color2,
//     yAxisSuffix,
//     maxValue,
//   }) => (
//     <View style={styles.chartContainer}>
//       <View style={styles.chartHeader}>
//         <Text style={styles.chartTitle}>{title}</Text>
//         <TouchableOpacity onPress={onPressArrow}>
//           <Ionicons name="expand-outline" size={24} color={theme.accent} />
//         </TouchableOpacity>
//       </View>

//       <LineChart
//         data={data1}
//         data2={data2}
//         thickness={3}
//         color={color1}
//         color2={color2}
//         noOfSections={4}
//         maxValue={maxValue}
//         yAxisTextStyle={{ color: theme.textSecondary }}
//         xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
//         yAxisSuffix={yAxisSuffix}
//         isAnimated
//         spacing={45}
//         initialSpacing={10}
//         hideDataPoints
//         rulesColor="#333858"
//         xAxisColor="#333858"
//         yAxisColor="#333858"
//       />

//       <View style={styles.legendBox}>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendIndicator, { backgroundColor: color1 }]} />
//           <Text style={styles.legendText}>GRID</Text>
//         </View>
//         <View style={styles.legendItem}>
//           <View style={[styles.legendIndicator, { backgroundColor: color2 }]} />
//           <Text style={styles.legendText}>DG</Text>
//         </View>
//       </View>
//       <Text style={styles.unitText}>{unit}</Text>
//     </View>
//   );
  
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
//        <ScrollView contentContainerStyle={styles.scrollContent}>
//         <ChartBox
//           title="GRID/DG CONSUMPTION"
//           unit="(kWh)"
//           onPressArrow={() =>
//             router.push({
//               pathname: '/report/(chart)/DailyFullChart',
//               params: {
//                 title: 'GRID/DG CONSUMPTION (kWh)',
//                 yAxisSuffix: 'kWh',
//                 color1: theme.gridColor,
//                 color2: theme.dgColor,
//                 data1: JSON.stringify(gridData),
//                 data2: JSON.stringify(dgData),
//               },
//             })
//           }
//           data1={gridData}
//           data2={dgData}
//           color1={theme.gridColor}
//           color2={theme.dgColor}
//           yAxisSuffix=" kWh"
//           maxValue={Math.max(...gridData.map((d) => d.value), ...dgData.map((d) => d.value)) + 5 || 10}
//         />

//         <ChartBox
//           title="COST CONSUMPTION"
//           unit="(₹)"
//           onPressArrow={() =>
//             router.push({
//               pathname: '/report/(chart)/CostFullChart',
//               params: {
//                 title: 'COST CONSUMPTION (₹)',
//                 yAxisSuffix: '₹',
//                 color1: theme.gridColor,
//                 color2: theme.dgColor,
//                 data1: JSON.stringify(costData),
//                 data2: JSON.stringify(dgCostData),
//               },
//             })
//           }
//           data1={costData}
//           data2={dgCostData}
//           color1={theme.gridColor}
//           color2={theme.dgColor}
//           yAxisSuffix=" ₹"
//           maxValue={Math.max(...costData.map((d) => d.value), ...dgCostData.map((d) => d.value)) + 100 || 100}
//         />
//       </ScrollView>
//     )
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.replace('/report')} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
//         </TouchableOpacity>
//         <Text style={styles.mainTitle}>Daily Report</Text>
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
//     padding: 16,
//     marginBottom: 20,
//   },
//   chartHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
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
//     marginTop: 15,
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
//   unitText: {
//     textAlign: 'center',
//     color: theme.textSecondary,
//     fontSize: 12,
//     marginTop: 4,
//   },
//   errorText: {
//     fontSize: 16,
//     color: theme.error,
//     textAlign: 'center',
//     marginTop: 10,
//   },
// });

// export default DailyReport;


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
  Switch,
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

// Format date to "DD MMM"
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

const DailyReport = () => {
  const router = useRouter();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showValues, setShowValues] = useState(true);
  const { user } = useAuth();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = { ...user, RechargeType: '0' };
        const response = await axios.post(
          'http://www.pesonline.in/webconfig/Android/mETERhISTORYwEEKLY',
          payload,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (response.data.ApiStatus === 'TRUE') {
          if (response.data.Data && response.data.Data.length > 0) {
            setChartData(response.data.Data);
          } else {
            const noDataMessage = 'No meter history records found for this period.';
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

  // Function to get chart data with optional values
  const getChartData = (calculator) => {
    return chartData.map((item, index) => {
      const val = index === 0 ? 0 : calculator(item, index);
      return {
        value: val,
        label: formatDate(item.RecordDate),
        ...(showValues ? { dataPointText: val.toString() } : {}),
      };
    });
  };

  // Process data for charts
  const gridData = getChartData((item, index) => +(item.kwhMainActual - chartData[index - 1].kwhMainActual).toFixed(1));
  const dgData = getChartData((item, index) => +(item.kwhdgActual - chartData[index - 1].kwhdgActual).toFixed(1));
  const costData = getChartData((item, index) => +(item.mAINcHARGES - chartData[index - 1].mAINcHARGES).toFixed(1));
  const dgCostData = getChartData((item, index) => +(item.dgcharges - chartData[index - 1].dgcharges).toFixed(1));

  // ChartBox component
  const ChartBox = ({
    title,
    unit,
    onPressArrow,
    data1,
    data2,
    color1,
    color2,
    yAxisSuffix,
    maxValue,
  }) => (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{title}</Text>
        <TouchableOpacity onPress={onPressArrow}>
          <Ionicons name="expand-outline" size={24} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <LineChart
        data={data1}
        data2={data2}
        thickness={3}
        color={color1}
        color2={color2}
        noOfSections={4}
        maxValue={maxValue}
        yAxisTextStyle={{ color: theme.textSecondary }}
        xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
        yAxisSuffix={yAxisSuffix}
        isAnimated
        spacing={45}
        initialSpacing={10}
        rulesColor="#333858"
        xAxisColor="#333858"
        yAxisColor="#333858"
        {...(showValues ? {
          textColor1: theme.textPrimary,
          textColor2: theme.textPrimary,
          textFontSize: 10,
          textShiftY: -5,
          textShiftX: -5,
        } : {})}
      />

      <View style={styles.legendBox}>
        <View style={styles.legendItem}>
          <View style={[styles.legendIndicator, { backgroundColor: color1 }]} />
          <Text style={styles.legendText}>GRID</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendIndicator, { backgroundColor: color2 }]} />
          <Text style={styles.legendText}>DG</Text>
        </View>
      </View>
      <Text style={styles.unitText}>{unit}</Text>
    </View>
  );
  
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
    
    return (
       <ScrollView contentContainerStyle={styles.scrollContent}>
        <ChartBox
          title="GRID/DG CONSUMPTION"
          unit="(kWh)"
          onPressArrow={() =>
            router.push({
              pathname: '/report/(chart)/DailyFullChart',
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
          data1={gridData}
          data2={dgData}
          color1={theme.gridColor}
          color2={theme.dgColor}
          yAxisSuffix=" kWh"
          maxValue={Math.max(...gridData.map((d) => d.value), ...dgData.map((d) => d.value)) + 5 || 10}
        />

        <ChartBox
          title="COST CONSUMPTION"
          unit="(₹)"
          onPressArrow={() =>
            router.push({
              pathname: '/report/(chart)/CostFullChart',
              params: {
                title: 'COST CONSUMPTION (₹)',
                yAxisSuffix: '₹',
                color1: theme.gridColor,
                color2: theme.dgColor,
                data1: JSON.stringify(costData),
                data2: JSON.stringify(dgCostData),
              },
            })
          }
          data1={costData}
          data2={dgCostData}
          color1={theme.gridColor}
          color2={theme.dgColor}
          yAxisSuffix=" ₹"
          maxValue={Math.max(...costData.map((d) => d.value), ...dgCostData.map((d) => d.value)) + 100 || 100}
        />
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/report')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.mainTitle}>Daily Report</Text>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Show Values</Text>
          <Switch
            value={showValues}
            onValueChange={setShowValues}
            trackColor={{ false: theme.textSecondary, true: theme.accent }}
            thumbColor={theme.textPrimary}
          />
        </View>
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
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    color: theme.textPrimary,
    fontSize: 14,
    marginRight: 8,
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
    padding: 16,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    marginTop: 15,
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
  unitText: {
    textAlign: 'center',
    color: theme.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    fontSize: 16,
    color: theme.error,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default DailyReport;