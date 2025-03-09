import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import "../styles/auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    address: "",
    phone: "", // ✅ Ensure phone is initialized
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      // ✅ Ensure phone number is included in request
      if (!formData.phone) {
        setError("Phone number is required.");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Signup successful:", response.data);

      // ✅ Store token and stationaryId in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("stationaryId", response.data.stationary._id);
      localStorage.setItem("user", JSON.stringify(response.data));

      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Signup Failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <Container className="auth-container">
      <Typography variant="h4">Register Stationary</Typography>
      {error && <Typography className="error-text">{error}</Typography>}

      <TextField label="Shop Name" name="shopName" fullWidth onChange={handleChange} margin="normal" />
      <TextField label="Owner Name" name="ownerName" fullWidth onChange={handleChange} margin="normal" />
      <TextField label="Address" name="address" fullWidth onChange={handleChange} margin="normal" />
      <TextField label="Phone" name="phone" type="tel" fullWidth onChange={handleChange} margin="normal" required />
      <TextField label="Email" name="email" type="email" fullWidth onChange={handleChange} margin="normal" />
      <TextField label="Password" name="password" type="password" fullWidth onChange={handleChange} margin="normal" />

      <Button variant="contained" fullWidth onClick={handleSignup}>
        Sign Up
      </Button>

      <Typography className="switch-link" onClick={() => navigate("/")} style={{ cursor: "pointer", textDecoration: "underline" }}>
        Already have an account? Login
      </Typography>
    </Container>
  );
};

export default Signup;
