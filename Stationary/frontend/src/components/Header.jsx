import React, { useState, useContext } from "react";
import { AppBar, Toolbar, IconButton, Avatar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import { Toaster } from "react-hot-toast";

const Header = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />

      <Notification />

      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Avatar */}
          <IconButton onClick={() => navigate("/profile")}>
            <Avatar src={user?.profilePic || "/default-avatar.png"} />
          </IconButton>

          {/* App Name */}
          <Typography variant="h6">Stationary Dashboard</Typography>

          {/* Menu Icon (Opens Sidebar) */}
          <IconButton onClick={() => setSidebarOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;
