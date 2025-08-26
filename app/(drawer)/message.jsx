// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   FlatList,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { useAuth } from "../../context/AuthContext";

// export default function Message() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch data from the API
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     if (!user) {
//       setError("User not logged in.");
//       setTimeout(() => {
//         router.replace("/login");
//       }, 2000); // Adjust to 3000 for 3 seconds if preferred
//       return;
//     }
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(
//         "http://www.pesonline.co.in:8080/WebServicesFinal/Android/MessageHistory",
//         //`${apiUrl}/api/messages`,

//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(user), // Adjust payload as needed
//         }
//       );
//       const data = await response.json();

//       if (data.ApiStatus === "TRUE") {
//         const formattedData = data.Data.map((item, index) => ({
//           id: index + 1, // For numbering the messages (1, 2, 3, ...)
//           contactNo: item.MobileNo || "", // Contact No (empty in most cases)
//           message: item.MobileMessage, // The message body
//           dateTime: item.DateTime, // The timestamp
//         }));
//         setMessages(formattedData);
//       } else {
//         setError("Failed to fetch messages. Please try again.");
//       }
//     } catch (error) {
//       setError("An error occurred while fetching messages. Please try again.");
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to format the DateTime to "DD MMM YY HH:MM:SS"
//   const formatDateTime = (dateTime) => {
//     const date = new Date(dateTime);
//     const day = date.getDate().toString().padStart(2, "0");
//     const month = date
//       .toLocaleString("default", { month: "short" })
//       .toUpperCase();
//     const year = date.getFullYear().toString().slice(-2);
//     const hours = date.getHours().toString().padStart(2, "0");
//     const minutes = date.getMinutes().toString().padStart(2, "0");
//     const seconds = date.getSeconds().toString().padStart(2, "0");
//     return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         <View style={styles.iconContainer}>
//           <Ionicons name="mail-outline" size={20} color="#fff" />
//           <Text style={styles.iconNumber}>{item.id}</Text>
//         </View>
//       </View>
//       <Text style={styles.cardText}>Contact No: {item.contactNo}</Text>
//       <Text style={styles.cardText}>{item.message}</Text>
//       <Text style={[styles.cardText, styles.timestamp]}>{item.dateTime}</Text>
//     </View>
//   );

//   // Handle retry on error
//   const handleRetry = () => {
//     setLoading(true);
//     setError(null);
//     fetchData();
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.replace("/(drawer)")}>
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Message</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#28B9A9" />
//           <Text style={styles.loadingText}>Loading messages...</Text>
//         </View>
//       ) : error ? (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : messages?.length > 0 ? (
//         <FlatList
//           data={messages}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id.toString()}
//           contentContainerStyle={styles.list}
//         />
//       ) : (
//         <Text style={styles.emptyText}>No messages available.</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   header: {
//     backgroundColor: "#28B9A9",
//     padding: 15,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   list: {
//     padding: 10,
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 15,
//     marginBottom: 10,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   iconContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#28B9A9",
//     borderRadius: 50,
//     padding: 5,
//   },
//   iconNumber: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//     marginLeft: 5,
//   },
//   cardText: {
//     fontSize: 14,
//     color: "#333",
//     marginBottom: 5,
//   },
//   timestamp: {
//     fontWeight: "bold",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "#333",
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   errorText: {
//     fontSize: 16,
//     color: "#ff3333",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   retryButton: {
//     backgroundColor: "#28B9A9",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   retryButtonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   emptyText: {
//     textAlign: "center",
//     marginTop: 50,
//     color: "#777",
//     fontSize: 16,
//   },
// });
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { apiUrl } from "../../constant/utils";

// --- Theme Colors ---
const THEME_COLORS = {
  background: "#0A0F1E",
  cardBackground: "#1A1F2C",
  accentBlue: "#00A3FF",
  accentBlueGlow: "rgba(0, 163, 255, 0.5)",
  textPrimary: "#E0E7FF",
  textSecondary: "#8A9CB0",
  iconColor: "#C0D0E0",
  neutralDark: "#303A52",
  negative: "#F87171",
  
  unreadIndicator: "#FFD700", 
};

export default function Message() {
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const formatDateTime = useCallback((dateTimeString) => {
    if (!dateTimeString || typeof dateTimeString !== "string")
      return "Invalid Date";

   
    const parts = dateTimeString.match(
      /^(\d{4})\/(\d{2})\/(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/
    );

    if (!parts) {
     
      const d = new Date(dateTimeString);
      if (isNaN(d.getTime())) {
        console.warn(
          "Could not parse date with regex or Date constructor:",
          dateTimeString
        );
        return "Date Error";
      }
      
      const day = d.getDate().toString().padStart(2, "0");
      const month = d.toLocaleString("en-GB", { month: "short" }).toUpperCase();
      const year = d.getFullYear().toString().slice(-2);
      const hours = d.getHours().toString().padStart(2, "0");
      const minutes = d.getMinutes().toString().padStart(2, "0");
      return `${day} ${month} '${year}  ${hours}:${minutes}`;
    }

 
    const yearVal = parseInt(parts[1], 10);
    const monthVal = parseInt(parts[2], 10) - 1; 
    const dayVal = parseInt(parts[3], 10);
    const hourVal = parseInt(parts[4], 10);
    const minuteVal = parseInt(parts[5], 10);
  

    const date = new Date(yearVal, monthVal, dayVal, hourVal, minuteVal);

    if (isNaN(date.getTime())) {
      console.warn("Date created from regex parts is invalid:", dateTimeString);
      return "Date Error";
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = date
      .toLocaleString("en-GB", { month: "short" })
      .toUpperCase();
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day} ${month} '${year}  ${hours}:${minutes}`; 
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) {
      setError("User not logged in. Redirecting...");
      setLoading(false);
      setTimeout(() => {
        router.replace("/login");
      }, 2000);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${apiUrl}/WebServicesFinal/Android/MessageHistory`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );
      const data = await response.json();

      if (data.ApiStatus === "TRUE" && data.Data) {
        const formattedData = data.Data.map((item, index) => ({
          id: `${item.MobileMessage?.slice(0, 10)}-${index}`, 
          contactNo: item.MobileNo || "System",
          message: item.MobileMessage || "No message content.",
          dateTime: formatDateTime(item.DateTime), 
          
        }))?.sort((a, b) => {
          // Attempt to sort by original date string if formatDateTime fails
          const dateA = new Date(
            a.dateTime === "Date Error" || a.dateTime === "Invalid Date"
              ? 0
              : data.Data.find((d) => d.MobileMessage === a.message)
                  ?.DateTime || 0
          );
          const dateB = new Date(
            b.dateTime === "Date Error" || b.dateTime === "Invalid Date"
              ? 0
              : data.Data.find((d) => d.MobileMessage === b.message)
                  ?.DateTime || 0
          );
          return dateB - dateA; // Sort descending (newest first)
        });
        setMessages(formattedData);
      } else {
        setError(data.ApiMessage || "Failed to fetch messages.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [user, formatDateTime, router]); 

  useEffect(() => {
    fetchData();
  }, [fetchData]); 

  const renderItem = ({ item }) => (
    <View style={styles.card}>
     
      <View style={styles.cardTopRow}>
        <View style={styles.senderInfo}>
          <Ionicons
            name={
              item.contactNo === "System"
                ? "notifications-outline"
                : "person-circle-outline"
            }
            size={22}
            color={THEME_COLORS.accentBlue}
          />
          <Text style={styles.senderName}>{item.contactNo}</Text>
        </View>
        <Text style={styles.timestamp}>{item.dateTime}</Text>
      </View>

      <View style={styles.messageContent}>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    </View>
  );

  const handleRetry = () => {
    fetchData();
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={THEME_COLORS.background}
      />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(drawer)")}
          style={styles.headerIcon}
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color={THEME_COLORS.iconColor}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message</Text>
        <View style={{ width: 26 }} />
      </View>

      {loading ? (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.accentBlue} />
          <Text style={styles.statusText}>Loading messages...</Text>
        </View>
      ) : error ? (
        <View style={styles.statusContainer}>
          <Ionicons
            name="cloud-offline-outline"
            size={60}
            color={THEME_COLORS.negative}
          />
          <Text
            style={[
              styles.statusText,
              { color: THEME_COLORS.negative, textAlign: "center" },
            ]}
          >
            {error}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : messages?.length > 0 ? (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.statusContainer}>
          <Ionicons
            name="mail-open-outline"
            size={60}
            color={THEME_COLORS.textSecondary}
          />
          <Text style={styles.statusText}>Your inbox is empty.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
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
  listContainer: {
    paddingVertical: 16, // Add vertical padding for the list itself
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: THEME_COLORS.cardBackground,
    borderRadius: 12, // Slightly less rounded for a sleeker look
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    // Neumorphic shadow
    shadowColor: "rgba(0,0,0,0.5)", 
    shadowOffset: { width: 3, height: 3 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 6, 
    elevation: 5, 
    position: "relative", 
  },
  // unreadDot: { // Optional
  //   position: 'absolute',
  //   top: 12,
  //   left: 12,
  //   width: 10,
  //   height: 10,
  //   borderRadius: 5,
  //   backgroundColor: THEME_COLORS.unreadIndicator,
  // },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8, // Space between top row and message body
  },
  senderInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  senderName: {
    color: THEME_COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "600", 
    marginLeft: 8,
  },
  timestamp: {
    fontSize: 12,
    color: THEME_COLORS.textSecondary,
  },
  messageContent: {
   
  },
  messageText: {
    fontSize: 15,
    color: THEME_COLORS.textPrimary,
    lineHeight: 21, 
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
    marginTop: 25, 
    backgroundColor: THEME_COLORS.accentBlue,
    paddingVertical: 12,
    paddingHorizontal: 35, 
    borderRadius: 25,
    // Glow effect
    shadowColor: THEME_COLORS.accentBlueGlow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: {
    color: THEME_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
