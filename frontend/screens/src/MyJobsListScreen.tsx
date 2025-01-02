import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { AuthContext } from '../auth/AuthContext';
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

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };
  
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      />
    </SafeAreaView>
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    marginRight: 10,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
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
