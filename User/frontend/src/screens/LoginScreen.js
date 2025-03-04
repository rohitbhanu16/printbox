import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";  // ✅ Import AsyncStorage
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:5000/api/auth/login', { email, password });
      
      const userData = response.data;
      const { id, token } = response.data;  // ✅ Extract userId and token correctly

      if (!id || !token) {
        console.error("❌ Login failed: Missing user ID or token.");
        Alert.alert("Error", "Invalid login response. Please try again.");
        return;
      }

      // ✅ Store userId and token in AsyncStorage
      await AsyncStorage.setItem("userId", JSON.stringify(userData.id));
      await AsyncStorage.setItem("authToken", JSON.stringify(userData.token));
      

      console.log("✅ User logged in. User ID stored:", id);
      
      login(response.data); // Update global auth state

      Alert.alert('Success', 'Login successful!');
      navigation.navigate('Main');

    } catch (error) {
      console.error('❌ Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Haven't joined us? Signup</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 32 },
  input: { width: '80%', padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 16, fontSize: 16 },
  loginButton: { backgroundColor: '#34A853', padding: 12, borderRadius: 8, width: '80%', alignItems: 'center', marginVertical: 8 },
  loginText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  signupText: { color: '#4285F4', marginTop: 16, fontSize: 16 },
});

export default LoginScreen;
