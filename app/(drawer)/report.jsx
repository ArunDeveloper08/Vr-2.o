// import {
//     View,
//     Text,
//     StyleSheet,
//     Pressable,
//     Animated,
//     StatusBar,
//     Dimensions,
//   } from 'react-native';
//   import React, { useRef } from 'react';
//   import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
//   import { useRouter } from 'expo-router';
  
//   const screenWidth = Dimensions.get('window').width;
  
//   const AnimatedCard = ({ icon, label, iconName, onPress }) => {
//     const scale = useRef(new Animated.Value(1)).current;
  
//     const handlePressIn = () => {
//       Animated.spring(scale, {
//         toValue: 0.97,
//         useNativeDriver: true,
//       }).start();
//     };
  
//     const handlePressOut = () => {
//       Animated.spring(scale, {
//         toValue: 1,
//         friction: 3,
//         useNativeDriver: true,
//       }).start();
//     };
  
//     return (
//       <Pressable
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}
//         onPress={onPress}
//       >
//         <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
//           <MaterialCommunityIcons name={iconName} size={42} color="#28B9A9" />
//           <Text style={styles.cardText}>{label}</Text>
//         </Animated.View>
//       </Pressable>
//     );
//   };
  
//   const Report = () => {
//     const router = useRouter();
  
//     return (
//       <View style={styles.container}>
//         <StatusBar backgroundColor="#28B9A9" barStyle="light-content" />
        
//         {/* Header */}
//         <View style={styles.header}>
//           <Pressable onPress={() => router.replace('/(drawer)')}>
//             <Ionicons name="arrow-back" size={24} color="white" />
//           </Pressable>
//           <Text style={styles.headerTitle}>Report</Text>
//           <View style={{ width: 24 }} />
//         </View>
  
//         {/* Unit Label */}
//         <Text style={styles.unitLabel}>UNIT S2-0203</Text>
  
//         {/* Cards */}
//         <View style={styles.cardContainer}>
//           <AnimatedCard
//             iconName="chart-line"
//             label="DAILY"
//             onPress={() => router.push('/report/daily')}
//           />
//           <AnimatedCard
//             iconName="chart-bar"
//             label="MONTHLY"
//             onPress={() => router.push('/report/monthly')}
//           />
//           <AnimatedCard
//             iconName="chart-bar-stacked"
//             label="COMPARATIVE"
//             onPress={() => router.push('/report/comparative')}
//           />
//           <AnimatedCard
//             iconName="credit-card-outline"
//             label="CURRENT TARIFF"
//             onPress={() => router.push('/report/current-tariff')}
//           />
//         </View>
//       </View>
//     );
//   };
  
//   export default Report;
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#F0F4F8',
//     },
//     header: {
//       backgroundColor: '#28B9A9',
//       paddingVertical: 18,
//       paddingHorizontal: 16,
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       elevation: 4,
//     },
//     headerTitle: {
//       color: '#fff',
//       fontSize: 20,
//       fontWeight: 'bold',
//     },
//     unitLabel: {
//       fontSize: 18,
//       fontWeight: '600',
//       textAlign: 'center',
//       marginVertical: 15,
//       color: '#444',
//     },
//     cardContainer: {
//       flexDirection: 'row',
//       flexWrap: 'wrap',
//       justifyContent: 'space-around',
//       padding: 10,
//     },
//     card: {
//       backgroundColor: '#fff',
//       width: screenWidth * 0.42,
//       aspectRatio: 1,
//       marginVertical: 10,
//       borderRadius: 16,
//       justifyContent: 'center',
//       alignItems: 'center',
//       elevation: 6,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 3 },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//     },
//     cardText: {
//       marginTop: 10,
//       fontSize: 14,
//       fontWeight: '600',
//       color: '#333', 
//       textAlign: 'center',
//     },
//   });
  

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import React, { useRef } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext'; 

const screenWidth = Dimensions.get('window').width;

// --- Theme Colors ---
const THEME_COLORS = {
  background: "#0A0F1E",
  cardBackground: "#1A1F2C",
  accentBlue: "#00A3FF",
  textPrimary: "#E0E7FF",
  textSecondary: "#8A9CB0",
  iconColor: "#C0D0E0", 
  neutralDark: "#303A52",
  // Specific card icon colors for visual differentiation (optional)
  cardIconColor1: "#00A3FF", 
  cardIconColor2: "#34D399", 
  cardIconColor3: "#FBBF24", 
  cardIconColor4: "#A78BFA", 
};

const AnimatedCard = ({ iconName, label, onPress, iconColor = THEME_COLORS.accentBlue }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96, 
      friction: 4,    
      tension: 100,  
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 70,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={styles.pressableCardWrapper} 
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <MaterialCommunityIcons name={iconName} size={screenWidth * 0.1} color={iconColor} />
        <Text style={styles.cardText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

const Report = () => {
  const router = useRouter();
  const { user } = useAuth(); 

  
  const unitLabel = user?.UnitNo || user?.MeterName || "My Unit";


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEME_COLORS.background} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/(drawer)')} style={styles.headerIcon}>
          <Ionicons name="arrow-back" size={26} color={THEME_COLORS.iconColor} />
        </Pressable>
        <Text style={styles.headerTitle}>Reports Dashboard</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Unit Label */}
      <Text style={styles.unitLabel}>{unitLabel}</Text>

      {/* Cards */}
      <View style={styles.cardContainer}>
        <AnimatedCard
          iconName="chart-timeline-variant" 
          label="DAILY INSIGHTS"
          iconColor={THEME_COLORS.cardIconColor1}
          onPress={() => router.push('/report/daily')} 
        />
        <AnimatedCard
          iconName="calendar-month-outline" 
          label="MONTHLY SUMMARY"
          iconColor={THEME_COLORS.cardIconColor2}
          onPress={() => router.push('/report/monthly')}
        />
        <AnimatedCard
          iconName="compare-horizontal" 
          label="COMPARATIVE ANALYSIS"
          iconColor={THEME_COLORS.cardIconColor3}
          onPress={() => router.push('/report/comparative')}
        />
        <AnimatedCard
          iconName="file-document-outline" 
          label="CURRENT TARIFF"
          iconColor={THEME_COLORS.cardIconColor4}
          onPress={() => router.push('/report/current-tariff')}
        />
      </View>
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  header: {
    backgroundColor: THEME_COLORS.background, 
    paddingVertical: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: THEME_COLORS.neutralDark, 
  },
  headerIcon: {
    padding: 5, // For easier touch
  },
  headerTitle: {
    color: THEME_COLORS.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  unitLabel: {
    fontSize: 16, 
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20, 
    color: THEME_COLORS.textSecondary,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 10,
  },
  pressableCardWrapper: { 
    width: '47%', 
    marginBottom: screenWidth * 0.06, 
  },
  card: {
    backgroundColor: THEME_COLORS.cardBackground,
    aspectRatio: 1.1, 
    borderRadius: 18, 
    justifyContent: 'center',
    alignItems: 'center',
   
    shadowColor: "rgba(0,0,0,0.6)", 
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.15, 
    shadowRadius: 8,    
    elevation: 6,       
    padding: 10, 
  },
  cardText: {
    marginTop: screenWidth * 0.03,
    fontSize: screenWidth * 0.035, 
    fontWeight: '600',
    color: THEME_COLORS.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 5, 
  },
});