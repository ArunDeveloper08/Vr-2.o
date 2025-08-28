// import { Feather } from "@expo/vector-icons";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { useCallback, useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   KeyboardAvoidingView,
//   Modal,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { WebView } from "react-native-webview";
// import { useAuth } from "../../context/AuthContext";

// // --- Mock Data (Replace with your API call) ---
// const MDR_CHARGES_DATA = [
//   { key: "1", method: "UPI", charge: "0.1%" },
//   { key: "2", method: "Debit-Card<2k", charge: "0.5%" },
//   { key: "3", method: "Debit Card>2k", charge: "0.9%" },
//   { key: "4", method: "Net-Banking", charge: "1.65%" },
//   { key: "5", method: "PPI on UPI", charge: "1.85%" },
//   { key: "6", method: "Credit-Card(visa/master/rupay)", charge: "1.85%" },
//   { key: "7", method: "Rupay Credit-card on UPI", charge: "2%" },
//   { key: "8", method: "Credit-Card(amex/dinner/corp)", charge: "2.9%" },
// ];

// // --- Configuration ---
// const RETURN_URL = "https://your-app.com/payment-callback";
// const API_ENDPOINT = "http://YOUR_SERVER_IP:3000/create-payment-link"; // <-- IMPORTANT: REPLACE THIS
// const HANDLING_CHARGE = 10.0;
// const CGST_RATE = 0.09; // 9%
// const SGST_RATE = 0.09; // 9%
// const MINIMUM_AMOUNT = 500; 

// // Using your preferred dark theme
// const theme = {
//   colors: {
//     background: "#0F172A",
//     card: "#1E293B",
//     textPrimary: "#F1F5F9",
//     textSecondary: "#94A3B8",
//     accent: "#0EA5E9",
//     border: "#334155",
//     inputBackground: "#334155",
//   },
// };

// export default function PaymentScreen() {
//   const navigation = useNavigation();
//   const { user } = useAuth();
//   //  console.log("user" , user)

//   // --- State Management for the entire flow ---
//   const [isMdrModalVisible, setMdrModalVisible] = useState(true);
//   const [isLoadingCharges, setIsLoadingCharges] = useState(true);
//   const [mdrCharges, setMdrCharges] = useState([]);
//   const [showPaymentForm, setShowPaymentForm] = useState(false);

//   // State for the new Topup UI
//   const [amount, setAmount] = useState("");
//   const [notes, setNotes] = useState("");
//   const [calculated, setCalculated] = useState({
//     amount: 0,
//     handling: HANDLING_CHARGE,
//     cgst: HANDLING_CHARGE * CGST_RATE,
//     sgst: HANDLING_CHARGE * SGST_RATE,
//     total: HANDLING_CHARGE * (1 + CGST_RATE + SGST_RATE),
//   });

//   // WebView State
//   const [isLoadingPayment, setIsLoadingPayment] = useState(false);
//   const [showWebViewModal, setShowWebViewModal] = useState(false);
//   const [paymentUrl, setPaymentUrl] = useState("");

//   // Reset screen state every time it's focused
//   useFocusEffect(
//     useCallback(() => {
//       setShowPaymentForm(false);
//       setMdrModalVisible(true);
//       setIsLoadingCharges(true);
//       setAmount("");
//       setNotes("");

//       // Fetch the charges data
//       setTimeout(() => {
//         setMdrCharges(MDR_CHARGES_DATA);
//         setIsLoadingCharges(false);
//       }, 1000);

//       return () => {};
//     }, [])
//   );

//   // Real-time calculation as the user types
//   useEffect(() => {
//     const numericAmount = parseFloat(amount) || 0;
//     const cgst = HANDLING_CHARGE * CGST_RATE;
//     const sgst = HANDLING_CHARGE * SGST_RATE;
//     const total = numericAmount + HANDLING_CHARGE + cgst + sgst;

//     setCalculated({
//       amount: numericAmount,
//       handling: HANDLING_CHARGE,
//       cgst,
//       sgst,
//       total,
//     });
//   }, [amount]);

