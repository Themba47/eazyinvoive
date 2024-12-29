import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { fetchCsrfToken, getCsrfToken } from '../auth/CsrfService';
import { backendApp } from '../utils';

export default ({ route, navigation }) => {
  const { selectedValue } = route.params; // Retrieve selected company type
  const { setCompanyId} = useContext(AuthContext);
  const [formData, setFormData] = useState({
    company_name: '',
    company_type: selectedValue,
    reg_number: '',
    tax_number: '',
    contact_number: '',
    contact_email: '',
    other_vital_info: [],
  });

  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  const addOtherField = () => {
    if (newFieldKey && newFieldValue) {
      setFormData({
        ...formData,
        other_vital_info: [...formData.other_vital_info, { key: newFieldKey, value: newFieldValue }],
      });
      setNewFieldKey('');
      setNewFieldValue('');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const deleteVitalInfo = (index) => {
    const updatedInfo = formData.other_vital_info.filter((_, i) => i !== index);
    setFormData({ ...formData, other_vital_info: updatedInfo });
  };

  const submitForm = async () => {
    console.log('Form data to submit:', formData);
    // Call the backend API to save the company data
    try {
      await fetchCsrfToken();
      const response = await axios.post(`${backendApp()}/api/company/`, formData,
      {
        headers: {
            'X-CSRFToken': getCsrfToken(),
        },
        withCredentials: true, // Ensures cookies are sent with the request
    });
      console.log(response.data)
      setCompanyId(response.data.company_id)


      // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Logged in successfully!',
    });
    navigation.navigate('CompanyPage1'); //navigation.navigate('Home');
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
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

		{/* <Text>Selected Form: {selectedValue}</Text> */}

      <Text style={styles.label}>Company Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter company name"
        value={formData.company_name}
        onChangeText={(value) => handleInputChange('company_name', value)}
      />

      <Text style={styles.label}>Contact Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter contact email"
        value={formData.contact_email}
        onChangeText={(value) => handleInputChange('contact_email', value)}
      />

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter contact number"
        value={formData.contact_number}
        onChangeText={(value) => handleInputChange('contact_number', value)}
      />

      {selectedValue != 'Freelancer' && selectedValue !== 'Informal' && (
        <>
          <Text style={styles.label}>Registration Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter registration number"
            value={formData.reg_number}
            onChangeText={(value) => handleInputChange('reg_number', value)}
          />
        </>
      )}

      <Text style={styles.label}>Tax Number (or VAT Number)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter tax number (Optional)"
        value={formData.tax_number}
        onChangeText={(value) => handleInputChange('tax_number', value)}
      />

      <Text style={styles.label}>Other Vital Info</Text>
      {formData.other_vital_info.map((field, index) => (
        <View key={index} style={styles.otherField}>
          <Text style={styles.fieldText}>{field.key}: {field.value}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteVitalInfo(index)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TextInput
        style={styles.input}
        placeholder="Key (e.g., License, Website)"
        value={newFieldKey}
        onChangeText={setNewFieldKey}
      />
      <TextInput
        style={styles.input}
        placeholder="Value (e.g., ABC12345, www.website.com)"
        value={newFieldValue}
        onChangeText={setNewFieldValue}
      />
      <TouchableOpacity style={styles.addButton} onPress={addOtherField}>
        <Text style={styles.addButtonText}>Add Field</Text>
      </TouchableOpacity>

      <Button title="Submit" onPress={submitForm} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  otherField: {
    marginBottom: 10,
  },
  fieldText: {
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 5,
    marginTop: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

