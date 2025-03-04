import { useEffect } from "react";
import { Document, Page, pdfjs} from "react-pdf";
import { Button, Typography } from "@mui/material";
import bellSound from "../assets/bellSound.mp3";
import "../styles/notification.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const NotificationPopup = ({ order }) => {
  useEffect(() => {
    const audio = new Audio(bellSound);
    audio.play();
  }, [order]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <Typography variant="h5">New Order Received</Typography>
        <Typography><strong>User:</strong> {order.user}</Typography>
        <Typography><strong>Preferences:</strong> {order.preferences.size}, {order.preferences.color}, {order.preferences.sides}, {order.preferences.urgency}</Typography>
        <Typography><strong>Notes:</strong> {order.notes || "No notes"}</Typography>
        <div className="pdf-preview">
          <Document file={order.documents[0]}>
            <Page pageNumber={1} width={250} />
          </Document>
        </div>
        <Button variant="contained" onClick={() => window.open(order.documents[0], "_blank")}>
          View Full Document
        </Button>
      </div>
    </div>
  );
};

export default NotificationPopup;