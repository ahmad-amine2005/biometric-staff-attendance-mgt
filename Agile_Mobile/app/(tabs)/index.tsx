import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';

export default function StaffPortalLogin() {
  const [employeeId, setEmployeeId] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [biometricType, setBiometricType] = useState('');

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      // Check if device supports biometric authentication
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);

      if (compatible) {
        // Check what type of biometric authentication is available
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        
        if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Fingerprint');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else {
          setBiometricType('Biometric');
        }

        // Check if user has enrolled biometrics
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) {
          Alert.alert(
            'No Biometrics Enrolled',
            'Please set up biometric authentication in your device settings.'
          );
        }
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
    }
  };

  const handleFingerprintScan = async () => {
    // Validate employee ID first
    if (!employeeId.trim()) {
      Alert.alert('Missing Information', 'Please enter your Employee ID first.');
      return;
    }

    if (!isBiometricSupported) {
      Alert.alert(
        'Not Supported',
        'Biometric authentication is not supported on this device.'
      );
      return;
    }

    try {
      console.log('🔐 Starting biometric authentication...');
      console.log('👤 Employee ID:', employeeId);
      
      // THIS IS WHERE THE COMPARISON HAPPENS! 
      // The OS will:
      // 1. Show the fingerprint/Face ID prompt
      // 2. Capture the fingerprint/face
      // 3. Compare it with enrolled biometrics in the secure enclave
      // 4. Return success/failure (you NEVER get the actual fingerprint data)
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Verify your ${biometricType}`,
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false, // Allow fallback to device passcode
      });

      console.log('📱 Authentication result:', result);

      if (result.success) {
        // ✅ FINGERPRINT MATCHED! 
        // The device confirmed the scanned fingerprint matches one enrolled on the device
        console.log('✅ Fingerprint verified successfully!');
        console.log('👤 Authenticated Employee ID:', employeeId);
        
        Alert.alert(
          '✅ Authentication Successful',
          `Welcome! Employee ID: ${employeeId}\n\nYour ${biometricType.toLowerCase()} has been verified.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // TODO: Record attendance in your database
                recordAttendance(employeeId);
              },
            },
          ]
        );
      } else {
        // ❌ FINGERPRINT DID NOT MATCH!
        console.log('❌ Authentication failed:', result.error);
        
        Alert.alert(
          '❌ Authentication Failed',
          result.error === 'user_cancel'
            ? 'Authentication was cancelled.'
            : `${biometricType} does not match. Please try again.`
        );
      }
    } catch (error) {
      console.error('🚨 Authentication error:', error);
      Alert.alert('Error', 'An error occurred during authentication.');
    }
  };

  const recordAttendance = (empId: string) => {
    // This is where you would send data to your backend
    const attendanceRecord = {
      employeeId: empId,
      timestamp: new Date().toISOString(),
      verified: true,
    };
    
    console.log('📝 Recording attendance:', attendanceRecord);
    
    // TODO: Send to your backend API
    // Example:
    // fetch('https://your-api.com/attendance', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(attendanceRecord),
    // });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Phone Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.phoneIcon}>
          <View style={styles.phoneBody}>
            <View style={styles.phoneDot} />
          </View>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Welcome, Sarah Johnson</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Enter your employee ID and scan your{'\n'}
        {biometricType || 'fingerprint'}
      </Text>

      {/* Biometric Status Indicator */}
      {isBiometricSupported && (
        <View style={styles.statusContainer}>
          <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.statusText}>
            {biometricType} authentication available
          </Text>
        </View>
      )}

      {/* Employee ID Input */}
      <View style={styles.inputSection}>
        <Text style={styles.label}>Employee ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your employee ID (e.g., EMP001)"
          placeholderTextColor="#999"
          value={employeeId}
          onChangeText={setEmployeeId}
          autoCapitalize="characters"
        />
      </View>

      {/* Fingerprint Scanner Button */}
      <TouchableOpacity
        style={[
          styles.fingerprintButton,
          !isBiometricSupported && styles.fingerprintButtonDisabled,
        ]}
        onPress={handleFingerprintScan}
        activeOpacity={0.7}
        disabled={!isBiometricSupported}
      >
        <View style={styles.fingerprintCircle}>
          <MaterialCommunityIcons
            name={
              biometricType === 'Face ID' ? 'face-recognition' : 'fingerprint'
            }
            size={80}
            color="#FFFFFF"
          />
        </View>
      </TouchableOpacity>

      <Text style={styles.scanText}>
        Tap to scan {biometricType.toLowerCase() || 'biometric'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
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
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneBody: {
    width: 35,
    height: 50,
    borderWidth: 3,
    borderColor: '#5B8DEE',
    borderRadius: 6,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 5,
  },
  phoneDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5B8DEE',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 6,
    fontWeight: '500',
  },
  inputSection: {
    width: '100%',
    marginBottom: 50,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
  },
  fingerprintButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  fingerprintButtonDisabled: {
    opacity: 0.5,
  },
  fingerprintCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#7BA5F5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  scanText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});