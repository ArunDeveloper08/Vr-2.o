// import { StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '../../context/AuthContext';
// import { apiUrl } from '../../constant/utils';

// export default function Bulletin() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [notices, setNotices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch data from the API
//   useEffect(() => {
//     fetchNotices();
//   }, []);

//   const fetchNotices = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(
//         'http://www.pesonline.co.in:8080/WebServicesFinal/Android/NoticeBoard', 
//         //`${apiUrl}/api/notices`, 
//         {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(user),
//       });

//       const data = await response.json();

//       if (data.ApiStatus === 'TRUE' && data.Data && data.Data.Table) {
//         // Map the API data, replacing CHAR(10) with a newline
//         const formattedNotices = data.Data.Table.map((item) => ({
//           notice: item?.NoticeBoard.replace(/CHAR\(10\)/g, '\n'),
//         }));
//         setNotices(formattedNotices);
//       } else {
//         setError(data.ApiMessage || 'No notices found.');
//       }
//     } catch (err) {
//       setError('Failed to load notices. Please try again.');
//       console.error('Error fetching notices:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderNoticeItem = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.noticeText}>{item.notice}</Text>
//     </View>
//   );

//   // Handle retry on error
//   const handleRetry = () => {
//     setLoading(true);
//     setError(null);
//     fetchNotices();
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.replace('/(drawer)')}>
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Bulletin</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#28B9A9" />
//           <Text style={styles.loadingText}>Loading notices...</Text>
//         </View>
//       ) : error ? (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : notices.length > 0 ? (
//         <FlatList
//           data={notices}
//           renderItem={renderNoticeItem}
//           keyExtractor={(item, index) => index.toString()}
//           contentContainerStyle={styles.list}
//         />
//       ) : (
//         <Text style={styles.emptyText}>No notices available.</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     backgroundColor: '#28B9A9',
//     padding: 15,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
//   headerTitle: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   list: {
//     padding: 10,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 15,
//     marginBottom: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   noticeText: {
//     fontSize: 16,
//     color: '#333',
//     lineHeight: 24, // For better readability with newlines
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#333',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#ff3333',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   retryButton: {
//     backgroundColor: '#28B9A9',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   emptyText: {
//     textAlign: 'center',
//     marginTop: 50,
//     color: '#777',
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
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react'; 
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { apiUrl } from '../../constant/utils';


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
};

export default function Bulletin() {
  const router = useRouter();
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotices = useCallback(async () => {
    if (!user) {
      setError("User not logged in. Redirecting...");
      setLoading(false);
      setTimeout(() => {
        router.replace('/login');
      }, 2000);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${apiUrl}/WebServicesFinal/Android/NoticeBoard`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        }
      );
      const data = await response.json();

      if (data.ApiStatus === 'TRUE' && data.Data && data.Data.Table) {
        const formattedNotices = data.Data.Table.map((item, index) => ({
          id: `notice-${index}`, // Add a unique id
          notice: item?.NoticeBoard?.replace(/CHAR\(10\)/g, '\n').trim() || "No content for this notice.",
        }));
        setNotices(formattedNotices);
      } else {
        setError(data.ApiMessage || 'No notices found at the moment.');
      }
    } catch (err) {
      setError('Failed to load notices. Please check your connection and try again.');
      console.error('Error fetching notices:', err);
    } finally {
      setLoading(false);
    }
  }, [user, router]); 
  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]); 

  const renderNoticeItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardIconContainer}>
        <Ionicons name="megaphone-outline" size={24} color={THEME_COLORS.accentBlue} />
      </View>
      <Text style={styles.noticeText}>{item.notice}</Text>
    </View>
  );

  const handleRetry = () => {
    fetchNotices();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(drawer)')} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={26} color={THEME_COLORS.iconColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bulletin Board</Text>
        <View style={{ width: 26 }} />
      </View>

      {loading ? (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.accentBlue} />
          <Text style={styles.statusText}>Loading notices...</Text>
        </View>
      ) : error ? (
        <View style={styles.statusContainer}>
          <Ionicons name="cloud-offline-outline" size={60} color={THEME_COLORS.negative} />
          <Text style={[styles.statusText, {color: THEME_COLORS.negative, textAlign: 'center'}]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : notices.length > 0 ? (
        <FlatList
          data={notices}
          renderItem={renderNoticeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.statusContainer}>
            <Ionicons name="reader-outline" size={60} color={THEME_COLORS.textSecondary} />
            <Text style={styles.statusText}>No notices available right now.</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.neutralDark,
  },
  headerIcon: {
    padding: 5,
  },
  headerTitle: {
    color: THEME_COLORS.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: THEME_COLORS.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12, 
    marginBottom: 16,
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    // Neumorphic shadow
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardIconContainer: {
    marginRight: 12,
    paddingTop: 2, 
  },
  noticeText: {
    fontSize: 15, 
    color: THEME_COLORS.textPrimary,
    lineHeight: 22, 
    flex: 1, 
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: THEME_COLORS.background,
  },
  statusText: {
    marginTop: 15,
    fontSize: 16,
    color: THEME_COLORS.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 25,
    backgroundColor: THEME_COLORS.accentBlue,
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 25,
    shadowColor: THEME_COLORS.accentBlueGlow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: {
    color: THEME_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});