import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState(null);
  const [stationarySocket, setStationarySocket] = useState(null);
  const [userSocket, setUserSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stationaryId = localStorage.getItem("stationaryId");

    if (!token || !stationaryId) {
      console.warn("🚫 No token or stationary ID - WebSocket will not connect.");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/orders?stationary=${stationaryId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      }
    };

    fetchOrders(); // ✅ Fetch orders when component mounts

    // ✅ Setup Stationary WebSocket Connection
    const newStationarySocket = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    newStationarySocket.on("connect", () => {
      console.log("🟢 Connected to Stationary Backend WebSocket:", newStationarySocket.id);
      newStationarySocket.emit("joinRoom", stationaryId);
    });

    newStationarySocket.on("orderNotification", (order) => {
      console.log("🔔 New Order from Stationary Backend:", order);
      setNewOrder(order);
      setOrders((prev) => [order, ...prev]); // ✅ Orders update dynamically
    });

    setStationarySocket(newStationarySocket);

    // ✅ Setup User WebSocket Connection
    const newUserSocket = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
    });

    newUserSocket.on("connect", () => {
      console.log("🟢 Connected to User Backend WebSocket:", newUserSocket.id);
      newUserSocket.emit("joinRoom", stationaryId);
    });

    newUserSocket.on("orderNotification", (order) => {
      console.log("🔔 New Order from User Backend:", order);
      setNewOrder(order);
      setOrders((prev) => [order, ...prev]); // ✅ Orders update dynamically
    });

    setUserSocket(newUserSocket);

    return () => {
      newStationarySocket.disconnect();
      newUserSocket.disconnect();
    };
  }, []); // ✅ Runs only once when component mounts

  return (
    <OrderContext.Provider value={{ orders, setOrders, newOrder, setNewOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