//   // Handles the final "Proceed to Checkout" button press
//   const handlePayment = async () => {
//     if (calculated.amount < MINIMUM_AMOUNT) {
//       Alert.alert(
//         "Invalid Amount",
//         `Minimum amount must be greater than ₹${MINIMUM_AMOUNT}.`
//       );
//       return;
//     }

//     setIsLoadingPayment(true);
//     try {
//       // NOTE: You need to get user details (name, email, phone) from your app's state,
//       // as they are no longer entered on this screen.
//       const userDetails = {
//         name: "Bhavish yadav", // Get from user profile
//         email: "bhavish@example.com", // Get from user profile
//         phone: "9999999999", // Get from user profile
//       };

//       const response = await fetch(API_ENDPOINT, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           orderId: `ORD_${Date.now()}`,
//           amount: calculated.total.toFixed(2),
//           customerName: userDetails.name,
//           customerEmail: userDetails.email,
//           customerPhone: userDetails.phone,
//         }),
//       });
//       const data = await response.json();

//       if (data.paymentUrl) {
//         setPaymentUrl(data.paymentUrl);
//         setShowWebViewModal(true);
//       } else {
//         Alert.alert("Error", "Could not initiate payment.");
//       }
//     } catch (error) {
//       Alert.alert("Network Error", "Unable to connect to the server.");
//     } finally {
//       setIsLoadingPayment(false);
//     }
//   };

//   const handleNavigationStateChange = (navState) => {
//     const { url } = navState;
//     if (url && url.startsWith(RETURN_URL)) {
//       setShowWebViewModal(false);
//       setPaymentUrl("");
//       if (url.includes("status=success")) {
//         Alert.alert("Payment Successful", "Your balance has been updated.", [
//           { text: "OK", onPress: () => navigation.goBack() },
//         ]);
//       } else {
//         Alert.alert("Payment Failed", "Your payment was not successful.");
//       }
//     }
//   };

//   const renderChargeItem = ({ item }) => (
//     <View style={modalStyles.chargeRow}>
//       <Text style={modalStyles.chargeMethod}>{item.method}</Text>
//       <Text style={modalStyles.chargeValue}>{item.charge}</Text>
//     </View>
//   );

//   const isButtonDisabled = calculated.amount < MINIMUM_AMOUNT;

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* --- This is the main Topup UI, hidden until modal is dismissed --- */}
//       {showPaymentForm && (
//         <KeyboardAvoidingView
//           style={{ flex: 1 }}
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//         >
//           <ScrollView contentContainerStyle={styles.scrollContainer}>
//             {/* <View style={styles.userInfoCard}>
//               <Text style={styles.userName}>Mr. Bhavish yadav S/0 Sh. CP Yadav M-G04</Text>
//               <Text style={styles.liveBalance}>Live Balance : ₹387.0</Text>
//             </View> */}

//             <View style={styles.detailsCard}>
//               <Text style={styles.cardTitle}>Amount Details</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter Amount"
//                 placeholderTextColor={theme.colors.textSecondary}
//                 keyboardType="numeric"
//                 value={amount}
//                 onChangeText={setAmount}
//               />
//               <Text style={styles.validationText}>
//                 Minimum amount must be greater than ₹{MINIMUM_AMOUNT}.
//               </Text>
//               <TextInput
//                 style={[
//                   styles.input,
//                   { height: 80, textAlignVertical: "top", paddingTop: 12 },
//                 ]}
//                 placeholder="Notes"
//                 placeholderTextColor={theme.colors.textSecondary}
//                 multiline={true}
//                 value={notes}
//                 onChangeText={setNotes}
//               />
//             </View>

//             <View style={styles.linksCard}>
//               <TouchableOpacity style={styles.linkRow}>
//                 <Text style={styles.linkText}>Terms of Service</Text>
//                 <Feather
//                   name="chevron-right"
//                   size={20}
//                   color={theme.colors.textSecondary}
//                 />
//               </TouchableOpacity>
//               <View style={styles.separator} />
//               <TouchableOpacity style={styles.linkRow}>
//                 <Text style={styles.linkText}>Privacy policy</Text>
//                 <Feather
//                   name="chevron-right"
//                   size={20}
//                   color={theme.colors.textSecondary}
//                 />
//               </TouchableOpacity>
//             </View>
//           </ScrollView>

