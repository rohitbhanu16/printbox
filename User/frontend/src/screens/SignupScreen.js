import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = () => {
  const navigation = useNavigation();

  // State for form fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:5000/api/auth/signup', {
        name,
        username,
        email,
        password,
      });
      Alert.alert('Success', 'Account created successfully!');
      await AsyncStorage.setItem('token', response.data.token)
      navigation.navigate('Login');
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TouchableOpacity style={styles.oauthButton} onPress={() => handleOAuth('google')}>
        <Text style={styles.oauthText}>Sign Up with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.oauthButton} onPress={() => handleOAuth('github')}>
        <Text style={styles.oauthText}>Sign Up with GitHub</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  oauthButton: {
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  oauthText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    marginVertical: 16,
    fontSize: 16,
    color: '#888',
  },
  input: {
    width: '80%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: '#34A853',
    padding: 12,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginVertical: 8,
  },
  signupText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    color: '#4285F4',
    marginTop: 16,
    fontSize: 16,
  },
});

export default SignupScreen;
