
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVendorProducts } from "../../services/vendorApi";
import impact from "../../assets/live.png";
import "./VendorProducts.css";
import Footer from "../../components/layout/Footer/Footer"
import Navbar from "../../components/layout/Navbar/Navbar"
import MainHeader from "../../components/layout/Header/Header";
import { addToCart } from "../../services/cartService";
import CrowdfundingHeader from "../../components/layout/Crowdfund/CrowdfundingHeader";
function VendorProducts() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingProductId, setAddingProductId] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getVendorProducts(id);

        if (!active) return;

        if (data.success === false) {
          throw new Error(
            data.message || "Unable to load vendor products."
          );
        }

        setVendor(data.vendor || null);
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load products. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(price) || 0);

  if (loading) {
    return (
      <main className="vendor-products-page">
        <p className="vp-message">Loading vendor products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="vendor-products-page">
        <button className="vp-back-btn" onClick={() => navigate(-1)}>
          ← Back to Vendors
        </button>

        <div className="vp-message" role="alert">
          <h2>Products could not be loaded</h2>
          <p>{error}</p>
          <button
            className="vp-primary-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!vendor) {
    return (
      <main className="vendor-products-page">
        <div className="vp-message">
          <h2>Vendor not found</h2>
          <button
            className="vp-primary-btn"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  


const handleAddToCart = async (item) => {
  if (Number(item.stock) <= 0) {
    alert("This product is out of stock.");
    return;
  }

  try {
    setAddingProductId(item._id);

    await addToCart({
      vendorId: vendor._id || id,
      itemId: item._id,
      quantity: 1,
    });

    navigate("/cart");
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Unable to add product to cart. Please try again."
    );
  } finally {
    setAddingProductId(null);
  }
};
  return (
    <>
    <Navbar/>
    <CrowdfundingHeader/>
    <MainHeader/>
   
    <main className="vendor-products-page">
      <div className="vp-container">
        <button className="vp-back-btn" onClick={() => navigate(-1)}>
          ← Back to Vendors
        </button>

        <section className="vp-vendor-banner">
          <img
            className="vp-vendor-image"
            src={vendor.image || impact}
            alt={vendor.name || "Vendor"}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = impact;
            }}
          />

          <div className="vp-vendor-info">
            <span className="vp-eyebrow">
              O POSITIVE HEALTH FOUNDATION
            </span>

            <h1>{vendor.title || vendor.name}</h1>

            <p className="vp-location">
              <span aria-hidden="true">📍</span>{" "}
              {vendor.city || "India"}
            </p>

            {vendor.category && (
              <span className="vp-category">
                {vendor.category}
              </span>
            )}

            {vendor.story && (
              <p className="vp-story">{vendor.story}</p>
            )}
          </div>
        </section>

        <section className="vp-products-section">
          <div className="vp-section-heading">
            <div>
              <span className="vp-eyebrow">SHOP WITH PURPOSE</span>
              <h2>Products by {vendor.name || "this vendor"}</h2>
              <p>
                Every purchase helps support local vendors and their
                livelihoods.
              </p>
            </div>

            <span className="vp-product-count">
              {items.length} {items.length === 1 ? "Product" : "Products"}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="vp-empty">
              <div className="vp-empty-icon">🛍️</div>
              <h3>Products coming soon!</h3>
              <p>
                This vendor has not added any available products yet.
                Please check back soon.
              </p>
            </div>
          ) : (
            <div className="vp-products-grid">
              {items.map((item, index) => {
                const inStock = Number(item.stock) > 0;

                return (
                  <article
                    className="vp-product-card"
                    key={item._id || `${item.name}-${index}`}
                  >
                    <div className="vp-product-image-wrap">
                      <img
                        className="vp-product-image"
                        src={item.image || impact}
                        alt={item.name || "Vendor product"}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = impact;
                        }}
                      />

                      <span
                        className={`vp-stock-badge ${
                          inStock ? "in-stock" : "out-of-stock"
                        }`}
                      >
                        {inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    <div className="vp-product-content">
                      <h3>{item.name}</h3>

                      <p className="vp-product-description">
                        {item.description ||
                          "A product offered by our local vendor."}
                      </p>

                      <div className="vp-product-footer">
                        <strong className="vp-price">
                          {formatPrice(item.price)}
                        </strong>

                        <span className="vp-stock-count">
                          {inStock
                            ? `${item.stock} available`
                            : "Currently unavailable"}
                        </span>
                      </div>
                    </div>


<button
  className="vp-buy-now-btn"
  type="button"
  disabled={!inStock || addingProductId === item._id}
  onClick={() => handleAddToCart(item)}
>
  {!inStock
    ? "Out of Stock"
    : addingProductId === item._id
    ? "Adding..."
    : "Buy Now"}
</button>


                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
    <Footer/>
    </>
  );
}

export default VendorProducts;
