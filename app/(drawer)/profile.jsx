// import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../../context/AuthContext';
// import { Ionicons } from '@expo/vector-icons';
// import { apiUrl } from '../../constant/utils';

// export default function Profile() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [profileData, setProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//    const [modalVisible, setModalVisible] = useState(false);

//   // Fetch profile data from the API
//   const fetchProfileData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(
//         'http://www.pesonline.co.in:8080/WebServicesFinal/Android/MeterStatusSingleCommon',
//           // `${apiUrl}/api/meter-status`,
//          {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify( user ),
//       });

//       const data = await response.json();

//       if (data.ApiStatus === 'TRUE' && data.Data && data.Data.length > 0) {
//         setProfileData(data.Data[0]);
//       } else {
//         setError('No profile data found.');
//       }
//     } catch (err) {
//       setError('Failed to load profile data. Please try again.');
//       console.error('Error fetching profile data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {

//     fetchProfileData();
//   }, []);

//   // Handle "Report Issue" button press
//   const handleReportIssue = () => {
//     Alert.alert('Report Issue', 'This feature is not implemented yet. Please contact support.');
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#28B9A9" />
//         <Text style={styles.loadingText}>Loading profile...</Text>
//       </View>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity
//           style={styles.retryButton}
//           onPress={() => {
//             setLoading(true);
//             setError(null);
//             fetchProfileData();
//           }}
//         >
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // Main UI
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.replace('/(drawer)')}>
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Profile</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Profile Section */}
//       <View style={styles.profileContainer}>
//         {/* User Icon */}
//         <View style={styles.iconContainer}>
//           <Ionicons name="person" size={40} color="#28B9A9" />
//         </View>

//         {/* Name, Unit No, Address, Email */}
//         <View style={styles.card}>
//           <Text style={styles.nameText}>{profileData.MeterName}</Text>
//           <Text style={styles.unitText}>{profileData.UnitNo}</Text>
//           <Text style={styles.addressText}>{profileData.Address}</Text>
//           <Text style={styles.emailText}>{profileData.Email}</Text>
//         </View>

//         {/* Area and Sanction Load */}
//         <View style={styles.card}>
//           <Text style={styles.infoText}>AREA {profileData.Area.toFixed(1)} sq.ft.</Text>
//           <Text style={styles.infoText}>SANCTION LOAD (Main) : {profileData.SanctionLoad.toFixed(1)} Watt</Text>
//           <Text style={styles.infoText}>SANCTION LOAD (DG) : {profileData.SanctionLoadDg.toFixed(1)} Watt</Text>
//         </View>

//         {/* Customer ID and Energy Meter ID */}
//         <View style={styles.card}>
//           <View style={styles.idContainer}>
//             <View style={styles.idBox}>
//               <Text style={styles.idText}>{profileData.CustomerID}</Text>
//               <Text style={styles.idLabel}>Customer ID</Text>
//             </View>
//             <View style={styles.idBox}>
//               <Text style={styles.idText}>{profileData.MeterID}</Text>
//               <Text style={styles.idLabel}>Energy Meter Id</Text>
//             </View>
//           </View>
//         </View>

//         {/* Report Issue Button */}
//         <TouchableOpacity style={styles.reportButton} onPress={() => setModalVisible(true)}>
//           <Text style={styles.reportButtonText}  >Report Issue ? Click Here</Text>
//         </TouchableOpacity>
//       </View>

//         <Modal
//                   animationType="slide"
//                   transparent={true}
//                   visible={modalVisible}
//                   onRequestClose={() => setModalVisible(false)}
//                 >
//                   <View style={styles.modalOverlay}>
//                     <View style={styles.modalContainer}>
//                       <View style={styles.modalHeader}>
//                         <Text style={styles.modalTitle}>Report Issue</Text>
//                         <TouchableOpacity onPress={() => setModalVisible(false)}>
//                           <Ionicons name="close" size={24} color="#666" />
//                         </TouchableOpacity>
//                       </View>
      
//                       <View style={styles.modalContent}>
//                         <View style={styles.inputContainer}>
//                           <Text style={styles.inputLabel}>Meter ID : {profileData?.MeterID || ""}</Text>
//                         </View>
//                         <View style={styles.inputContainer}>
//                           <Text style={styles.inputLabel}>Site ID : {user?.SiteID}</Text>
//                         </View>
//                         <TextInput
//                           style={styles.textArea}
//                           placeholder="Write your issue here..."
//                           placeholderTextColor="#999"
//                           multiline={true}
//                           numberOfLines={4}
//                         />
//                       </View>
      
