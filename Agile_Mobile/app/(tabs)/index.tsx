import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function StaffPortalLogin() {
  const [employeeId, setEmployeeId] = useState('');

  const handleFingerprintScan = () => {
    // This will be where you integrate your fingerprint scanner
    console.log('Fingerprint scan initiated for employee:', employeeId);
    // Add your fingerprint authentication logic here
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
        Enter your employee ID and scan your{'\n'}fingerprint
      </Text>

      {/* Employee ID Input */}
      <View style={styles.inputSection}>
        <Text style={styles.label}>Employee ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your employee ID (e.g., EMP00"
          placeholderTextColor="#999"
          value={employeeId}
          onChangeText={setEmployeeId}
          autoCapitalize="characters"
        />
      </View>

      {/* Fingerprint Scanner Button */}
      <TouchableOpacity
        style={styles.fingerprintButton}
        onPress={handleFingerprintScan}
        activeOpacity={0.7}
      >
        <View style={styles.fingerprintCircle}>
          <MaterialCommunityIcons name="fingerprint" size={80} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <Text style={styles.scanText}>Tap to scan fingerprint</Text>
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
    marginBottom: 40,
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
  fingerprintIcon: {
    fontSize: 60,
  },
  scanText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
});