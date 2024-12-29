import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CompanyPage1 = ({ navigation }: any) => {
  const [selectedValue, setSelectedValue] = useState("Other");

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Type Of Company:</Text>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Registered Company" value="Registered" />
        <Picker.Item label="Freelancer" value="Freelancer" />
        <Picker.Item label="Informal Business" value="Informal" />
        <Picker.Item label="Other" value="Other" />
      </Picker>
      <Text style={styles.selectedText}>Selected: {selectedValue}</Text>
		<Button
        title="Next"
        onPress={() => navigation.navigate('CompanyForm', { selectedValue })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
	height: 50,
	width: '100%',
	marginBottom: 150,
 },
  selectedText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default CompanyPage1;
