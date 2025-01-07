import React, { useContext, useState } from 'react';
import { Button, Dimensions, StyleSheet, View } from 'react-native';

export default ({ navigation }) => {
  const [billToVisible, setBillToVisible] = useState(false);
  const data = {
    name: 'John Doe',
    details: 'This is sample data for the PDF.',
  };

  return (
    <View style={styles.container}>
      <View style={styles.row90}></View>
      <View style={styles.row10}>
        <Button title='Create Invoice' onPress={() => navigation.navigate('AddService')} />
      </View> 
    </View>
  );
}

const width = Dimensions.get("window").width; //full width
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row90: {
    flex: 9,
  },
  row10: {
    flex: 1
  }
});
