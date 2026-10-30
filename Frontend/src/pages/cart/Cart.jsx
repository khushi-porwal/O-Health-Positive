
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/layout/Navbar/Navbar";
import MainHeader from "../../components/layout/Header/Header";
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";
import Footer from "../../components/layout/Footer/Footer";

import impact from "../../assets/live.png";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "../../services/cartService";

import "./Cart.css";

function extractCart(response) {
  // Supports both wrapped and direct API responses.
  const cart =
    response?.cart ??
    response?.data?.cart ??
    response?.data ??
    response;

  const rawItems = Array.isArray(cart?.items) ? cart.items : [];

  return rawItems.map((item) => ({
    ...item,
    vendorId: String(item.vendorId?._id ?? item.vendorId ?? ""),
    productId: String(
      item.itemId?._id ??
        item.itemId ??
        item.productId?._id ??
        item.productId ??
        ""
    ),
    quantity: Number(item.quantity) || 1,
    price: Number(item.price) || 0,
    stock: Number(item.stock) || 0,
  }));
}

function getItemKey(item) {
  return `${item.vendorId}-${item.productId}`;
}

function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingKey, setUpdatingKey] = useState(null);
  const [removingKey, setRemovingKey] = useState(null);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(price) || 0);

  const fetchCart = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }

    setError("");

    try {
      const response = await getCart();
      setItems(extractCart(response));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your cart. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (item, change) => {
    const key = getItemKey(item);
    const nextQuantity = item.quantity + change;

    if (nextQuantity < 1) return;

    if (nextQuantity > item.stock) {
      setError(`Only ${item.stock} units are available for ${item.name}.`);
      return;
    }

    setUpdatingKey(key);
    setError("");

    try {
      await updateCartItem({
        vendorId: item.vendorId,
        itemId: item.productId,
        quantity: nextQuantity,
      });

      await fetchCart(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update quantity. Please try again."
      );
    } finally {
      setUpdatingKey(null);
    }
  };

  const removeItem = async (item) => {
    const key = getItemKey(item);

    setRemovingKey(key);
    setError("");

    try {
      await removeCartItem({
        vendorId: item.vendorId,
        itemId: item.productId,
      });

      await fetchCart(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to remove this product. Please try again."
      );
    } finally {
      setRemovingKey(null);
    }
  };

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />
      <CrowdfundingHeader />
      <MainHeader />

      <main className="cart-page">
        <div className="cart-container">
          <button
            className="cart-back-btn"
            type="button"
            onClick={() => navigate(-1)}
          >
            ← Continue Shopping
          </button>

          <div className="cart-heading">
            <div>
              <span className="cart-eyebrow">
                O POSITIVE HEALTH FOUNDATION
              </span>
              <h1>My Shopping Cart</h1>
              <p>
                Shop with purpose. Support local vendors and
                their livelihoods.
              </p>
            </div>

            <span className="cart-count">
              {totalQuantity}{" "}
              {totalQuantity === 1 ? "item" : "items"}
            </span>
          </div>

          {error && (
            <div className="cart-error" role="alert">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => fetchCart()}
                disabled={loading}
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <section className="cart-empty">
              <h2>Loading your cart...</h2>
              <p>Please wait while we fetch your products.</p>
            </section>
          ) : items.length === 0 ? (
            <section className="cart-empty">
              <div className="cart-empty-icon">🛍️</div>
              <h2>Your cart is empty</h2>
              <p>
                You haven't added any products to your cart yet.
              </p>
              <button
                className="cart-primary-btn"
                type="button"
                onClick={() => navigate("/vendor")}
              >
                Explore Vendors
              </button>
            </section>
          ) : (
            <div className="cart-layout">
              <section className="cart-items">
                {items.map((item) => {
                  const key = getItemKey(item);
                  const isUpdating = updatingKey === key;
                  const isRemoving = removingKey === key;
                  const unavailable =
                    item.unavailable || item.stock < item.quantity;

                  return (
                    <article className="cart-item" key={key}>
                      <img
                        className="cart-item-image"
                        src={item.image || impact}
                        alt={item.name || "Product"}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = impact;
                        }}
                      />

                      <div className="cart-item-info">
                        <h3>{item.name || "Product"}</h3>

                        <p className="cart-vendor-name">
                          Sold by {item.vendorName || "Local Vendor"}
                        </p>

                        <strong className="cart-item-price">
                          {formatPrice(item.price)}
                        </strong>

                        <p>
                          {item.stock > 0
                            ? `${item.stock} available`
                            : "Out of stock"}
                        </p>

                        {unavailable && (
                          <p className="cart-error">
                            Please adjust the quantity or remove
                            this unavailable item before checkout.
                          </p>
                        )}

                        <div className="cart-item-actions">
                          <div className="cart-quantity">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              disabled={isUpdating || isRemoving || item.quantity <= 1}
                              onClick={() => updateQuantity(item, -1)}
                            >
                              −
                            </button>

                            <span>{item.quantity}</span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              disabled={
                                isUpdating ||
                                isRemoving ||
                                item.quantity >= item.stock
                              }
                              onClick={() => updateQuantity(item, 1)}
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="cart-remove-btn"
                            type="button"
                            disabled={isRemoving || isUpdating}
                            onClick={() => removeItem(item)}
                          >
                            {isRemoving ? "Removing..." : "Remove"}
                          </button>
                        </div>
                      </div>

                      <strong className="cart-line-total">
                        {formatPrice(item.price * item.quantity)}
                      </strong>
                    </article>
                  );
                })}
              </section>

              <aside className="cart-summary">
                <h2>Order Summary</h2>

                <div className="cart-summary-row">
                  <span>Items ({totalQuantity})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="cart-summary-row">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="cart-summary-total">
                  <span>Subtotal</span>
                  <strong>{formatPrice(subtotal)}</strong>
                </div>

                <button
                  className="cart-primary-btn cart-checkout-btn"
                  type="button"
                  disabled={
                    items.length === 0 ||
                    items.some(
                      (item) =>
                        item.unavailable ||
                        item.stock < item.quantity ||
                        item.stock <= 0
                    ) ||
                    Boolean(updatingKey) ||
                    Boolean(removingKey)
                  }
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout →
                </button>

                <p className="cart-secure-note">
                  Your final payable amount will be confirmed at
                  checkout.
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

export default Cart;
