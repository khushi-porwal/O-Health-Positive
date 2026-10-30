
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../../components/layout/Navbar/Navbar";
import MainHeader from "../../components/layout/Header/Header";
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";
import Footer from "../../components/layout/Footer/Footer";

import { getCart } from "../../services/cartService";
import impact from "../../assets/live.png";

import "./Checkout.css";

const API_URL = import.meta.env.VITE_API_URL;

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

function extractCart(response) {
  const cart =
    response?.cart ??
    response?.data?.cart ??
    response?.data ??
    response;

  return {
    items: Array.isArray(cart?.items) ? cart.items : [],
    totalAmount: Number(cart?.totalAmount) || 0,
  };
}

function Checkout() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(price) || 0);

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCart();
        const cart = extractCart(response);

        setItems(cart.items);

        const calculatedTotal = cart.items.reduce(
          (sum, item) =>
            sum +
            (Number(item.price) || 0) *
              (Number(item.quantity) || 0),
          0
        );

        setTotalAmount(calculatedTotal);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load cart. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const {
      fullName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
    } = form;

    if (
      !fullName.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      setError("Please fill all required delivery details.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      setError("Enter a valid 6-digit pincode.");
      return;
    }

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      setError("Enter a valid email address.");
      return;
    }

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post(
        `${API_URL}/orders/checkout`,
        {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const checkoutUrl = response.data?.redirectUrl;

      if (!checkoutUrl) {
        throw new Error(
          "Payment URL was not received. Please try again."
        );
      }

      // Redirect to PhonePe checkout.
      window.location.assign(checkoutUrl);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start payment. Please try again."
      );
      setSubmitting(false);
    }
  };

  const unavailableItems = items.some(
    (item) =>
      item.unavailable ||
      Number(item.stock) < Number(item.quantity) ||
      Number(item.stock) <= 0
  );

  return (
    <>
      <Navbar />
      <CrowdfundingHeader />
      <MainHeader />

      <main className="checkout-page">
        <div className="checkout-container">

          <button
            type="button"
            className="checkout-back-btn"
            onClick={() => navigate("/cart")}
            disabled={submitting}
          >
            ← Back to Cart
          </button>

          <div className="checkout-heading">
            <span>O POSITIVE HEALTH FOUNDATION</span>
            <h1>Secure Checkout</h1>
            <p>
              Complete your delivery details and proceed
              with secure PhonePe payment.
            </p>
          </div>

          {error && (
            <div className="checkout-error" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="checkout-loading">
              Loading your order details...
            </div>
          ) : items.length === 0 ? (
            <div className="checkout-empty">
              <h2>Your cart is empty</h2>
              <p>Add products before proceeding to checkout.</p>

              <button
                type="button"
                onClick={() => navigate("/vendor")}
              >
                Explore Vendors
              </button>
            </div>
          ) : (
            <div className="checkout-layout">

              {/* DELIVERY FORM */}
              <form
                className="checkout-form"
                onSubmit={handleSubmit}
              >
                <h2>Delivery Information</h2>

                <div className="checkout-form-grid">

                  <div className="checkout-field full-width">
                    <label htmlFor="fullName">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.fullName}
                      onChange={handleChange}
                      maxLength={100}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="phone">
                      Mobile Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={handleChange}
                      maxLength={10}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </div>

                  <div className="checkout-field full-width">
                    <label htmlFor="address">
                      Complete Address *
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      placeholder="House number, street, area..."
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      maxLength={500}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="city">City *</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Enter city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="state">State *</label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      placeholder="Enter state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="pincode">
                      Pincode *
                    </label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      inputMode="numeric"
                      placeholder="6-digit pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      required
                      disabled={submitting}
                    />
                  </div>

                </div>

                <div className="checkout-payment-info">
                  <div className="checkout-payment-icon">
                    <img
                      src="https://www.phonepe.com/webstatic/3761/static/phonepe-logo.svg"
                      alt="PhonePe"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <div>
                    <strong>Secure Payment with PhonePe</strong>
                    <p>
                      You will be redirected to PhonePe to
                      complete your payment.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="checkout-pay-btn"
                  disabled={
                    submitting ||
                    loading ||
                    !items.length ||
                    unavailableItems
                  }
                >
                  {submitting
                    ? "Redirecting to PhonePe..."
                    : `Pay ${formatPrice(totalAmount)} →`}
                </button>

                {unavailableItems && (
                  <p className="checkout-stock-error">
                    Some products are unavailable or have
                    insufficient stock. Please update your cart.
                  </p>
                )}

                <p className="checkout-secure-text">
                  Your order will be confirmed only after
                  successful payment verification.
                </p>
              </form>

              {/* ORDER SUMMARY */}
              <aside className="checkout-summary">
                <h2>Your Order</h2>

                <div className="checkout-products">
                  {items.map((item, index) => (
                    <div
                      className="checkout-product"
                      key={`${item.vendorId}-${item.itemId || item.productId}-${index}`}
                    >
                      <img
                        src={item.image || impact}
                        alt={item.name || "Product"}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = impact;
                        }}
                      />

                      <div className="checkout-product-details">
                        <strong>{item.name || "Product"}</strong>
                        <span>
                          Qty: {item.quantity}
                        </span>
                        <span>
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      <strong>
                        {formatPrice(
                          Number(item.price) *
                            Number(item.quantity)
                        )}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="checkout-summary-total">
                  <span>Total Payable</span>
                  <strong>{formatPrice(totalAmount)}</strong>
                </div>

                <p className="checkout-summary-note">
                  Final amount is calculated and validated
                  again by our secure backend.
                </p>
              </aside>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Checkout;
