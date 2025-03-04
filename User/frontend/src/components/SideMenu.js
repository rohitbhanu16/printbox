import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SideMenu = ({ toggleMenu }) => {
  const navigation = useNavigation();

  const navigateToScreen = (screen) => {
    toggleMenu(); // Close the sidebar when navigating
    navigation.navigate('Main', { screen }); // Ensure nested navigation
  };

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity onPress={() => navigateToScreen('CurrentOrdersScreen')} style={styles.menuItem}>
        <Text>Current Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigateToScreen('OrderHistoryScreen')} style={styles.menuItem}>
        <Text>Order History</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  menuItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' }
});

export default SideMenu;
