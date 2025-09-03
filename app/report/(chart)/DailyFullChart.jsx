import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';

const screenWidth = Dimensions.get('window').width;

// Theme colors
const theme = {
  background: '#0F142D',
  card: '#1C203A',
  textPrimary: '#FFFFFF',
  textSecondary: '#A9A9B2',
  gridColor: '#00A3FF',
  dgColor: '#FFA500',
  accent: '#00A3FF',
  error: '#FF6347',
};

export default function DailyFullChart() {
  const router = useRouter();
  const { title, yAxisSuffix, data1, data2, color1, color2 } = useLocalSearchParams();
  const [chartType, setChartType] = useState('line'); // 'line' or 'bar'
  const [showTable, setShowTable] = useState(true);

  const parsedData1 = JSON.parse(data1);
  const parsedData2 = JSON.parse(data2);

  // Calculate max value with some padding
  const maxValue = Math.max(
    ...parsedData1.map((d) => d.value), 
    ...parsedData2.map((d) => d.value)
  ) * 1.2;

  // Prepare table data
  const tableData = parsedData1.map((gridItem, index) => {
    const dgItem = parsedData2[index];
    return {
      date: gridItem.label,
      gridConsumption: gridItem.value,
      dgConsumption: dgItem.value,
      totalConsumption: gridItem.value + dgItem.value,
    };
  });

  // Calculate totals for the table footer
  const totals = tableData.reduce(
    (acc, item) => {
      acc.grid += item.gridConsumption;
      acc.dg += item.dgConsumption;
      acc.total += item.totalConsumption;
      return acc;
    },
    { grid: 0, dg: 0, total: 0 }
  );

  // Render the appropriate chart based on chartType
  const renderChart = () => {
    const commonProps = {
      data: parsedData1,
      data2: parsedData2,
      thickness: 3,
      color: color1,
      color2: color2,
      noOfSections: 6,
      spacing: screenWidth / parsedData1.length,
      isAnimated: true,
      yAxisSuffix: yAxisSuffix,
      maxValue: maxValue,
      height: 300,
      initialSpacing: 10,
      xAxisLabelTextStyle: { fontSize: 10, color: theme.textSecondary },
      yAxisTextStyle: { fontSize: 10, color: theme.textSecondary },
      rulesColor: '#333858',
      xAxisColor: '#333858',
      yAxisColor: '#333858',
    };

    if (chartType === 'line') {
      return (
        <LineChart
          {...commonProps}
          hideDataPoints={false}
          dataPointsColor={color1}
          dataPointsColor2={color2}
        />
      );
    } else {
      return (
        <BarChart
          {...commonProps}
          barWidth={screenWidth / (parsedData1.length * 3)}
          barBorderRadius={4}
          frontColor={color1}
          frontColor2={color2}
          showValuesAsTopLabel
          topLabelTextStyle={{ color: theme.textPrimary, fontSize: 10 }}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Chart Type Toggle */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[styles.controlButton, chartType === 'line' && styles.activeControlButton]}
            onPress={() => setChartType('line')}
          >
            <Ionicons 
              name="analytics-outline" 
              size={20} 
              color={chartType === 'line' ? theme.textPrimary : theme.textSecondary} 
            />
            <Text style={[
              styles.controlButtonText, 
              chartType === 'line' && styles.activeControlButtonText
            ]}>
              Line Chart
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, chartType === 'bar' && styles.activeControlButton]}
            onPress={() => setChartType('bar')}
          >
            <Ionicons 
              name="bar-chart-outline" 
              size={20} 
              color={chartType === 'bar' ? theme.textPrimary : theme.textSecondary} 
            />
            <Text style={[
              styles.controlButtonText, 
              chartType === 'bar' && styles.activeControlButtonText
            ]}>
              Bar Chart
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chart Container */}
        <View style={styles.chartContainer}>
          {renderChart()}
        </View>

        {/* Legend */}
        <View style={styles.legendBox}>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: color1 }]} />
            <Text style={styles.legendText}>GRID Consumption</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: color2 }]} />
            <Text style={styles.legendText}>DG Consumption</Text>
          </View>
        </View>

        {/* Table Toggle */}
        <TouchableOpacity 
          style={styles.tableToggle}
          onPress={() => setShowTable(!showTable)}
        >
          <Text style={styles.tableToggleText}>
            {showTable ? 'Hide Data Table' : 'Show Data Table'}
          </Text>
          <Ionicons 
            name={showTable ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={theme.accent} 
          />
        </TouchableOpacity>

        {/* Data Table */}
        {showTable && (
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>DAILY CONSUMPTION DATA</Text>
            
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.tableCell, {flex: 1.5}]}>Date</Text>
              <Text style={[styles.tableHeaderText, styles.tableCell, {flex: 1}]}>Grid (kWh)</Text>
              <Text style={[styles.tableHeaderText, styles.tableCell, {flex: 1}]}>DG (kWh)</Text>
              <Text style={[styles.tableHeaderText, styles.tableCell, {flex: 1}]}>Total (kWh)</Text>
            </View>
            
            {/* Table Rows */}
            {tableData.map((item, index) => (
              <View key={index} style={[
                styles.tableRow, 
                index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
              ]}>
                <Text style={[styles.tableCellText, styles.tableCell, {flex: 1.5}]}>{item.date}</Text>
                <Text style={[styles.tableCellText, styles.tableCell, {flex: 1, color: theme.gridColor}]}>
                  {item.gridConsumption.toFixed(1)}
                </Text>
                <Text style={[styles.tableCellText, styles.tableCell, {flex: 1, color: theme.dgColor}]}>
                  {item.dgConsumption.toFixed(1)}
                </Text>
                <Text style={[styles.tableCellText, styles.tableCell, {flex: 1, fontWeight: 'bold'}]}>
                  {item.totalConsumption.toFixed(1)}
                </Text>
              </View>
            ))}
            
            {/* Table Footer with Totals */}
            <View style={[styles.tableRow, styles.tableFooter]}>
              <Text style={[styles.tableCellText, styles.tableCell, {flex: 1.5, fontWeight: 'bold'}]}>TOTAL</Text>
              <Text style={[styles.tableCellText, styles.tableCell, {flex: 1, color: theme.gridColor, fontWeight: 'bold'}]}>
                {totals.grid.toFixed(1)}
              </Text>
              <Text style={[styles.tableCellText, styles.tableCell, {flex: 1, color: theme.dgColor, fontWeight: 'bold'}]}>
                {totals.dg.toFixed(1)}
              </Text>
              <Text style={[styles.tableCellText, styles.tableCell, {flex: 1, fontWeight: 'bold'}]}>
                {totals.total.toFixed(1)}
              </Text>
            </View>
          </View>
        )}

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, {borderLeftColor: theme.gridColor}]}>
            <Text style={styles.summaryLabel}>Total Grid</Text>
            <Text style={[styles.summaryValue, {color: theme.gridColor}]}>
              {totals.grid.toFixed(1)} kWh
            </Text>
          </View>
          <View style={[styles.summaryCard, {borderLeftColor: theme.dgColor}]}>
            <Text style={styles.summaryLabel}>Total DG</Text>
            <Text style={[styles.summaryValue, {color: theme.dgColor}]}>
              {totals.dg.toFixed(1)} kWh
            </Text>
          </View>
          <View style={[styles.summaryCard, {borderLeftColor: theme.accent}]}>
            <Text style={styles.summaryLabel}>Total Combined</Text>
            <Text style={[styles.summaryValue, {color: theme.accent}]}>
              {totals.total.toFixed(1)} kWh
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textPrimary,
    textAlign: 'center',
    flex: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 15,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: theme.card,
    gap: 5,
  },
  activeControlButton: {
    backgroundColor: theme.accent,
  },
  controlButtonText: {
    color: theme.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  activeControlButtonText: {
    color: theme.textPrimary,
  },
  chartContainer: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  legendBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
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
    fontSize: 12,
  },
  tableToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
    backgroundColor: theme.card,
    borderRadius: 8,
    gap: 5,
  },
  tableToggleText: {
    color: theme.accent,
    fontWeight: '600',
  },
  tableContainer: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  tableTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: theme.textPrimary,
    textAlign: 'center',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#333858',
    paddingBottom: 10,
    marginBottom: 10,
  },
  tableHeaderText: {
    color: theme.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  tableRowEven: {
    backgroundColor: 'rgba(51, 56, 88, 0.3)',
  },
  tableRowOdd: {
    backgroundColor: 'rgba(51, 56, 88, 0.1)',
  },
  tableFooter: {
    borderTopWidth: 2,
    borderTopColor: '#333858',
    backgroundColor: 'rgba(0, 163, 255, 0.2)',
  },
  tableCell: {
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCellText: {
    color: theme.textPrimary,
    fontSize: 11,
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
  },
  summaryLabel: {
    color: theme.textSecondary,
    fontSize: 10,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});