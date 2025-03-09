import { Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/Profile";
import Header from "./components/Header";

function App() {
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if(!token && window.location.pathname !== "/signup") {
      logout();
    }
  }, [logout]);


  return (
    <>
      {user && <Header />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
