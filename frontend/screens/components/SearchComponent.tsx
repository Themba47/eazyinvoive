import React, { useState } from 'react';
import { FlatList, Text, TextInput, View, StyleSheet } from 'react-native';

export default ({data, placeholder, populateFunc}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text) => {
    setSearchQuery(text);

    if (text) {
      const filtered = data.filter((item) => 
			// Edit later
        item.job_name.toLowerCase().includes(text.toLowerCase()) ||
        item.price.toString().includes(text) ||
        item.description.toLowerCase().includes(text.toLowerCase())
      );
      populateFunc(filtered);
    } else {
      populateFunc(data);
    }
  };

  const handleBlur = () => {
	if (!searchQuery || searchQuery == "") {
	  populateFunc(data); // Return all items if the search query is empty
	}
 };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder={placeholder}
        value={searchQuery}
        onChangeText={handleSearch}
		  onBlur={handleBlur}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

