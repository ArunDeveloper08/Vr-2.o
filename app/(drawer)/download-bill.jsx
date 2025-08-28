// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import * as FileSystem from "expo-file-system";
// import * as Print from "expo-print";
// import * as Sharing from "expo-sharing";
// import { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Modal,
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import ViewShot from "react-native-view-shot";
// import { WebView } from "react-native-webview";
// import { useAuth } from "../../context/AuthContext";

// const COLORS = {
//   background: "#0E1629",
//   card: "#1C2536",
//   textPrimary: "#FFFFFF",
//   textSecondary: "#A0AEC0",
//   mainAccent: "#009FFD",
//   dgAccent: "#FFC107",
//   loadingOverlay: "rgba(0, 0, 0, 0.7)",
// };

// const INITIAL_ZOOM = 0.4;

// export default function DownloadBill() {
//   const { user } = useAuth();
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [currentUrl, setCurrentUrl] = useState("");
//   const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM);
//   const webviewRef = useRef(null);
//   const viewShotRef = useRef(null);
//   const [isWebViewReady, setIsWebViewReady] = useState(false);

//   const MAIN_BILL_URL = `https://www.pesonline.in/user/billreport?Sitecode=${user?.SiteID}&MeterID=${user?.MeterID}`;
//   const DG_LOG_URL = `https://www.pesonline.in/usertest/Home/MeterLog?sitecode=${user?.SiteID}&meterid=${user?.MeterID}`;

//   const openWebView = (url) => {
//     setCurrentUrl(url);
//     setZoomLevel(INITIAL_ZOOM);
//     setIsWebViewReady(false);
//     setIsModalVisible(true);
//   };

//   const closeWebView = () => {
//     setIsModalVisible(false);
//     setCurrentUrl("");
//   };

//   const handleZoomIn = () => setZoomLevel((prevZoom) => prevZoom + 0.1);
//   const handleZoomOut = () =>
//     setZoomLevel((prevZoom) => Math.max(0.2, prevZoom - 0.1));

//   useEffect(() => {
//     if (webviewRef.current && isModalVisible) {
//       const jsCode = `document.body.style.zoom = ${zoomLevel};`;
//       webviewRef.current.injectJavaScript(jsCode);
//     }
//   }, [zoomLevel]);

//   const handleSaveAsPdf = async () => {
//     if (isProcessing) return;
//     setIsProcessing(true);

//     try {
//       //console.log("Capturing image...");
//       // Capture the WebView as a temporary file
//       const imageUri = await viewShotRef.current.capture({
//         format: "jpg",
//         quality: 0.9,
//         result: "tmpfile",
//       });

//       //console.log("Image captured at:", imageUri);

//       // Verify the image file exists and read it
//       const fileInfo = await FileSystem.getInfoAsync(imageUri);
//       if (!fileInfo.exists) {
//         throw new Error("Captured image file does not exist");
//       }

//       // Convert image to base64 to ensure compatibility with HTML
//       const base64Image = await FileSystem.readAsStringAsync(imageUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       // Create HTML with base64 image
//       const html = `
//         <html>
//           <body style="margin: 0; padding: 0; width: 100%; height: 100%;">
//             <img src="data:image/jpeg;base64,${base64Image}" style="width: 100%; height: auto; display: block;" />
//           </body>
//         </html>
//       `;

//       //console.log("Generating PDF...");
//       const { uri: pdfUri } = await Print.printToFileAsync({ html });
//       await Sharing.shareAsync(pdfUri, {
//         dialogTitle: "Save or Share your Bill",
//         mimeType: "application/pdf",
//       });

