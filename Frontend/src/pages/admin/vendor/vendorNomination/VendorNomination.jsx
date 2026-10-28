
import React, { useCallback, useEffect, useState } from "react";
import {
  getVendorNominations,
  updateVendorNominationStatus,
} from "../../../../services/vendorApi";
import "./VendorNomination.css";

const VendorNominations = ({ onCountChange }) => {
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchNominations = useCallback(async () => {
    try {
      setError("");

      const response = await getVendorNominations();

      if (!response?.success || !Array.isArray(response.nominations)) {
        throw new Error("Unable to load vendor nominations.");
      }

      setNominations(response.nominations);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load nominations. Please check your admin login."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNominations();
  }, [fetchNominations]);

  const pendingCount = nominations.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = nominations.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = nominations.filter(
    (item) => item.status === "rejected"
  ).length;

  useEffect(() => {
    onCountChange?.(pendingCount);
  }, [pendingCount, onCountChange]);

  const handleStatusChange = async (nominationId, status) => {
    try {
      setUpdatingId(nominationId);
      setError("");

      const response = await updateVendorNominationStatus(
        nominationId,
        status
      );

      if (!response?.success) {
        throw new Error(
          response?.message || "Unable to update nomination status."
        );
      }

      // Update local data only after backend confirms success.
      setNominations((previous) =>
        previous.map((item) =>
          item._id === nominationId
            ? { ...item, status: response.nomination?.status || status }
            : item
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to update nomination status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="vn-loading">Loading vendor nominations...</div>;
  }

  return (
    <section className="vn-admin">
      <div className="vn-header">
        <div>
          <h2>Vendor Nominations</h2>
          <p>Review and manage submitted vendor nominations.</p>
        </div>

        <button
          type="button"
          className="vn-refresh"
          onClick={() => {
            setLoading(true);
            fetchNominations();
          }}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="vn-error" role="alert">
          {error}
        </div>
      )}

      <div className="vn-stats">
        <div className="vn-stat">
          <span>Total Nominations</span>
          <strong>{nominations.length}</strong>
        </div>

        <div className="vn-stat">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>

        <div className="vn-stat">
          <span>Approved</span>
          <strong>{approvedCount}</strong>
        </div>

        <div className="vn-stat">
          <span>Rejected</span>
          <strong>{rejectedCount}</strong>
        </div>
      </div>

      {nominations.length === 0 ? (
        <div className="vn-empty">
          No vendor nominations have been submitted yet.
        </div>
      ) : (
        <div className="vn-list">
          {nominations.map((item) => (
            <article className="vn-card" key={item._id}>
              <div className="vn-card-header">
                <div>
                  <h3>{item.vendorName}</h3>
                  <span className={`vn-status ${item.status || "pending"}`}>
                    {item.status || "pending"}
                  </span>
                </div>

                <span className="vn-date">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-IN")
                    : "Date unavailable"}
                </span>
              </div>

              <div className="vn-details">
                <p>
                  <strong>Nominated by:</strong>{" "}
                  {item.nominatorName}
                </p>
                <p>
                  <strong>Contact:</strong> {item.phoneNumber}
                </p>
                <p>
                  <strong>Vendor phone:</strong>{" "}
                  {item.vendorPhone || "Not provided"}
                </p>
                <p>
                  <strong>Location:</strong> {item.vendorLocation}
                </p>
                <p>
                  <strong>Category:</strong> {item.productCategory}
                </p>
                <p>
                  <strong>Products:</strong> {item.productsSold}
                </p>
                <p className="vn-description">
                  <strong>About vendor:</strong> {item.description}
                </p>
              </div>

              <div className="vn-actions">
                <label htmlFor={`status-${item._id}`}>
                  Update status
                </label>

                <select
                  id={`status-${item._id}`}
                  value={item.status || "pending"}
                  disabled={updatingId === item._id}
                  onChange={(event) =>
                    handleStatusChange(item._id, event.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                {updatingId === item._id && (
                  <span>Updating...</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default VendorNominations;
