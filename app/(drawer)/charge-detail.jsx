

import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { apiUrl } from "../../constant/utils";
import { useAuth } from "../../context/AuthContext";


// --- Theme Colors (Re-use from your Home screen or define globally) ---
const THEME_COLORS = {
  background: "#0A0F1E",
  cardBackground: "#1A1F2C",
  accentBlue: "#00A3FF",
  accentBlueGlow: "rgba(0, 163, 255, 0.5)",
  textPrimary: "#E0E7FF",
  textSecondary: "#8A9CB0",
  iconColor: "#C0D0E0",
  shadowLight: "rgba(40, 50, 70, 0.7)",
  shadowDark: "rgba(0, 0, 0, 0.6)",
  negative: "#F87171",
  neutralDark: "#303A52",
  inputBackground: "#0E1423", 
};

export default function ChargeDetail() {
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [modalVisible, setModalVisible] = useState(false);

  const fetchCharges = async () => {
    if (!user) {
      setErrorMessage("User not logged in. Redirecting to login...");
      setError(true); 
      setLoading(false); 
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
      return;
    }
    try {
      setLoading(true);
      setError(false);
      setErrorMessage("");

      const response = await axios.post(
        `${apiUrl}/WebServicesFinal/PesAdmin/LiveBalanceCalculation`,
        { ...user } 
      );
      const res = response.data;

      if (res?.ApiStatus === "TRUE" && res.Data && res.Data.length > 0) {
        setData(res.Data[0]);
      } else {
        setErrorMessage(res?.ApiMessage || "Failed to retrieve charge details.");
        setError(true);
      }
    } catch (err) {
      console.error("Error fetching charges:", err);
      setErrorMessage("An error occurred. Please try again later.");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharges();
  }, [user]); 

  const renderRow = (label, value) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value !== undefined && value !== null ? String(value) : "N/A"}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLORS.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(drawer)")} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={26} color={THEME_COLORS.iconColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Charges Details</Text>
        <View style={{ width: 26 }} /> 
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={THEME_COLORS.accentBlue} />
          <Text style={[styles.centerText, { marginTop: 15, color: THEME_COLORS.textSecondary }]}>
            Loading Charges...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
           <Ionicons name="alert-circle-outline" size={60} color={THEME_COLORS.negative} />
          <Text style={[styles.centerText, { color: THEME_COLORS.negative, marginTop: 15, textAlign: 'center' }]}>
            {errorMessage || "Server Error. Please try again later."}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCharges}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : data ? ( 
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            {renderRow("Grid Charge", data["\tGrid Charge"])}
            {renderRow("DG Charge", data["DG Charge"])}
            {renderRow("Maintenance Charge", data["MaintenanceCharge"])}
            {renderRow("Load Main", data["Load Main"])}
            {renderRow("Load DG", data["Load DG"])}
            {renderRow("Area", data["Area"])}
            {renderRow("Last Bill Date", data["Last Bill Date"])}
            {renderRow("Opening Balance", data["Opening Balance"])}
            {renderRow("Opening Mains", data["Opening Mains"])}
            {renderRow("Opening DG", data["Opening DG"])}
            {renderRow("Current Main", data["Current Main"])}
            {renderRow("Current DG", data["Current DG"])}
            {renderRow("Live Balance", data["LiveBalance"])}
            {renderRow("Unit Consumed Main", data["Unit Consumed Main"])}
            {renderRow("Unit Consumed DG", data["Unit Consumed Dg"])}
            {renderRow("Fixed Main Per Month", data["Fixed Main Per Month"])}
            {renderRow("Fixed Main Per Day", data["Fixed Main Per Day"])}
            {renderRow("Months", data["Months"])}
            {renderRow("Days", data["Days"])}
            {renderRow(
              "Mains Consumption Charges",
              data["Mains Consumption Charges"]
            )}
            {renderRow(
              "DG Consumption Charges",
              data["DG Consumption Charges"]
            )}
            {renderRow("Mains Charges", data["Mains Charges"])}
            {renderRow("Last balance", data["Last balance"])}
            {renderRow("Recharge", data["Recharge "] || 0)}
            {renderRow("Current Amt", data["Current Amt"])}
            {renderRow("Adjustment", data["Adjsutment"])}
            {renderRow("Final Amt", data["Final Amt"])}
            {renderRow("Record Date Time", data["RecordDateTime"])}
            {renderRow("Meter ID", data["MeterID"])}
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>Report Issue</Text>
          </TouchableOpacity>

          {/* Modal for Report Issue */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Report Issue</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                    <Ionicons name="close" size={28} color={THEME_COLORS.iconColor} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalContent}>
                  <View style={styles.inputStaticContainer}>
                    <Text style={styles.inputStaticLabel}>Meter ID:</Text>
                    <Text style={styles.inputStaticValue}>{data?.MeterID || "N/A"}</Text>
                  </View>
                  <View style={styles.inputStaticContainer}>
                    <Text style={styles.inputStaticLabel}>Site ID:</Text>
                    <Text style={styles.inputStaticValue}>{user?.SiteID || "N/A"}</Text>
                  </View>
                  <TextInput
                    style={styles.textArea}
                    placeholder="Write your issue here..."
                    placeholderTextColor={THEME_COLORS.textSecondary}
                    multiline={true}
                    numberOfLines={4}
                    
                  />
                </View>

                <TouchableOpacity
                  style={styles.actionButton} 
                  onPress={() => {
                
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.actionButtonText}>SUBMIT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      ) : (
        <View style={styles.center}>
          <Ionicons name="information-circle-outline" size={60} color={THEME_COLORS.textSecondary} />
          <Text style={[styles.centerText, { marginTop: 15, color: THEME_COLORS.textSecondary }]}>
            No charge details available.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME_COLORS.background },
  header: {
    backgroundColor: THEME_COLORS.background, 
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.neutralDark,
  },
  headerIcon: {
    padding: 5, 
  },
  headerTitle: {
    color: THEME_COLORS.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: THEME_COLORS.background,
  },
  centerText: {
    fontSize: 16,
    
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: THEME_COLORS.accentBlue,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: THEME_COLORS.accentBlueGlow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  retryButtonText: {
    color: THEME_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
    paddingBottom: 30, 
  },
  card: {
    backgroundColor: THEME_COLORS.cardBackground,
    borderRadius: 15, 
    padding: 16,
    // Neumorphic shadows
    shadowColor: THEME_COLORS.shadowDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1, 
    borderColor: THEME_COLORS.neutralDark,
    paddingVertical: 12, 
  },
  label: { color: THEME_COLORS.textSecondary, fontWeight: "500", fontSize: 15, flex: 1 },
  value: { color: THEME_COLORS.textPrimary, fontSize: 15, fontWeight: "600", flex: 1, textAlign: 'right' },

  actionButton: { 
    marginTop: 25,
    backgroundColor: THEME_COLORS.accentBlue,
    paddingVertical: 14,
    borderRadius: 25, 
    alignItems: "center",
   
    shadowColor: THEME_COLORS.accentBlueGlow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    color: THEME_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)", 
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: THEME_COLORS.cardBackground, 
    borderRadius: 20, 
    padding: 20,
    paddingTop: 15,
   
    shadowColor: THEME_COLORS.shadowDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.neutralDark,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: THEME_COLORS.textPrimary,
  },
  modalCloseButton: {
    padding: 5, 
  },
  modalContent: {
    marginBottom: 20,
  },
  inputStaticContainer: { 
    backgroundColor: THEME_COLORS.inputBackground, 
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME_COLORS.neutralDark, 
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputStaticLabel: {
    fontSize: 15,
    color: THEME_COLORS.textSecondary,
    fontWeight: '500',
  },
  inputStaticValue: {
    fontSize: 15,
    color: THEME_COLORS.textPrimary,
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: THEME_COLORS.inputBackground, 
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 120, 
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: THEME_COLORS.neutralDark,
    fontSize: 15,
    color: THEME_COLORS.textPrimary,
    lineHeight: 20, 
  },
});