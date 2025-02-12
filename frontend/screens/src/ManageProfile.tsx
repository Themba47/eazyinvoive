import React, { useContext, useState, useEffect } from 'react';
import {ScrollView,StyleSheet,Text,View,TouchableOpacity} from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../auth/AuthContext';

export default ({navigation}) => {
	const { logout } = useContext(AuthContext);

	const Logout = async () => {
		await logout();
		navigation.navigate('Login');
		Toast.show({
				type: 'success',
				text1: 'Success',
				text2: 'Logged Out!',
			 });
	}

	return (
		<View style={styles.container}>
			<View style={styles.row1}>

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
				
				<TouchableOpacity style={styles.card}
				onPress={() => navigation.navigate('Feedback')}
				>
					<Text style={styles.cardText}>Provide Feedback</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.row2}>
				<TouchableOpacity
				   style={styles.logoutButton}
					onPress={Logout}
				>
					<Text style={styles.text}>Logout</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
  container: {
	 flex: 1,
	 backgroundColor: '#f5f5f5',
	 justifyContent: 'flex-start',
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
 },
 text: {
	fontSize: 18,
	color: "#fff",
	paddingVertical: 10
 },
 logoutButton: {
	backgroundColor: '#000',
	padding: 5,
	width: "25%",
	alignItems: "center",
	borderRadius: 10
 },
 row1: {flex: 8},
  row2: {
    flex: 1,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#000",
  }
});