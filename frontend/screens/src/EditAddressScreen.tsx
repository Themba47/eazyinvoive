import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../auth/AuthContext';
import { fetchCsrfToken, getCsrfToken } from '../auth/CsrfService';
import axios from 'axios';
import { backendApp } from '../utils';

export default ({ route, navigation }) => {
//   const { addressId } = route.params; // Pass the addressId as a prop
  const { authToken, companyId, userId, logout } = useContext(AuthContext);
  const [address, setAddress] = useState({
    street: '',
    complex_apartment: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
    address_type: 'Other',
  });

  const addressTypes = ['Home', 'Office', 'Warehouse', 'Other'];

  useEffect(() => {
    // Fetch the current address
    axios
      .get(`${backendApp()}/api/address/`) // Replace with your endpoint
      .then(response => {
        setAddress(response.data);
      })
      .catch(error => {
        console.error('Error fetching address:', error);
        Alert.alert('Error', 'Unable to load address details.');
      });
  }, [addressId]);

  const handleInputChange = (key, value) => {
    setAddress(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleUpdateAddress = async () => {
	await fetchCsrfToken();
    try {
      const data = { ...form, address_type: selectedAddressType, company_id: companyId }; // Include companyId in the request payload
		console.log(data)
      const response = await axios.put(`${backendApp()}/api/address/`, data,
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
      <Text style={styles.label}>Street</Text>
      <TextInput
        style={styles.input}
        value={address.street}
        onChangeText={value => handleInputChange('street', value)}
      />
      <Text style={styles.label}>Complex/Apartment</Text>
      <TextInput
        style={styles.input}
        value={address.complex_apartment}
        onChangeText={value => handleInputChange('complex_apartment', value)}
      />
      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        value={address.city}
        onChangeText={value => handleInputChange('city', value)}
      />
      <Text style={styles.label}>Province</Text>
      <TextInput
        style={styles.input}
        value={address.province}
        onChangeText={value => handleInputChange('province', value)}
      />
      <Text style={styles.label}>Postal Code</Text>
      <TextInput
        style={styles.input}
        value={address.postal_code}
        onChangeText={value => handleInputChange('postal_code', value)}
      />
      <Text style={styles.label}>Country</Text>
      <TextInput
        style={styles.input}
        value={address.country}
        onChangeText={value => handleInputChange('country', value)}
      />
      <Text style={styles.label}>Address Type</Text>
      <View style={styles.buttonGroup}>
        {addressTypes.map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.button,
              address.address_type === type && styles.selectedButton,
            ]}
            onPress={() => handleAddressTypeChange(type)}
          >
            <Text
              style={[
                styles.buttonText,
                address.address_type === type && styles.selectedButtonText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Update Address" onPress={handleUpdateAddress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginVertical: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#007bff',
    borderColor: '#0056b3',
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#fff',
  },
});

