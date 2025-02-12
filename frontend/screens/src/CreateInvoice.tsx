import React, { useContext, useEffect, useState } from "react";
import {FlatList, View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert, ScrollView, Platform } from "react-native";
import axios from "axios";
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { fetchCsrfToken, getCsrfToken } from '../auth/CsrfService';
import BillToModal from "../components/BillToModal";
import ReusableModalPicker from '../components/OptionsScreen';
import { AuthContext } from '../auth/AuthContext';
import { backendApp } from '../utils';
import AddServiceModal from "../components/AddServiceModal";
import { baseStyles, buttonColor } from "../stylesheet";

export default({ navigation }) => {
  const { authToken, userId, companyId } = useContext(AuthContext);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedClient, setSelectedClient] = useState('');
  const [clientId, setClientId] = useState('')
  const [selectedClientDetail, setSelectedClientDetail] = useState('');
  const [isClientModalVisible, setClientModalVisible] = useState(false);
  const [isJobModalVisible, setJobModalVisible] = useState(false);
  const [billToVisible, setBillToVisible] = useState(false);
  const [addServiceToVisible, setAddSericeToVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null);
  const [quantityEnabled, setQuantityEnabled] = useState(false);
  const [notes, setNotes] = useState("");
  const [myclients, setMyClients] = useState([]); 
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [date, setDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState('');
  const [address, setAddress] = useState([
    {
      address_type: "",
      city: "",
      company_id: {
        Active: false,
        company_code: "",
        company_name: "",
        company_type: "",
        contact_email: "",
        contact_number: "",
        date_created: "",
        date_updated: "",
        details: null,
        id: null,
        logo: "",
        other_vital_info: [], // Keeping it as an empty array
        reg_number: "",
        tax_number: "",
        user_id: null,
      },
      complex_apartment: "",
      country: "",
      postal_code: "",
      province: "",
      street: "",
    },
  ]); // Initial empty structure

  const [total, setTotal] = useState(0)
  const [subtotal, setSubTotal] = useState(0)
  const [taxpercentage, setTaxPaercentage] = useState(.15)
   
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

  const getMyCompanyDetails = async () => {
    try {
      const response = await axios.get(`${backendApp()}/api/address/${companyId}/`)
      setAddress(response.data) 
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
     setCurrentDate(format(new Date(), 'dd MMM yyyy'));
     getMyClients()
     getInvoiceNumber()
     getMyCompanyDetails()
     getMyJobs()
   }, [])// Temporary hardcoded list of countries

  const [dueDate, setDueDate] = useState(false)
  const [isTaxIncluded, setIsTaxIncluded] = useState(false);
  const options = ["QUOTE", "UNPAID", "PAID"];

  const checkOption = (opt) => {
    
  }

  const calculateSubtotal = (bool: boolean) => {
    if(bool && total > 0) {
      setSubTotal(total - (total * taxpercentage))
    }else {
      setSubTotal(0)
    }
  }

  const getInvoiceNumber = async () => {
    try {
      const response = await axios.get(`${backendApp()}/api/userdetails/`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Send token in header
        },
      })
      setInvoiceNumber(response.data.invoices_generated);
    } catch (error) {
      console.error('Error:', error.message)
    }
  };

  const toggleSwitch = () => {
    setIsTaxIncluded(prev => {
      const newValue = !prev;
      // console.log(newValue);
      calculateSubtotal(newValue);
      return newValue;
    });
  };
  const showDueDateView = () => {setDueDate((prev) => !prev)};

  const handleSubmit = async (form) => {
	 await fetchCsrfToken();
    // if (!description || !price || selectedOption === null) {
    //   Alert.alert("Error", "Please fill out all fields.");
    //   return;
    // }

    const formData = {
      user: form.userId,
      name: '',
      total: form.total,
      client: form.clientId,
      items: form.selectedJob,
      status: form.selectedOption,
      file: ''
    };
    

    try {
      const response = await axios.post(`${backendApp()}/api/invoices/`, formData, 
		{
			  headers: {
					'X-CSRFToken': getCsrfToken(),
			  },
		 });
		console.log('Response:', response.data);
      Toast.show({
					type: 'success',
					text1: 'Success',
					text2: 'Template created',
				 });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", `Failed to submit the form because. ${error}`);
    }
  };

  const handlePreview = () => {
    const formData = {
      userId: userId,
      address: address[0],
      description: description,
      price: price,
      clientId: clientId,
      selectedClientDetail: selectedClientDetail.split("\n"),
      isClientModalVisible: isClientModalVisible,
      isJobModalVisible: isJobModalVisible,
      billToVisible: billToVisible,
      addServiceToVisible: addServiceToVisible,
      selectedOption: selectedOption,
      quantityEnabled: quantityEnabled,
      notes: notes,
      myclients: myclients,
      showDatePicker: showDatePicker,
      duedate: format(date, 'dd MMM yyyy'),
      currentDate: currentDate,
      jobs: jobs,
      selectedJob: selectedJob,
      isDueDate: dueDate,
      isTaxIncluded: isTaxIncluded,
      invoiceNumber: invoiceNumber,
      total: total,
      subtotal: subtotal,
      taxpercentage: taxpercentage * 100,
      taxamount: total * taxpercentage,
      currency: 'R'
     };
     console.log(">>>> " + formData.address.company_id.company_name)
     handleSubmit(formData)
     navigation.navigate('Preview', {data: formData});
  }

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
    setClientId(client.id)
		setBillToVisible(false); // Close the modal after selection
	};

  const handleSelectItem = (item) => {
		setSelectedJob((prevItems) => {
      // Check if the item is already in the array
      const exists = prevItems.some((job) => job.id === item.id);
      if (!exists) {
        setTotal(total + parseFloat(item.price))
        return [...prevItems, item]; // Add the new item if it doesn't exist
      }
      return prevItems; // Return the previous array if the item exists
    });
		setJobModalVisible(false); // Close the modal after selection
    calculateSubtotal(isTaxIncluded)
	};

  const removeItem = (item) => {
    setSelectedJob((prevItems) => prevItems.filter((job) => job.id !== item.id));
    setTotal(total - parseFloat(item.price))
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }); // Example: "09 Jan 2025"
  };

  return (
    <View style={[baseStyles.container, styles.container]}>
      <ScrollView style={styles.createContainer}>
      <Text>Today's date: {currentDate}</Text>
      <Text style={styles.label}>Select Invoice:</Text>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedOption === option ? styles.selectedOption : null,
            ]}
            onPress={() => {setSelectedOption(option); checkOption(selectedOption)}}
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
      {selectedOption != "QUOTE" ? <Text style={styles.label}>Invoice: Number: { invoiceNumber }</Text> : null}
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
              nestedScrollEnabled={true}
              data={selectedJob}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.addedItems}>
                <Text style={[styles.addedItemsText]}>{item.job_name} {item.price}</Text>
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
          title="Select an item"
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setAddSericeToVisible(true)}>
          <Ionicons name="add-circle" size={30} color="blue" />
        </TouchableOpacity>

        {selectedClient ? <Text>{selectedClient}</Text> : null}
      </View>
      
      <View style={styles.switchView}>
        <Switch
          value={isTaxIncluded}
          onValueChange={toggleSwitch}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isTaxIncluded ? '#f5dd4b' : '#f4f3f4'}
        />
        <Text>Show tax and subtotal</Text>
      </View>

      { isTaxIncluded && (
      <View>
        <Text style={styles.total}>Subtotal: R {subtotal}</Text>
        <Text style={styles.total}>Tax R 15%</Text>
      </View>
      )}
      <Text style={styles.total}>Total: R {total}</Text>

      <Text style={styles.label}>Notes:</Text>
        <TextInput
          style={styles.input}
          value={notes}
          onChangeText={setNotes}
          placeholder="Enter notes for invoice"
        />
      <Text>{notes}</Text>
      
      <View style={styles.switchView}>
        <Switch
          value={dueDate}
          onValueChange={showDueDateView}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={dueDate ? '#f5dd4b' : '#f4f3f4'}
        />
        <Text>Show due date</Text>
      </View>
      { dueDate && (
      <View>
        <TouchableOpacity onPress={() => setShowDatePicker((prev) => !prev)} style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 5,
        }}>
          <Text>{formatDate(date)}</Text>
        </TouchableOpacity>
    
        {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          onChange={handleDateChange}
        />
      )}
      </View>)}

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
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handlePreview}>
          <Text style={styles.submitButtonText}>Preview Invoice</Text>
        </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
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
    backgroundColor: buttonColor,
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
    backgroundColor: buttonColor,
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
  total: {
    paddingVertical: 10,
    fontSize: 24,
  },
  addedItemsButton: {
    flex: 2
  },
  switchView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  addButton: {
    
  },
});
