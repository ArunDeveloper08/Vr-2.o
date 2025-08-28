import { LogBox, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import LoginEntry from "./login";

LogBox.ignoreLogs(['"shadow*" style props are deprecated. Use "boxShadow".']);
export default function Index() {
  return (
    <SafeAreaProvider>
      {/* SafeAreaView will apply the padding to avoid the notch/status bar */}
      {/* You can style the SafeAreaView itself, or place a View inside it */}
      <SafeAreaView style={styles.safeArea}>
        <LoginEntry />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Ensures the SafeAreaView takes up the full screen
    // You can add a background color here if you want it to fill the whole safe area
    // backgroundColor: 'white',
  },
});
