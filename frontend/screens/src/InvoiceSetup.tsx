import React from 'react';
import { Button, View } from 'react-native';

export default ({ navigation }) => {
  const data = {
    name: 'John Doe',
    details: 'This is sample data for the PDF.',
  };

  return (
    <View>
      <Button
        title="Generate PDF"
        onPress={() => navigation.navigate('Preview', { data })}
      />
    </View>
  );
}
