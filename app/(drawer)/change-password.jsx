// import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
// import React, { useState } from 'react';
// import { useRouter } from 'expo-router';
// import { useAuth } from '../../context/AuthContext';
// import { Ionicons } from '@expo/vector-icons';
// import { apiUrl } from '../../constant/utils';

// export default function ChangePassword() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const [newPassword, setNewPassword] = useState('');
//   const [reEnterPassword, setReEnterPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Handle password change submission
//   const handleSubmit = async () => {
//     if (loading) return;

//     if (!newPassword || !reEnterPassword) {
//       setError('Please fill in all fields.');
//       return;
//     }

//     if (newPassword !== reEnterPassword) {
//       setError('Passwords do not match.');
//       return;
//     }

//     if (newPassword.length < 6) {
//       setError('Password must be at least 6 characters long.');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       // API call to update password
//       const response = await fetch(
//         'http://www.pesonline.co.in:8080/WebServicesFinal/Android/UpdatePassword',
//        // `${apiUrl}/api/update-password`,
        
//         {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...user, // Adjust based on your user object structure
//           newPassword: newPassword,
//           // Add other required fields (e.g., oldPassword, token) if needed
//         }),
//       });

//       const data = await response.json();

//       if (data.ApiStatus === 'TRUE') {
//         Alert.alert('Success', 'Password changed successfully!');
//         router.replace('/(drawer)');
//       } else {
//         setError(data.ApiMessage || 'Failed to change password. Please try again.');
//       }
//     } catch (err) {
//       setError('An error occurred while changing the password. Please try again.');
//       console.error('Error changing password:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.replace('/(drawer)')}>
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Change Password</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <View style={styles.content}>
//         {error && <Text style={styles.errorText}>{error}</Text>}

//         <TextInput
//           style={styles.input}
//           placeholder="New Password"
//           value={newPassword}
//           onChangeText={setNewPassword}
//           secureTextEntry
//           placeholderTextColor="#888"
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Re-Enter New Password"
//           value={reEnterPassword}
//           onChangeText={setReEnterPassword}
//           secureTextEntry
//           placeholderTextColor="#888"
//         />

//         <TouchableOpacity
//           style={[styles.submitButton, loading && styles.disabledButton]}
//           onPress={handleSubmit}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <Text style={styles.submitButtonText}>Submit</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#444444', // Dark gray background as per screenshot
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
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//     backgroundColor: '#444444',
//   },
//   input: {
//     backgroundColor: '#fff',
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginBottom: 20,
//     fontSize: 16,
//     color: '#333',
//   },
//   submitButton: {
//     backgroundColor: '#28B9A9',
//     borderRadius: 25,
//     paddingVertical: 12,
//     alignItems: 'center',
//   },
//   disabledButton: {
//     opacity: 0.7,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
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
  TextInput,
  Alert,
  ActivityIndicator, 
  StatusBar,
} from 'react-native';
import React, { useState, useCallback } from 'react'; 
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { apiUrl } from '../../constant/utils';


// --- Theme Colors ---
const THEME_COLORS = {
  background: "#0A0F1E",
  cardBackground: "#1A1F2C", // Not directly used for cards, but for consistency
  accentBlue: "#00A3FF",
  accentBlueGlow: "rgba(0, 163, 255, 0.5)",
  textPrimary: "#E0E7FF",
  textSecondary: "#8A9CB0",
  iconColor: "#C0D0E0",
  neutralDark: "#303A52",
  negative: "#F87171",
  inputBackground: "#0E1423", 
  inputBorder: "#253047",    
};

export default function ChangePassword() {
  const router = useRouter();
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (loading) return;

    if (!user) { // Added user check
      setError("User not authenticated. Please log in again.");
      setTimeout(() => router.replace('/login'), 2000);
      return;
    }

    if (!newPassword || !reEnterPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== reEnterPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${apiUrl}/WebServicesFinal/Android/UpdatePassword`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
          
            UserID: user.UserID, 
            SiteID: user.SiteID, 
            MeterID: user.MeterID, 
            OldPassword: user.Password, 
            NewPassword: newPassword,
           
          }),
        }
      );
      const data = await response.json();

      if (data.ApiStatus === 'TRUE') {
        Alert.alert('Success', 'Password changed successfully! Please log in again with your new password.');
      
        router.replace('/login'); 
      } else {
        setError(data.ApiMessage || 'Failed to change password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please check your connection and try again.');
      console.error('Error changing password:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, newPassword, reEnterPassword, user, router]); 

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(drawer)')} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={26} color={THEME_COLORS.iconColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.formTitle}>Set Your New Password</Text>
        <Text style={styles.formSubtitle}>
          Ensure your new password is strong and memorable.
        </Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.inputGroup}>
          <Ionicons name="lock-closed-outline" size={20} color={THEME_COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={newPassword}
            onChangeText={(text) => { setNewPassword(text); setError(null); }}
            secureTextEntry={!showNewPassword}
            placeholderTextColor={THEME_COLORS.textSecondary}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
            <Ionicons name={showNewPassword ? "eye-off-outline" : "eye-outline"} size={22} color={THEME_COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="lock-closed-outline" size={20} color={THEME_COLORS.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Re-Enter New Password"
            value={reEnterPassword}
            onChangeText={(text) => { setReEnterPassword(text); setError(null); }}
            secureTextEntry={!showReEnterPassword}
            placeholderTextColor={THEME_COLORS.textSecondary}
            autoCapitalize="none"
          />
           <TouchableOpacity onPress={() => setShowReEnterPassword(!showReEnterPassword)} style={styles.eyeIcon}>
            <Ionicons name={showReEnterPassword ? "eye-off-outline" : "eye-outline"} size={22} color={THEME_COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={THEME_COLORS.textPrimary} />
          ) : (
            <Text style={styles.submitButtonText}>Update Password</Text>
          )}
        </TouchableOpacity>
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
    justifyContent: 'center', 
    paddingHorizontal: 25, 
    paddingBottom: 50, 
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  formSubtitle: {
    fontSize: 14,
    color: THEME_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.inputBackground,
    borderRadius: 12, 
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: THEME_COLORS.inputBorder, 
   
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14, 
    fontSize: 16,
    color: THEME_COLORS.textPrimary,
  },
  eyeIcon: {
    padding: 8, 
  },
  submitButton: {
    backgroundColor: THEME_COLORS.accentBlue,
    borderRadius: 12, 
    paddingVertical: 15, 
    alignItems: 'center',
    marginTop: 10, 
    // Glow effect
    shadowColor: THEME_COLORS.accentBlueGlow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6, 
  },
  submitButtonText: {
    color: THEME_COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: THEME_COLORS.negative,
    textAlign: 'center',
    marginBottom: 15, // Space below error
    fontSize: 14,
    fontWeight: '500',
  },
});