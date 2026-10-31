import { useEffect, useState } from "react";
import {
  getAdminOrders,
  getAdminOrderDetails,
  updateAdminOrderStatus,
} from "../../../services/adminOrderService";
import "./ManageOrders.css";

const DELIVERY_STATUSES = [
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const formatStatus = (status = "") =>
  status.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

const formatDate = (date) =>
  date ? new Date(date).toLocaleString() : "—";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    orderStatus: "",
    courierName: "",
    trackingNumber: "",
    trackingUrl: "",
    estimatedDeliveryDate: "",
    message: "",
  });

  const loadOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAdminOrders({
        page,
        limit: 10,
        ...(paymentStatus && { paymentStatus }),
        ...(orderStatus && { orderStatus }),
      });

      setOrders(result.orders || []);
      setPagination(result.pagination || null);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // loadOrders is intentionally driven by these filter/page values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, paymentStatus, orderStatus]);

  const openOrder = async (id) => {
    setError("");
    setNotice("");

    try {
      const result = await getAdminOrderDetails(id);
      const order = result.order;
      setSelectedOrder(order);
      setForm({
        orderStatus: order.orderStatus || "confirmed",
        courierName: order.courierName || "",
        trackingNumber: order.trackingNumber || "",
        trackingUrl: order.trackingUrl || "",
        estimatedDeliveryDate: order.estimatedDeliveryDate
          ? new Date(order.estimatedDeliveryDate).toISOString().slice(0, 10)
          : "",
        message: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Could not load order details.");
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!selectedOrder) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const result = await updateAdminOrderStatus(selectedOrder._id, {
        ...form,
        estimatedDeliveryDate: form.estimatedDeliveryDate || null,
      });

      setSelectedOrder(result.order);
      setNotice(result.message || "Order updated.");
      await loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="manage-orders">
      <header className="manage-orders__header">
        <div>
          <h2>Manage Orders</h2>
          <p>View orders and update delivery progress.</p>
        </div>
        <button type="button" onClick={loadOrders} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      <div className="manage-orders__filters">
        <label>
          Payment
          <select
            value={paymentStatus}
            onChange={(event) => {
              setPage(1);
              setPaymentStatus(event.target.value);
            }}
          >
            <option value="">All payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>

        <label>
          Order status
          <select
            value={orderStatus}
            onChange={(event) => {
              setPage(1);
              setOrderStatus(event.target.value);
            }}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            {DELIVERY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
      </div>

      {error && <p className="manage-orders__error">{error}</p>}
      {notice && <p className="manage-orders__notice">{notice}</p>}

      <div className="manage-orders__table-wrap">
        <table className="manage-orders__table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Delivery</th>
              <th>Placed</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Loading orders…</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="7">No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.merchantOrderId || order._id}</td>
                  <td>
                    {order.deliveryDetails?.fullName || "—"}
                    <small>{order.deliveryDetails?.email || ""}</small>
                  </td>
                  <td>
                    {order.currency || "INR"}{" "}
                    {Number(order.totalAmount || 0).toLocaleString()}
                  </td>
                  <td>{formatStatus(order.status)}</td>
                  <td>{formatStatus(order.orderStatus || "pending")}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <button type="button" onClick={() => openOrder(order._id)}>
                      View / Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="manage-orders__pagination">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => setPage((current) => current - 1)}
        >
          Previous
        </button>
        <span>
          Page {pagination?.currentPage || page} of {pagination?.totalPages || 1}
        </span>
        <button
          type="button"
          disabled={!pagination || page >= pagination.totalPages || loading}
          onClick={() => setPage((current) => current + 1)}
        >
          Next
        </button>
      </div>

      {selectedOrder && (
        <div className="manage-orders__modal-backdrop">
          <section
            className="manage-orders__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="manage-order-title"
          >
            <div className="manage-orders__modal-header">
              <h3 id="manage-order-title">Order details</h3>
              <button type="button" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>

            <p>
              <strong>Order ID:</strong>{" "}
              {selectedOrder.merchantOrderId || selectedOrder._id}
            </p>
            <p>
              <strong>Customer:</strong>{" "}
              {selectedOrder.deliveryDetails?.fullName || "—"}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {[
                selectedOrder.deliveryDetails?.address,
                selectedOrder.deliveryDetails?.city,
                selectedOrder.deliveryDetails?.state,
                selectedOrder.deliveryDetails?.pincode,
              ]
                .filter(Boolean)
                .join(", ") || "—"}
            </p>

            <form onSubmit={handleSave} className="manage-orders__form">
              <label>
                Delivery status
                <select
                  required
                  value={form.orderStatus}
                  onChange={(event) =>
                    setForm({ ...form, orderStatus: event.target.value })
                  }
                >
                  {DELIVERY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {formatStatus(status)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Courier name
                <input
                  value={form.courierName}
                  onChange={(event) =>
                    setForm({ ...form, courierName: event.target.value })
                  }
                />
              </label>

              <label>
                Tracking number
                <input
                  value={form.trackingNumber}
                  onChange={(event) =>
                    setForm({ ...form, trackingNumber: event.target.value })
                  }
                />
              </label>

              <label>
                Tracking URL
                <input
                  type="url"
                  value={form.trackingUrl}
                  onChange={(event) =>
                    setForm({ ...form, trackingUrl: event.target.value })
                  }
                />
              </label>

              <label>
                Estimated delivery
                <input
                  type="date"
                  value={form.estimatedDeliveryDate}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      estimatedDeliveryDate: event.target.value,
                    })
                  }
                />
              </label>

              <label>
                Update message
                <input
                  value={form.message}
                  onChange={(event) =>
                    setForm({ ...form, message: event.target.value })
                  }
                />
              </label>

              <button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save update"}
              </button>
            </form>

            <h4>Tracking history</h4>
            {selectedOrder.trackingHistory?.length ? (
              <ol className="manage-orders__history">
                {selectedOrder.trackingHistory.map((entry, index) => (
                  <li key={`${entry.updatedAt}-${index}`}>
                    <strong>{formatStatus(entry.status)}</strong>
                    <span>{entry.message}</span>
                    <small>{formatDate(entry.updatedAt)}</small>
                  </li>
                ))}
              </ol>
            ) : (
              <p>No tracking updates yet.</p>
            )}
          </section>
        </div>
      )}
    </section>
  );
}