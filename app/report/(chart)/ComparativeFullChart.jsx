import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Switch } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { BarChart } from 'react-native-gifted-charts';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const data = [
//  { value: 65, label: '2024-05', frontColor: '#003366', type: 'GRID', labelTextStyle: styles.labelText },

 // { value: 1, label: '2025-05', frontColor: '#003366', type: 'GRID', labelTextStyle: styles.labelText }, 
 { value: 0, label: "2025-05", frontColor: "#003366"  },
 { value: 70, label: "2024-05", frontColor: "#003366" },
];

const ComparativeFullChart = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [highlight, setHighlight] = useState(null); // null, 'GRID', or 'DG'
  const [showBarBorder, setShowBarBorder] = useState(false); // Toggle bar border
  const [tooltip, setTooltip] = useState({ visible: false, value: 0, x: 0, y: 0, type: '' });

  const currentDate = new Date();
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const currentMonth = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    // Simulate loading for 1 second
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLegendPress = (type) => {
    setHighlight(type === highlight ? null : type); // Toggle highlight
  };

  const handleBarPress = (item, index) => {
    setTooltip({
      visible: true,
      value: item.value,
      x: index * 80 + 50, // Approximate x position
      y: height - (item.value / 150) * (height - 300) - 150, // Approximate y position
      type: item.type,
    });
    // Hide tooltip after 2 seconds
    setTimeout(() => setTooltip({ ...tooltip, visible: false }), 2000);
  };

  const filteredData = data.map((item) => ({
    ...item,
    frontColor: highlight && highlight !== item.type ? `${item.frontColor}` : item.frontColor, // Fade non-highlighted bars
  }));

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
        <Text style={styles.loadingText}>Loading Chart...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.mainTitle}>REPORT {'>'} COMPARATIVE {'>'} GRID/DG CONSUMPTION</Text>
        <View style={styles.dateBox}>
          <Text style={styles.dateText}>{currentMonth}</Text>
          <Text style={styles.yearText}>{currentYear}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.chartContainer}>
        <View style={styles.chartBox}>
          <BarChart
            data={filteredData}
            barWidth={40} // Wider bars
            spacing={10}  // Closer spacing for bars of the same date
            hideRules
            yAxisLabel="(kWh) "
            noOfSections={5}
            maxValue={150} // Adjusted for total height
            yAxisThickness={0}
            xAxisColor="#000"
            xAxisLabelTextStyle={styles.axisText}
            yAxisTextStyle={styles.axisText}
            width={width - 40}
            height={height - 300}
            onPress={handleBarPress}
            barBorderWidth={showBarBorder ? 2 : 0}
            barBorderColor={showBarBorder ? '#333' : 'transparent'}
            showValuesAsTopLabel // Show values on top of bars
            topLabelTextStyle={styles.topLabelText}
          />
          {tooltip.visible && (
            <View
              style={[
                styles.tooltip,
                { left: tooltip.x, top: tooltip.y },
              ]}
            >
              <Text style={styles.tooltipText}>
                {tooltip.type}: {tooltip.value} kWh
              </Text>
            </View>
          )}
          <View style={styles.legendContainer}>
            <TouchableOpacity style={styles.legendItem} onPress={() => handleLegendPress('GRID')}>
              <View style={[styles.legendDot, { backgroundColor: '#003366', opacity: highlight === 'DG' ? 0.3 : 1 }]} />
              <Text style={[styles.legendText, { opacity: highlight === 'DG' ? 0.5 : 1 }]}>GRID</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.legendItem} onPress={() => handleLegendPress('DG')}>
              <View style={[styles.legendDot, { backgroundColor: '#B22222', opacity: highlight === 'GRID' ? 0.3 : 1 }]} />
              <Text style={[styles.legendText, { opacity: highlight === 'GRID' ? 0.5 : 1 }]}>DG</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Bar Border</Text>
            <Switch
              value={showBarBorder}
              onValueChange={setShowBarBorder}
              trackColor={{ false: '#767577', true: '#B22222' }}
              thumbColor={showBarBorder ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ComparativeFullChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#28B9A9',
    padding: 15,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
    flex: 1,
  },
  dateBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  dateText: {
    color: '#B22222',
    fontSize: 12,
    fontWeight: 'bold',
  },
  yearText: {
    color: '#B22222',
    fontSize: 10,
  },
  chartContainer: {
    padding: 20,
    alignItems: 'center',
  },
  chartBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: width - 40,
  },
  axisText: {
    color: '#333',
    fontSize: 12,
  },
  labelText: {
    color: '#333',
    fontSize: 12,
  },
  topLabelText: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 13,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#003366',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#333',
    borderRadius: 4,
    padding: 6,
    elevation: 5,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#333',
    marginRight: 10,
  },
});