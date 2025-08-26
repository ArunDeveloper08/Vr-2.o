

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../../context/AuthContext';
// import axios from 'axios';

// // Colors
// const GRID_COLOR = '#28B9A9'; // Teal green for Grid
// const DG_COLOR = '#FF6347'; // Tomato for DG

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
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         );

   

//         if (response.data.ApiStatus === 'TRUE') {
//           if (response.data.Data && response.data.Data.length > 0) {
//             setChartData(response.data.Data);
//           } else {
//             setError('No data available for the selected period.');
//             Alert.alert(
//               'No Data Available',
//               'There are no meter history records for the selected period. Please try a different period or contact support.',
//               [{ text: 'OK', style: 'default' }],
//               { cancelable: false }
//             );
//           }
//         } else {
//           throw new Error(response.data.ApiMessage || 'API request failed');
//         }
//       } catch (err) {
//         console.error('API Error:', {
//           message: err.message,
//           status: err.response?.status,
//           data: err.response?.data,
//         });
//         const errorMessage = err.response?.data?.ApiMessage || err.message || 'Failed to fetch data';
//         setError(errorMessage);
//         Alert.alert('Error', errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Process data for charts
//   const gridData = chartData.map((item, index) => ({
//     value:
//       index === 0
//         ? 0
//         : +(item.kwhMainActual - chartData[index - 1].kwhMainActual).toFixed(1),
//     label: formatDate(item.RecordDate),
//   }));

//   const dgData = chartData.map((item, index) => ({
//     value:
//       index === 0
//         ? 0
//         : +(item.kwhdgActual - chartData[index - 1].kwhdgActual).toFixed(1),
//     label: formatDate(item.RecordDate),
//   }));

//   const costData = chartData.map((item, index) => ({
//     value:
//       index === 0
//         ? 0
//         : +(item.mAINcHARGES - chartData[index - 1].mAINcHARGES).toFixed(1),
//     label: formatDate(item.RecordDate),
//   }));

//   const dgCostData = chartData.map((item, index) => ({
//     value:
//       index === 0
//         ? 0
//         : +(item.dgcharges - chartData[index - 1].dgcharges).toFixed(1),
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
//           <Ionicons name="expand-outline" size={20} color="#003366" />
//         </TouchableOpacity>
//       </View>

//       <LineChart
//         data={data1}
//         data2={data2}
//         thickness={2}
//         color={color1}
//         color2={color2}
//         noOfSections={4}
//         maxValue={maxValue}
//         yAxisLabelTexts={Array.from({ length: 5 }, (_, i) =>
//           (i * (maxValue / 4)).toFixed(0)
//         )}
//         xAxisLabelTextStyle={{ fontSize: 10 }}
//         yAxisTextStyle={{ fontSize: 10 }}
//         yAxisSuffix={yAxisSuffix}
//         hideDataPoints={false}
//         spacing={40}
//         isAnimated
//       />

//       <View style={styles.legendBox}>
//         <Text style={[styles.legend, { color: color1 }]}>⬤ GRID</Text>
//         <Text style={[styles.legend, { color: color2 }]}>⬤ DG</Text>
//       </View>

//       <Text style={styles.unitText}>{unit}</Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#28B9A9" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <View style={[styles.header, { backgroundColor: '#28B9A9' }]}>
//           <View style={styles.headerContent}>
//             <TouchableOpacity onPress={() => router.replace('/report')}>
//               <Ionicons name="arrow-back" size={24} color="white" />
//             </TouchableOpacity>
//             <Text style={styles.mainTitle}>REPORT {'>'} DAILY</Text>
//           </View>
//         </View>
//         <Text style={styles.unitLabel}>UNIT S2-0203</Text>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
//       <View style={[styles.header, { backgroundColor: '#28B9A9' }]}>
//         <View style={styles.headerContent}>
//           <TouchableOpacity onPress={() => router.replace('/report')}>
//             <Ionicons name="arrow-back" size={24} color="white" />
//           </TouchableOpacity>
//           <Text style={styles.mainTitle}>REPORT {'>'} DAILY</Text>
//         </View>
//       </View>

