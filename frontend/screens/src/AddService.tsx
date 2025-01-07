import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { fetchCsrfToken, getCsrfToken } from '../auth/CsrfService';
import BillToModal from "../components/BillToModal";
import ReusableModalPicker from '../components/OptionsScreen';
import { AuthContext } from '../auth/AuthContext';
import { backendApp } from '../utils';

export default({ navigation }) => {
  const { userId } = useContext(AuthContext);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedClient, setSelectedClient] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [billToVisible, setBillToVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [myclients, setMyClients] = useState([
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

  const options = ["Service", "Product"];

  const handleSubmit = async () => {
	 await fetchCsrfToken();
    if (!description || !price || selectedOption === null) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    const formData = {
		user_id: userId,
      description,
      price,
      job_type: selectedOption,
    };

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
		navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      Alert.alert("Error", `Failed to submit the form because. ${error}`);
    }
  };

  const handleSelect = (client) => {
		setSelectedClient(client.value);
		setIsModalVisible(false); // Close the modal after selection
	};

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Bill To:</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.selectText}>
            {selectedClient || "Select an option"}
          </Text>
        </TouchableOpacity>

        <ReusableModalPicker
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          options={myclients}
          onSelect={handleSelect}
          title="Select a client"
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setBillToVisible(true)}>
          <Ionicons name="add-circle" size={30} color="blue" />
        </TouchableOpacity>
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
        />
        
        {selectedClient ? <Text>{selectedClient}</Text> : null}
      </View>

      <Text style={styles.label}>Price:</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="decimal-pad"
      />

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

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {/* **************** Modals ************* */}
      <BillToModal
        visible={billToVisible}
        onDismiss={() => setBillToVisible(false)}
        onSuccess={() => {
          // Handle success, maybe refresh data
          setBillToVisible(false);
        }}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
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
  selectText: {
		fontSize: 16,
	 },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    // Add any custom styling if necessary
  },
});
