import React from "react";
import { TextField } from "@mui/material";

const CalendarFilter = ({ selectedDate, setSelectedDate }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <TextField 
        label="Filter by Date" 
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
    </div>
  );
};

export default CalendarFilter;