//                       <TouchableOpacity
//                         style={styles.doneButton}
//                         onPress={() => setModalVisible(false)}
//                       >
//                         <Text style={styles.doneButtonText}>DONE</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </Modal>
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
//   profileContainer: {
//     flex: 1,
//     padding: 20,
//     alignItems: 'center',
//   },
//   iconContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 50,
//     padding: 15,
//     marginBottom: 20,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#28B9A9',
//     padding: 15,
//     marginBottom: 15,
//     width: '100%',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   nameText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//   },
//   unitText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//     marginVertical: 5,
//   },
//   addressText: {
//     fontSize: 14,
//     color: '#333',
//     textAlign: 'center',
//   },
//   emailText: {
//     fontSize: 14,
//     color: '#333',
//     textAlign: 'center',
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#333',
//     marginBottom: 5,
//   },
//   idContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   idBox: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   idText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   idLabel: {
//     fontSize: 12,
//     color: '#666',
//   },
//   reportButton: {
//     backgroundColor: '#28B9A9',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     marginTop: 20,
//   },
//   reportButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
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
//     backgroundColor: '#f5f5f5',
//     padding: 20,
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
//   label: { color: "#333", fontWeight: "500" },
//   value: { color: "#000" },
//   reportButton: {
//     marginTop: 20,
//     backgroundColor: "#28B9A9",
//     padding: 14,
//     borderRadius: 30,
//     alignItems: "center",
//   },
//   reportText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContainer: {
//     width: "90%",
//     backgroundColor: "#F4F6F8",
//     borderRadius: 10,
//     padding: 20,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   modalContent: {
//     marginBottom: 20,
//   },
//   inputContainer: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   inputLabel: {
//     fontSize: 16,
//     color: "#333",
//   },
//   textArea: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 10,
//     height: 100,
//     textAlignVertical: "top",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     fontSize: 16,
//     color: "#333",
//   },
//   doneButton: {
//     backgroundColor: "#28B9A9",
//     padding: 14,
//     borderRadius: 30,
//     alignItems: "center",
//   },
//   doneButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });


import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  // Alert, // Alert not used for modal
  Modal,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
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
  inputBackground: "#0E1423", 
};

