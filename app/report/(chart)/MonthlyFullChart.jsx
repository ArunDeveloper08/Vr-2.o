import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Import useLocalSearchParams
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window'); // Removed height as it's not directly used for fixed height chart anymore

// --- UI Theme Colors (Matching your MonthlyChartScreen for consistency) ---
const theme = {
  background: '#0F142D', // Dark navy background
  card: '#1C203A', // Darker card background
  textPrimary: '#FFFFFF', // White text
  textSecondary: '#A9A9B2', // Light grey for subtitles
  accent: '#00A3FF', // Bright blue for highlights
  gridColor: '#00A3FF', // Blue for Grid data
  dgColor: '#FFA500', // Orange for DG data
  error: '#FF6347', // Red for error messages

  // Additional colors for table and other elements
  tableHeaderBg: '#2C3252',
  tableRowEven: '#1C203A',
  tableRowOdd: '#141830',
};

const MonthlyFullChart = () => {
  const router = useRouter();
  const params = useLocalSearchParams(); // Use useLocalSearchParams to get route parameters

  const [isLoading, setIsLoading] = useState(true);
  const [highlight, setHighlight] = useState(null); // null, 'GRID', or 'DG'
  const [isAreaChart, setIsAreaChart] = useState(true); // Toggle area chart fill
  const [tooltip, setTooltip] = useState({ visible: false, value: 0, x: 0, y: 0, dataset: '' });

  // Extract data from params and parse it
  const chartTitle = params.title || 'Report Chart';
  const yAxisSuffix = params.yAxisSuffix || '';
  const color1 = params.color1 || theme.gridColor; // Default to theme color if not provided
  const color2 = params.color2 || theme.dgColor;   // Default to theme color if not provided

  let rawGridData = [];
  let rawDgData = [];

  try {
    rawGridData = params.data1 ? JSON.parse(params.data1) : [];
    rawDgData = params.data2 ? JSON.parse(params.data2) : [];
  } catch (e) {
    console.error("Error parsing chart data from params:", e);
  }

  // Combine data for the table: [{ label, gridValue, dgValue }]
  const tableData = rawGridData.map((gridItem, index) => {
    const dgItem = rawDgData[index];
    return {
      label: gridItem.label, // e.g., "Jan '25"
      gridValue: gridItem.value,
      dgValue: dgItem ? dgItem.value : 0, // Ensure DG data exists
    };
  });

  // Calculate max value for chart based on actual data
  const chartMaxValue = Math.max(
    ...rawGridData.map(d => d.value),
    ...rawDgData.map(d => d.value)
  ) + (chartTitle.includes('COST') ? 100 : 50); // Add a buffer, more for cost
  const finalChartMaxValue = isNaN(chartMaxValue) ? 100 : chartMaxValue; // Default if no data

  useEffect(() => {
    // Simulate loading for 1 second
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLegendPress = (type) => {
    setHighlight(type === highlight ? null : type); // Toggle highlight
  };

  const handleDataPointPress = (data, index, dataset, x, y) => {
    setTooltip({
      visible: true,
      value: data.value,
      x: x,
      y: y,
      dataset,
    });
    // Hide tooltip after 2 seconds
    setTimeout(() => setTooltip({ ...tooltip, visible: false }), 2000);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.accent} />
        <Text style={styles.loadingText}>Loading Chart...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
     <TouchableOpacity onPress={() => router.replace('/report/monthly')}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.mainTitle}>{chartTitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Chart Section */}
        <View style={styles.chartBox}>
          <LineChart
            data={rawGridData}
            data2={rawDgData}
            spacing={width / (rawGridData.length > 1 ? rawGridData.length : 2) - 30} // Dynamic spacing based on number of points
            thickness={3}
            color={color1}
            color2={color2}
            hideRules
            showVerticalLines
            showXAxisIndices
            xAxisLabelTextStyle={styles.axisText}
            yAxisTextStyle={styles.axisText}
            yAxisSuffix={yAxisSuffix}
            maxValue={finalChartMaxValue}
            areaChart={isAreaChart}
            areaChart2={isAreaChart}
            startFillColor={color1}
            startOpacity={highlight === 'DG' ? 0.1 : highlight === 'GRID' ? 0.4 : 0.4}
            endOpacity={highlight === 'DG' ? 0.05 : highlight === 'GRID' ? 0.1 : 0.1}
            startFillColor2={color2}
            startOpacity2={highlight === 'GRID' ? 0.1 : highlight === 'DG' ? 0.4 : 0.4}
            endOpacity2={highlight === 'GRID' ? 0.05 : highlight === 'DG' ? 0.1 : 0.1}
            dataPointsColor={color1}
            dataPointsColor2={color2}
            onPress={(item, index, x, y) => handleDataPointPress(item, index, 'GRID', x, y)}
            onPress2={(item, index, x, y) => handleDataPointPress(item, index, 'DG', x, y)}
            width={width - 70} // Adjusted width to fit within padding and give some margin
            height={250} // Fixed height for consistency
            xAxisColor="#333858" // Match main chart
            yAxisColor="#333858" // Match main chart
            rulesColor="#333858" // Match main chart
            initialSpacing={10}
            endSpacing={10}
          />
          {tooltip.visible && (
            <View
              style={[
                styles.tooltip,
                { left: tooltip.x, top: tooltip.y - 30 }, // Adjust tooltip position
              ]}
            >
              <Text style={styles.tooltipText}>
                {tooltip.dataset}: {tooltip.value} {yAxisSuffix}
              </Text>
            </View>
          )}

          <View style={styles.legend}>
            <TouchableOpacity style={styles.legendItem} onPress={() => handleLegendPress('GRID')}>
              <View style={[styles.dot, { backgroundColor: color1, opacity: highlight === 'DG' ? 0.3 : 1 }]} />
              <Text style={[styles.legendText, { opacity: highlight === 'DG' ? 0.5 : 1 }]}>GRID</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.legendItem} onPress={() => handleLegendPress('DG')}>
              <View style={[styles.dot, { backgroundColor: color2, opacity: highlight === 'GRID' ? 0.3 : 1, marginLeft: 20 }]} />
              <Text style={[styles.legendText, { opacity: highlight === 'GRID' ? 0.5 : 1 }]}>DG</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Area Chart</Text>
            <Switch
              value={isAreaChart}
              onValueChange={setIsAreaChart}
              trackColor={{ false: theme.textSecondary, true: theme.accent }}
              thumbColor={isAreaChart ? theme.textPrimary : theme.textPrimary}
            />
          </View>
        </View>

        {/* Data Table Section */}
        {tableData.length > 0 && (
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 2 }]}>Date</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Grid {yAxisSuffix}</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>DG {yAxisSuffix}</Text>
            </View>
            {tableData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  { backgroundColor: index % 2 === 0 ? theme.tableRowEven : theme.tableRowOdd },
                ]}
              >
                <Text style={[styles.tableCell, { flex: 2 }]}>{item.label}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.gridValue.toFixed(2)}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{item.dgValue.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MonthlyFullChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    backgroundColor: theme.background,
    padding: 15,
    paddingTop: 50, // Adjusted padding for safe area, assuming it's not wrapped in SafeAreaView here
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2C3252',
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginLeft: 10,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30, // Extra padding at bottom for scrollability
    alignItems: 'center',
  },
  chartBox: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20, // Space between chart and table
    width: width - 32, // Match parent padding
  },
  axisText: {
    color: theme.textSecondary,
    fontSize: 10,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: theme.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.accent,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 4,
    padding: 6,
    elevation: 5,
  },
  tooltipText: {
    color: theme.textPrimary,
    fontSize: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#333858', // Separator line
  },
  toggleLabel: {
    fontSize: 14,
    color: theme.textPrimary,
    marginRight: 10,
  },

  // --- Table Styles ---
  tableContainer: {
    backgroundColor: theme.card,
    borderRadius: 12,
    width: width - 32,
    overflow: 'hidden', // Ensures border radius applies to children
    marginBottom: 20, // Add some space at the bottom
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.tableHeaderBg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333858',
  },
  tableHeaderText: {
    color: theme.textSecondary,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C3252',
  },
  tableCell: {
    color: theme.textPrimary,
    fontSize: 13,
    textAlign: 'left',
  },
});