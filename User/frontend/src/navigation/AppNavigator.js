import React, { useContext, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import StationarySelectionScreen from '../screens/StationarySelectionScreen';
import OrderCreationScreen from '../screens/CreateOrderScreen';
import OrderHistoryScreen from '../screens/OrderHistory';
import CurrentOrdersScreen from '../screens/CurrentOrders';
import HeaderComponent from '../components/HeaderComponent';
import SideMenu from '../components/SideMenu';
import AuthContext from '../context/AuthContext';

const Stack = createStackNavigator();

const MainScreens = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  return (
    <>
      <HeaderComponent navigation={navigation} toggleMenu={toggleMenu} />
      {menuVisible && <SideMenu navigation={navigation} toggleMenu={toggleMenu} />}
      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StationarySelection" component={StationarySelectionScreen} />
        <Stack.Screen name="CreateOrder" component={OrderCreationScreen} />
        <Stack.Screen name="CurrentOrdersScreen" component={CurrentOrdersScreen} />
        <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
      </Stack.Navigator>
    </>
  );
};

const AppNavigator = () => {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Main">
          {({ navigation }) => <MainScreens navigation={navigation} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
