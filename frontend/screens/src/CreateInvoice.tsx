import React, { useContext, useEffect, useState } from "react";
import {FlatList, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert } from "react-native";
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
  const [selectedClientDetail, setSelectedClientDetail] = useState('');
  const [isClientModalVisible, setClientModalVisible] = useState(false);
  const [isJobModalVisible, setJobModalVisible] = useState(false);
  const [billToVisible, setBillToVisible] = useState(false);
  const [addServiceToVisible, setAddSericeToVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null);
  const [notes, setNotes] = useState("")
  const [myclients, setMyClients] = useState([]); 
   
   const [jobs, setJobs] = useState([]);
   const [selectedJob, setSelectedJob] = useState([]);

   const getMyClients = async () => {
    try {
      const response = await axios.get(`${backendApp()}/api/billto/${userId}/`)
      setMyClients(response.data.myjobs);
    } catch (error) {
      console.error('Error:', error.message)
    }
  };
 
   const getMyJobs = async () => {
     try {
       const response = await axios.get(`${backendApp()}/api/jobs/${userId}/`)
       setJobs(response.data.myjobs);
     } catch (error) {
       console.error('Error:', error.message)
     }
   };
   useEffect(() => {
     getMyClients()
     getMyJobs()
   }, [])// Temporary hardcoded list of countries

  const [isTaxIncluded, setIsTaxIncluded] = useState(false);
  const options = ["QUOTE", "UNPAID", "PAID"];

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

  const handleSelectClient = (client) => {
    
    // Exclude the unwanted fields
    const filteredClient = { ...client };
    delete filteredClient.id
    delete filteredClient.Active;
    delete filteredClient.longitude;
    delete filteredClient.latitude;
    delete filteredClient.created_at;
    delete filteredClient.updated_at;
    delete filteredClient.user_id;

    const clientString = Object.entries(filteredClient)
    .filter(([_, value]) => value !== "" && value !== null) // Exclude empty strings and null values
    .map(([key, value]) => `${value}`)
    .join("\n");

    setSelectedClientDetail(clientString);
		setSelectedClient(filteredClient.client_name);
		setBillToVisible(false); // Close the modal after selection
	};

  const handleSelectItem = (item) => {
		setSelectedJob((prevItems) => {
      // Check if the item is already in the array
      const exists = prevItems.some((job) => job.id === item.id);
      if (!exists) {
        return [...prevItems, item]; // Add the new item if it doesn't exist
      }
      return prevItems; // Return the previous array if the item exists
    });
		setJobModalVisible(false); // Close the modal after selection
	};

  const removeItem = (item) => {
    setSelectedJob((prevItems) => prevItems.filter((job) => job.id !== item.id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.createContainer}>
      <Text style={styles.label}>Select Invoice:</Text>
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
              {option.toLocaleLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
          onSelect={handleSelectClient}
          title="Select a client"
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setBillToVisible(true)}>
          <Ionicons name="add-circle" size={30} color="blue" />
        </TouchableOpacity>

        {selectedClient ? <Text>{selectedClientDetail}</Text> : null}
      </View>

      <View>
        <Text style={styles.label}>Add Item:</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setJobModalVisible(true)}
        >
          <Text style={styles.selectText}>Add An item</Text>
        </TouchableOpacity>

        <View>
          <FlatList
              data={selectedJob}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.addedItems}>
                <Text style={[styles.addedItemsText]}>{item.job_name}</Text>
                <TouchableOpacity style={styles.addedItemsButton} onPress={() => removeItem(item)}>
                  <Ionicons name="remove-circle" size={30} color="red" />
                </TouchableOpacity>
                </View>
              )}
            />
        </View>

        <ReusableModalPicker
          visible={isJobModalVisible}
          onClose={() => setJobModalVisible(false)}
          options={jobs}
          onSelect={handleSelectItem}
          title="Select An item"
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setAddSericeToVisible(true)}>
          <Ionicons name="add-circle" size={30} color="blue" />
        </TouchableOpacity>

        {selectedClient ? <Text>{selectedClient}</Text> : null}
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Preview Invoice</Text>
        </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  createContainer: {
    flex: 9
  },
  buttonContainer: {
    flex: 1
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
  addedItems: {
    flex: 1,
    borderWidth: 1,
    padding: 2,
    borderColor: "#000",
    borderRadius: 10, 
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  addedItemsText: {
    flex: 8
  },
  addedItemsButton: {
    flex: 2
  },
  addButton: {
    
  },
});
