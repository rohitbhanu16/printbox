import { useEffect, useState, useContext } from "react";
import { Container, Typography, Button, CircularProgress } from "@mui/material";
import OrderContext from "../context/OrderContext";
import AuthContext from "../context/AuthContext";
import NotificationPopup from "../components/NotificationPopup";
import SearchBar from "../components/SearchBar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { orders, setOrders, newOrder } = useContext(OrderContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [popupOrder, setPopupOrder] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const stationaryId = localStorage.getItem("stationaryId");
        if (!token || !stationaryId) return;

        const response = await axios.get(
          `http://localhost:5000/api/orders?stationary=${stationaryId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders); // Initially show all orders
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [setOrders]);

  // Show new order notification & instantly add to top
  useEffect(() => {
    if (newOrder) {
      setPopupOrder(newOrder);
      setOrders((prev) => [newOrder, ...prev]);
      setFilteredOrders((prev) => [newOrder, ...prev]);
      setTimeout(() => setPopupOrder(null), 5000);
    }
  }, [newOrder, setOrders]);

  // Mark order as ready
  const markOrderReady = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/ready`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "ready" } : order
        )
      );

      setFilteredOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "ready" } : order
        )
      );
    } catch (error) {
      setError("Failed to update order status.");
    }
  };

  // Handle search input change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    filterOrders(query, null);
  };

  // Handle sidebar filter changes
  const handleSidebarFilter = (filteredOrders) => {
    setFilteredOrders(filteredOrders);
  };

  // Search & Filter Orders
  const filterOrders = (query, sidebarFilteredOrders) => {
    let result = sidebarFilteredOrders || orders;

    if (query.trim() !== "") {
      result = result.filter((order) =>
        order.user?.name?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredOrders(result);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      {popupOrder && <NotificationPopup order={popupOrder} />}
      <Typography
        variant="h4"
        className="dashboard-title"
        textAlign={"center"}
        margin={4}
      >
        Orders
      </Typography>

      <div className="searchAndFilter">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        <Button variant="outlined" onClick={() => setSidebarOpen(true)}>
          Filter Orders
        </Button>
      </div>

      {/* Sidebar Component */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        setFilteredOrders={handleSidebarFilter}
      />

      <div className="order-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <Typography>
                <strong>User:</strong> {order.user?.name || "Unknown"}
              </Typography>
              <Typography>
                <strong>Preferences:</strong> {order.preferences.size},{" "}
                {order.preferences.color}, {order.preferences.sides},{" "}
                {order.preferences.urgency}
              </Typography>
              <Typography>
                <strong>Notes:</strong> {order.notes || "No notes"}
              </Typography>
              <Typography>
                <strong>Status:</strong> {order.status}
              </Typography>
              <Typography>
                <strong>Copies:</strong> {order.preferences.numberofCopies}
              </Typography>
              <Typography>
                <strong>Created At:</strong> {order.createdAt}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={() => markOrderReady(order._id)}
                disabled={order.status === "ready"}
              >
                Mark as Ready
              </Button>

              {order.documents.length > 0 && (
                <div
                  className="pdf-preview"
                  onClick={() => window.open(order.documents[0], "_blank")}
                >
                  <iframe
                    src={`${order.documents[0]}#toolbar=0&navpanes=0&scrollbar=0`}
                    width="150"
                    height="200"
                    title="PDF Preview"
                  />
                </div>
              )}

              {/* ✅ Open PDF in Default Viewer */}
              {order.documents.length > 0 && (
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ marginTop: 1 }}
                  onClick={() => window.open(order.documents[0], "_blank")}
                >
                  Open in PDF Viewer
                </Button>
              )}
            </div>
          ))
        ) : (
          <Typography>No orders found</Typography>
        )}
      </div>
    </Container>
  );
};

export default Dashboard;
