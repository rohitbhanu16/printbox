import React, { useEffect } from "react"
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { OrderProvider } from "./src/context/OrderContext";

const App = () => {
  return (
    <AuthProvider>
      <OrderProvider>
      <AppNavigator />
      </OrderProvider>
    </AuthProvider>
  );
};

export default App;
