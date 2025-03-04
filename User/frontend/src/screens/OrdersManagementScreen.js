import React, {useContext} from 'react';
import { View, StyleSheet } from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import AuthContext from '../context/AuthContext';
import { TabView, SceneMap } from 'react-native-tab-view';
import CurrentOrders from './CurrentOrders'; // Example routes
import OrderHistory from './OrderHistory';

const OrdersManagementScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'current', title: 'Current Orders' },
    { key: 'history', title: 'Order History' },
  ]);

  return (
    <View style={styles.container}>
      <HeaderComponent userName={user?.name || 'User'} navigation={navigation} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          current: CurrentOrders,
          history: OrderHistory,
        })}
        onIndexChange={setIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OrdersManagementScreen;
