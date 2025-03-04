import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "./AuthContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");

        if (!storedUserId) {
          console.error("❌ No userId found!");
          return;
        }

        const userId = JSON.parse(storedUserId); // ✅ Parse userId from string

        console.log("✅ Fetching orders for user:", userId);

        const response = await axios.get(
          `http://10.0.2.2:5000/api/orders?userId=${userId}`
        );

        setOrders(response.data);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, setOrders, newOrder, setNewOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
