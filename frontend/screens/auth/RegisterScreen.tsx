import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
// import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

const RegisterScreen: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirm_password] = useState('');
  const [open, setOpen] = useState(false); // To handle dropdown visibility
  const [items, setItems] = useState([
	{ label: 'South Africa', value: 'South Africa' },
	{ label: 'United States', value: 'United States' },
	{ label: 'United Kingdom', value: 'United Kingdom' },
	{ label: 'Canada', value: 'Canada' },
	{ label: 'Australia', value: 'Australia' },
	{ label: 'India', value: 'India' },
	{ label: 'Germany', value: 'Germany' },
	{ label: 'France', value: 'France' },
	{ label: 'Japan', value: 'Japan' },
	{ label: 'Brazil', value: 'Brazil' },
 ]); // Temporary hardcoded list of countries

  const handleRegister = () => {
	 console.log('Register:', email, firstname, lastname, selectedCountry, password);
	 navigation.navigate('Home');
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
		  placeholder="First Name"
		  value={firstname}
		  onChangeText={setFirstname}
		  keyboardType="default"
		  autoCapitalize="none"
		/>
		<TextInput
		  style={styles.input}
		  placeholder="Last name"
		  value={lastname}
		  onChangeText={setLastname}
		  keyboardType="default"
		  autoCapitalize="none"
		/>
		<DropDownPicker
        open={open}
        value={selectedCountry}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedCountry}
        setItems={setItems}
        placeholder="Select a country"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownStyle={styles.dropdownList}
      />
		<TextInput
		  style={styles.input}
		  placeholder="Password"
		  value={password}
		  onChangeText={setPassword}
		  secureTextEntry
		/>
		<TextInput
		  style={styles.input}
		  placeholder="Confirm Password"
		  value={confirm_password}
		  onChangeText={setConfirm_password}
		  secureTextEntry
		/>
		<Button title="Register" onPress={handleRegister} />
		<Text
		  style={styles.link}
		  onPress={() => navigation.navigate('ForgotPassword')}
		>
		  Forgot Password?
		</Text>
		<Text
		  style={styles.link}
		  onPress={() => navigation.navigate('Login')}
		>
		  Have an account? Login
		</Text>
	 </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { 
	borderWidth: 1, 
	borderColor: '#ccc', 
	padding: 10, 
	marginBottom: 15, 
	borderRadius: 5 },
  link: { 
	color: 'blue', 
	textAlign: 'center', 
	marginTop: 15 },
	dropdownContainer: {
		marginBottom: 20,
	 },
	 dropdown: {
		backgroundColor: '#fafafa',
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 5,
	 },
	 dropdownList: {
		backgroundColor: '#fafafa',
	 },
});

export default RegisterScreen;
