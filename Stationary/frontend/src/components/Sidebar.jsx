import React, { useState, useContext } from "react";
import { Drawer, List, ListItem, Button, Select, MenuItem, Divider } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import OrderContext from "../context/OrderContext";
import axios from "axios";
import dayjs from "dayjs";

const Sidebar = ({ open, onClose, setFilteredOrders }) => {
  const { setOrders } = useContext(OrderContext);
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));
  const [status, setStatus] = useState("");

  const handleFilterOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const stationaryId = localStorage.getItem("stationaryId");

      if (!token || !stationaryId) return alert("Session expired! Please log in again.");

      const response = await axios.get("http://localhost:5001/api/orders", {
        params: {
          stationary: stationaryId,
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD"),
          status: status || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Filtered Orders:", response.data);
      setOrders(response.data); // Update context
      setFilteredOrders(response.data); // Update Dashboard
      onClose(); // Close sidebar
    } catch (error) {
      console.error("❌ Error fetching filtered orders:", error);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <List>
        <ListItem>Filter Orders</ListItem>
        <Divider />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ListItem>
            <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
          </ListItem>
          <ListItem>
            <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
          </ListItem>
        </LocalizationProvider>
        <ListItem>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
            <MenuItem value="">All Orders</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="ready">Ready</MenuItem>
          </Select>
        </ListItem>
        <ListItem>
          <Button variant="contained" onClick={handleFilterOrders}>
            Apply Filter
          </Button>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
