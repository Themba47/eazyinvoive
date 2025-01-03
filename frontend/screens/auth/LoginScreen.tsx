import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Alert, Button, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { fetchCsrfToken, getCsrfToken } from './CsrfService';
import { backendApp } from '../utils';


const LoginScreen: React.FC = ({ navigation }: any) => {
  const { setAuthToken, setUserId, setCompanyId } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await fetchCsrfToken();
      const response = await axios.post(`${backendApp()}/api/auth/login/`, {
        email,
        password,
      },
      {
        headers: {
            'X-CSRFToken': getCsrfToken(),
        },
        withCredentials: true, // Ensures cookies are sent with the request
    });
      console.log(response.data)
      const token = response.data.key;
      setAuthToken(token);
      setUserId(response.data.user_id.toString())


      // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Logged in successfully!',
    });
    if(response.data.company_id) {
      setCompanyId(response.data.company_id.toString())
      navigation.navigate('Main');
    } else {
      navigation.navigate('CompanyPage1'); //navigation.navigate('Home');
    }
    } catch (e) {
      console.error(e.response?.data || e.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to log in. Please try again.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
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
      <Button title="Log In" onPress={handleLogin} />
      <Text
        style={styles.link}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        Forgot Password?
      </Text>
      <Text
        style={styles.link}
        onPress={() => navigation.navigate('Register')}
      >
        Don’t have an account? Sign Up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  link: { color: 'blue', textAlign: 'center', marginTop: 15 },
});

export default LoginScreen;
