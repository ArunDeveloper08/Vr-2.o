

// import {
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   FlatList,
//   ActivityIndicator,
//   // Alert, // Alert not used in this version
//   StatusBar, // Import StatusBar
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { Ionicons } from '@expo/vector-icons';
// import { useAuth } from '../../context/AuthContext';
// import { useRouter } from 'expo-router';
// // import { apiUrl } from '../../constant/utils'; // Assuming this is for your API base URL

// // --- Theme Colors ---
// const THEME_COLORS = {
//   background: "#0A0F1E",
//   cardBackground: "#1A1F2C",
//   accentBlue: "#00A3FF",
//   accentBlueGlow: "rgba(0, 163, 255, 0.5)",
//   textPrimary: "#E0E7FF",
//   textSecondary: "#8A9CB0",
//   iconColor: "#C0D0E0",
//   neutralDark: "#303A52",
//   negative: "#F87171", // For error text
//   positive: "#34D399", // Can be used for "Cr" status
// };

// export default function UserRechargeHistory() {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [rechargeData, setRechargeData] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchRechargeHistory = async () => {
//     if (!user) { // Moved user check outside useEffect for clarity
//       setError("User not logged in. Redirecting...");
//       setLoading(false); // Ensure loading stops
//       setTimeout(() => {
//         router.replace('/login');
//       }, 2000);
//       return;
//     }
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(
//         'http://www.pesonline.co.in:8080/WebServicesFinal/Android/RechargeHistory',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(user),
//         }
//       );
//       const json = await response.json();

//       if (json.ApiStatus === "TRUE" && json.Data) {
//         setRechargeData(json.Data);
//       } else {
//         setError(json.ApiMessage || 'Failed to fetch recharge history.');
//       }
//     } catch (error) {
//       setError('An error occurred. Please try again.');
//       console.error('Error fetching recharge history:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const fetchData = async () => {
//     if (!user) { // Moved user check outside useEffect for clarity
//       setError("User not logged in. Redirecting...");
//       setLoading(false); // Ensure loading stops
//       setTimeout(() => {
//         router.replace('/login');
//       }, 2000);
//       return;
//     }
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(
//         'http://www.pesonline.co.in:8080/WebServicesFinal/Android/MeterDataSingle',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(user),
//         }
//       );
//       const json = await response.json();

//       if (json.ApiStatus === "TRUE" && json.Data) {
//         setData(json.Data);
//       } else {
//         setError(json.ApiMessage || 'Failed to fetch recharge history.');
//       }
//     } catch (error) {
//       setError('An error occurred. Please try again.');
//       console.error('Error fetching recharge history:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRechargeHistory();
//   }, [user]); // Add user to dependency array

//   const monthMap = {
//     '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR', '05': 'MAY', '06': 'JUN',
//     '07': 'JUL', '08': 'AUG', '09': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC',
//   };

//   const renderRechargeItem = ({ item, index }) => {
//     if (!item.RechargeDate || typeof item.RechargeDate !== 'string') {
//         return <View style={styles.cardError}><Text style={styles.errorTextSmall}>Invalid date format for item</Text></View>;
//     }
//     const rechargeDateParts = item.RechargeDate.split('/');
//     if (rechargeDateParts.length < 3) {
//         return <View style={styles.cardError}><Text style={styles.errorTextSmall}>Invalid date format: {item.RechargeDate}</Text></View>;
//     }
//     const day = rechargeDateParts[2].slice(-2);
//     const month = rechargeDateParts[1];
//     const year = rechargeDateParts[0].slice(-2);
//     const formattedDate = `${day} ${monthMap[month] || '??'} '${year}`;

    // const drCrStatus = item['Dr/Cr']?.trim().toUpperCase();
    // const statusColor = drCrStatus === 'CR' ? THEME_COLORS.positive : (drCrStatus === 'DR' ? THEME_COLORS.negative : THEME_COLORS.textSecondary);


//     return (
//       <View style={styles.card}>
//         <View style={styles.cardHeader}>
//           <View style={styles.iconContainer}>
//             <Ionicons name="receipt-outline" size={28} color={THEME_COLORS.accentBlue} />
//             <View style={styles.numberCircle}>
//               <Text style={styles.numberText}>{index + 1}</Text>
//             </View>
//           </View>
//           <Text style={styles.dateText}>{formattedDate}</Text>
//         </View>
//         <View style={styles.cardContent}>
//           <DetailRow label="Card No" value={item.CardNo} />
//           <DetailRow label="Card Value" value={item.CardValue} isAmount />
//           <DetailRow label="Recharge Date" value={item.RechargeDate} />
//           {/* <DetailRow label="Dr/Cr" value={drCrStatus} color={statusColor} /> */}
//           {/* <DetailRow label="Cheque No" value={item.ChequeNo} />
//           <DetailRow label="Cheque Date" value={item.ChequeDate} />
//           <DetailRow label="Recharge Type" value={item['Payment Type']} />
//           <DetailRow label="Payment Mode" value={item.PaymentMode} /> */}
//         </View>
//       </View>
//     );
//   };

//   // Helper component for detail rows
//   const DetailRow = ({ label, value, color, isAmount = false }) => (
//     <View style={styles.detailRow}>
//       <Text style={styles.detailLabel}>{label}:</Text>
//       <Text style={[styles.detailValue, color ? { color } : {}, isAmount ? styles.amountValue : {}]}>
//         {isAmount && value ? `₹${parseFloat(value).toFixed(2)}` : (value || 'N/A')}
//       </Text>
//     </View>
//   );


//   const handleRetry = () => {
//     // setLoading(true); // setLoading is handled in fetchRechargeHistory
//     // setError(null);
//     fetchRechargeHistory();
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor={THEME_COLORS.background} />
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.replace('/(drawer)')} style={styles.headerIcon}>
//           <Ionicons name="arrow-back" size={26} color={THEME_COLORS.iconColor} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Recharge History</Text>
//         <View style={{ width: 26 }} />
//       </View>

//       {loading ? (
//         <View style={styles.statusContainer}>
//           <ActivityIndicator size="large" color={THEME_COLORS.accentBlue} />
//           <Text style={styles.statusText}>Loading history...</Text>
//         </View>
//       ) : error ? (
//         <View style={styles.statusContainer}>
//           <Ionicons name="alert-circle-outline" size={60} color={THEME_COLORS.negative} />
//           <Text style={[styles.statusText, { color: THEME_COLORS.negative, textAlign: 'center' }]}>{error}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : rechargeData.length > 0 ? (
//         <FlatList
//           data={rechargeData}
//           renderItem={renderRechargeItem}
//           keyExtractor={(item, index) => `${item.CardNo}-${item.RechargeDate}-${index}`} // More unique key
//           contentContainerStyle={styles.listContainer}
//           showsVerticalScrollIndicator={false}
//         />
//       ) : (
//         <View style={styles.statusContainer}>
//             <Ionicons name="archive-outline" size={60} color={THEME_COLORS.textSecondary} />
//             <Text style={styles.statusText}>No recharge history found.</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: THEME_COLORS.background,
//   },
//   header: {
//     backgroundColor: THEME_COLORS.background,
//     paddingVertical: 15,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: THEME_COLORS.neutralDark,
//   },
//   headerIcon: {
//     padding: 5,
//   },
//   headerTitle: {
//     color: THEME_COLORS.textPrimary,
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   listContainer: {
//     padding: 16,
//   },
//   card: {
//     backgroundColor: THEME_COLORS.cardBackground,
//     borderRadius: 15, // More rounded
//     marginBottom: 16, // More spacing
//     // Neumorphic shadow
//     shadowColor: THEME_COLORS.shadowDark, // Assuming you have shadowDark
//     shadowOffset: { width: 4, height: 4 },
//     shadowOpacity: 0.7,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   cardError: { // For items with bad data
//     backgroundColor: THEME_COLORS.cardBackground,
//     borderRadius: 15,
//     marginBottom: 16,
//     padding: 15,
//     borderColor: THEME_COLORS.negative,
//     borderWidth: 1,
//   },
//   errorTextSmall: {
//     color: THEME_COLORS.negative,
//     fontSize: 14,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: THEME_COLORS.neutralDark, // Darker border
//   },
//   iconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   numberCircle: {
//     backgroundColor: THEME_COLORS.accentBlue,
//     borderRadius: 12,
//     width: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//   numberText: {
//     color: THEME_COLORS.textPrimary,
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   dateText: {
//     color: THEME_COLORS.textPrimary,
//     fontSize: 14, // Slightly smaller
//     fontWeight: '600',
//     backgroundColor: THEME_COLORS.neutralDark, // Subtler background
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 8, // More rounded
//   },
//   cardContent: {
//     paddingHorizontal: 15,
//     paddingVertical: 10, // Adjust padding
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 8, // More vertical padding
//     alignItems: 'flex-start', // Align items to start for multi-line values
//   },
//   detailLabel: {
//     color: THEME_COLORS.textSecondary,
//     fontSize: 14,
//     fontWeight: '500',
//     flex: 0.45, // Allocate space for label
//   },
//   detailValue: {
//     color: THEME_COLORS.textPrimary,
//     fontSize: 14,
//     fontWeight: '500',
//     flex: 0.55, // Allocate space for value
//     textAlign: 'right', // Align value to the right
//   },
//   amountValue: {
//     fontWeight: 'bold', // Make amounts stand out
//     color: THEME_COLORS.accentBlue, // Use accent for amounts
//   },
//   statusContainer: { // For loading, error, empty states
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: THEME_COLORS.background,
//   },
//   statusText: {
//     marginTop: 15,
//     fontSize: 16,
//     color: THEME_COLORS.textSecondary,
//   },
//   retryButton: {
//     marginTop: 20,
//     backgroundColor: THEME_COLORS.accentBlue,
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     shadowColor: THEME_COLORS.accentBlueGlow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.8,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   retryButtonText: {
//     color: THEME_COLORS.textPrimary,
//     fontSize: 16,
//     fontWeight: 'bold',
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
import React, { useEffect, useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
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
  positive: "#34D399",
  shadowDark: "#000000",
};

// --- Helper function to format ISO date strings ---
const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    }) + ', ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

export default function UserRechargeHistory() {
  const { user } = useAuth();
  const router = useRouter();
  const [rechargeData, setRechargeData] = useState([]);
  const [meterData, setMeterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Combined data fetching function using Promise.allSettled for robustness ---
  const fetchAllData = useCallback(async () => {
    if (!user) {
      setError("User not logged in. Redirecting...");
      setLoading(false);
      setTimeout(() => router.replace('/login'), 2000);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requests = [
        fetch(`${apiUrl}/WebServicesFinal/Android/RechargeHistory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        }),
        fetch(`${apiUrl}/WebServicesFinal/Android/MeterDataSingle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        }),
      ];

      const results = await Promise.allSettled(requests);
      const [historyResult, meterDataResult] = results;
      let fetchError = null;

     
      if (historyResult.status === 'fulfilled') {
        const historyJson = await historyResult.value.json();
        if (historyJson.ApiStatus === "TRUE" && historyJson.Data) {
          setRechargeData(historyJson.Data);
        } else {
          fetchError = historyJson.ApiMessage || 'Failed to fetch recharge history.';
        }
      } else {
        console.error("RechargeHistory API failed:", historyResult.reason);
        fetchError = 'Could not fetch recharge history.';
      }

     
      if (meterDataResult.status === 'fulfilled') {
        const meterDataJson = await meterDataResult.value.json();
        if (meterDataJson.ApiStatus === "TRUE" && meterDataJson.Data?.length > 0) {
          setMeterData(meterDataJson.Data[0]);
        } else if (!fetchError) { // Only set error if history didn't already fail
           fetchError = meterDataJson.ApiMessage || 'Failed to fetch summary data.';
        }
      } else {
        console.error("MeterDataSingle API failed:", meterDataResult.reason);
        if (!fetchError) {
           fetchError = 'Could not fetch summary data.';
        }
      }

      if (fetchError) {
        setError(fetchError + ' Please check connection and retry.');
      }

    } catch (err) {
      setError('An unexpected application error occurred.');
      console.error('Unexpected error in fetchAllData:', err);
    } finally {
      setLoading(false);
    }
  }, [user, router]);


  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const monthMap = {
    '01': 'JAN', '02': 'FEB', '03': 'MAR', '04': 'APR', '05': 'MAY', '06': 'JUN',
    '07': 'JUL', '08': 'AUG', '09': 'SEP', '10': 'OCT', '11': 'NOV', '12': 'DEC',
  };

  const renderRechargeItem = ({ item, index }) => {
    if (!item.RechargeDate || typeof item.RechargeDate !== 'string') {
        return <View style={styles.cardError}><Text style={styles.errorTextSmall}>Invalid date format for item</Text></View>;
    }
    const rechargeDateParts = item.RechargeDate.split('/');
    if (rechargeDateParts.length < 3) {
        return <View style={styles.cardError}><Text style={styles.errorTextSmall}>Invalid date format: {item.RechargeDate}</Text></View>;
    }
    const day = rechargeDateParts[2].slice(-2);
    const month = rechargeDateParts[1];
    const year = rechargeDateParts[0].slice(-2);
    const formattedDate = `${day} ${monthMap[month] || '??'} '${year}`;
    const drCrStatus = item['Dr/Cr']?.trim();
    const statusColor = drCrStatus === 'CR' ? THEME_COLORS.positive : (drCrStatus === 'DR' ? THEME_COLORS.negative : THEME_COLORS.textSecondary);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="receipt-outline" size={28} color={THEME_COLORS.accentBlue} />
            <View style={styles.numberCircle}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>
          </View>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
        <View style={styles.cardContent}>
          <DetailRow label="Card No" value={item.CardNo} />
          <DetailRow label={`Card Value (${drCrStatus})`} value={item.CardValue} isAmount />
          <DetailRow label="Recharge Date" value={item.RechargeDate} />
          
        </View>
      </View>
    );
  };

  const DetailRow = ({ label, value, isAmount = false }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={[styles.detailValue, isAmount ? styles.amountValue : {}]}>
        {isAmount && value != null ? `₹${parseFloat(value).toFixed(2)}` : (value || 'N/A')}
      </Text>
    </View>
  );

  const SummaryItem = ({ label, value, valueColor }) => (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, valueColor ? { color: valueColor } : {}]}>{value}</Text>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.accentBlue} />
          <Text style={styles.statusText}>Loading history...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.statusContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={THEME_COLORS.negative} />
          <Text style={[styles.statusText, { color: THEME_COLORS.negative, textAlign: 'center' }]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchAllData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View style={{flex: 1}}>
        {meterData && (
          <View style={styles.summaryContainer}>
            <SummaryItem
              label="Available Balance"
              value={`₹${parseFloat(meterData.balance || 0).toFixed(2)}`}
              valueColor={THEME_COLORS.positive}
            />
            <SummaryItem
              label="Recent Recharge"
              value={formatDateTime(meterData.RechargedOn)}
            />
             <SummaryItem
              label="Last Updated"
              value={formatDateTime(meterData.ClosingDateTime)}
            />
          </View>
        )}

        {rechargeData.length > 0 ? (
          <FlatList
            data={rechargeData}
            renderItem={renderRechargeItem}
            keyExtractor={(item, index) => `${item.CardNo}-${item.RechargeDate}-${index}`}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.statusContainer}>
              <Ionicons name="archive-outline" size={60} color={THEME_COLORS.textSecondary} />
              <Text style={styles.statusText}>No recharge history found.</Text>
          </View>
        )}
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(drawer)')} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={26} color={THEME_COLORS.iconColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recharge History</Text>
        <View style={{ width: 26 }} />
      </View>

      {renderContent()}

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
    paddingHorizontal: 16,
    paddingBottom: 16, 
  },
  card: {
    backgroundColor: THEME_COLORS.cardBackground,
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: THEME_COLORS.shadowDark,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  cardError: {
    backgroundColor: THEME_COLORS.cardBackground,
    borderRadius: 15,
    marginBottom: 16,
    padding: 15,
    borderColor: THEME_COLORS.negative,
    borderWidth: 1,
  },
  errorTextSmall: {
    color: THEME_COLORS.negative,
    fontSize: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.neutralDark,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberCircle: {
    backgroundColor: THEME_COLORS.accentBlue,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  numberText: {
    color: THEME_COLORS.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    color: THEME_COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: THEME_COLORS.neutralDark,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  cardContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  detailLabel: {
    color: THEME_COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    flex: 0.45,
  },
  detailValue: {
    color: THEME_COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    flex: 0.55,
    textAlign: 'right',
  },
  amountValue: {
    fontWeight: 'bold',
    color: THEME_COLORS.accentBlue,
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusText: {
    marginTop: 15,
    fontSize: 16,
    color: THEME_COLORS.textSecondary,
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
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: THEME_COLORS.cardBackground,
    borderRadius: 15,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME_COLORS.neutralDark,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    color: THEME_COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  summaryValue: {
    color: THEME_COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});