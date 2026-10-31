import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../services/orderService";
import "./MyOrders.css";
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";
import Footer from "../../components/layout/Footer/Footer"
import MainHeader from "../../components/layout/Header/Header";
import Navbar from "../../components/layout/Navbar/Navbar";
const formatStatus = (status = "") =>
  status.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Orders load nahi ho sake. Please dobara try karein."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="my-orders-page">
        <p className="my-orders-message">Loading your orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-orders-page">
        <h1>My Orders</h1>
        <p className="my-orders-error">{error}</p>
        <button type="button" onClick={loadOrders}>
          Try Again
        </button>
      </main>
    );
  }

  return (
    <>
     <Navbar />
      <CrowdfundingHeader />
      <MainHeader />
   
    <main className="my-orders-page">
      <header className="my-orders-header">
  <div>
    <h1>My Orders</h1>
    <p>View your purchases and check their delivery status.</p>
  </div>

  <div className="my-orders-header-actions">
    <button type="button" onClick={loadOrders}>
      Refresh
    </button>

    <Link className="my-orders-shop-link" to="/vendor">
      Continue Shopping
    </Link>
  </div>
</header>

      {orders.length === 0 ? (
        <section className="my-orders-empty">
          <h2>No orders yet</h2>
          <p>Your orders will appear here after you place an order.</p>
        </section>
      ) : (
        <section className="my-orders-list">
          {orders.map((order) => (
            <article className="my-order-card" key={order._id}>
              <div className="my-order-top">
                <div>
                  <h2>Order #{order.merchantOrderId || order._id}</h2>
                  <p>Placed on {formatDate(order.createdAt)}</p>
                </div>

                <span className="my-order-current-status">
                  {formatStatus(order.orderStatus || "pending")}
                </span>
              </div>

              <div className="my-orders-items">
                {(order.items || []).map((item, index) => (
                  <div
                    className="my-orders-item"
                    key={`${item.itemId || item.productName}-${index}`}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.productName} />
                    ) : (
                      <div className="my-orders-image-placeholder">
                        No image
                      </div>
                    )}

                    <div>
                      <h3>{item.productName}</h3>
                      <p>Qty: {item.quantity}</p>
                      <p>
                        ₹{Number(item.subtotal || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-orders-bottom">
                <div>
                  <p>
                    Payment: <strong>{formatStatus(order.status)}</strong>
                  </p>
                  <p>
                    Total:{" "}
                    <strong>
                      ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                    </strong>
                  </p>
                </div>

                <Link
                  className="my-orders-track-link"
                  to={`/my-orders/${order._id}`}
                >
                  View Details / Track Order
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
    <Footer/>
     </>
  );
}