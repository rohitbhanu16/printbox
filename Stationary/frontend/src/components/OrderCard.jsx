import React, { useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

const OrderCard = ({ order }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const openFullPDF = () => {
    window.open(order.documents[0], "_blank");
  };

  return (
    <Card sx={{ marginBottom: 2, cursor: "pointer" }} onClick={openFullPDF}>
      <CardContent>
        <Typography variant="h6">Order from: {order.userName}</Typography>
        <Typography variant="body2">Notes: {order.notes}</Typography>
        <div style={{ margin: "10px 0" }}>
          <Document file={order.documents[0]} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={1} width={200} />
          </Document>
          <Typography variant="caption">Click to view full PDF</Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
