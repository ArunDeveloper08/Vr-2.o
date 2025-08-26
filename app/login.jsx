
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

export default function LoginEntry() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/(drawer)'); // Navigate to home if user exists
    }
  }, [loading, user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#28B9A9" />
      </View>
    );
  }

  return user ? null : <AppNavigator />; // Show login navigator if no user
}

// import React, { useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'expo-router';
// import AppNavigator from './navigation/AppNavigator';
// import { ActivityIndicator, View } from 'react-native';
// import Home from "../app/(drawer)/index"

// export default function LoginEntry() {
//   const { user, loading , setUser } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
 
//     if (!loading && user) {
//       router.replace('/(drawer)');
//     }
//   }, [loading, user]);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#28B9A9" />
//       </View>
//     );
//   }

//   return user ? null : <AppNavigator />;
// }