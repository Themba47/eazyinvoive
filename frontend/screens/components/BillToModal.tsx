import React, { useContext, useState } from 'react';
import {View, ScrollView, StyleSheet, Alert, Modal} from 'react-native';
import { TextInput, Button, Text, List, Surface, IconButton } from 'react-native-paper';
import axios from 'axios';
import { fetchCsrfToken, getCsrfToken } from '../auth/CsrfService';
import { AuthContext } from '../auth/AuthContext';
import { backendApp } from '../utils';

export default ({ visible, onDismiss, onSuccess }) => {
  const { authToken, userId } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    user_id: userId,
    client_company_name: '',
    client_name: '',
    client_email: '',
    client_phone_number: '',
    tax_number: '',
    address: '',
    complex_apartment: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
    additional_info: '',
  });
  
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const URL = `${backendApp()}/api/billto`

  const handleSubmit = async () => {
    await fetchCsrfToken();
    setLoading(true);
    try {
      console.log(formData)
      const response = await axios.post(`${URL}/${userId}/`, formData, {
        headers: {
              'X-CSRFToken': getCsrfToken(),
            },
      });

      Alert.alert('Success', 'Billing information saved successfully');
      onSuccess?.();
      onDismiss();
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to save billing information'
      );
      console.log(`${URL}/${userId}/`)
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <Surface style={styles.header}>
          <Text style={styles.headerTitle}>Billing Information</Text>
          <IconButton
            icon="close"
            size={24}
            onPress={onDismiss}
          />
        </Surface>

        <ScrollView style={styles.container}>
          {/* Required Fields */}
          <Surface style={styles.card}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <TextInput
              label="Company Name"
              value={formData.client_company_name}
              onChangeText={(text) => setFormData({...formData, client_company_name: text})}
              style={styles.input}
            />
            <TextInput
              label="Contact Name"
              value={formData.client_name}
              onChangeText={(text) => setFormData({...formData, client_name: text})}
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={formData.client_email}
              onChangeText={(text) => setFormData({...formData, client_email: text})}
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              label="Phone Number"
              value={formData.client_phone_number}
              onChangeText={(text) => setFormData({...formData, client_phone_number: text})}
              keyboardType="phone-pad"
              style={styles.input}
            />
          </Surface>

          {/* Optional Fields Accordion */}
          <List.Accordion
            title="Additional Details"
            description="Tax, address, and other optional information"
            expanded={showOptionalFields}
            onPress={() => setShowOptionalFields(!showOptionalFields)}
            style={styles.accordion}
          >
            <Surface style={styles.card}>
              <TextInput
                label="Tax Number"
                value={formData.tax_number}
                onChangeText={(text) => setFormData({...formData, tax_number: text})}
                style={styles.input}
              />
              <TextInput
                label="Address"
                value={formData.address}
                onChangeText={(text) => setFormData({...formData, address: text})}
                style={styles.input}
              />
              <TextInput
                label="Complex/Apartment"
                value={formData.complex_apartment}
                onChangeText={(text) => setFormData({...formData, complex_apartment: text})}
                style={styles.input}
              />
              <TextInput
                label="City"
                value={formData.city}
                onChangeText={(text) => setFormData({...formData, city: text})}
                style={styles.input}
              />
              <TextInput
                label="Province"
                value={formData.province}
                onChangeText={(text) => setFormData({...formData, province: text})}
                style={styles.input}
              />
              <TextInput
                label="Postal Code"
                value={formData.postal_code}
                onChangeText={(text) => setFormData({...formData, postal_code: text})}
                style={styles.input}
              />
              <TextInput
                label="Country"
                value={formData.country}
                onChangeText={(text) => setFormData({...formData, country: text})}
                style={styles.input}
              />
              <TextInput
                label="Additional Information"
                value={formData.additional_info}
                onChangeText={(text) => setFormData({...formData, additional_info: text})}
                multiline
                numberOfLines={4}
                style={styles.input}
              />
            </Surface>
          </List.Accordion>
        </ScrollView>

        <Surface style={styles.footer}>
          <Button 
            mode="outlined" 
            onPress={onDismiss}
            style={styles.footerButton}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.footerButton}
          >
            Save
          </Button>
        </Surface>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    marginBottom: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  accordion: {
    backgroundColor: '#fff',
    marginVertical: 8,
  },
  footer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    elevation: 4,
  },
  footerButton: {
    marginLeft: 8,
  },
});
