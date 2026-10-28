
import { useEffect, useState } from "react";
import {
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from "../../../services/vendorApi";
import "./ManageVendors.css";

const initialForm = {
  name: "",
  title: "",
  story: "",
  image: "",
  city: "",
  category: "",
  products: "",
  items: [],
  goalAmount: "",
  raisedAmount: "",
  supportersCount: "",
  isFeatured: false,
  status: "approved",
};

const createEmptyProduct = () => ({
  name: "",
  description: "",
  price: "",
  image: "",
  stock: "0",
  isActive: true,
});

function ManageVendors() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllVendors();

      setVendors(
        Array.isArray(response)
          ? response
          : response.vendors || response.data || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Vendors load nahi ho paaye."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Product field update
  const handleProductChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: value }
          : item
      ),
    }));
  };

  // Add another product
  const addProduct = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyProduct()],
    }));
  };

  // Remove product
  const removeProduct = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const resetForm = () => {
    setForm({
      ...initialForm,
      items: [],
    });
    setEditingId(null);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      // Validate product entries
      const validItems = [];

      for (let index = 0; index < form.items.length; index++) {
        const item = form.items[index];

        const isBlank =
          !item.name?.trim() &&
          !item.description?.trim() &&
          !item.price &&
          !item.image?.trim();

        // Ignore completely blank product cards
        if (isBlank) continue;

        if (!item.name?.trim()) {
          throw new Error(
            `Product ${index + 1}: product name required hai.`
          );
        }

        if (
          item.price === "" ||
          !Number.isFinite(Number(item.price)) ||
          Number(item.price) < 0
        ) {
          throw new Error(
            `Product ${index + 1}: valid price enter karein.`
          );
        }

        if (
          item.stock === "" ||
          !Number.isInteger(Number(item.stock)) ||
          Number(item.stock) < 0
        ) {
          throw new Error(
            `Product ${index + 1}: stock 0 ya positive whole number hona chahiye.`
          );
        }

        if (
          item.image?.trim() &&
          !/^https?:\/\/\S+$/i.test(item.image.trim())
        ) {
          throw new Error(
            `Product ${index + 1}: valid image URL enter karein.`
          );
        }

        validItems.push({
          ...(item._id ? { _id: item._id } : {}),
          name: item.name.trim(),
          description: item.description.trim(),
          price: Number(item.price),
          image: item.image.trim(),
          stock: Number(item.stock),
          isActive: Boolean(item.isActive),
        });
      }

      const payload = {
        name: form.name.trim(),
        title: form.title.trim(),
        story: form.story.trim(),
        image: form.image.trim(),
        city: form.city.trim(),
        category: form.category.trim(),

        // Existing product/service tags are preserved
        products: form.products
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        // Actual individual products
        items: validItems,

        goalAmount: Number(form.goalAmount || 0),
        raisedAmount: Number(form.raisedAmount || 0),
        supportersCount: Number(form.supportersCount || 0),
        isFeatured: Boolean(form.isFeatured),
        status: form.status,
      };

      if (editingId) {
        await updateVendor(editingId, payload);
      } else {
        await createVendor(payload);
      }

      const successMessage = editingId
        ? "Vendor aur products successfully update ho gaye."
        : "Vendor aur products successfully add ho gaye.";

      resetForm();
      setMessage(successMessage);

      await loadVendors();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Vendor save karte waqt error aaya."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (vendor) => {
    setEditingId(vendor._id);

    setForm({
      name: vendor.name || "",
      title: vendor.title || "",
      story: vendor.story || "",
      image: vendor.image || "",
      city: vendor.city || "",
      category: vendor.category || "",

      products: Array.isArray(vendor.products)
        ? vendor.products.join(", ")
        : vendor.products || "",

      items: Array.isArray(vendor.items)
        ? vendor.items.map((item) => ({
            _id: item._id,
            name: item.name || "",
            description: item.description || "",
            price: item.price ?? "",
            image: item.image || "",
            stock: item.stock ?? 0,
            isActive: item.isActive !== false,
          }))
        : [],

      goalAmount: vendor.goalAmount ?? "",
      raisedAmount: vendor.raisedAmount ?? "",
      supportersCount: vendor.supportersCount ?? "",
      isFeatured: Boolean(vendor.isFeatured),
      status: vendor.status || "approved",
    });

    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (vendor) => {
    const confirmed = window.confirm(
      `Kya aap "${vendor.title || vendor.name}" ko delete karna chahte hain?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteVendor(vendor._id);

      setVendors((prev) =>
        prev.filter((item) => item._id !== vendor._id)
      );

      if (editingId === vendor._id) {
        resetForm();
      }

      setMessage("Vendor delete ho gaya.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Vendor delete nahi ho paaya."
      );
    }
  };

  const handleFeatureToggle = async (vendor) => {
    try {
      setError("");
      setMessage("");

      await updateVendor(vendor._id, {
        isFeatured: !vendor.isFeatured,
        ...(!vendor.isFeatured ? { status: "approved" } : {}),
      });

      setMessage(
        !vendor.isFeatured
          ? "Vendor featured aur approved ho gaya."
          : "Vendor featured list se remove ho gaya."
      );

      await loadVendors();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Featured status update nahi hua."
      );
    }
  };

  return (
    <main className="manage-vendors-page">
      <header className="manage-vendors-header">
        <div>
          <p className="manage-vendors-eyebrow">ADMIN PANEL</p>
          <h1>Manage Vendors</h1>
          <p>
            Add, edit, publish aur featured vendors manage karein.
          </p>
        </div>

        <div className="vendor-count">
          <span>Total Vendors</span>
          <strong>{vendors.length}</strong>
        </div>
      </header>

      {message && (
        <div className="vendor-alert success" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="vendor-alert error" role="alert">
          {error}
        </div>
      )}

      <section className="vendor-form-card">
        <div className="vendor-section-heading">
          <div>
            <h2>{editingId ? "Edit Vendor" : "Add New Vendor"}</h2>
            <p>Vendor ki details fill karein.</p>
          </div>

          {editingId && (
            <button
              type="button"
              className="vendor-btn secondary"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="vendor-form">
          <label>
            Vendor Name *
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Vendor name"
            />
          </label>

          <label>
            Display Title *
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Title shown on website"
            />
          </label>

          <label>
            City *
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              placeholder="e.g. Delhi"
            />
          </label>

          <label>
            Category *
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              placeholder="e.g. Handicrafts"
            />
          </label>

          <label className="vendor-form-full">
            Story / Description *
            <textarea
              name="story"
              value={form.story}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Vendor ke baare mein likhein..."
            />
          </label>

          <label className="vendor-form-full">
            Vendor Image URL
            <input
              name="image"
              type="url"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/vendor.jpg"
            />
          </label>

          <label className="vendor-form-full">
            Products / Services Tags
            <input
              name="products"
              value={form.products}
              onChange={handleChange}
              placeholder="Handmade Bags, Clothing (comma separated)"
            />
            <small>
              Ye tags vendor card par dikhte hain. Individual products
              neeche add karein.
            </small>
          </label>

          {/* INDIVIDUAL PRODUCT MANAGEMENT */}
          <section className="vendor-products-admin vendor-form-full">
            <div className="vendor-products-admin-heading">
              <div>
                <h3>Products Management</h3>
                <p>
                  Is vendor ke products yahan add karein. Ye products
                  Buy Now page par dikhenge.
                </p>
              </div>

              <button
                type="button"
                className="vendor-btn secondary"
                onClick={addProduct}
              >
                + Add Another Product
              </button>
            </div>

            {form.items.length === 0 && (
              <div className="vendor-products-empty">
                <p>Abhi koi individual product add nahi hua hai.</p>
                <p>
                  Product add karne ke liye “Add Another Product”
                  button click karein.
                </p>
              </div>
            )}

            {form.items.map((item, index) => (
              <div className="vendor-product-admin-card" key={item._id || index}>
                <div className="vendor-product-admin-title">
                  <h4>Product {index + 1}</h4>

                  <button
                    type="button"
                    className="vendor-btn small danger"
                    onClick={() => removeProduct(index)}
                  >
                    Remove
                  </button>
                </div>

                <div className="vendor-product-admin-grid">
                  <label>
                    Product Name *
                    <input
                      value={item.name}
                      onChange={(e) =>
                        handleProductChange(index, "name", e.target.value)
                      }
                      placeholder="e.g. Handmade Cotton Bag"
                      required
                    />
                  </label>

                  <label>
                    Price (₹) *
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        handleProductChange(index, "price", e.target.value)
                      }
                      placeholder="e.g. 250"
                      required
                    />
                  </label>

                  <label className="vendor-product-admin-full">
                    Product Description
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        handleProductChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      rows={3}
                      placeholder="Product ke baare mein details..."
                    />
                  </label>

                  <label className="vendor-product-admin-full">
                    Product Image URL
                    <input
                      type="url"
                      value={item.image}
                      onChange={(e) =>
                        handleProductChange(index, "image", e.target.value)
                      }
                      placeholder="https://example.com/product.jpg"
                    />
                  </label>

                  <label>
                    Stock Quantity *
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={item.stock}
                      onChange={(e) =>
                        handleProductChange(index, "stock", e.target.value)
                      }
                      required
                    />
                  </label>

                  <label className="vendor-product-active">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={(e) =>
                        handleProductChange(
                          index,
                          "isActive",
                          e.target.checked
                        )
                      }
                    />
                    Show this product on vendor page
                  </label>
                </div>
              </div>
            ))}
          </section>

          <label>
            Goal Amount (₹)
            <input
              name="goalAmount"
              type="number"
              min="0"
              value={form.goalAmount}
              onChange={handleChange}
            />
          </label>

          <label>
            Raised Amount (₹)
            <input
              name="raisedAmount"
              type="number"
              min="0"
              value={form.raisedAmount}
              onChange={handleChange}
            />
          </label>

          <label>
            Supporters Count
            <input
              name="supportersCount"
              type="number"
              min="0"
              value={form.supportersCount}
              onChange={handleChange}
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>

          <label className="vendor-checkbox">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
            />
            Show in Featured Vendors
          </label>

          <div className="vendor-form-actions vendor-form-full">
            <button
              type="submit"
              className="vendor-btn primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Vendor"
                : "Add Vendor"}
            </button>

            <button
              type="button"
              className="vendor-btn secondary"
              onClick={resetForm}
            >
              Clear Form
            </button>
          </div>
        </form>
      </section>

      {/* EXISTING VENDOR LIST */}
      <section className="vendor-list-section">
        <div className="vendor-section-heading">
          <div>
            <h2>All Vendors</h2>
            <p>Yahan se existing vendors ko manage karein.</p>
          </div>

          <button
            className="vendor-btn secondary"
            type="button"
            onClick={loadVendors}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="vendor-empty-state">Loading vendors...</p>
        ) : vendors.length === 0 ? (
          <p className="vendor-empty-state">
            Abhi koi vendor add nahi hua.
          </p>
        ) : (
          <div className="vendor-table-wrapper">
            <table className="vendor-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>City</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor._id}>
                    <td>
                      <div className="vendor-table-name">
                        {vendor.image ? (
                          <img src={vendor.image} alt="" />
                        ) : (
                          <div className="vendor-image-placeholder">
                            {(vendor.name || "V")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div>
                          <strong>{vendor.title || vendor.name}</strong>
                          <small>{vendor.name}</small>
                        </div>
                      </div>
                    </td>

                    <td>{vendor.city || "—"}</td>
                    <td>{vendor.category || "—"}</td>

                    <td>
                      <span
                        className={`vendor-status ${
                          vendor.status || "pending"
                        }`}
                      >
                        {vendor.status || "pending"}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`vendor-feature-toggle ${
                          vendor.isFeatured ? "active" : ""
                        }`}
                        onClick={() => handleFeatureToggle(vendor)}
                      >
                        {vendor.isFeatured
                          ? "Featured"
                          : "Not Featured"}
                      </button>
                    </td>

                    <td>
                      <div className="vendor-row-actions">
                        <button
                          type="button"
                          className="vendor-btn small secondary"
                          onClick={() => handleEdit(vendor)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="vendor-btn small danger"
                          onClick={() => handleDelete(vendor)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default ManageVendors;