//       <Text style={styles.unitLabel}>UNIT S2-0203</Text>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <ChartBox
//           title="GRID/DG CONSUMPTION"
//           unit="(kWh)"
//           onPressArrow={() =>
//             router.push({
//               pathname: '/report/(chart)/DailyFullChart',
//               params: {
//                 title: 'GRID/DG CONSUMPTION (kWh)',
//                 yAxisSuffix: 'kWh',
//                 color1: GRID_COLOR,
//                 color2: DG_COLOR,
//                 data1: JSON.stringify(gridData),
//                 data2: JSON.stringify(dgData),
//               },
//             })
//           }
//           data1={gridData}
//           data2={dgData}
//           color1={GRID_COLOR}
//           color2={DG_COLOR}
//           yAxisSuffix="kWh"
//           maxValue={
//             Math.max(
//               ...gridData.map((d) => d.value),
//               ...dgData.map((d) => d.value)
//             ) + 5
//           }
//         />

//         <ChartBox
//           title="COST CONSUMPTION"
//           unit="(Rs)"
//           onPressArrow={() =>
//             router.push({
//               pathname: '/report/(chart)/CostFullChart',
//               params: {
//                 title: 'COST CONSUMPTION (Rs)',
//                 yAxisSuffix: 'Rs',
//                 color1: GRID_COLOR,
//                 color2: DG_COLOR,
//                 data1: JSON.stringify(costData),
//                 data2: JSON.stringify(dgCostData),
//               },
//             })
//           }
//           data1={costData}
//           data2={dgCostData}
//           color1={GRID_COLOR}
//           color2={DG_COLOR}
//           yAxisSuffix="Rs"
//           maxValue={
//             Math.max(
//               ...costData.map((d) => d.value),
//               ...dgCostData.map((d) => d.value)
//             ) + 100
//           }
//         />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     padding: 15,
//     paddingTop: 40,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   mainTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginLeft: 10,
//   },
//   unitLabel: {
//     fontSize: 22,
//     fontWeight: '700',
//     textAlign: 'center',
//     marginVertical: 20,
//     color: '#2D3436',
//   },
//   scrollContent: {
//     padding: 16,
//   },
//   chartContainer: {
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 20,
//     elevation: 2,
//   },
//   chartHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   chartTitle: {
//     fontWeight: '600',
//     fontSize: 14,
//     color: '#003366',
//   },
//   legendBox: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 10,
//     marginTop: 10,
//   },
//   legend: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
//   unitText: {
//     textAlign: 'center',
//     color: '#333',
//     fontSize: 12,
//     marginTop: 4,
//   },
//   errorText: {
//     fontSize: 16,
//     color: 'red',
//     textAlign: 'center',
//   },
// });

// export default DailyReport;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

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

  // Process data for charts
  const gridData = chartData.map((item, index) => ({
    value: index === 0 ? 0 : +(item.kwhMainActual - chartData[index - 1].kwhMainActual).toFixed(1),
    label: formatDate(item.RecordDate),
  }));

  const dgData = chartData.map((item, index) => ({
    value: index === 0 ? 0 : +(item.kwhdgActual - chartData[index - 1].kwhdgActual).toFixed(1),
    label: formatDate(item.RecordDate),
  }));

  const costData = chartData.map((item, index) => ({
    value: index === 0 ? 0 : +(item.mAINcHARGES - chartData[index - 1].mAINcHARGES).toFixed(1),
    label: formatDate(item.RecordDate),
  }));

  const dgCostData = chartData.map((item, index) => ({
    value: index === 0 ? 0 : +(item.dgcharges - chartData[index - 1].dgcharges).toFixed(1),
    label: formatDate(item.RecordDate),
  }));

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
        {/* <TouchableOpacity onPress={onPressArrow}>
          <Ionicons name="expand-outline" size={24} color={theme.accent} />
        </TouchableOpacity> */}
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
        hideDataPoints
        rulesColor="#333858"
        xAxisColor="#333858"
        yAxisColor="#333858"
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