//           <View style={styles.summaryContainer}>
//             <Text style={styles.summaryTitle}>Topup Amount</Text>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Amount</Text>
//               <Text style={styles.summaryValue}>
//                 ₹{calculated.amount.toFixed(2)}
//               </Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>Handling Charge</Text>
//               <Text style={styles.summaryValue}>
//                 ₹{calculated.handling.toFixed(2)}
//               </Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>CGST (9.0%)</Text>
//               <Text style={styles.summaryValue}>
//                 ₹{calculated.cgst.toFixed(2)}
//               </Text>
//             </View>
//             <View style={styles.summaryRow}>
//               <Text style={styles.summaryLabel}>SGST (9.0%)</Text>
//               <Text style={styles.summaryValue}>
//                 ₹{calculated.sgst.toFixed(2)}
//               </Text>
//             </View>
//             <View style={styles.totalRow}>
//               <Text style={styles.totalLabel}>Total</Text>
//               <Text style={styles.totalValue}>
//                 ₹{calculated.total.toFixed(2)}
//               </Text>
//             </View>

//             <TouchableOpacity
//               style={[
//                 styles.proceedButton,
//                 isButtonDisabled && styles.buttonDisabled,
//               ]}
//               onPress={handlePayment}
//               disabled={isButtonDisabled || isLoadingPayment}
//             >
//               {isLoadingPayment ? (
//                 <ActivityIndicator color={theme.colors.textPrimary} />
//               ) : (
//                 <Text style={styles.proceedButtonText}>
//                   Proceed to Checkout
//                 </Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </KeyboardAvoidingView>
//       )}

