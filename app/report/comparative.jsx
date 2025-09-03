import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useAuth } from '../../context/AuthContext';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// --- UI Theme Colors ---
const theme = {
    background: '#0F142D',
    card: '#1C203A',
    textPrimary: '#FFFFFF',
    textSecondary: '#A9A9B2',
    mainColor: '#00A3FF', // Blue for Grid
    dgColor: '#FFA500',  // Orange for DG
    error: '#FF6347',
};

const Comparative = () => {
    const router = useRouter();
    const { user } = useAuth();

    // State to hold data for each of the four charts
    const [dgConsumptionData, setDgConsumptionData] = useState([]);
    const [gridConsumptionData, setGridConsumptionData] = useState([]);
    const [dgCostData, setDgCostData] = useState([]);
    const [gridCostData, setGridCostData] = useState([]);
    const [tableData, setTableData] = useState([]);

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
                    // Aggregate data into yearly totals for each metric
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

                    // Prepare data for four separate, non-stacked charts
                    // Ensure 'frontColor' is set for each data point for individual bar coloring
                    // And add `topLabelComponent` to customize the label content if needed
                    const dgConsumption = [
                        { value: totals[previousYear].dgConsumption, label: String(previousYear), frontColor: theme.dgColor, topLabelComponent: () => <Text style={styles.barValueText}>{totals[previousYear].dgConsumption.toFixed(0)}</Text> },
                        { value: totals[currentYear].dgConsumption, label: String(currentYear), frontColor: theme.dgColor, topLabelComponent: () => <Text style={styles.barValueText}>{totals[currentYear].dgConsumption.toFixed(0)}</Text> },
                    ];
                    const gridConsumption = [
                        { value: totals[previousYear].mainConsumption, label: String(previousYear), frontColor: theme.mainColor, topLabelComponent: () => <Text style={styles.barValueText}>{totals[previousYear].mainConsumption.toFixed(0)}</Text> },
                        { value: totals[currentYear].mainConsumption, label: String(currentYear), frontColor: theme.mainColor, topLabelComponent: () => <Text style={styles.barValueText}>{totals[currentYear].mainConsumption.toFixed(0)}</Text> },
                    ];
                    const dgCost = [
                        { value: totals[previousYear].dgCost, label: String(previousYear), frontColor: theme.dgColor, topLabelComponent: () => <Text style={styles.barValueText}>₹{totals[previousYear].dgCost.toFixed(0)}</Text> },
                        { value: totals[currentYear].dgCost, label: String(currentYear), frontColor: theme.dgColor, topLabelComponent: () => <Text style={styles.barValueText}>₹{totals[currentYear].dgCost.toFixed(0)}</Text> },
                    ];
                    const gridCost = [
                        { value: totals[previousYear].mainCost, label: String(previousYear), frontColor: theme.mainColor, topLabelComponent: () => <Text style={styles.barValueText}>₹{totals[previousYear].mainCost.toFixed(0)}</Text> },
                        { value: totals[currentYear].mainCost, label: String(currentYear), frontColor: theme.mainColor, topLabelComponent: () => <Text style={styles.barValueText}>₹{totals[currentYear].mainCost.toFixed(0)}</Text> },
                    ];
                    
                    setDgConsumptionData(dgConsumption);
                    setGridConsumptionData(gridConsumption);
                    setDgCostData(dgCost);
                    setGridCostData(gridCost);

                    // Prepare table data
                    const tableData = [
                        {
                            year: previousYear,
                            dgConsumption: totals[previousYear].dgConsumption,
                            gridConsumption: totals[previousYear].mainConsumption,
                            dgCost: totals[previousYear].dgCost,
                            gridCost: totals[previousYear].mainCost,
                            dgPrice: totals[previousYear].dgConsumption > 0 ? 
                                (totals[previousYear].dgCost / totals[previousYear].dgConsumption).toFixed(2) : '0.00',
                            gridPrice: totals[previousYear].mainConsumption > 0 ? 
                                (totals[previousYear].mainCost / totals[previousYear].mainConsumption).toFixed(2) : '0.00'
                        },
                        {
                            year: currentYear,
                            dgConsumption: totals[currentYear].dgConsumption,
                            gridConsumption: totals[currentYear].mainConsumption,
                            dgCost: totals[currentYear].dgCost,
                            gridCost: totals[currentYear].mainCost,
                            dgPrice: totals[currentYear].dgConsumption > 0 ? 
                                (totals[currentYear].dgCost / totals[currentYear].dgConsumption).toFixed(2) : '0.00',
                            gridPrice: totals[currentYear].mainConsumption > 0 ? 
                                (totals[currentYear].mainCost / totals[currentYear].mainConsumption).toFixed(2) : '0.00'
                        }
                    ];
                    setTableData(tableData);

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

    // Function to render a single chart component
    const renderChart = (title, data, unit, color) => (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <View style={[styles.colorIndicator, {backgroundColor: color}]} />
                <Text style={styles.chartTitle}>{title}</Text>
            </View>
            <BarChart
                data={data}
                barWidth={35}
                spacing={40}
                noOfSections={4}
                maxValue={Math.max(...data.map(d => d.value)) * 1.2 || 200}
                yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: theme.textSecondary, textAlign: 'center', fontSize: 10 }}
                rulesColor="#333858"
                xAxisColor="#333858"
                yAxisColor="#333858"
                yAxisThickness={1}
                xAxisThickness={1}
                isAnimated
                showValuesOnTopOfBars={true} // This is the key property
                // topLabelTextStyle property is no longer used when topLabelComponent is provided
                // valueFontSize is ignored when topLabelComponent is provided
                // Instead, the styling for the value comes from `styles.barValueText`
                barBorderRadius={4}
                width={width / 2 - 40} // Ensure enough space for the chart
                // By providing topLabelComponent in the data array, the text will be customized per bar
                // However, you can also define a general topLabelComponent prop here if you don't need per-bar customization
                // For example: topLabelComponent={(item) => <Text style={styles.barValueText}>{item.value.toFixed(0)}</Text>}
            />
            <Text style={styles.chartUnit}>{unit}</Text>
        </View>
    );

    // Function to render the data table
    const renderTable = () => (
        <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>COMPARATIVE DATA SUMMARY</Text>
            
            {/* Table Header */}
            <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.tableCell, {flex: 1}]}>Year</Text>
                <Text style={[styles.tableHeaderText, styles.tableCell, {flex: 1.5}]}>DG Cons. (kWh)</Text>
                <Text style={[styles.tableHeaderText, styles.tableCell, {flex: 1.5}]}>Grid Cons. (kWh)</Text>
                <Text style={[styles.tableHeaderText, styles.tableCell, {flex: 1.2}]}>DG Cost (₹)</Text>
                <Text style={[styles.tableHeaderText, styles.tableCell, {flex: 1.2}]}>Grid Cost (₹)</Text>
            </View>
            
            {/* Table Rows */}
            {tableData.map((item, index) => (
                <View key={index} style={[
                    styles.tableRow, 
                    index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                ]}>
                    <Text style={[styles.tableCellText, styles.tableCell, {flex: 1, fontWeight: 'bold'}]}>{item.year}</Text>
                    <Text style={[styles.tableCellText, styles.tableCell, {flex: 1.5, color: theme.dgColor}]}>{item.dgConsumption.toFixed(2)}</Text>
                    <Text style={[styles.tableCellText, styles.tableCell, {flex: 1.5, color: theme.mainColor}]}>{item.gridConsumption.toFixed(2)}</Text>
                    <Text style={[styles.tableCellText, styles.tableCell, {flex: 1.2, color: theme.dgColor}]}>₹{item.dgCost.toFixed(2)}</Text>
                    <Text style={[styles.tableCellText, styles.tableCell, {flex: 1.2, color: theme.mainColor}]}>₹{item.gridCost.toFixed(2)}</Text>
                </View>
            ))}
            
            {/* Summary Row */}
            <View style={[styles.tableRow, styles.summaryRow]}>
                <Text style={[styles.tableCellText, styles.tableCell, {flex: 1, fontWeight: 'bold'}]}>Total</Text>
                <Text style={[styles.tableCellText, styles.tableCell, {flex: 1.5, color: theme.dgColor, fontWeight: 'bold'}]}>
                    {tableData.reduce((sum, item) => sum + item.dgConsumption, 0).toFixed(2)}
                </Text>
                <Text style={[styles.tableCellText, styles.tableCell, {flex: 1.5, color: theme.mainColor, fontWeight: 'bold'}]}>
                    {tableData.reduce((sum, item) => sum + item.gridConsumption, 0).toFixed(2)}
                </Text>
                <Text style={[styles.tableCellText, styles.tableCell, {flex: 1.2, color: theme.dgColor, fontWeight: 'bold'}]}>
                    ₹{tableData.reduce((sum, item) => sum + item.dgCost, 0).toFixed(2)}
                </Text>
                <Text style={[styles.tableCellText, styles.tableCell, {flex: 1.2, color: theme.mainColor, fontWeight: 'bold'}]}>
                    ₹{tableData.reduce((sum, item) => sum + item.gridCost, 0).toFixed(2)}
                </Text>
            </View>
        </View>
    );

    const renderContent = () => {
        if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color={theme.mainColor} /></View>;
        if (error) return <View style={styles.centered}><Ionicons name="cloud-offline-outline" size={64} color={theme.error} /><Text style={styles.errorText}>{error}</Text></View>;

        return (
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Section 1: Consumption Charts */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ENERGY CONSUMPTION (kWh)</Text>
                    <View style={styles.chartsRow}>
                        {renderChart("DG CONSUMPTION", dgConsumptionData, "kWh", theme.dgColor)}
                        {renderChart("GRID CONSUMPTION", gridConsumptionData, "kWh", theme.mainColor)}
                    </View>
                </View>
                
                {/* Section 2: Cost Charts */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ENERGY COST (₹)</Text>
                    <View style={styles.chartsRow}>
                        {renderChart("DG COST", dgCostData, "₹", theme.dgColor)}
                        {renderChart("GRID COST", gridCostData, "₹", theme.mainColor)}
                    </View>
                </View>
                
                {/* Section 3: Data Table */}
                <View style={styles.section}>
                    {renderTable()}
                </View>
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.background} />
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
        backgroundColor: theme.background,
    },
    backButton: { 
        marginRight: 16,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    mainTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: theme.textPrimary,
        textShadowColor: 'rgba(0, 163, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    scrollContent: { 
        padding: 16, 
        paddingBottom: 30 
    },
    centered: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20 
    },
    errorText: { 
        fontSize: 16, 
        color: theme.error, 
        textAlign: 'center', 
        marginTop: 10 
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.textPrimary,
        marginBottom: 15,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    chartsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap', // Allow charts to wrap if space is too small
        marginBottom: 10,
    },
    chartContainer: {
        backgroundColor: theme.card,
        borderRadius: 12,
        padding: 12,
        width: width / 2 - 20, // Adjusted width to ensure two charts fit with padding
        marginVertical: 5, // Add vertical margin for spacing when wrapping
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'center', // Center title with indicator
    },
    colorIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    chartTitle: {
        fontWeight: '600',
        fontSize: 12,
        color: theme.textPrimary,
    },
    chartUnit: {
        fontSize: 10,
        color: theme.textSecondary,
        marginTop: 5,
    },
    barValueText: { // New style for the value on top of the bars
        color: theme.textPrimary, // White text for visibility
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2, // Small margin to lift it slightly above the bar
    },
    tableContainer: {
        backgroundColor: theme.card,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    tableTitle: {
        fontWeight: '600',
        fontSize: 14,
        color: theme.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
        textAlign: 'center',
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
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    tableRowEven: {
        backgroundColor: 'rgba(51, 56, 88, 0.3)',
    },
    tableRowOdd: {
        backgroundColor: 'rgba(51, 56, 88, 0.1)',
    },
    summaryRow: {
        backgroundColor: 'rgba(0, 163, 255, 0.2)',
        borderTopWidth: 2,
        borderTopColor: '#333858',
        borderBottomWidth: 0,
        marginTop: 5,
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
});

export default Comparative;