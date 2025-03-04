import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import OrderContext from '../context/OrderContext';

const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString();
};

const OrderHistoryScreen = () => {
  const { orders } = useContext(OrderContext);
  const [ previousOrders, setPreviousOrders ] = useState([]);

  useEffect(() => {
    if(orders && Array.isArray(orders)) {
      const filteredOrders = orders.filter(order => order.status === 'ready');
      setPreviousOrders(filteredOrders);
    }
  },[orders]);

return (
    <View style={styles.container}>
      <Text style={styles.header}>Previous Orders</Text>

      {orders === undefined ? (
        <ActivityIndicator size="large" color="#34A853" />
      ) : previousOrders.length === 0 ? (
        <Text style={styles.emptyText}>No pending orders.</Text>
      ) : (
        <FlatList
          data={previousOrders}
          keyExtractor={(item, index) => item?._id ? item._id.toString() : index.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.orderText}>📄 Order ID: {item?._id || 'N/A'}</Text>
              <Text style={styles.orderText}>📌 Status: {item?.status || 'Unknown'}</Text>
              <Text style={styles.orderText}>🕒 Created At: {item?.createdAt ? formatDate(item.createdAt) : 'N/A'}</Text>
              <Text style={styles.orderText}>📝 Notes: {item?.notes || 'None'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  orderItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', marginBottom: 10 },
  orderText: { fontSize: 16, color: '#333' },
  emptyText: { textAlign: 'center', color: '#888', fontSize: 18, marginTop: 20 },
});

export default OrderHistoryScreen;