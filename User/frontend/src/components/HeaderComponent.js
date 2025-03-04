import React, {useState, useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import AuthContext from '../context/AuthContext';
import SideMenu from './SideMenu';
import axios from 'axios';

const HeaderComponent = ({navigation}) => {

  const {user} = useContext(AuthContext);
  const userName = user?.name;
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return(
    <>
      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={styles.logo}/>
        <Text style={styles.greeting}>Hi, {userName}!</Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name='menu' size={24} color="black" style={styles.menuIcon}/>
        </TouchableOpacity>
      </View>
      {menuVisible && <SideMenu navigation={navigation} toggleMenu={() => setMenuVisible(false)}/>}
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuIcon: {
    padding: 8,
  },
});

export default HeaderComponent;