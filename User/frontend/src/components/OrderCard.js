import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const OrderCard = ({order, onPress}) => {
  return(
    <TouchableOpacity style={styles.card} onPress={() => onPress(order)}>
      <Text style={styles.title}>{order.stationary.name}</Text>
      <Text style={styles.status}>Status: {order.status}</Text>
      <View style={styles.preferences}>
        <Text>Copies: {order.preferences.copies}</Text>
        <Text>Urgency: {order.preferences.urgency}</Text>
      </View>
      <Text style={styles.notes}>Notes: {order.notes || 'N/A'}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: '#007BFF',
    marginBottom: 8,
  },
  preferences: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notes: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#6c757d',
  },
});

export default OrderCard;