import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

type TaxToggleProps = {
  selectedValue: string; // Pass 'Registered' or any other string to indicate company type
};

const TaxToggleScreen: React.FC<TaxToggleProps> = ({ route }) => {
  const { selectedValue } = route.params; // Retrieve selected company type
  console.log(`^^^^^^^^^^^^ ${selectedValue} ^^^^^^^^^^^^^`)
  const [isTaxIncluded, setIsTaxIncluded] = useState(false);

  // Automatically set the toggle based on company type
  useEffect(() => {
    if (selectedValue === 'Registered') {
      setIsTaxIncluded(true);
    }
  }, [selectedValue]);

  const toggleSwitch = () => setIsTaxIncluded((prev) => !prev);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tax Inclusion Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Include Tax:</Text>
        <Switch
          value={isTaxIncluded}
          onValueChange={toggleSwitch}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isTaxIncluded ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      <Text style={styles.status}>
        {isTaxIncluded
          ? 'Tax is included in calculations.'
          : 'Tax is not included in calculations.'}
      </Text>
    </View>
  );
};

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
});

export default TaxToggleScreen;
