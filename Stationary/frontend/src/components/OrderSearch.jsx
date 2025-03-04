import React from "react";
import { TextField } from "@mui/material";

const OrderSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <TextField 
      label="Search Orders" 
      variant="outlined" 
      fullWidth 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search by customer name or order ID"
      style={{ marginBottom: "20px" }}
    />
  );
};

export default OrderSearch;
