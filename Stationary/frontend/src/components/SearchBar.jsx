import React from "react";
import { TextField } from "@mui/material";

const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <TextField
      label="Search by User Name"
      variant="outlined"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
};

export default SearchBar;
