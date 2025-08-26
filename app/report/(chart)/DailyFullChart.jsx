// import React from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   SafeAreaView,
//   Dimensions,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// const screenWidth = Dimensions.get('window').width;

// const rawData = [
//   { value: 0, label: '2025-05-01' },
//   { value: 10, label: '2025-05-02' },
//   { value: 5, label: '2025-05-03' },
//   { value: 7, label: '2025-05-04' },
//   { value: 0, label: '2025-05-05' },
//   { value: 3, label: '2025-05-06' },
// ];

// // Format labels to "01 May 2025"
// const chartData = rawData.map(item => {
//   const date = new Date(item.label);
//   const formatted = date.toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   });
//   return { ...item, label: formatted };
// });

// export default function DailyFullChart() {
//   const router = useRouter();

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => router.replace('/report/daily')}>
//             <Ionicons name="arrow-back" size={24} color="#003366" />
//           </TouchableOpacity>
//           <Text style={styles.title}>GRID/DG CONSUMPTION (kWh)</Text>
//           <View style={{ width: 24 }} /> {/* to balance back icon space */}
//         </View>

//         <LineChart
//           data={chartData}
//           thickness={3}
//           color="#C81D4D"
//           noOfSections={6}
//           spacing={screenWidth / 6}
//           hideDataPoints={false}
//           isAnimated
//           xAxisLabelTextStyle={{ fontSize: 10, rotation: 45, width: 70 }}
//           yAxisTextStyle={{ fontSize: 10 }}
//           yAxisLabelTexts={['0', '5', '10', '15']}
//           maxValue={15}
//           height={400}
//           initialSpacing={10}
//         />

//         <View style={styles.legendBox}>
//           <Text style={[styles.legend, { color: '#003366' }]}>⬤ GRID</Text>
//           <Text style={[styles.legend, { color: '#C81D4D' }]}>⬤ DG</Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#003366',
//     textAlign: 'center',
//     flex: 1,
//   },
//   legendBox: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 10,
//     marginTop: 20,
//   },
//   legend: {
//     fontSize: 12,
//     fontWeight: '500',
//   },
// });


import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

export default function DailyFullChart() {
  const router = useRouter();
  const { title, yAxisSuffix, data1, data2, color1, color2 } = useLocalSearchParams();

  const parsedData1 = JSON.parse(data1);
  const parsedData2 = JSON.parse(data2);

  const maxValue =
    Math.max(...parsedData1.map((d) => d.value), ...parsedData2.map((d) => d.value)) + 5;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/report/daily')}>
            <Ionicons name="arrow-back" size={24} color="#003366" />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={{ width: 24 }} /> {/* for spacing */}
        </View>

        <LineChart
          data={parsedData1}
          data2={parsedData2}
          thickness={3}
          color={color1}
          color2={color2}
          noOfSections={6}
          spacing={screenWidth / parsedData1.length}
          hideDataPoints={false}
          isAnimated
          xAxisLabelTextStyle={{ fontSize: 10, rotation: 45, width: 70 }}
          yAxisTextStyle={{ fontSize: 10 }}
          yAxisSuffix={yAxisSuffix}
          maxValue={maxValue}
          height={400}
          initialSpacing={10}
        />

        <View style={styles.legendBox}>
          <Text style={[styles.legend, { color: color1 }]}>⬤ GRID</Text>
          <Text style={[styles.legend, { color: color2 }]}>⬤ DG</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    flex: 1,
  },
  legendBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  legend: {
    fontSize: 12,
    fontWeight: '500',
  },
});