//       // console.log("PDF created at:", pdfUri);
//     } catch (error) {
//       console.error("Failed to create or share PDF:", error);
//       Alert.alert(
//         "Error",
//         "Could not create PDF. Please try again. Details: " + error.message
//       );
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const injectedJavaScriptOnLoad = `
//     const downloadButton = Array.from(document.querySelectorAll('a, button')).find(el => el.innerText?.toLowerCase().trim() === 'download');
//     if (downloadButton) downloadButton.style.display = 'none';
//     const meta = document.createElement('meta');
//     meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes');
//     meta.setAttribute('name', 'viewport');
//     document.head.appendChild(meta);
//     document.body.style.zoom = ${INITIAL_ZOOM};
//     true;
//   `;

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" />
//       <View style={styles.container}>
//         <View style={styles.card}>
//           <Text style={styles.title}>View Report</Text>
//           <Text style={styles.subtitle}>
//             Select a source to view the bill in the app.
//           </Text>
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity
//               style={[styles.button, styles.mainButton]}
//               onPress={() => openWebView(MAIN_BILL_URL)}
//               activeOpacity={0.7}
//             >
//               <MaterialCommunityIcons
//                 name="transmission-tower"
//                 size={52}
//                 color={COLORS.textPrimary}
//               />
//               <Text style={styles.buttonText}>Main Bill</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.button, styles.dgButton]}
//               onPress={() => openWebView(DG_LOG_URL)}
//               activeOpacity={0.7}
//             >
//               <MaterialCommunityIcons
//                 name="engine"
//                 size={52}
//                 color={COLORS.textPrimary}
//               />
//               <Text style={styles.buttonText}>DG Log</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>

//       {isProcessing && (
//         <View style={styles.loadingOverlay}>
//           <ActivityIndicator size="large" color={COLORS.textPrimary} />
//           <Text style={styles.loadingText}>Creating PDF...</Text>
//         </View>
//       )}

