// import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
// import React, { useState } from 'react';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../../context/AuthContext';
// import { Ionicons } from '@expo/vector-icons';

// export default function PrivacySetting() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Function to handle account deletion
//   const handleDeleteAccount = async () => {
//     // Show confirmation prompt
//     Alert.alert(
//       'Delete Account',
//       'Are you sure you want to delete your account? This action cannot be undone.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             setLoading(true);
//             setError(null);

//             try {
 
//               await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay

//               Alert.alert('Success', 'Your account has been deleted.');
//               // Optionally, log the user out and redirect
//               router.replace('/login'); // Adjust route as needed
//             } catch (err) {
//               setError('Failed to delete account. Please try again.');
//               console.error('Error deleting account:', err);
//             } finally {
//               setLoading(false);
//             }
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.replace('/(drawer)')}>
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Privacy Setting</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Content */}
//       <View style={styles.content}>
//         {error && <Text style={styles.errorText}>{error}</Text>}

//         <TouchableOpacity
//           style={[styles.deleteRow, loading && styles.disabledRow]}
//           onPress={handleDeleteAccount}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator size="small" color="#ff3333" style={styles.deleteIcon} />
//           ) : (
//             <Ionicons name="trash-outline" size={24} color="#ff3333" style={styles.deleteIcon} />
//           )}
//           <Text style={styles.deleteText}>Delete Account</Text>
//         </TouchableOpacity>
//       </View>
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
//   content: {
//     flex: 1,
//     padding: 20,
//   },
//   deleteRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   deleteIcon: {
//     marginRight: 10,
//   },
//   deleteText: {
//     fontSize: 16,
//     color: '#ff3333',
//     fontWeight: 'bold',
//   },
//   disabledRow: {
//     opacity: 0.7,
//   },
//   errorText: {
//     color: '#ff3333',
//     textAlign: 'center',
//     marginBottom: 20,
//     fontSize: 14,
//   },
// });

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  StatusBar, // Import StatusBar
} from 'react-native';
import React, { useState, useCallback } from 'react'; // Added useCallback
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext'; // Assuming correct path
import { Ionicons } from '@expo/vector-icons';

// --- Theme Colors ---
const THEME_COLORS = {
  background: "#0A0F1E",
  cardBackground: "#1A1F2C", // For rows or cards
  accentBlue: "#00A3FF", // Not directly used here, but for consistency
  accentBlueGlow: "rgba(0, 163, 255, 0.5)",
  textPrimary: "#E0E7FF",
  textSecondary: "#8A9CB0",
  iconColor: "#C0D0E0", // For header icon
  neutralDark: "#303A52",
  negative: "#F87171", // For delete button and error text
  negativeGlow: "rgba(248, 113, 113, 0.4)", // Glow for delete button
};

export default function PrivacySetting() {
  const router = useRouter();
  const { user, logout } = useAuth(); // Assuming logout is available from useAuth
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteAccount = useCallback(async () => {
    Alert.alert(
      'Confirm Account Deletion',
      'Are you sure you want to permanently delete your account? This action cannot be undone, and all your data will be lost.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => {} },
        {
          text: 'Delete My Account',
          style: 'destructive',
          onPress: async () => {
            if (!user) {
              setError("User not authenticated. Please log in again.");
              setTimeout(() => router.replace('/login'), 2000);
              return;
            }
            setLoading(true);
            setError(null);

            try {
              // **IMPORTANT: Replace with your actual API call for account deletion**
              // The API call should securely handle user identification.
              // Example:
              // const response = await fetch('YOUR_API_ENDPOINT/delete-account', {
              //   method: 'POST',
              //   headers: {
              //     'Content-Type': 'application/json',
              //     // 'Authorization': `Bearer ${user.token}`, // If using token auth
              //   },
              //   body: JSON.stringify({
              //      UserID: user.UserID, // Or other identifiers API needs
              //      SiteID: user.SiteID,
              //      MeterID: user.MeterID,
              //   }),
              // });
              // const data = await response.json();
              // if (!response.ok || data.ApiStatus !== 'TRUE') {
              //   throw new Error(data.ApiMessage || 'Failed to delete account.');
              // }

              // Simulated API call for now:
              await new Promise((resolve) => setTimeout(resolve, 1500));
            

              Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
              await logout(); 
              router.replace('/login'); 
            } catch (err) {
              setError(err.message || 'An error occurred. Please try again.');
              console.error('Error deleting account:', err);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [user, router, logout]); // Added dependencies

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLORS.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(drawer)')} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={26} color={THEME_COLORS.iconColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Account Management</Text>
        <Text style={styles.sectionDescription}>
          Manage your account settings and data. Be careful, some actions are irreversible.
        </Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.actionRow, loading && styles.disabledRow]}
          onPress={handleDeleteAccount}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={THEME_COLORS.negative} style={styles.actionIcon} />
          ) : (
            <Ionicons name="trash-bin-outline" size={24} color={THEME_COLORS.negative} style={styles.actionIcon} />
          )}
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionText}>Delete Account</Text>
            <Text style={styles.actionSubtext}>Permanently remove your account and data.</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={THEME_COLORS.textSecondary} />
        </TouchableOpacity>

        {/* You can add more privacy settings here, e.g.:
        <TouchableOpacity style={styles.actionRow}>
          <Ionicons name="shield-checkmark-outline" size={24} color={THEME_COLORS.accentBlue} style={styles.actionIcon} />
           <View style={styles.actionTextContainer}>
            <Text style={[styles.actionText, {color: THEME_COLORS.textPrimary}]}>Data Export</Text>
            <Text style={styles.actionSubtext}>Download a copy of your data.</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={THEME_COLORS.textSecondary} />
        </TouchableOpacity>
        */}

      </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_COLORS.textPrimary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: THEME_COLORS.textSecondary,
    marginBottom: 25,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.cardBackground,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12, 
    marginBottom: 16, 
    // Neumorphic shadow for action rows
    shadowColor: "rgba(0,0,0,0.5)",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  actionIcon: {
    marginRight: 15,
  },
  actionTextContainer: {
    flex: 1, 
  },
  actionText: {
    fontSize: 16,
    color: THEME_COLORS.negative, 
    fontWeight: '600',
  },
  actionSubtext: {
    fontSize: 13,
    color: THEME_COLORS.textSecondary,
    marginTop: 2,
  },
  disabledRow: {
    opacity: 0.5, 
  },
  errorText: {
    color: THEME_COLORS.negative,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
    fontWeight: '500',
  },
});