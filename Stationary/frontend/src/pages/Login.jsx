import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { TextField, Button, Container, Typography} from "@mui/material";
import axios from "axios";
import "../styles/auth.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: ""});
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials,
      );
      login(response.data);
      navigate("/dashboard");
      console.log("Stationary ID:", localStorage.getItem("stationaryId"))
    } catch (error) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <Container className="auth-container">
      <Typography variant="h4">Stationary Login</Typography>
      {error && <Typography className="error-text">{error}</Typography>}
      <TextField
        label="Email"
        name="email"
        type="email"
        fullWidth
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        fullWidth
        onChange={handleChange}
        margin="normal"
      />
      <Button variant="contained" fullWidth onClick={handleLogin}>
        Login
      </Button>
      <Typography
        className="switch-link"
        onClick={() => navigate("/signup")}
        component = "a"
        style={{ cursor: "pointer", textDecoration: "underline" }}
      >
        Don't have an account? Sign up
      </Typography> 
    </Container>
  );
};

export default Login;