export default function Profile() {
  const router = useRouter();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [issueText, setIssueText] = useState(''); // State for issue text input

  const fetchProfileData = useCallback(async () => {
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
        `${apiUrl}/WebServicesFinal/Android/MeterStatusSingleCommon`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        }
      );
      const data = await response.json();

      if (data.ApiStatus === 'TRUE' && data.Data && data.Data.length > 0) {
        setProfileData(data.Data[0]);
      } else {
        setError(data.ApiMessage || 'No profile data found.');
      }
    } catch (err) {
      setError('Failed to load profile data. Please try again.');
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Handle "Report Issue" submission
  const handleSubmitIssue = () => {
    // Implement your issue submission logic here
    // console.log('Issue to report:', issueText);
    // console.log('Meter ID:', profileData?.MeterID);
    // console.log('Site ID:', user?.SiteID);
   
    setIssueText(''); // Clear text
    setModalVisible(false);
    
    // Alert.alert("Success", "Your issue has been reported.");
  };

 
  const ProfileDetailItem = ({ label, value, iconName, largeValue = false }) => (
    <View style={styles.detailItem}>
      {iconName && <Ionicons name={iconName} size={18} color={THEME_COLORS.textSecondary} style={styles.detailIcon} />}
      <Text style={styles.detailItemLabel}>{label}:</Text>
      <Text style={[styles.detailItemValue, largeValue && styles.largeDetailValue]}>
        {value !== undefined && value !== null ? String(value) : 'N/A'}
      </Text>
    </View>
  );


  // Loading state
  if (loading) {
    return (
      <View style={styles.statusContainer}>
        <ActivityIndicator size="large" color={THEME_COLORS.accentBlue} />
        <Text style={styles.statusText}>Loading profile...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.statusContainer}>
        <Ionicons name="cloud-offline-outline" size={60} color={THEME_COLORS.negative} />
        <Text style={[styles.statusText, {color: THEME_COLORS.negative, textAlign: 'center'}]}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProfileData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No profile data after successful fetch (but empty data array)
  if (!profileData) {
    return (
        <View style={styles.statusContainer}>
            <Ionicons name="person-remove-outline" size={60} color={THEME_COLORS.textSecondary} />
            <Text style={styles.statusText}>Profile data could not be loaded.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchProfileData}>
                <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
        </View>
    );
  }

 
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLORS.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(drawer)')} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={26} color={THEME_COLORS.iconColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Avatar and Name Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-outline" size={50} color={THEME_COLORS.accentBlue} />
          </View>
          <Text style={styles.profileName}>{profileData.MeterName || 'User Name'}</Text>
          <Text style={styles.profileUnitNo}>{profileData.UnitNo || 'Unit N/A'}</Text>
        </View>

        {/* Contact Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <ProfileDetailItem label="Address" value={profileData.Address} iconName="location-outline"/>
          <ProfileDetailItem label="Email" value={profileData.Email} iconName="mail-outline"/>
        </View>

        {/* Meter Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Meter Details</Text>
          <ProfileDetailItem label="Area" value={`${profileData.Area?.toFixed(1) || '0.0'} sq.ft.`} iconName="cube-outline"/>
          <ProfileDetailItem label="Sanction Load (Main)" value={`${profileData.SanctionLoad?.toFixed(1) || '0.0'} W`} iconName="flash-outline"/>
          <ProfileDetailItem label="Sanction Load (DG)" value={`${profileData.SanctionLoadDg?.toFixed(1) || '0.0'} W`} iconName="battery-charging-outline"/>
        </View>

        {/* IDs Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Identifiers</Text>
          <ProfileDetailItem label="Customer ID" value={profileData.CustomerID} iconName="person-circle-outline" largeValue/>
          <ProfileDetailItem label="Energy Meter ID" value={profileData.MeterID} iconName="speedometer-outline" largeValue/>
        </View>

        {/* Report Issue Button */}
        <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="flag-outline" size={20} color={THEME_COLORS.textPrimary} style={{marginRight: 10}}/>
          <Text style={styles.actionButtonText}>Report an Issue</Text>
        </TouchableOpacity>
      </ScrollView>

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
                <Text style={styles.inputStaticValue}>{profileData?.MeterID || "N/A"}</Text>
              </View>
              <View style={styles.inputStaticContainer}>
                <Text style={styles.inputStaticLabel}>Site ID:</Text>
                <Text style={styles.inputStaticValue}>{user?.SiteID || "N/A"}</Text>
              </View>
              <TextInput
                style={styles.textArea}
                placeholder="Describe your issue here..."
                placeholderTextColor={THEME_COLORS.textSecondary}
                multiline={true}
                numberOfLines={5} // Increased lines
                value={issueText}
                onChangeText={setIssueText}
              />
            </View>

            <TouchableOpacity
              style={styles.actionButton} 
              onPress={handleSubmitIssue}
            >
              <Text style={styles.actionButtonText}>SUBMIT ISSUE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  scrollContainer: {
    padding: 16,
    paddingBottom: 30, 
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME_COLORS.cardBackground, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME_COLORS.textPrimary,
    textAlign: 'center',
  },
  profileUnitNo: {
    fontSize: 15,
    color: THEME_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: THEME_COLORS.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    width: '100%',
    
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_COLORS.textPrimary,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.neutralDark,
    paddingBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 10,
  },
  detailIcon: {
    marginRight: 10,
  },
  detailItemLabel: {
    fontSize: 14,
    color: THEME_COLORS.textSecondary,
    fontWeight: '500',
    minWidth: 100, 
  },
  detailItemValue: {
    fontSize: 14,
    color: THEME_COLORS.textPrimary,
    flexShrink: 1, 
    fontWeight: '500',
  },
  largeDetailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME_COLORS.accentBlue, 
  },
  actionButton: {
    marginTop: 20,
    backgroundColor: THEME_COLORS.accentBlue,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
    
    shadowColor: THEME_COLORS.accentBlueGlow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    color: THEME_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
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
 
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)", 
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: THEME_COLORS.cardBackground,
    borderRadius: 15,
    padding: 20,
    shadowColor: "rgba(0,0,0,0.7)",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
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
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME_COLORS.neutralDark,
  },
  inputStaticLabel: {
    fontSize: 14,
    color: THEME_COLORS.textSecondary,
    fontWeight: '500',
  },
  inputStaticValue: {
    fontSize: 14,
    color: THEME_COLORS.textPrimary,
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: THEME_COLORS.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 120, // Good height for issue description
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: THEME_COLORS.neutralDark,
    fontSize: 15,
    color: THEME_COLORS.textPrimary,
    lineHeight: 20,
  },
});