//       <Modal
//         visible={isModalVisible}
//         onRequestClose={closeWebView}
//         animationType="slide"
//       >
//         <SafeAreaView style={styles.modalSafeArea}>
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Report View</Text>
//             <View style={styles.headerButtons}>
//               <TouchableOpacity
//                 onPress={handleZoomOut}
//                 style={styles.headerButton}
//               >
//                 <MaterialCommunityIcons
//                   name="minus-circle-outline"
//                   size={28}
//                   color={COLORS.textPrimary}
//                 />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={handleZoomIn}
//                 style={styles.headerButton}
//               >
//                 <MaterialCommunityIcons
//                   name="plus-circle-outline"
//                   size={28}
//                   color={COLORS.textPrimary}
//                 />
//               </TouchableOpacity>
//               {currentUrl.includes("billreport") && (
//                 <TouchableOpacity
//                   onPress={handleSaveAsPdf}
//                   style={[
//                     styles.headerButton,
//                     !isWebViewReady && styles.disabledButton,
//                   ]}
//                   disabled={!isWebViewReady}
//                 >
//                   <MaterialCommunityIcons
//                     name="file-pdf-box"
//                     size={26}
//                     color={isWebViewReady ? COLORS.textPrimary : "#888"}
//                   />
//                 </TouchableOpacity>
//               )}
//               <TouchableOpacity
//                 onPress={closeWebView}
//                 style={styles.headerButton}
//               >
//                 <MaterialCommunityIcons
//                   name="close"
//                   size={28}
//                   color={COLORS.textPrimary}
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <ViewShot
//             ref={viewShotRef}
//             options={{ format: "jpg", quality: 0.9 }}
//             style={{ flex: 1 }}
//           >
//             <WebView
//               ref={webviewRef}
//               source={{ uri: currentUrl }}
//               startInLoadingState={true}
//               renderLoading={() => (
//                 <ActivityIndicator
//                   style={{
//                     position: "absolute",
//                     top: 0,
//                     bottom: 0,
//                     left: 0,
//                     right: 0,
//                   }}
//                   size="large"
//                   color={COLORS.mainAccent}
//                 />
//               )}
//               injectedJavaScript={injectedJavaScriptOnLoad}
//               onLoadEnd={() => {
//                 setTimeout(() => setIsWebViewReady(true), 1000);
//               }}
//               style={{ flex: 1, backgroundColor: "transparent" }}
//             />
//           </ViewShot>
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: COLORS.background },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   card: {
//     width: "100%",
//     backgroundColor: COLORS.card,
//     borderRadius: 16,
//     paddingVertical: 40,
//     paddingHorizontal: 25,
//     alignItems: "center",
//     elevation: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: COLORS.textPrimary,
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: COLORS.textSecondary,
//     textAlign: "center",
//     marginBottom: 35,
//     lineHeight: 24,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   button: {
//     width: "48%",
//     aspectRatio: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 12,
//     padding: 10,
//   },
//   mainButton: { backgroundColor: COLORS.mainAccent },
//   dgButton: { backgroundColor: COLORS.dgAccent },
//   buttonText: {
//     color: COLORS.textPrimary,
//     fontSize: 18,
//     fontWeight: "600",
//     marginTop: 12,
//     textAlign: "center",
//   },
//   modalSafeArea: { flex: 1, backgroundColor: COLORS.card },
//   modalHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     backgroundColor: COLORS.card,
//     borderBottomWidth: 1,
//     borderBottomColor: "#333",
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: COLORS.textPrimary,
//   },
//   headerButtons: { flexDirection: "row", alignItems: "center" },
//   headerButton: { padding: 5, marginLeft: 15 },
//   disabledButton: { opacity: 0.5 },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: COLORS.loadingOverlay,
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1000,
//   },
//   loadingText: {
//     marginTop: 15,
//     color: COLORS.textPrimary,
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";
import { WebView } from "react-native-webview";
import { useAuth } from "../../context/AuthContext";

const COLORS = {
  background: "#0E1629",
  card: "#1C2536",
  textPrimary: "#FFFFFF",
  textSecondary: "#A0AEC0",
  mainAccent: "#009FFD",
  dgAccent: "#FFC107",
  loadingOverlay: "rgba(0, 0, 0, 0.7)",
};

const INITIAL_ZOOM = 0.4;

export default function DownloadBill() {
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [zoomLevel, setZoomLevel] = useState(INITIAL_ZOOM);
  const webviewRef = useRef(null);
  const viewShotRef = useRef(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);

  const MAIN_BILL_URL = `https://www.pesonline.in/user/billreport?Sitecode=${user?.SiteID}&MeterID=${user?.MeterID}`;
  const DG_LOG_URL = `https://www.pesonline.in/usertest/Home/MeterLog?sitecode=${user?.SiteID}&meterid=${user?.MeterID}`;

  const openWebView = (url) => {
    setCurrentUrl(url);
    setZoomLevel(INITIAL_ZOOM);
    setIsWebViewReady(false);
    setIsModalVisible(true);
  };     

  const closeWebView = () => {
    setIsModalVisible(false);
    setCurrentUrl("");
  };

  const handleZoomIn = () => setZoomLevel((prevZoom) => prevZoom + 0.1);
  const handleZoomOut = () =>
    setZoomLevel((prevZoom) => Math.max(0.2, prevZoom - 0.1));
     
  useEffect(() => {
    if (webviewRef.current && isModalVisible) {
      const jsCode = `document.body.style.zoom = ${zoomLevel};`;
      webviewRef.current.injectJavaScript(jsCode);
    }
  }, [zoomLevel]);

  const handleSaveAsPdf = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const imageUri = await viewShotRef.current.capture({
        format: "jpg",
        quality: 0.9,
        result: "tmpfile",
      });

      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        throw new Error("Captured image file does not exist");
      }

      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const html = `
        <html>
          <body style="margin: 0; padding: 0; width: 100%; height: 100%;">
            <img src="data:image/jpeg;base64,${base64Image}" style="width: 100%; height: auto; display: block;" />
          </body>
        </html>
      `;

      const { uri: pdfUri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(pdfUri, {
        dialogTitle: "Save or Share your Bill",
        mimeType: "application/pdf",
      });
    } catch (error) {
      console.error("Failed to create or share PDF:", error);
      Alert.alert(
        "Error",
        "Could not create PDF. Please try again. Details: " + error.message
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // ==================== THIS IS THE MODIFIED PART ====================
  // We've enhanced this script to specifically target and hide the navbar
  // on the DG Log page.
  const injectedJavaScriptOnLoad = `
    (function() { // Wrap in a function to avoid scope issues
      // --- General setup for all pages ---
      document.body.style.zoom = ${INITIAL_ZOOM}; 
      const meta = document.createElement('meta'); 
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes'); 
      meta.setAttribute('name', 'viewport'); 
      document.head.appendChild(meta);

      // --- LOGIC TO HIDE NAVBAR ON DG LOG PAGE ONLY ---
      // We check if the URL contains 'MeterLog', which is unique to the DG Log URL.
      if (window.location.href.includes('MeterLog')) {
        // Try to find the navbar element. '.navbar' is a very common class for headers.
        const navbar = document.querySelector('.navbar'); 
        if (navbar) {
          navbar.style.display = 'none';
        }
        
        // As a fallback, some websites use the HTML <header> tag. We'll hide that too if found.
        const header = document.querySelector('header');
        if (header) {
          header.style.display = 'none';
        }

        // Optional: Sometimes after hiding a fixed header, the content behind it needs a little push down.
        // You can uncomment the line below if the report starts too high on the screen.
        // document.body.style.paddingTop = '10px';
      }
      
      // --- Existing logic to hide any download buttons ---
      const downloadButton = Array.from(document.querySelectorAll('a, button')).find(el => el.innerText?.toLowerCase().trim() === 'download');
      if (downloadButton) downloadButton.style.display = 'none';
      
      // Must return true to signal that the script has finished executing.
      true;
    })();
  `;
  // ==================== END OF MODIFIED PART ====================

  return (

    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>View Report</Text>
          <Text style={styles.subtitle}>
            Select a source to view the bill in the app.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.mainButton]}
              onPress={() => openWebView(MAIN_BILL_URL)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="transmission-tower"
                size={52}
                color={COLORS.textPrimary}
              />
              <Text style={styles.buttonText}>Main Bill</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.dgButton]}
              onPress={() => openWebView(DG_LOG_URL)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="engine"
                size={52}
                color={COLORS.textPrimary}
              />
              <Text style={styles.buttonText}>DG Log</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {isProcessing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.textPrimary} />
          <Text style={styles.loadingText}>Creating PDF...</Text>
        </View>
      )}

      <Modal
        visible={isModalVisible}
        onRequestClose={closeWebView}
        animationType="slide" 
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Report View</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={handleZoomOut}
                style={styles.headerButton}
              >
                <MaterialCommunityIcons
                  name="minus-circle-outline"
                  size={28}
                  color={COLORS.textPrimary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleZoomIn}
                style={styles.headerButton}
              >
                <MaterialCommunityIcons
                  name="plus-circle-outline"
                  size={28}
                  color={COLORS.textPrimary}
                /> 
              </TouchableOpacity>
              {currentUrl.includes("billreport") && (
                <TouchableOpacity
                  onPress={handleSaveAsPdf}
                  style={[
                    styles.headerButton,
                    !isWebViewReady && styles.disabledButton,
                  ]}
                  disabled={!isWebViewReady}
                >
                  <MaterialCommunityIcons
                    name="file-pdf-box"
                    size={26}
                    color={isWebViewReady ? COLORS.textPrimary : "#888"}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={closeWebView}
                style={styles.headerButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={28}
                  color={COLORS.textPrimary}
                />
              </TouchableOpacity>
            </View>          
          </View>

          <ViewShot
            ref={viewShotRef}
            options={{ format: "jpg", quality: 0.9 }}
            style={{ flex: 1 }}
          >
            <WebView
              ref={webviewRef}
              source={{ uri: currentUrl }}
              startInLoadingState={true}
              renderLoading={() => (
                <ActivityIndicator
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                  }}
                  size="large"
                  color={COLORS.mainAccent} 
                />
              )}
              injectedJavaScript={injectedJavaScriptOnLoad}
              onLoadEnd={() => {
                setTimeout(() => setIsWebViewReady(true), 1000);
              }} 
              style={{ flex: 1, backgroundColor: "transparent" }}
            />
          </ViewShot>

        </SafeAreaView>
      </Modal>
    </SafeAreaView> 
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 25,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 35,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    width: "48%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
  },
  mainButton: { backgroundColor: COLORS.mainAccent },
  dgButton: { backgroundColor: COLORS.dgAccent },
  buttonText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
  modalSafeArea: { flex: 1, backgroundColor: COLORS.card },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  headerButtons: { flexDirection: "row", alignItems: "center" },
  headerButton: { padding: 5, marginLeft: 15 },
  disabledButton: { opacity: 0.5 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.loadingOverlay,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 15,
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});
