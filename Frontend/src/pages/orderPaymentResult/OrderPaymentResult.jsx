
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import Navbar from "../../components/layout/Navbar/Navbar";
import MainHeader from "../../components/layout/Header/Header";
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";
import Footer from "../../components/layout/Footer/Footer";

import "./OrderPaymentResult.css";

const API_URL = import.meta.env.VITE_API_URL;

function OrderPaymentResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const merchantOrderId = searchParams.get("merchantOrderId");

  const [status, setStatus] = useState("checking");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const verifyPayment = useCallback(async () => {
    if (!merchantOrderId) {
      setStatus("error");
      setError("Order reference is missing from the payment URL.");
      return;
    }

    try {
      setStatus("checking");
      setError("");

      const response = await axios.get(
        `${API_URL}/orders/${encodeURIComponent(
          merchantOrderId
        )}/status`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      setOrder(data);

      const paymentStatus = String(data.status || "").toLowerCase();

      if (paymentStatus === "paid") {
        setStatus("success");
      } else if (
        paymentStatus === "failed" ||
        paymentStatus === "cancelled"
      ) {
        setStatus("failed");
      } else {
        setStatus("pending");
      }
    } catch (err) {
      setStatus("error");
      setError(
        err.response?.data?.message ||
          "Unable to verify payment. Please try again."
      );
    }
  }, [merchantOrderId]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(price) || 0);

  return (
    <>
      <Navbar />
      <CrowdfundingHeader />
      <MainHeader />

      <main className="order-result-page">
        <section className="order-result-card">

          {status === "checking" && (
            <>
              <div className="order-result-loader" />
              <h1>Verifying Your Payment</h1>
              <p>
                Please wait while we confirm your payment
                with PhonePe. Do not close this page.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="order-result-icon success">
                ✓
              </div>

              <span className="order-result-label">
                PAYMENT SUCCESSFUL
              </span>

              <h1>Thank You for Your Order!</h1>

              <p>
                Your payment has been successfully verified.
                Your order is now confirmed.
              </p>

              {order && (
                <div className="order-result-details">
                  <div>
                    <span>Order Reference</span>
                    <strong>{order.merchantOrderId}</strong>
                  </div>

                  <div>
                    <span>Amount Paid</span>
                    <strong>
                      {formatPrice(order.totalAmount)}
                    </strong>
                  </div>

                  <div>
                    <span>Payment Status</span>
                    <strong className="paid-text">Paid</strong>
                  </div>
                </div>
              )}

              <button
  type="button"
  onClick={() => navigate("/my-orders")}
>
  View My Orders
</button>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="order-result-icon failed">
                ×
              </div>

              <span className="order-result-label failed-label">
                PAYMENT FAILED
              </span>

              <h1>Payment Was Not Successful</h1>

              <p>
                Your payment could not be completed.
                Please check your order and try again.
              </p>

              {order?.merchantOrderId && (
                <p className="order-reference">
                  Order Reference: {order.merchantOrderId}
                </p>
              )}

              <button
                type="button"
                onClick={() => navigate("/cart")}
              >
                Return to Cart
              </button>
            </>
          )}

          {status === "pending" && (
            <>
              <div className="order-result-icon pending">
                !
              </div>

              <span className="order-result-label pending-label">
                PAYMENT PENDING
              </span>

              <h1>Payment Is Being Processed</h1>

              <p>
                We have not received final confirmation yet.
                Please check again in a moment.
              </p>

              <button
                type="button"
                onClick={verifyPayment}
              >
                Check Payment Status
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="order-result-icon failed">
                !
              </div>

              <h1>Unable to Verify Payment</h1>

              <p>{error}</p>

              <button
                type="button"
                onClick={verifyPayment}
              >
                Retry Verification
              </button>
            </>
          )}

          {merchantOrderId && (
            <p className="order-result-reference">
              Reference: {merchantOrderId}
            </p>
          )}

        </section>
      </main>

      <Footer />
    </>
  );
}

export default OrderPaymentResult;
