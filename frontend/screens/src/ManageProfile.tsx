import React, { useContext, useState, useEffect } from 'react';
import {ScrollView,StyleSheet,Text,View,TouchableOpacity} from 'react-native';

export default ({navigation}) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.card}
				onPress={() => navigation.navigate('My Company')}
			>
				<Text style={styles.cardText}>Edit Company</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.card}
				onPress={() => navigation.navigate('Edit Address')}
			>
				<Text style={styles.cardText}>Edit Company Address</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.card}
				onPress={() => navigation.navigate('My Profile')}
			>
				<Text style={styles.cardText}>Edit Payment Details</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.card}
				onPress={() => navigation.navigate('My Profile')}
			>
				<Text style={styles.cardText}>Edit Profile</Text>
			</TouchableOpacity>
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
	paddingVertical: 20,
	paddingHorizontal: 10,
	borderRadius: 8,
	shadowColor: '#000',
	shadowOpacity: 0.1,
	shadowRadius: 4,
	elevation: 2,
 },
 cardText: {
	fontSize: 20,
	textAlign: 'center',
 }
});