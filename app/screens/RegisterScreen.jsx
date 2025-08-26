// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import { useNavigation } from '@react-navigation/native';
// import { apiUrl } from '@/constant/utils';

// const RegisterScreen = () => {
//   const router = useRouter();
//   const navigation = useNavigation();

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
//       // Send POST request to the registration API endpoint
//      // const response = await fetch(`${apiUrl}/api/register`,
//        const response = await fetch('http://www.pesonline.co.in:8080/WebServicesFinal/Android/AndroidRegister',
//          {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ meterId, siteId }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert('Success', 'Registration successful.');
//         router.back(); // Navigate back after successful registration
//       } else {
//         Alert.alert('Error', data.message || 'Failed to register. Please try again.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred. Please try again.');
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
//         <Text style={styles.headerTitle}>Register</Text>
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

//         {/* Login Link */}
//         <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//           <Text style={styles.loginLink}>
//             ALREADY REGISTERED ?{' '}
//             <Text style={styles.loginLinkText}>LOGIN HERE</Text>
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

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

// export default RegisterScreen;
import React, { useState, useCallback } from 'react'; // Added useCallback
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  StatusBar, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView, 
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { apiUrl } from '@/constant/utils';


const screenHeight = Dimensions.get('window').height;

// --- Theme Colors ---
const THEME_COLORS = {
  background: "#0A0F1E",
  inputBackground: "#0E1423",
  inputBorder: "#253047",
  textPrimary: "#E0E7FF",
  textSecondary: "#8A9CB0",
  accentBlue: "#00A3FF",
  accentBlueGlow: "rgba(0, 163, 255, 0.5)",
  negative: "#F87171",
  iconColor: "#C0D0E0", 
};

const RegisterScreen = () => {
  const router = useRouter();


  const [meterId, setMeterId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); 

  const handleSubmit = useCallback(async () => {
    if (loading) return;
    setError(''); 

    if (!meterId.trim() || !siteId.trim()) {
    
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/WebServicesFinal/Android/AndroidRegister`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
       
            MeterID: meterId, 
            SiteID: siteId,
          
          }),
      });

      const data = await response.json();

      if (data.ApiStatus === 'TRUE' && data.ApiMessage === 'SUCCESS') { 
        Alert.alert(
          'Registration Successful',
          data.DisplayMessage || 'You have been registered. Please check your email or SMS for login details, or try logging in.', 
          [{ text: 'OK', onPress: () => router.replace('/login') }] 
        );
      } else {
        setError(data.ApiMessage || data.DisplayMessage || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please check your connection and try again.');
      console.error("Registration Error:", err);
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
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Ionicons name="person-add-outline" size={screenHeight * 0.07} color={THEME_COLORS.accentBlue} style={styles.formIcon} />
            <Text style={styles.formTitle}>Join Us</Text>
            <Text style={styles.formSubtitle}>
              Enter your Meter/Customer ID and Site ID to get started.
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
                autoCapitalize="none"
                />
            </View>
            {/* Add more fields here if needed (e.g., Email, Mobile, Password for registration)
            <View style={styles.inputGroup}>
                <Ionicons name="mail-outline" size={20} color={THEME_COLORS.textSecondary} style={styles.inputIconPrefix} />
                <TextInput style={styles.input} placeholder="Email Address" ... />
            </View>
            */}

            {/* Submit Button */}
            <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
            >
            {loading ? (
                <ActivityIndicator size="small" color={THEME_COLORS.textPrimary} />
            ) : (
                <Text style={styles.submitButtonText}>Register</Text>
            )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity onPress={() => router.replace('/login')} style={styles.loginLinkButton}>
            <Text style={styles.loginLink}>
                Already have an account?{' '}
                <Text style={styles.loginLinkTextHighlight}>Login Here</Text>
            </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
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
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingBottom: 20, 
  },
  formIcon: {
    marginBottom: 15,
  },
  formTitle: {
    fontSize: screenHeight * 0.035,
    fontWeight: 'bold',
    color: THEME_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: screenHeight * 0.018,
    color: THEME_COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  errorText: {
    color: THEME_COLORS.negative,
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.inputBackground,
    borderRadius: 12,
    width: '100%',
    marginBottom: 18,
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
  loginLinkButton: { 
    marginTop: 25,
    paddingVertical: 10,
  },
  loginLink: {
    color: THEME_COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  loginLinkTextHighlight: {
    color: THEME_COLORS.accentBlue,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;