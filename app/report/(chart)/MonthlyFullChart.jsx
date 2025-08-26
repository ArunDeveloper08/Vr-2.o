import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-gifted-charts';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const gridData = [
  { value: 40 },
  { value: 50 },
  { value: 90 },
  { value: 120 },
  { value: 180 },
];

const dgData = [
  { value: 20 },
  { value: 40 },
  { value: 70 },
  { value: 30 },
  { value: 60 },
];

const xLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY'];

const MonthlyFullChart = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [highlight, setHighlight] = useState(null); // null, 'GRID', or 'DG'
  const [isAreaChart, setIsAreaChart] = useState(true); // Toggle area chart fill
  const [tooltip, setTooltip] = useState({ visible: false, value: 0, x: 0, y: 0 });

  useEffect(() => {
    // Simulate loading for 1 second
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLegendPress = (type) => {
    setHighlight(type === highlight ? null : type); // Toggle highlight
  };

  const handleDataPointPress = (data, index, dataset) => {
    setTooltip({
      visible: true,
      value: data.value,
      x: index * 40 + 50, // Approximate x position based on spacing
      y: height - (data.value / 200) * (height - 200) - 100, // Approximate y position
      dataset,
    });
    // Hide tooltip after 2 seconds
    setTimeout(() => setTooltip({ ...tooltip, visible: false }), 2000);
  };

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
        <TouchableOpacity onPress={() => router.replace('/report/monthly')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.mainTitle}>REPORT {'>'} MONTHLY {'>'} GRID/DG CONSUMPTION</Text>
      </View>

      <ScrollView contentContainerStyle={styles.chartContainer}>
        <View style={styles.chartBox}>
          <LineChart
            data={gridData}
            data2={dgData}
            spacing={40}
            thickness={2}
            hideRules
            showVerticalLines
            showXAxisIndices
            xAxisLabelTexts={xLabels}
            xAxisLabelTextStyle={styles.axisText}
            yAxisTextStyle={styles.axisText}
            maxValue={200}
            areaChart={isAreaChart}
            areaChart2={isAreaChart}
            startFillColor="#003366"
            startOpacity={highlight === 'DG' ? 0.1 : highlight === 'GRID' ? 0.4 : 0.4}
            endOpacity={highlight === 'DG' ? 0.05 : highlight === 'GRID' ? 0.1 : 0.1}
            startFillColor2="#C81D4D"
            startOpacity2={highlight === 'GRID' ? 0.1 : highlight === 'DG' ? 0.4 : 0.4}
            endOpacity2={highlight === 'GRID' ? 0.05 : highlight === 'DG' ? 0.1 : 0.1}
            dataPointsColor="#003366"
            dataPointsColor2="#C81D4D"
            onPress={(data, index) => handleDataPointPress(data, index, 'GRID')}
            onPress2={(data, index) => handleDataPointPress(data, index, 'DG')}
            width={width - 40}
            height={height - 200}
          />
          {tooltip.visible && (
            <View
              style={[
                styles.tooltip,
                { left: tooltip.x, top: tooltip.y },
              ]}
            >
              <Text style={styles.tooltipText}>
                {tooltip.dataset}: {tooltip.value} kWh
              </Text>
            </View>
          )}
          <Text style={styles.unitLabel}>kWh</Text>
          <View style={styles.legend}>
            <TouchableOpacity style={styles.legendItem} onPress={() => handleLegendPress('GRID')}>
              <View style={[styles.dot, { backgroundColor: '#003366', opacity: highlight === 'DG' ? 0.3 : 1 }]} />
              <Text style={[styles.legendText, { opacity: highlight === 'DG' ? 0.5 : 1 }]}>GRID</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.legendItem} onPress={() => handleLegendPress('DG')}>
              <View style={[styles.dot, { backgroundColor: '#C81D4D', opacity: highlight === 'GRID' ? 0.3 : 1, marginLeft: 20 }]} />
              <Text style={[styles.legendText, { opacity: highlight === 'GRID' ? 0.5 : 1 }]}>DG</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Area Chart</Text>
            <Switch
              value={isAreaChart}
              onValueChange={setIsAreaChart}
              trackColor={{ false: '#767577', true: '#28B9A9' }}
              thumbColor={isAreaChart ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MonthlyFullChart;

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
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
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
    fontSize: 10,
  },
  unitLabel: {
    textAlign: 'right',
    fontSize: 12,
    color: '#777',
    marginTop: 8,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
    marginLeft: 6,
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