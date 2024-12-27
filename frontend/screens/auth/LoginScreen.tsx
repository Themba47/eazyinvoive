import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const LoginScreen: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if(email == 'thembasishuba11@gmail.com') {
      navigation.navigate('Home');
    }
    console.log('Logging in with:', email, password);
    // Call your API here
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