//       {/* --- MDR Charges Modal (Shows on load) --- */}
//       <Modal
//         visible={isMdrModalVisible}
//         transparent={true}
//         animationType="fade"
//       >
//         <View style={modalStyles.modalOverlay}>
//           <View style={modalStyles.modalContainer}>
//             {isLoadingCharges ? (
//               <ActivityIndicator size="large" color="#00447E" />
//             ) : (
//               <>
//                 <Text style={modalStyles.modalTitle}>
//                   Applicable MDR Charges per Transaction
//                 </Text>
//                 <FlatList
//                   data={mdrCharges}
//                   renderItem={renderChargeItem}
//                   keyExtractor={(item) => item.key}
//                   style={{ maxHeight: 250 }}
//                 />
//                 <Text style={modalStyles.noteText}>
//                   MDR charges are subject to change... exclusive of all
//                   applicable taxes.
//                 </Text>
//                 <Text style={modalStyles.noteTextBold}>
//                   NOTE : As a free and cost effective alternative... visiting
//                   RWA/ FM office.
//                 </Text>
//                 <View style={modalStyles.buttonContainer}>
//                   <TouchableOpacity
//                     style={[modalStyles.button, modalStyles.continueButton]}
//                     onPress={() => {
//                       setMdrModalVisible(false);
//                       setShowPaymentForm(true);
//                     }}
//                   >
//                     <Text style={modalStyles.continueButtonText}>
//                       Continue to Payment
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[modalStyles.button, modalStyles.returnButton]}
//                     onPress={() => navigation.goBack()}
//                   >
//                     <Text style={modalStyles.returnButtonText}>
//                       Return to Home
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* --- WebView Modal (For ICICI Payment Page) --- */}
//       <Modal
//         visible={showWebViewModal}
//         onRequestClose={() => setShowWebViewModal(false)}
//         animationType="slide"
//       >
//         <SafeAreaView
//           style={{ flex: 1, backgroundColor: theme.colors.background }}
//         >
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalHeaderText}>Complete Secure Payment</Text>
//             <TouchableOpacity onPress={() => setShowWebViewModal(false)}>
//               <Feather name="x" size={24} color={theme.colors.textPrimary} />
//             </TouchableOpacity>
//           </View>
//           <WebView
//             source={{ uri: paymentUrl }}
//             onNavigationStateChange={handleNavigationStateChange}
//             startInLoadingState={true}
//             renderLoading={() => (
//               <ActivityIndicator
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                 }}
//                 size="large"
//                 color={theme.colors.accent}
//               />
//             )}
//           />
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// // --- Styles for the Main Screen ---
// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: theme.colors.background },
//   scrollContainer: { padding: 16, paddingBottom: 320, paddingTop: 20 }, // Extra padding for footer
//   userInfoCard: {
//     backgroundColor: theme.colors.card,
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   userName: {
//     color: theme.colors.textPrimary,
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   liveBalance: { color: theme.colors.accent, fontSize: 14, marginTop: 4 },
//   detailsCard: {
//     backgroundColor: theme.colors.card,
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//   },
//   cardTitle: {
//     color: theme.colors.textSecondary,
//     fontSize: 14,
//     marginBottom: 12,
//   },
//   input: {
//     backgroundColor: theme.colors.inputBackground,
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     height: 50,
//     color: theme.colors.textPrimary,
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   validationText: {
//     color: theme.colors.textSecondary,
//     fontSize: 12,
//     marginBottom: 16,
//     paddingLeft: 8,
//   },
//   linksCard: {
//     backgroundColor: theme.colors.card,
//     borderRadius: 12,
//     overflow: "hidden",
//   },
//   linkRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//   },
//   linkText: { color: theme.colors.textPrimary, fontSize: 16 },
//   separator: { height: 1, backgroundColor: theme.colors.border },
//   summaryContainer: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: theme.colors.card,
//     padding: 16,
//     paddingBottom: Platform.OS === "ios" ? 30 : 16,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     borderTopWidth: 1,
//     borderColor: theme.colors.border,
//   },
//   summaryTitle: {
//     color: theme.colors.textPrimary,
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   summaryLabel: { color: theme.colors.textSecondary, fontSize: 16 },
//   summaryValue: { color: theme.colors.textPrimary, fontSize: 16 },
//   totalRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 8,
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: theme.colors.border,
//   },
//   totalLabel: {
//     color: theme.colors.textPrimary,
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   totalValue: { color: theme.colors.accent, fontSize: 18, fontWeight: "bold" },
//   proceedButton: {
//     backgroundColor: theme.colors.accent,
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: "center",
//     marginTop: 16,
//   },
//   proceedButtonText: {
//     color: theme.colors.textPrimary,
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   buttonDisabled: { opacity: 0.5 },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border,
//   },
//   modalHeaderText: {
//     color: theme.colors.textPrimary,
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// // --- Styles for the MDR Charges Modal ---
// const modalStyles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   modalContainer: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 8,
//     padding: 20,
//     width: "100%",
//     maxHeight: "90%",
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1E293B",
//     marginBottom: 15,
//     textAlign: "center",
//   },
//   chargeRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E2E8F0",
//   },
//   chargeMethod: { fontSize: 14, color: "#334155" },
//   chargeValue: { fontSize: 14, color: "#1E293B", fontWeight: "600" },
//   noteText: {
//     fontSize: 12,
//     color: "#64748B",
//     marginBottom: 10,
//     lineHeight: 18,
//     paddingTop: 10,
//   },
//   noteTextBold: {
//     fontSize: 12,
//     color: "#334155",
//     fontWeight: "bold",
//     marginBottom: 20,
//     lineHeight: 18,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingTop: 10,
//   },
//   button: {
//     flex: 1,
//     paddingVertical: 12,
//     borderRadius: 6,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   continueButton: { backgroundColor: "#00447E", marginRight: 10 },
//   continueButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
//   returnButton: { backgroundColor: "#DC2626", marginLeft: 10 },
//   returnButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
// });
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useAuth } from "../../context/AuthContext"; // Assuming this path is correct

const API_CONFIG_URL = "https://www.pesonline.co.in/webconfig/Android/SiteRechargeConfig";
const API_ENDPOINT = "http://YOUR_SERVER_IP:3000/create-payment-link"; // <-- IMPORTANT: REPLACE THIS
const RETURN_URL = "https://your-app.com/payment-callback"; // Your app's return URL

const MINIMUM_AMOUNT = 500; // Define your minimum amount here

// Using your preferred dark theme
const theme = {
  colors: {
    background: "#0F172A",
    card: "#1E293B",
    textPrimary: "#F1F5F9",
    textSecondary: "#94A3B8",
    accent: "#0EA5E9",
    border: "#334155",
    inputBackground: "#334155",
  },
};

export default function PaymentScreen() {
  const navigation = useNavigation();
  const { user } = useAuth(); // Assuming useAuth provides user data including email, name, phone
//  console.log("user" , user)

  // --- State Management for the entire flow ---
  const [isMdrModalVisible, setMdrModalVisible] = useState(true);
  const [isLoadingCharges, setIsLoadingCharges] = useState(true);
  const [mdrCharges, setMdrCharges] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Dynamic values from API
  const [handlingCharge, setHandlingCharge] = useState(0);
  const [cgstRate, setCgstRate] = useState(0);
  const [sgstRate, setSgstRate] = useState(0);
  const [chargesNote, setChargesNote] = useState("");
  const [chargesNote1, setChargesNote1] = useState("");

  // State for the new Topup UI
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [calculated, setCalculated] = useState({
    amount: 0,
    handling: 0,
    cgst: 0,
    sgst: 0,
    total: 0,
  });

  // WebView State
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [showWebViewModal, setShowWebViewModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");

  // Fetch configuration data on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(API_CONFIG_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            siteID: user?.SiteID,
            vendorID: "PesAndroid",
          }),
        });
        const json = await response.json();

        if (json.ApiStatus === "TRUE" && json.Data && json.Data.length > 0) {
          const configData = json.Data[0];
          const chargesData = json.Data[1]?.charges_data?.["Phone-Pe"]?.[0];

          setHandlingCharge(configData.HandlingCharge || 0);
          setCgstRate((configData.CGST || 0) / 100);
          setSgstRate((configData.SGST || 0) / 100);

          if (chargesData && chargesData.ChargesDetails) {
            const formattedMdrCharges = chargesData.ChargesDetails.map(
              (detail, index) => ({
                key: String(index),
                method: detail.Name,
                charge: `${detail.Value}%`,
              })
            );
            setMdrCharges(formattedMdrCharges);
            setChargesNote(chargesData.ChargesNotes?.charges_note || "");
            setChargesNote1(chargesData.ChargesNotes?.charges_note1 || "");
          } else {
            console.warn("No MDR charges details found in API response.");
            setMdrCharges([]); // Ensure it's an empty array if not found
          }
        } else {
          Alert.alert("Error", "Failed to load configuration data.");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error fetching config:", error);
        Alert.alert("Network Error", "Could not fetch configuration data.");
        navigation.goBack();
      } finally {
        setIsLoadingCharges(false);
      }
    };

    fetchConfig();
  }, []); // Run only once on mount

  // Reset screen state every time it's focused
  useFocusEffect(
    useCallback(() => {
      setShowPaymentForm(false);
      setMdrModalVisible(true);
      setAmount("");
      setNotes("");
      setPaymentUrl("");
      setShowWebViewModal(false);

      // Re-trigger loading charges if not already loaded or if modal was dismissed prematurely
      if (mdrCharges.length === 0 && !isLoadingCharges) {
        setIsLoadingCharges(true);
        // A small delay to simulate network call if you want to reuse the loading indicator
        // In a real app, you might just keep the fetched data without re-fetching on focus
        setTimeout(() => setIsLoadingCharges(false), 500);
      }

      return () => {};
    }, [mdrCharges, isLoadingCharges])
  );

  // Real-time calculation as the user types or config changes
  useEffect(() => {
    const numericAmount = parseFloat(amount) || 0;
    const cgst = handlingCharge * cgstRate;
    const sgst = handlingCharge * sgstRate;
    const total = numericAmount + handlingCharge + cgst + sgst;

    setCalculated({
      amount: numericAmount,
      handling: handlingCharge,
      cgst,
      sgst,
      total,
    });
  }, [amount, handlingCharge, cgstRate, sgstRate]);

  // Handles the final "Proceed to Checkout" button press
  const handlePayment = async () => {
    if (calculated.amount < MINIMUM_AMOUNT) {
      Alert.alert(
        "Invalid Amount",
        `Minimum amount must be greater than ₹${MINIMUM_AMOUNT}.`
      );
      return;
    }

    setIsLoadingPayment(true);
    try {
      const userDetails = {
        name:  "Customer Name", // Use actual user data
        email:  "customer@example.com", // Use actual user data
        phone:  "9999999999", // Use actual user data
      };

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: `ORD_${Date.now()}`,
          amount: calculated.total.toFixed(2),
          customerName: userDetails.name,
          customerEmail: userDetails.email,
          customerPhone: userDetails.phone,
          // You might also want to send siteID and vendorID if needed by your payment gateway
          // siteID: "pgrwa", 
          // vendorID: "PesAndroid",
        }),

        
      });
      const data = await response.json();

      if (data.paymentUrl) {
        setPaymentUrl(data.paymentUrl);
        setShowWebViewModal(true);
      } else {
        Alert.alert("Error", "Could not initiate payment.");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      Alert.alert("Network Error", "Unable to connect to the payment server.");
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
    if (url && url.startsWith(RETURN_URL)) {
      setShowWebViewModal(false);
      setPaymentUrl("");
      if (url.includes("status=success")) {
        Alert.alert("Payment Successful", "Your balance has been updated.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Payment Failed", "Your payment was not successful.");
      }
    }
  };

  const renderChargeItem = ({ item }) => (
    <View style={modalStyles.chargeRow}>
      <Text style={modalStyles.chargeMethod}>{item.method}</Text>
      <Text style={modalStyles.chargeValue}>{item.charge}</Text>
    </View>
  );

  const isButtonDisabled = calculated.amount < MINIMUM_AMOUNT;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- This is the main Topup UI, hidden until modal is dismissed --- */}
      {showPaymentForm && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* <View style={styles.userInfoCard}>
              <Text style={styles.userName}>Mr. Bhavish yadav S/0 Sh. CP Yadav M-G04</Text>
              <Text style={styles.liveBalance}>Live Balance : ₹387.0</Text>
            </View> */}

            <View style={styles.detailsCard}>
              <Text style={styles.cardTitle}>Amount Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Amount"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
              <Text style={styles.validationText}>
                Minimum amount must be greater than ₹{MINIMUM_AMOUNT}.
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { height: 80, textAlignVertical: "top", paddingTop: 12 },
                ]}
                placeholder="Notes"
                placeholderTextColor={theme.colors.textSecondary}
                multiline={true}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            <View style={styles.linksCard}>
              <TouchableOpacity style={styles.linkRow}>
                <Text style={styles.linkText}>Terms of Service</Text>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
              <View style={styles.separator} />
              <TouchableOpacity style={styles.linkRow}>
                <Text style={styles.linkText}>Privacy policy</Text>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Topup Amount</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text style={styles.summaryValue}>
                ₹{calculated.amount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Handling Charge</Text>
              <Text style={styles.summaryValue}>
                ₹{calculated.handling.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>CGST ({(cgstRate * 100).toFixed(1)}%)</Text>
              <Text style={styles.summaryValue}>
                ₹{calculated.cgst.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>SGST ({(sgstRate * 100).toFixed(1)}%)</Text>
              <Text style={styles.summaryValue}>
                ₹{calculated.sgst.toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ₹{calculated.total.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.proceedButton,
                isButtonDisabled && styles.buttonDisabled,
              ]}
              onPress={handlePayment}
              disabled={isButtonDisabled || isLoadingPayment}
            >
              {isLoadingPayment ? (
                <ActivityIndicator color={theme.colors.textPrimary} />
              ) : (
                <Text style={styles.proceedButtonText}>
                  Proceed to Checkout
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* --- MDR Charges Modal (Shows on load) --- */}
      <Modal
        visible={isMdrModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContainer}>
            {isLoadingCharges ? (
              <ActivityIndicator size="large" color="#00447E" />
            ) : (
              <>
                <Text style={modalStyles.modalTitle}>
                  Applicable MDR Charges per Transaction
                </Text>
                {mdrCharges.length > 0 ? (
                  <FlatList
                    data={mdrCharges}
                    renderItem={renderChargeItem}
                    keyExtractor={(item) => item.key}
                    style={{ maxHeight: 250 }}
                  />
                ) : (
                  <Text style={modalStyles.noChargesText}>
                    No MDR charges details available.
                  </Text>
                )}

                {chargesNote && (
                  <Text style={modalStyles.noteText}>{chargesNote}</Text>
                )}
                {chargesNote1 && (
                  <Text style={modalStyles.noteTextBold}>{chargesNote1}</Text>
                )}
                {!chargesNote && !chargesNote1 && (
                  <Text style={modalStyles.noteText}>
                    MDR charges are subject to change... exclusive of all
                    applicable taxes.
                  </Text>
                )}
                <View style={modalStyles.buttonContainer}>
                  <TouchableOpacity
                    style={[modalStyles.button, modalStyles.continueButton]}
                    onPress={() => {
                      setMdrModalVisible(false);
                      setShowPaymentForm(true);
                    }}
                  >
                    <Text style={modalStyles.continueButtonText}>
                      Continue to Payment
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[modalStyles.button, modalStyles.returnButton]}
                    onPress={() => navigation.goBack()}
                  >
                    <Text style={modalStyles.returnButtonText}>
                      Return to Home
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* --- WebView Modal (For ICICI Payment Page) --- */}
      <Modal
        visible={showWebViewModal}
        onRequestClose={() => setShowWebViewModal(false)}
        animationType="slide"
      >
        <SafeAreaView
          style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Complete Secure Payment</Text>
            <TouchableOpacity onPress={() => setShowWebViewModal(false)}>
              <Feather name="x" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={handleNavigationStateChange}
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
                color={theme.colors.accent}
              />
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// --- Styles for the Main Screen ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  scrollContainer: { padding: 16, paddingBottom: 320, paddingTop: 20 }, // Extra padding for footer
  userInfoCard: {
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  userName: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  liveBalance: { color: theme.colors.accent, fontSize: 14, marginTop: 4 },
  detailsCard: {
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    color: theme.colors.textPrimary,
    fontSize: 16,
    marginBottom: 8,
  },
  validationText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: 16,
    paddingLeft: 8,
  },
  linksCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    overflow: "hidden",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  linkText: { color: theme.colors.textPrimary, fontSize: 16 },
  separator: { height: 1, backgroundColor: theme.colors.border },
  summaryContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.card,
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 30 : 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: { color: theme.colors.textSecondary, fontSize: 16 },
  summaryValue: { color: theme.colors.textPrimary, fontSize: 16 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalLabel: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: { color: theme.colors.accent, fontSize: 18, fontWeight: "bold" },
  proceedButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  proceedButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: { opacity: 0.5 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalHeaderText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});

// --- Styles for the MDR Charges Modal ---
const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    width: "100%",
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 15,
    textAlign: "center",
  },
  chargeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  chargeMethod: { fontSize: 14, color: "#334155" },
  chargeValue: { fontSize: 14, color: "#1E293B", fontWeight: "600" },
  noteText: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 10,
    lineHeight: 18,
    paddingTop: 10,
  },
  noteTextBold: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "bold",
    marginBottom: 20,
    lineHeight: 18,
  },
  noChargesText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButton: { backgroundColor: "#00447E", marginRight: 10 },
  continueButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
  returnButton: { backgroundColor: "#DC2626", marginLeft: 10 },
  returnButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
});