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
import AddServiceModal from "../components/AddServiceModal";
import { backendApp } from '../utils';

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.subheading, {color: textColor}]}>{item.job_name}</Text>
    <Text style={[styles.body, {color: textColor}]}>{item.description}</Text>
    <Text style={[{color: textColor}]}>R {item.price}</Text>
  </TouchableOpacity>
);

export default ({ navigation }) => {
  const { authToken, companyId, userId, logout } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [addServiceToVisible, setAddSericeToVisible] = useState(false)
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
	}, [])

  const deleteMessage = async (id) => {
    try {
        // Make a DELETE request to the API to delete the job by its ID
        await fetchCsrfToken();
        await axios.delete(`${backendApp()}/api/jobs/delete/${id}/`, 
        {
            headers: {
              'X-CSRFToken': getCsrfToken(),
            },
        });
        
        // Update the state to remove the deleted job locally
        setJobs((prev) => prev.filter((job) => job.id !== id));
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
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : 'transparent';
    const color = item.id === selectedId ? 'white' : 'black';

    return(
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity style={styles.card}>
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
      </TouchableOpacity>
    </Swipeable>
  )};

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs} 
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={selectedId}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setAddSericeToVisible(true)}
      >
        <Ionicons name="add" size={40} color="white" />
      </TouchableOpacity>
      <AddServiceModal
              visible={addServiceToVisible}
              onDismiss={() => setAddSericeToVisible(false)}
              onSuccess={() => {
                // Handle success, maybe refresh data
                getMyJobs();
                setAddSericeToVisible(false);
              }}
            />
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
  },
  title: {
    fontSize: 32,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007BFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
