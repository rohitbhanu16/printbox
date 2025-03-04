import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (userData) => {
    localStorage.clear(); // ✅ Prevent old data conflicts
  
    const token = userData.token;
    const stationary = userData.stationary;
  
    if (!token || !stationary || !stationary._id) {
      console.error("❌ Token or Stationary ID missing!");
      return;
    }
  
    // ✅ Store token and stationary separately
    setUser(stationary);
    localStorage.setItem("user", JSON.stringify(stationary)); // Only store stationary details
    localStorage.setItem("token", token);
    localStorage.setItem("stationaryId", stationary._id); // Store stationary ID separately
  
    console.log("✅ Token & Stationary ID stored successfully!");
    navigate("/dashboard");
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("stationaryId");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
