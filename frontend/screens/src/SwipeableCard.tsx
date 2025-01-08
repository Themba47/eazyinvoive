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
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { backendApp } from '../utils';

const Item = ({item, onPress, backgroundColor, textColor}) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
    <Text style={[styles.title, {color: textColor}]}>{item.description}</Text>
    <Text style={[{color: textColor}]}>R {item.price}</Text>
  </TouchableOpacity>
);

export default () => {
  const { authToken, companyId, userId, logout } = useContext(AuthContext);
  const [jobs, setJobs] = useState({});
  const [selectedId, setSelectedId] = useState();

  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello, how are you?' },
    { id: '2', text: 'Are we meeting tomorrow?' },
    { id: '3', text: 'Don’t forget to bring the documents.' },
  ]);

  useEffect(() => {
		const getMyJobs = async () => {
			try {
				const response = await axios.get(`${backendApp()}/api/jobs/${userId}`)
				console.log(response.data.myjobs)
				setJobs(response.data.myjobs);
			} catch (error) {
				console.error('Error:', error.message)
			}
		};

		getMyJobs()
	}, [])

  const deleteMessage = (id) => {
    setMessages((prev) => prev.filter((message) => message.id !== id));
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
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';
    
    return(
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardText}>{item.text}</Text>
      </TouchableOpacity>
    </Swipeable>
  )};

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
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
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
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
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
