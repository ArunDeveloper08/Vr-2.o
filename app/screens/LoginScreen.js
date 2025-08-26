// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ImageBackground,
//   Alert,
//   ActivityIndicator
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { useRouter } from 'expo-router';
// import { useAuth } from '@/context/AuthContext';
// import {apiUrl} from '../../constant/utils'

// const LoginScreen = () => {
//   const [meterId, setMeterId] = useState('');
//   const [password, setPassword] = useState('');
//   const [siteId, setSiteId] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);

//   const navigation = useNavigation();
//  // const { setUser } = useAuth();
//  const { setUser: login } = useAuth();
//   const router = useRouter();

//   const handleLogin = async () => {
//     try {
//       const response = await fetch('http://www.pesonline.co.in:8080/WebServicesFinal/Android/LoginAndroid', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           SiteID: siteId,
//           VendorID: 'PesAndroid',
//           Password: password,
//           MeterID: meterId
//         })
//       });

//       const data = await response.json();

//       if (data.ApiMessage === 'SUCCESS') {

//       //  setUser({
//       //   SiteID: siteId,
//       //   VendorID: 'PesAndroid',
//       //   Password: password,
//       //   MeterID: meterId
//       // });
//       const userData = {
//           SiteID: siteId,
//           VendorID: 'PesAndroid',
//           Password: password, // Note: Avoid storing passwords in AsyncStorage for security
//           MeterID: meterId,
//         };
//         await login(userData);

//        router.replace('/(drawer)');
//       } else {
//         Alert.alert('API Fail', data.ApiMessage || 'Login failed.');
//       }

//       // Go to home page regardless

//     } catch (error) {

//       Alert.alert('API Fail', error.message || 'Something went wrong.');

//     }
//   };

//   return (
//     <ImageBackground
//       source={require('../../assets/images/background.jpg')}
//       style={styles.background}
//       resizeMode="cover"
//       onLoadEnd={() => setImageLoaded(true)}
//     >
//       {!imageLoaded ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#ffffff" />
//         </View>
//       ) : (
//         <View style={styles.container}>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter Meter / Customer ID"
//             placeholderTextColor="#9ca3af"
//             value={meterId}
//             onChangeText={setMeterId}
//           />

//           <View style={styles.passwordContainer}>
//             <TextInput
//               style={[styles.input, { flex: 1 }]}
//               placeholder="Password"
//               placeholderTextColor="#9ca3af"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//             />
//             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//               <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="black" />
//             </TouchableOpacity>
//           </View>

//           <TextInput
//             style={styles.input}
//             placeholder="Enter Site ID"
//             placeholderTextColor="#9ca3af"
//             value={siteId}
//             onChangeText={setSiteId}
//           />

//           <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//             <Text style={styles.loginButtonText}>Login</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => navigation.navigate('Register')}>
//             <Text style={styles.linkText}>
//               Register ? <Text style={styles.linkTextHighlight}>New User</Text>
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>

//           <Text style={styles.linkText} >Forgot Password ?</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'black', // Optional
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   input: {
//     width: '100%',
//     backgroundColor: 'white',
//     borderRadius: 25,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     fontSize: 16,
//     marginBottom: 15,
//   },
//   passwordContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '100%',
//     backgroundColor: 'white',
//     borderRadius: 25,
//     paddingHorizontal: 20,
//     marginBottom: 15,
//   },
//   loginButton: {
//     width: '100%',
//     backgroundColor: '#1abc9c',
//     paddingVertical: 15,
//     borderRadius: 25,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   loginButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   linkText: {
//     color: 'white',
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
// });

// export default LoginScreen;

import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { apiUrl } from "../../constant/utils";

const screenHeight = Dimensions.get("window").height;

// --- Theme Colors (Keep these as they are for the UI) ---
const THEME_COLORS = {
  background: "#0A0F1E",
  inputBackground: "#0E1423",
  inputBorder: "#253047",
  textPrimary: "#E0E7FF",
  textSecondary: "#8A9CB0",
  accentBlue: "#00A3FF",
  accentBlueGlow: "rgba(0, 163, 255, 0.5)",
  negative: "#F87171",
};

const LoginScreen = () => {
  const [meterId, setMeterId] = useState("");
  const [password, setPassword] = useState("");
  const [siteId, setSiteId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const { setUser: login } = useAuth();
  const router = useRouter();

  const handleLogin = useCallback(async () => {
    if (loading) return;
    setError("");

    if (!meterId.trim() || !password.trim() || !siteId.trim()) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/WebServicesFinal/Android/LoginAndroid`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            SiteID: siteId,
            VendorID: "PesAndroid",
            Password: password,
            MeterID: meterId,
          }),
        }
      );

      const data = await response.json();

      if (data.ApiStatus === "TRUE" && data.ApiMessage === "SUCCESS") {
        const userData = {
          SiteID: siteId,
          VendorID: "PesAndroid",
          Password: password,
          MeterID: meterId,
        };
        await login(userData);
        router.replace("/(drawer)");
      } else {
        setError(
          data.ApiMessage || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      setError(
        "An error occurred. Please check your connection and try again."
      );
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, meterId, password, siteId, login, router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={THEME_COLORS.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Ionicons
                name="log-in-outline"
                size={screenHeight * 0.08}
                color={THEME_COLORS.accentBlue}
              />
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputGroup}>
              <Ionicons
                name="speedometer-outline"
                size={20}
                color={THEME_COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Meter / Customer ID"
                placeholderTextColor={THEME_COLORS.textSecondary}
                value={meterId}
                onChangeText={(text) => {
                  setMeterId(text);
                  setError("");    
                }}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={THEME_COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={THEME_COLORS.textSecondary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color={THEME_COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Ionicons
                name="business-outline"
                size={20}
                color={THEME_COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Site ID"
                placeholderTextColor={THEME_COLORS.textSecondary}
                value={siteId}
                onChangeText={(text) => {
                  setSiteId(text);
                  setError("");
                }}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={THEME_COLORS.textPrimary}
                />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.linksContainer}>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.linkText}>
                  New User?{" "}
                  <Text style={styles.linkTextHighlight}>Register</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Forgot")}>
                <Text style={styles.linkText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: screenHeight * 0.05,
  },
  title: {
    fontSize: screenHeight * 0.035,
    fontWeight: "bold",
    color: THEME_COLORS.textPrimary,
    marginTop: 15,
  },
  subtitle: {
    fontSize: screenHeight * 0.018,
    color: THEME_COLORS.textSecondary,
    marginTop: 5,
  },
  errorText: {
    color: THEME_COLORS.negative,
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
    fontWeight: "500",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME_COLORS.inputBackground,
    borderRadius: 12,
    width: "100%",
    marginBottom: 18,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: THEME_COLORS.inputBorder,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: THEME_COLORS.textPrimary,
    paddingVertical: 10,
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    width: "100%",
    backgroundColor: THEME_COLORS.accentBlue,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    shadowColor: THEME_COLORS.accentBlueGlow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: THEME_COLORS.textPrimary,
    fontWeight: "bold",
    fontSize: 16,
  },
  linksContainer: {
    marginTop: 25,
    alignItems: "center",
    width: "100%",
  },
  linkText: {
    color: THEME_COLORS.textSecondary,
    fontWeight: "500",
    marginTop: 12,
    fontSize: 14,
  },
  linkTextHighlight: {
    color: THEME_COLORS.accentBlue,
    fontWeight: "bold",
  },
});

export default LoginScreen;
