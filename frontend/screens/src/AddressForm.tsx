import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { fetchCsrfToken, getCsrfToken } from '../auth/CsrfService';
import axios from 'axios';
import ReusableModalPicker from '../components/OptionsScreen';
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
   const options = ['Home', 'Office', 'Warehouse']
   const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (address_type) => {
		setSelectedAddressType(address_type.value);
	};

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
      setForm({
        street: '',
        complex_apartment: '',
        city: '',
        province: '',
        postal_code: '',
        country: '',
        address_type: 'Other',
      });
    } catch (error) {
      console.error('Error submitting address:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to submit address. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Company Address</Text>
      <Text style={styles.label}>Select Address Type:</Text>
      <View style={styles.optionsContainer}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    selectedAddressType === option ? styles.selectedOption : null,
                  ]}
                  onPress={() => setSelectedAddressType(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedAddressType === option ? styles.selectedOptionText : null,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
      
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
  label: {
    fontSize: 16,
    marginBottom: 8,
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
 optionsContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 16,
},
option: {
  padding: 10,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 5,
  flex: 1,
  marginHorizontal: 5,
  alignItems: "center",
},
selectedOption: {
  backgroundColor: "#007BFF",
},
optionText: {
  fontSize: 14,
  color: "#000",
},
selectedOptionText: {
  color: "#fff",
},
});
