import React, { useContext, useState } from 'react';
import {View, ScrollView, StyleSheet, Alert, Modal, TouchableOpacity} from 'react-native';
import { TextInput, Button, Text, List, Surface, IconButton } from 'react-native-paper';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { fetchCsrfToken, getCsrfToken } from '../auth/CsrfService';
import { AuthContext } from '../auth/AuthContext';
import { backendApp } from '../utils';

export default ({ visible, onDismiss, onSuccess }) => {
  const { userId } = useContext(AuthContext);
  const options = ["Service", "Product"];
  const [job_name, setJobName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    await fetchCsrfToken();
     if (!description || !price || selectedOption === null) {
       Alert.alert("Error", "Please fill out all fields.");
       return;
     }
 
     const formData = {
     user_id: userId,
       job_name,
       description,
       price,
       job_type: selectedOption,
     };

     const clearInputs = () => {
      setJobName("");
      setDescription("");
      setPrice("");
      setSelectedOption(null);
     }
 
     try {
       const response = await axios.post(`${backendApp()}/api/add-job/`, formData, 
     {
         headers: {
           'X-CSRFToken': getCsrfToken(),
         },
      });
     console.log('Response:', response.data);
       Toast.show({
           type: 'success',
           text1: 'Success',
           text2: 'Lets Go',
          });
          console.log("WHY IS THIS NOT WORKING!!!")
          onSuccess?.();
          clearInputs();
          onDismiss();
     } catch (error) {
       console.error(error);
       Alert.alert("Error", `Failed to submit the form because. ${error}`);
     }
   };


   const handlePriceChange = (text) => {
    // Allow only numbers and a single decimal point
    const formattedText = text.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point exists
    if ((formattedText.match(/\./g) || []).length <= 1) {
      setPrice(formattedText);
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
          <Text style={styles.headerTitle}>Add Job</Text>
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
            <Text style={styles.label}>Select Job Type:</Text>
                  <View style={styles.optionsContainer}>
                    {options.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.option,
                          selectedOption === option ? styles.selectedOption : null,
                        ]}
                        onPress={() => setSelectedOption(option)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            selectedOption === option ? styles.selectedOptionText : null,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
            <TextInput
              label="Name Of Service"
              value={job_name}
              onChangeText={setJobName}
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
            <TextInput
              label="Price"
              value={price}
              onChangeText={handlePriceChange}
              placeholder="Enter price"
              style={styles.input}
              keyboardType="numeric"
            />
          </Surface>

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
  label: {
    fontSize: 16,
    marginBottom: 8,
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
