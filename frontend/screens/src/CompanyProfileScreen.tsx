import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { fetchCsrfToken, getCsrfToken } from '../auth/CsrfService';
import { backendApp } from '../utils';
import * as ImagePicker from 'expo-image-picker';
import { baseStyles } from '../stylesheet';
import { AuthContext } from '../auth/AuthContext';

export default ({ navigation }) => {
  const { authToken, companyId } = useContext(AuthContext)
  const [companyName, setCompanyName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [logo, setLogo] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  };

  const handleSaveCompany = () => {
    postCompanyData();
  };

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${backendApp()}/api/company/${companyId}`);
      setCompanyName(response.data.company_name);
      setRegNumber(response.data.reg_number);
      setTaxNumber(response.data.tax_number);
      setContactNumber(response.data.contact_number);
      setContactEmail(response.data.contact_email);
    } catch (error) {
      console.error(error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch company data.',
      });
    }
  };

  const postCompanyData = async () => {
    try {
      await fetchCsrfToken();
      const response = await axios.patch(
        `${backendApp()}/api/company-patch/${companyId}/`,
        {
          company_name: companyName,
          reg_number: regNumber,
          tax_number: taxNumber,
          contact_number: contactNumber,
          contact_email: contactEmail,
        },
        {
          headers: {
            'X-CSRFToken': getCsrfToken(),
          },
          withCredentials: true,
        }
      );
      console.log(response);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Company updated successfully!',
      });
    } catch (e) {
      console.error(e.response?.data || e.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update company details.',
      });
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  return (
    <View style={baseStyles.container}>
      <Text style={styles.header}>Edit Company</Text>
      <TextInput style={styles.input} placeholder="Company Name" value={companyName} onChangeText={setCompanyName} />
      <TextInput style={styles.input} placeholder="Registration Number" value={regNumber} onChangeText={setRegNumber} />
      <TextInput style={styles.input} placeholder="Tax Number" value={taxNumber} onChangeText={setTaxNumber} />
      <TextInput style={styles.input} placeholder="Contact Number" value={contactNumber} onChangeText={setContactNumber} />
      <TextInput style={styles.input} placeholder="Contact Email" value={contactEmail} onChangeText={setContactEmail} />
      <Button title="Save" onPress={handleSaveCompany} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 8,
  },
});
