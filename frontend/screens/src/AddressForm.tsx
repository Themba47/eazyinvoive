import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
i
import { fetchCsrfToken, getCsrfToken } from '../auth/CsrfService';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext'; // Adjust the path based on your project structure
import { backendApp } from '../utils';

export default ({ route, navigation }) => {
  const { selectedValue } = route.params; // Retrieve selected company type
  const { companyId } = useContext(AuthContext); // Access companyId from AuthContext
  const [selectedAddressType, setSelectedAddressType] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    street: '',
    complex_apartment: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
    address_type: 'Other',
  });
  const [open, setOpen] = useState(false); // To handle dropdown visibility
  const [items, setItems] = useState([
	{ label: 'Home', value: 'Home' },
	{ label: 'Office', value: 'Office' },
	{ label: 'Warehouse', value: 'Warehouse' },
	{ label: 'Other', value: 'Other' },
	]); // Temporary hardcoded list of countries

  const handleSubmit = async () => {
	await fetchCsrfToken();
    try {
      const data = { ...form, address_type: selectedAddressType, company_id: companyId }; // Include companyId in the request payload
		console.log(data)
      const response = await axios.post(`${backendApp()}/api/address/`, data,
		{
			headers: {
				'X-CSRFToken': getCsrfToken(),
			},
			withCredentials: true, // Ensures cookies are sent with the request
		});
      Alert.alert('Success', 'Address added successfully');
		navigation.navigate('LogoForm', { selectedValue });
      // setForm({
      //   street: '',
      //   complex_apartment: '',
      //   city: '',
      //   province: '',
      //   postal_code: '',
      //   country: '',
      //   address_type: 'Other',
      // });
    } catch (error) {
      console.error('Error submitting address:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to submit address. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Company Address</Text>
		<DropDownPicker
        open={open}
        value={selectedAddressType}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedAddressType}
        setItems={setItems}
        placeholder="Select Address"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownStyle={styles.dropdownList}
      />
      <TextInput
        style={styles.input}
        placeholder="Street"
        value={form.street}
        onChangeText={(value) => setForm({ ...form, street: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Complex/Apartment"
        value={form.complex_apartment}
        onChangeText={(value) => setForm({ ...form, complex_apartment: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={form.city}
        onChangeText={(value) => setForm({ ...form, city: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Province"
        value={form.province}
        onChangeText={(value) => setForm({ ...form, province: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Postal Code"
        value={form.postal_code}
        onChangeText={(value) => setForm({ ...form, postal_code: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Country"
        value={form.country}
        onChangeText={(value) => setForm({ ...form, country: value })}
      />
      <Button title="Submit" onPress={handleSubmit} />
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.street}, {item.city}, {item.country}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
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
