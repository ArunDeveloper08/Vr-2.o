// import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import React, { useState } from 'react';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// export default function ForgotPasswordScreen() {
//   const router = useRouter();

//   // State for input fields and loading
//   const [meterId, setMeterId] = useState('');
//   const [siteId, setSiteId] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!meterId || !siteId) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Simulate an API call (replace with actual API endpoint)
//       // Example: await fetch('your-api-endpoint', { method: 'POST', body: JSON.stringify({ meterId, siteId }) });
//       console.log('Submitting:', { meterId, siteId });
//       Alert.alert('Success', 'Password reset instructions sent (simulated).');
//       router.back(); // Navigate back after success
//     } catch (error) {
//       Alert.alert('Error', 'Failed to reset password. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color="white" style={styles.backIcon} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Forgot Password</Text>
//       </View>

//       {/* Content */}
//       <View style={styles.container}>
//         {/* Input Fields */}
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Meter / Customer ID"
//           placeholderTextColor="#888"
//           value={meterId}
//           onChangeText={setMeterId}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Site ID"
//           placeholderTextColor="#888"
//           value={siteId}
//           onChangeText={setSiteId}
//         />

//         {/* Submit Button */}
//         <TouchableOpacity
//           style={styles.submitButton}
//           onPress={handleSubmit}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator size="small" color="white" />
//           ) : (
//             <Text style={styles.submitButtonText}>Submit</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#333333', // Dark gray background matching the screenshot
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1abc9c', // Teal color from the screenshot
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//   },
//   backIcon: {
//     marginRight: 10,
//   },
//   headerTitle: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#333333',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     backgroundColor: 'white',
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     marginBottom: 20,
//     fontSize: 16,
//     color: '#333',
//   },
//   submitButton: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#1abc9c',
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   loginLink: {
//     color: '#ccc',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   loginLinkText: {
//     color: '#1abc9c',
//     fontWeight: 'bold',
//   },
// });

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert, // Keep Alert for now, but consider custom modal for theme consistency
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView, // For better input handling with keyboard
  Platform,
} from 'react-native';
import React, { useState, useCallback } from 'react'; // Added useCallback
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// --- Theme Colors ---
const THEME_COLORS = {
  background: "#0A0F1E",
  cardBackground: "#1A1F2C", // Not directly used here for cards, but for consistency
  accentBlue: "#00A3FF",
  accentBlueGlow: "rgba(0, 163, 255, 0.5)",
  textPrimary: "#E0E7FF",
  textSecondary: "#8A9CB0",
  iconColor: "#C0D0E0", // For header icon
  neutralDark: "#303A52",
  negative: "#F87171",
  inputBackground: "#0E1423",
  inputBorder: "#253047",
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [meterId, setMeterId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // State for error messages

  const handleSubmit = useCallback(async () => {
    if (loading) return;
    setError(''); // Clear previous errors

    if (!meterId.trim() || !siteId.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // **IMPORTANT: Replace with your actual API endpoint and payload structure**
      // const response = await fetch('YOUR_FORGOT_PASSWORD_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     MeterID: meterId, // Or CustomerID, ensure key matches API
      //     SiteID: siteId,
      //     // Potentially other fields like 'email' or 'username' if your API uses them
      //   }),
      // });
      // const data = await response.json();

      // if (!response.ok || data.ApiStatus !== 'TRUE') {
      //   throw new Error(data.ApiMessage || 'Failed to process request.');
      // }

      // Simulated API call:
      await new Promise(resolve => setTimeout(resolve, 1500));
   

      Alert.alert(
        'Instructions Sent',
        'If an account matches the provided details, password reset instructions have been sent. Please check your registered email or contact support if you face issues.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error("Forgot Password Error:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, meterId, siteId, router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLORS.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={26} color={THEME_COLORS.iconColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.formContainer}>
            <Ionicons name="key-outline" size={60} color={THEME_COLORS.accentBlue} style={styles.formIcon} />
            <Text style={styles.formTitle}>Forgot Your Password?</Text>
            <Text style={styles.formSubtitle}>
            Enter your Meter/Customer ID and Site ID. We'll help you reset it.
            </Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Input Fields */}
            <View style={styles.inputGroup}>
                <Ionicons name="speedometer-outline" size={20} color={THEME_COLORS.textSecondary} style={styles.inputIconPrefix} />
                <TextInput
                style={styles.input}
                placeholder="Meter / Customer ID"
                placeholderTextColor={THEME_COLORS.textSecondary}
                value={meterId}
                onChangeText={(text) => {setMeterId(text); setError('');}}
                keyboardType="default" 
                autoCapitalize="none"
                />
            </View>

            <View style={styles.inputGroup}>
                <Ionicons name="business-outline" size={20} color={THEME_COLORS.textSecondary} style={styles.inputIconPrefix} />
                <TextInput
                style={styles.input}
                placeholder="Site ID"
                placeholderTextColor={THEME_COLORS.textSecondary}
                value={siteId}
                onChangeText={(text) => {setSiteId(text); setError('');}}
                keyboardType="default"
                autoCapitalize="none"
                />
            </View>


            {/* Submit Button */}
            <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
            >
            {loading ? (
                <ActivityIndicator size="small" color={THEME_COLORS.textPrimary} />
            ) : (
                <Text style={styles.submitButtonText}>Send Reset Instructions</Text>
            )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace('/login')} style={styles.backToLoginButton}>
                <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.background,
    paddingVertical: 15,
    paddingHorizontal: 16,
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
  container: { 
    flex: 1,
    justifyContent: 'center', 
  },
  formContainer: { 
    paddingHorizontal: 25,
    alignItems: 'center', 
  },
  formIcon: {
    marginBottom: 20,
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
    lineHeight: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.inputBackground,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: THEME_COLORS.inputBorder,
  },
  inputIconPrefix: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50, 
    fontSize: 16,
    color: THEME_COLORS.textPrimary,
    paddingVertical: 10, 
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: THEME_COLORS.accentBlue,
    borderRadius: 12, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, 
  
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
    marginBottom: 15,
    fontSize: 14,
    fontWeight: '500',
  },
  backToLoginButton: {
    marginTop: 25,
    paddingVertical: 10,
  },
  backToLoginText: {
    color: THEME_COLORS.accentBlue, 
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});