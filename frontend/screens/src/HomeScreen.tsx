import React, { useContext, useState, useEffect } from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';
import { fetchCsrfToken, getCsrfToken } from '../auth/CsrfService';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Ionicons } from '@expo/vector-icons';
import SearchComponent from '../components/SearchComponent';
import { backendApp } from '../utils';

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    {item.client && (
      <Text style={[styles.subheading, {color: textColor}]}>Invoice to: {item.client.client_company_name}</Text>
    )}
    <Text style={[styles.body, {color: textColor}]}>created: {item.date_created.split("T")[0]}</Text>
    <Text style={[{color: textColor}]}>R {item.total}</Text>
    <Text style={[styles.body, {color: textColor}]}>{item.status}</Text>
  </TouchableOpacity>
);

export default ({ navigation }) => {
  const { authToken, companyId, userId, logout } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [addServiceToVisible, setAddSericeToVisible] = useState(false)
  const [selectedId, setSelectedId] = useState();

  const getMyJobs = async () => {
    try {
      const response = await axios.get(`${backendApp()}/api/invoices/`)
      // console.log(response.data.myjobs)
      setJobs(response.data.myjobs);
    } catch (error) {
      console.error('Error:', error.message)
    }
  };
  useEffect(() => {
		getMyJobs()
	}, [])

  const deleteMessage = async (id) => {
    try {
        // Make a DELETE request to the API to delete the job by its ID
        await fetchCsrfToken();
        await axios.delete(`${backendApp()}/api/invoices/${id}/`, 
        {
            headers: {
              'X-CSRFToken': getCsrfToken(),
            },
        });
        
        // Update the state to remove the deleted job locally
        setJobs((prev) => prev.filter((invoice) => invoice.id !== id));
        console.log(`Job with ID ${id} deleted successfully`);
        getMyJobs()
    } catch (error) {
        console.error('Error deleting job:', error.response || error.message);
    }
};


  const renderRightActions = (id) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: 'red' }]}
        onPress={() => deleteMessage(id)}
      >
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: 'gray' }]}
        onPress={() => Alert.alert('Feature', 'More options coming soon!')}
      >
        <Text style={styles.actionText}>More</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => { 
    // if(item.client != null) {
    //   console.log(item.client.client_company_name)
    // }
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : 'transparent';
    const color = item.id === selectedId ? 'white' : 'black';

    return(
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity style={styles.card}>
      <Item
        item={item}
        onPress={() => navigation.navigate("ViewInvoice", {invoiceId: (item.id)})}
        backgroundColor={backgroundColor}
        textColor={color}
      />
      </TouchableOpacity>
    </Swipeable>
  )};

  return (
    <View style={styles.container}>
      <View style={styles.div1}>
        <SearchComponent
          data={jobs} 
          placeholder="Search"
          populateFunc={setJobs}
        />
      </View>
      <View style={styles.div2}>
        <FlatList
          data={jobs} 
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          extraData={selectedId}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#f0f4fc',
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
  },
  title: {
    fontSize: 32,
  },
  div1: {
    flex: 1
  },
  div2: {
    flex: 9
  }
});
