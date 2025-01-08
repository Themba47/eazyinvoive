import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert } from "react-native";
import axios from "axios";
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { fetchCsrfToken, getCsrfToken } from '../auth/CsrfService';
import BillToModal from "../components/BillToModal";
import ReusableModalPicker from '../components/OptionsScreen';
import { AuthContext } from '../auth/AuthContext';
import { backendApp } from '../utils';
import AddServiceModal from "../components/AddServiceModal";

export default({ navigation }) => {
  const { userId } = useContext(AuthContext);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedClient, setSelectedClient] = useState('');
  const [isClientModalVisible, setClientModalVisible] = useState(false);
  const [isJobModalVisible, setJobModalVisible] = useState(false);
  const [billToVisible, setBillToVisible] = useState(false);
  const [addServiceToVisible, setAddSericeToVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null);
  const [notes, setNotes] = useState("")
  const [myclients, setMyClients] = useState([]); 
   
   const [jobs, setJobs] = useState([]);
   const [selectedId, setSelectedId] = useState();
 
   const getMyJobs = async () => {
     try {
       const response = await axios.get(`${backendApp()}/api/jobs/${userId}/`)
       console.log(response.data.myjobs)
       setJobs(response.data.myjobs);
     } catch (error) {
       console.error('Error:', error.message)
     }
   };
   useEffect(() => {
     getMyJobs()
   }, [])// Temporary hardcoded list of countries

  const [isTaxIncluded, setIsTaxIncluded] = useState(false);
  const options = ["Service", "Product"];

  const toggleSwitch = () => setIsTaxIncluded((prev) => !prev);

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
          onPress={() => setClientModalVisible(true)}
        >
          <Text style={styles.selectText}>
            {selectedClient || "Select a client"}
          </Text>
        </TouchableOpacity>

        <ReusableModalPicker
          visible={isClientModalVisible}
          onClose={() => setClientModalVisible(false)}
          options={myclients}
          onSelect={handleSelect}
          title="Select a client"
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setBillToVisible(true)}>
          <Ionicons name="add-circle" size={30} color="blue" />
        </TouchableOpacity>

        {selectedClient ? <Text>{selectedClient}</Text> : null}
      </View>

      <View>
        <Text style={styles.label}>Add Item:</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setJobModalVisible(true)}
        >
          <Text style={styles.selectText}>
            {selectedClient || "Select an item"}
          </Text>
        </TouchableOpacity>

        <ReusableModalPicker
          visible={isJobModalVisible}
          onClose={() => setJobModalVisible(false)}
          options={jobs}
          onSelect={handleSelect}
          title="Select an item"
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setAddSericeToVisible(true)}>
          <Ionicons name="add-circle" size={30} color="blue" />
        </TouchableOpacity>

        {selectedClient ? <Text>{selectedClient}</Text> : null}
      </View>

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

      <Switch
        value={isTaxIncluded}
        onValueChange={toggleSwitch}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isTaxIncluded ? '#f5dd4b' : '#f4f3f4'}
      />

      <Text style={styles.label}>Notes:</Text>
        <TextInput
          style={styles.input}
          value={notes}
          onChangeText={setNotes}
          placeholder="Enter notes for invoice"
        />
      <Text>{notes}</Text>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Preview Invoice</Text>
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

      <AddServiceModal
        visible={addServiceToVisible}
        onDismiss={() => setAddSericeToVisible(false)}
        onSuccess={() => {
          // Handle success, maybe refresh data
          setAddSericeToVisible(false);
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
