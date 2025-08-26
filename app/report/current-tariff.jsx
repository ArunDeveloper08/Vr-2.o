import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// --- UI Theme Colors based on the provided image ---
const theme = {
  background: "#0F142D", // Dark navy background
  card: "#1C203A", // Darker card background
  textPrimary: "#FFFFFF", // White text
  textSecondary: "#A9A9B2", // Light grey for subtitles
  accent: "#00A3FF", // Bright blue for highlights
};

const CurrentTariff = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/report")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.mainTitle}>Current Tariff</Text>
      </View>

      {/* Body Content - Placeholder */}
      <View style={styles.centeredContent}>
        <Ionicons name="construct-outline" size={80} color={theme.accent} />
        <Text style={styles.placeholderTitle}>Feature Under Construction</Text>
        <Text style={styles.placeholderText}>
          We are working hard to bring you the detailed tariff information. This
          screen will be available in a future update.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 16,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.textPrimary,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30, // Add some padding on the sides
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.textPrimary,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  placeholderText: {
    fontSize: 17,
    color: theme.textSecondary,
    textAlign: "center",
    lineHeight: 24, // Improve readability
  },
});

export default CurrentTariff;
