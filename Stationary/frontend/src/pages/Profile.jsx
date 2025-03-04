import { useState, useEffect, useContext } from "react";
import { Avatar, TextField, Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/material";
import AuthContext from "../context/AuthContext";
import axios from "axios";
//import "../styles/profile.css";

const ProfileContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
});

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatedData, setUpdatedData] = useState({
    shopName: "",
    ownerName: "",
    address: "",
    phone: "",
  });
  //const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        //const token = localStorage.getItem("token");
        const stationaryId = localStorage.getItem("stationaryId");
        const response = await axios.get(`http://localhost:5001/api/stationary/profile/${stationaryId}`);
        setProfile(response.data);
        setUpdatedData({
          shopName: response.data.shopName,
          ownerName: response.data.ownerName,
          address: response.data.address,
          phone: response.data.phone,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.id]);

  const handleInputChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  /*const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };*/

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Authentication token missing. Please log in again.");
      return;
    }
  
    try {
      await axios.put("http://localhost:5001/api/stationary/update", updatedData, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // ✅ Ensure token is included
        },
      });
  
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };  

  if (loading) return <CircularProgress />;

  return (
    <ProfileContainer>
      <Avatar
  src={profile?.profilePic || "/default-avatar.png"}  // ✅ Use a local default image
  sx={{ width: 100, height: 100, marginBottom: 2 }}
/>
      {/*<input type="file" accept="image/*" onChange={handleFileChange} />*/}
      <TextField label="Shop Name" name="shopName" value={updatedData.shopName} onChange={handleInputChange} fullWidth margin="normal" />
      <TextField label="Owner Name" name="ownerName" value={updatedData.ownerName} onChange={handleInputChange} fullWidth margin="normal" />
      <TextField label="Address" name="address" value={updatedData.address} onChange={handleInputChange} fullWidth margin="normal" />
      <TextField label="Phone" name="phone" value={updatedData.phone} onChange={handleInputChange} fullWidth margin="normal" />
      <Button variant="contained" onClick={handleUpdateProfile} sx={{ marginTop: 2 }}>Save Changes</Button>
      <Button variant="outlined" color="error" onClick={logout} sx={{ marginTop: 2 }}>Logout</Button>
    </ProfileContainer>
  );
};
export default ProfilePage;
