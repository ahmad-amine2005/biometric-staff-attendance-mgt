import React, { useEffect, useRef, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Animated,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";

export default function StaffPortalLogin() {
  const [employeeId, setEmployeeId] = useState("");
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState("");
  const [sending, setSending] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "info" | "success" | "error";
  }>({
    visible: false,
    message: "",
    type: "info",
  });
  const opacity = useRef(new Animated.Value(0)).current;
  const toastTimeout = useRef<number | null>(null);

  const BASE_URL =
    "https://biometric-staff-attendance-mgt-production.up.railway.app";

  // Show a transient toast/snackbar
  const showToast = (
    message: string,
    type: "info" | "success" | "error" = "info"
  ) => {
    if (toastTimeout.current) {
      clearTimeout(toastTimeout.current as any);
      toastTimeout.current = null;
    }
    setToast({ visible: true, message, type });
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    toastTimeout.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      });
      toastTimeout.current = null;
    }, 3000) as unknown as number;
  };

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
      if (compatible) {
        const types =
          await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (
          types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
        ) {
          setBiometricType("Fingerprint");
        } else if (
          types.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
        ) {
          setBiometricType("Face ID");
        } else {
          setBiometricType("Biometric");
        }

        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) {
          showToast(
            "No biometrics enrolled. Please enable biometrics in device settings.",
            "info"
          );
        }
      }
    } catch (err) {
      console.error("Error checking biometric support:", err);
      showToast("Unable to check biometric support.", "error");
    }
  };

  const handleFingerprintScan = async () => {
    if (!employeeId.trim()) {
      showToast("Please enter your Employee ID first.", "error");
      return;
    }
    if (!isBiometricSupported) {
      showToast(
        "Biometric authentication is not supported on this device.",
        "error"
      );
      return;
    }

    try {
      // First, perform biometric authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Verify your ${biometricType}`,
        fallbackLabel: "Use Passcode",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Biometric successful - now record attendance
        recordAttendance(employeeId);
        showToast(
          "Authentication successful — recording attendance.",
          "success"
        );
      } else {
        showToast(
          result.error === "user_cancel"
            ? "Authentication cancelled."
            : `${biometricType} does not match. Please try again.`,
          "error"
        );
      }
    } catch (err) {
      console.error("Authentication error:", err);
      showToast("An error occurred during authentication.", "error");
    }
  };

  const recordAttendance = async (empId: string) => {
    // Base URL configuration - adjust these based on your environment
    const API_URL = `${BASE_URL}/api/attendance/record`;

    // Validate employee ID is numeric (as per backend Long type)
    const numericId = parseInt(empId, 10);
    if (Number.isNaN(numericId) || numericId <= 0) {
      showToast("Please enter a valid numeric employee ID.", "error");
      return;
    }

    // Format current date and time according to your DTO patterns
    const now = new Date();

    // Format date as yyyy-MM-dd (matching @JsonFormat pattern in AttendanceRequestDTO)
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Format datetime as yyyy-MM-dd'T'HH:mm:ss (matching @JsonFormat pattern in AttendanceRequestDTO)
    const formatDateTime = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    // Create request object matching AttendanceRequestDTO structure
    const attendanceRecord = {
      staffId: numericId,
      attendanceDate: formatDate(now), // yyyy-MM-dd
      attendanceTime: formatDateTime(now), // yyyy-MM-dd'T'HH:mm:ss
    };

    console.log("Sending attendance data:", attendanceRecord);
    console.log("To URL:", `${BASE_URL}/api/attendance/record`);

    setSending(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(attendanceRecord),
      });

      // Parse response based on status
      if (res.ok) {
        const responseData = await res.json();
        console.log("Attendance saved:", responseData);

        // Show appropriate message based on attendance status
        let successMessage = "Attendance recorded successfully";
        if (responseData.status === "ARRIVAL_RECORDED") {
          successMessage = `Check-in recorded at ${new Date(
            responseData.arrivalTime
          ).toLocaleTimeString()}`;
        } else if (responseData.status === "DEPARTURE_RECORDED") {
          successMessage = `Check-out recorded at ${new Date(
            responseData.departureTime
          ).toLocaleTimeString()}`;
        }

        showToast(successMessage, "success");

        // Optional: Clear input after successful recording
        // setEmployeeId("");
      } else {
        // Handle different error responses from backend
        let errorMessage = "Failed to record attendance";

        try {
          // Try to parse error JSON from backend
          const errorText = await res.text();
          const errorObj = JSON.parse(errorText);
          errorMessage = errorObj.error || errorMessage;
        } catch (parseError) {
          // If not JSON, use status-based messages
          if (res.status === 400) {
            errorMessage = "Invalid request. Please check your employee ID";
          } else if (res.status === 404) {
            errorMessage = "Employee not found. Please check your ID";
          } else if (res.status === 409) {
            errorMessage = "Attendance already completed for today";
          } else if (res.status >= 500) {
            errorMessage = "Server error. Please try again later";
          }
        }

        showToast(errorMessage, "error");
      }
    } catch (err) {
      console.error("Network error recording attendance:", err);

      // Check for specific network errors
      if (err instanceof TypeError) {
        showToast(
          "Network error. Check your connection and server URL",
          "error"
        );
      } else {
        showToast("Unable to reach attendance server.", "error");
      }
    } finally {
      setSending(false);
    }
  };

  // Optional: Add a manual submit button for testing without biometrics
  const handleManualSubmit = () => {
    if (!employeeId.trim()) {
      showToast("Please enter your Employee ID first.", "error");
      return;
    }

    // Directly call recordAttendance without biometric verification
    recordAttendance(employeeId);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
      />

      <View style={styles.iconContainer}>
        <View style={styles.phoneIcon}>
          <View style={styles.phoneBody}>
            <View style={styles.phoneDot} />
          </View>
        </View>
      </View>

      <Text style={styles.title}>Welcome</Text>

      <Text style={styles.subtitle}>
        Enter your employee ID and scan your{""}
        {biometricType || "biometric"}
      </Text>

      {isBiometricSupported && (
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color="#4CAF50"
          />
          <Text style={styles.statusText}>
            {biometricType} authentication available
          </Text>
        </View>
      )}

      <View style={styles.inputSection}>
        <Text style={styles.label}>Employee ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your employee ID (numeric)"
          placeholderTextColor="#999"
          value={employeeId}
          onChangeText={setEmployeeId}
          keyboardType="numeric" // Ensure numeric keyboard
          autoCapitalize="none"
          editable={!sending}
        />
      </View>

      {/* Biometric Scan Button */}
      <TouchableOpacity
        style={[
          styles.fingerprintButton,
          (!isBiometricSupported || sending) &&
            styles.fingerprintButtonDisabled,
        ]}
        onPress={handleFingerprintScan}
        activeOpacity={0.7}
        disabled={!isBiometricSupported || sending}
      >
        <View style={styles.fingerprintCircle}>
          {sending ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <MaterialCommunityIcons
              name={
                biometricType === "Face ID" ? "face-recognition" : "fingerprint"
              }
              size={80}
              color="#FFFFFF"
            />
          )}
        </View>
      </TouchableOpacity>

      <Text style={styles.scanText}>
        {sending
          ? "Recording attendance..."
          : `Tap to scan ${biometricType.toLowerCase() || "biometric"}`}
      </Text>

      {/* Optional: Manual Submit Button for Testing */}
      {!isBiometricSupported && (
        <TouchableOpacity
          style={[
            styles.fingerprintButton,
            sending && styles.fingerprintButtonDisabled,
          ]}
          onPress={handleManualSubmit}
          activeOpacity={0.7}
          disabled={sending}
        >
          <View
            style={[styles.fingerprintCircle, { backgroundColor: "#4CAF50" }]}
          >
            {sending ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <MaterialCommunityIcons
                name="account-check"
                size={60}
                color="#FFFFFF"
              />
            )}
          </View>
        </TouchableOpacity>
      )}

      {/* Toast */}
      {toast.visible && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            toast.type === "success" && styles.toastSuccess,
            toast.type === "error" && styles.toastError,
            { opacity },
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </View>
  );
}

// Styles remain EXACTLY THE SAME as your original
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  iconContainer: {
    marginBottom: 30,
  },
  phoneIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  phoneBody: {
    width: 35,
    height: 50,
    borderWidth: 3,
    borderColor: "#5B8DEE",
    borderRadius: 6,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 5,
  },
  phoneDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#5B8DEE",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    color: "#4CAF50",
    marginLeft: 6,
    fontWeight: "500",
  },
  inputSection: {
    width: "100%",
    marginBottom: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#1A1A1A",
    backgroundColor: "#FAFAFA",
  },
  fingerprintButton: {
    alignItems: "center",
    marginBottom: 16,
  },
  fingerprintButtonDisabled: {
    opacity: 0.5,
  },
  fingerprintCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#7BA5F5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scanText: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  toast: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 40,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#333",
    alignItems: "center",
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
  },
  toastSuccess: {
    backgroundColor: "#2E7D32",
  },
  toastError: {
    backgroundColor: "#C62828",
  },
});
