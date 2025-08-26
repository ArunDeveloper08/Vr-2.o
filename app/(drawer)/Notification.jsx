

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  FlatList, 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";


// --- Theme Colors ---
const THEME_COLORS = {
  background: "#0A0F1E",
  cardBackground: "#1A1F2C",
  accentBlue: "#00A3FF",
  // accentBlueGlow: "rgba(0, 163, 255, 0.5)", // Not used here, but for consistency
  textPrimary: "#E0E7FF",
  textSecondary: "#8A9CB0",
  iconColor: "#C0D0E0",
  neutralDark: "#303A52",
  negative: "#F87171",
  positive: "#34D399",
};

export default function NotificationHistory() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const formatDateTime = useCallback((dateString) => {
    if (!dateString) return "N/A";
    
    const parts = dateString.match(/^(\d{4})\/(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/);
    if (!parts) {
        const d = new Date(dateString); // Fallback
        if (isNaN(d.getTime())) return "Invalid Date";
        return new Intl.DateTimeFormat("en-GB", {
            day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit'
        }).format(d).replace(",", " '"); // e.g., 17 May '24 10:30
    }
    const date = new Date(parseInt(parts[1]), parseInt(parts[2])-1, parseInt(parts[3]), parseInt(parts[4]), parseInt(parts[5]), parseInt(parts[6]));
    if (isNaN(date.getTime())) return "Date Error";
    return new Intl.DateTimeFormat("en-GB", {
        day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit'
    }).format(date).replace(",", " '");
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setError("User not logged in. Please log in again.");
      setLoading(false);
      
      return;
    }
    try {
      // setLoading(true); // setLoading is handled by onRefresh or initial load
      setError(null);
      const response = await axios.post(
        "https://www.pesonline.co.in/webconfig/Android/NotificationHistory",
        user
      );
      if (response.data.ApiStatus === "TRUE" && response.data.Data) {
        const sortedNotifications = response.data.Data.sort((a, b) => {
          
            const dateA = new Date(a.RecordDateTime?.replace(/\//g, '-')); 
            const dateB = new Date(b.RecordDateTime?.replace(/\//g, '-'));
            if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0; 
            return dateB - dateA;
        });
        setNotifications(sortedNotifications);
      } else {
        setError(response.data.ApiMessage || "Failed to retrieve notifications.");
        setNotifications([]); 
      }
    } catch (err) {
      setError("An error occurred. Please check your connection and try again.");
      console.error("Error fetching notifications:", err);
      setNotifications([]); 
    } finally {
      setLoading(false); 
      setRefreshing(false); 
    }
  }, [user]);

  useEffect(() => {
    setLoading(true); 
    fetchNotifications();
  }, [fetchNotifications]); 

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    
  }, [fetchNotifications]);

  const getNotificationIcon = (title) => {
    const lowerTitle = title?.toLowerCase() || "";
    if (lowerTitle.includes("alert") || lowerTitle.includes("warning")) {
      return { name: "alert-circle-outline", color: THEME_COLORS.negative };
    }
    if (lowerTitle.includes("success") || lowerTitle.includes("completed")) {
      return { name: "check-circle-outline", color: THEME_COLORS.positive };
    }
    if (lowerTitle.includes("info") || lowerTitle.includes("update")) {
      return { name: "information-outline", color: THEME_COLORS.accentBlue };
    }
    return { name: "bell-outline", color: THEME_COLORS.textSecondary }; // Default
  };


  const renderNotificationItem = ({ item, index }) => {
    const iconInfo = getNotificationIcon(item.Title);
    return (
      <View style={styles.notificationCard}>
        <View style={styles.cardHeaderRow}>
            <Icon name={iconInfo.name} size={24} color={iconInfo.color} style={styles.notificationIcon} />
            <Text style={[styles.notificationTitle, {color: iconInfo.color}]}>{item.Title || "Notification"}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.Message || "No message content."}</Text>
        <Text style={styles.notificationDate}>
          {formatDateTime(item.RecordDateTime)}
        </Text>
      </View>
    );
  };


  if (loading && !refreshing) {
    return (
      <View style={styles.statusContainer}>
        <ActivityIndicator size="large" color={THEME_COLORS.accentBlue} />
        <Text style={styles.statusText}>Loading Notifications...</Text>
      </View>
    );
  }


  if (error && !loading) { 
    return (
      <View style={styles.statusContainer}>
        <Icon name="cloud-offline-outline" size={60} color={THEME_COLORS.negative} />
        <Text style={[styles.statusText, {color: THEME_COLORS.negative, textAlign: 'center'}]}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLORS.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Icon name="arrow-left" size={26} color={THEME_COLORS.iconColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification History</Text>
        <View style={{width: 26}} />
      </View>

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item, index) => `${item.RecordDateTime}-${index}`} // More unique key
          style={styles.container}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={THEME_COLORS.accentBlue} // For iOS
              colors={[THEME_COLORS.accentBlue]} // For Android
            />
          }
        />
      ) : (
         <ScrollView
            contentContainerStyle={styles.statusContainer}
             refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={THEME_COLORS.accentBlue}
                colors={[THEME_COLORS.accentBlue]}
                />
            }
        >
            <Icon name="bell-off-outline" size={60} color={THEME_COLORS.textSecondary} />
            <Text style={styles.statusText}>No notifications to show.</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  statusContainer: { 
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: THEME_COLORS.background,
  },
  statusText: { 
    marginTop: 15,
    fontSize: 16,
    color: THEME_COLORS.textSecondary,
    textAlign: "center",
  },
  retryButton: { 
    backgroundColor: THEME_COLORS.accentBlue,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 25, 
    shadowColor: THEME_COLORS.accentBlueGlow, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: { 
    color: THEME_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: THEME_COLORS.background, 
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.neutralDark,
  },
  headerButton: {
    padding: 5, 
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: THEME_COLORS.textPrimary,
  },
  notificationCard: {
    backgroundColor: THEME_COLORS.cardBackground,
    borderRadius: 12, 
    padding: 15,
    marginBottom: 12, 
    
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationIcon: {
    marginRight: 10,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",

    flexShrink: 1, 
  },
  notificationMessage: {
    fontSize: 14,
    color: THEME_COLORS.textPrimary, 
    lineHeight: 20, 
    marginBottom: 10,
  },
  notificationDate: {
    fontSize: 12,
    color: THEME_COLORS.textSecondary, 
    textAlign: 'right', 
  },
});