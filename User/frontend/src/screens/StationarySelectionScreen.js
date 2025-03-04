import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const StationarySelectionScreen = () => {
  const [stationaries, setStationaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch stationary shops from the backend
    const fetchStationaries = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:5000/api/stationary');
        setStationaries(response.data);
      } catch (error) {
        console.error('Error fetching stationaries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStationaries();
  }, []);

  const renderStationary = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CreateOrder', { stationaryId: item._id })}
    >
      <Text style={styles.name}>{item.shopName}</Text>
      <Text style={styles.location}>{item.address}</Text>
      <Text style={styles.phone}>{item.phone}</Text>
      <Text style={styles.status}>{item.status === 'open' ? 'Open' : 'Closed'}</Text>
    </TouchableOpacity>
  );
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Stationary</Text>
      <FlatList
        data={stationaries}
        keyExtractor={(item) => item._id}
        renderItem={renderStationary}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    color: '#6c757d',
  },
  status: {
    fontSize: 14,
    color: '#28a745',
    marginTop: 8,
  },
  phone: {
  fontSize: 14,
  color: '#007bff',
},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StationarySelectionScreen;
