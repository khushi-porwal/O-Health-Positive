import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMyOrderById } from "../services/orderService";
import "./MyOrder.css";

const formatStatus = (status = "") =>
  status.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function MyOrder() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Order details load nahi ho sake."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) loadOrder();
  }, [id]);

  if (loading) {
    return <main className="my-order-page">Loading order details...</main>;
  }

  if (error || !order) {
    return (
      <main className="my-order-page">
        <h1>Order not found</h1>
        <p>{error || "Ye order aapke account mein nahi mila."}</p>
        <Link to="/my-orders">Back to My Orders</Link>
      </main>
    );
  }

  const trackingSteps = [
    "confirmed",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
  ];

  const currentStep = trackingSteps.indexOf(order.orderStatus);

  return (
    <main className="my-order-page">
      <Link className="my-order-back" to="/my-orders">
        ← Back to My Orders
      </Link>

      <header className="my-order-heading">
        <div>
          <h1>Order Details</h1>
          <p>Order #{order.merchantOrderId || order._id}</p>
          <p>Placed on {formatDate(order.createdAt)}</p>
        </div>

        <span className="my-order-current-status">
          {formatStatus(order.orderStatus || "pending")}
        </span>
      </header>

      <section className="my-order-section">
        <h2>Order Tracking</h2>

        {order.orderStatus === "cancelled" ? (
          <p>This order has been cancelled.</p>
        ) : (
          <ol className="my-order-timeline">
            {trackingSteps.map((step, index) => {
              const isComplete = currentStep >= index;

              return (
                <li
                  key={step}
                  className={isComplete ? "completed" : ""}
                >
                  <span className="timeline-dot" />
                  <div>
                    <strong>{formatStatus(step)}</strong>
                    {order.trackingHistory
                      ?.filter((entry) => entry.status === step)
                      .map((entry, entryIndex) => (
                        <p key={`${step}-${entryIndex}`}>
                          {entry.message || formatDate(entry.updatedAt)}
                        </p>
                      ))}
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {order.estimatedDeliveryDate && (
          <p>
            Estimated delivery: {formatDate(order.estimatedDeliveryDate)}
          </p>
        )}

        {order.courierName && <p>Courier: {order.courierName}</p>}

        {order.trackingNumber && (
          <p>Tracking number: {order.trackingNumber}</p>
        )}

        {order.trackingUrl && (
          <a href={order.trackingUrl} target="_blank" rel="noreferrer">
            Track with courier
          </a>
        )}
      </section>

      <section className="my-order-section">
        <h2>Items</h2>

        {(order.items || []).map((item, index) => (
          <div
            className="my-order-detail-item"
            key={`${item.itemId || item.productName}-${index}`}
          >
            {item.image && (
              <img src={item.image} alt={item.productName} />
            )}

            <div>
              <h3>{item.productName}</h3>
              <p>Vendor: {item.vendorName}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Subtotal: ₹{Number(item.subtotal || 0).toLocaleString("en-IN")}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="my-order-section">
        <h2>Delivery Address</h2>
        <p>{order.deliveryDetails?.fullName}</p>
        <p>{order.deliveryDetails?.phone}</p>
        <p>{order.deliveryDetails?.address}</p>
        <p>
          {order.deliveryDetails?.city}, {order.deliveryDetails?.state}{" "}
          {order.deliveryDetails?.pincode}
        </p>
      </section>

      <section className="my-order-section">
        <h2>Payment</h2>
        <p>Payment status: {formatStatus(order.status)}</p>
        <p>
          Total amount:{" "}
          <strong>
            ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
          </strong>
        </p>
      </section>
    </main>
  );
}