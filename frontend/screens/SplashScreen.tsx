import React, { useEffect, useState } from 'react';
import { View, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State initialization
  const navigation = useNavigation();

  useEffect(() => {
    // Simulate checking user authentication status
    setTimeout(() => {
      navigation.navigate(isLoggedIn ? 'Home' : 'Login');
    }, 1500);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.text}>Weakestlink</Text> */}
      <Image source={require("../assets/eazyinvoice.png")} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { marginTop: 20, fontSize: 24, fontWeight: 'bold' },
  image: {
    width: 200, // Adjust as needed
    height: 200, // Adjust as needed
    resizeMode: "contain", // Keeps aspect ratio
  },
});

export default SplashScreen;
