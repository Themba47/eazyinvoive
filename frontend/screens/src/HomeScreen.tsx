import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { AuthContext } from '../auth/AuthContext';

const HomeScreen = ({navigation}) => {
  const { authToken, companyId, userId, logout } = useContext(AuthContext);
  console.log(`${authToken} Company: ${companyId} User: ${userId}`)
  const [selectedCard, setSelectedCard] = useState<number | null>(null); // Track selected card

  // Mock data for cards
  const cards = [
    { id: 1, text: 'Card 1', image: 'https://via.placeholder.com/150' },
    { id: 2, text: 'Card 2', image: 'https://via.placeholder.com/150' },
    { id: 3, text: 'Card 3', image: 'https://via.placeholder.com/150' },
    { id: 4, text: 'Card 4', image: 'https://via.placeholder.com/150' },
  ];

  return (
    <View style={styles.container}>
      {/* First Row: Current Points */}
      <View style={styles.row20}>
        <Text style={styles.pointsText}>Current Points: 1200</Text>
      </View>

      <Text onPress={() => navigation.navigate('InvoiceSetup')}>
            View My Jobs
      </Text>

      {/* Second Row: Scrollable Cards */}
      <View style={styles.row80}>
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                selectedCard === item.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedCard(item.id)} // Set selected card
            >
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.cardBackground}
                imageStyle={styles.cardImage}
              >
                <Text style={styles.cardText}>{item.text}</Text>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const screen_width = Dimensions.get('window').width
const screen_height = Dimensions.get('window').height
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  row20: {
    flex: 2, // 30% height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  pointsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  row80: {
    flex: 8, // 70% height
    margin: 10,
    paddingVertical: 10,
  },
  card: {
    width: screen_width,
    height: '90%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#007BFF',
  },
  cardBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardImage: {
    resizeMode: 'cover',
  },
  cardText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Text background for contrast
    padding: 5,
  },
});

export default HomeScreen;

