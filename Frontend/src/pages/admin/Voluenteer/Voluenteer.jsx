
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    getVolunteers,
    updateVolunteerStatus,
    deleteVolunteer,
} from "../../../services/volunteerService";
import "./Voluenteer.css"
const VOLUNTEER_STATUSES = ["Pending", "Approved", "Rejected"];

function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function VolunteersSection() {
    const [volunteers, setVolunteers] = useState([]);
    const [volunteerSearch, setVolunteerSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);

    const loadVolunteers = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getVolunteers();

            const list = Array.isArray(response)
                ? response
                : Array.isArray(response?.data)
                ? response.data
                : Array.isArray(response?.volunteers)
                ? response.volunteers
                : [];

            setVolunteers(list);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Volunteer applications load nahi ho paayi. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadVolunteers();
    }, [loadVolunteers]);

    const handleStatusChange = async (id, status) => {
        setActionError("");
        setUpdatingId(id);

        try {
            await updateVolunteerStatus(id, status);

            setVolunteers((previous) =>
                previous.map((volunteer) =>
                    volunteer._id === id
                        ? { ...volunteer, status }
                        : volunteer
                )
            );

            setSelectedVolunteer((previous) =>
                previous?._id === id
                    ? { ...previous, status }
                    : previous
            );
        } catch (err) {
            setActionError(
                err.response?.data?.message ||
                    "Volunteer status update nahi ho paaya."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (volunteer) => {
        const name =
            volunteer.fullName || volunteer.name || "this volunteer";

        const confirmed = window.confirm(
            `Kya aap ${name} ki application delete karna chahte hain?`
        );

        if (!confirmed) return;

        setActionError("");
        setDeletingId(volunteer._id);

        try {
            await deleteVolunteer(volunteer._id);

            setVolunteers((previous) =>
                previous.filter((item) => item._id !== volunteer._id)
            );

            setSelectedVolunteer((previous) =>
                previous?._id === volunteer._id ? null : previous
            );
        } catch (err) {
            setActionError(
                err.response?.data?.message ||
                    "Volunteer application delete nahi ho paayi."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const filteredVolunteers = useMemo(() => {
        const query = volunteerSearch.trim().toLowerCase();

        return volunteers.filter((volunteer) => {
            const name = volunteer.fullName || volunteer.name || "";
            const email = volunteer.email || "";
            const city = volunteer.city || "";
            const interest =
                volunteer.interest ||
                volunteer.areaOfInterest ||
                volunteer.role ||
                "";

            const matchesSearch = [
                name,
                email,
                city,
                interest,
                volunteer.phone || "",
            ].some((value) =>
                String(value).toLowerCase().includes(query)
            );

            const matchesStatus =
                statusFilter === "All" ||
                (volunteer.status || "Pending") === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [volunteers, volunteerSearch, statusFilter]);

    const counts = useMemo(
        () => ({
            total: volunteers.length,
            pending: volunteers.filter(
                (item) => (item.status || "Pending") === "Pending"
            ).length,
            approved: volunteers.filter(
                (item) => item.status === "Approved"
            ).length,
            rejected: volunteers.filter(
                (item) => item.status === "Rejected"
            ).length,
        }),
        [volunteers]
    );

    return (
        <>
            <header className="dashboard-topbar">
                <div>
                    <span className="dashboard-eyebrow">
                        ADMINISTRATION
                    </span>
                    <h1>Volunteers</h1>
                </div>

                <button
                    type="button"
                    className="dashboard-refresh-button"
                    onClick={loadVolunteers}
                    disabled={loading}
                >
                    {loading ? "Refreshing..." : "↻ Refresh"}
                </button>
            </header>

            <section className="dashboard-welcome">
                <div>
                    <h2>Volunteer Applications</h2>
                    <p>
                        Review applications, approve volunteers, and
                        manage their application status.
                    </p>
                </div>
            </section>

            {/* Statistics */}
            <section className="dashboard-stats">
                <article className="dashboard-stat-card total">
                    <div className="dashboard-stat-icon">▦</div>
                    <span>Total Applications</span>
                    <strong>{counts.total}</strong>
                </article>

                <article className="dashboard-stat-card pending">
                    <div className="dashboard-stat-icon">◷</div>
                    <span>Pending</span>
                    <strong>{counts.pending}</strong>
                </article>

                <article className="dashboard-stat-card resolved">
                    <div className="dashboard-stat-icon">✓</div>
                    <span>Approved</span>
                    <strong>{counts.approved}</strong>
                </article>

                <article className="dashboard-stat-card rejected">
                    <div className="dashboard-stat-icon">×</div>
                    <span>Rejected</span>
                    <strong>{counts.rejected}</strong>
                </article>
            </section>

            {/* Applications Table */}
            <section className="dashboard-contacts-panel">
                <div className="dashboard-panel-heading">
                    <div>
                        <h2>Volunteer Applications</h2>
                        <p>
                            Review and manage people who want to
                            volunteer.
                        </p>
                    </div>

                    <span>{filteredVolunteers.length} results</span>
                </div>

                <div className="dashboard-filters">
                    <input
                        type="search"
                        placeholder="Search name, email, city..."
                        value={volunteerSearch}
                        onChange={(event) =>
                            setVolunteerSearch(event.target.value)
                        }
                        aria-label="Search volunteers"
                    />

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        aria-label="Filter volunteers by status"
                    >
                        <option value="All">All statuses</option>

                        {VOLUNTEER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {error && (
                    <div className="dashboard-error">
                        {error}
                        <button type="button" onClick={loadVolunteers}>
                            Try again
                        </button>
                    </div>
                )}

                {actionError && (
                    <div className="dashboard-error">
                        {actionError}
                    </div>
                )}

                {loading ? (
                    <div className="dashboard-empty-state">
                        Loading volunteer applications...
                    </div>
                ) : filteredVolunteers.length === 0 ? (
                    <div className="dashboard-empty-state">
                        No volunteer applications found.
                    </div>
                ) : (
                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Volunteer</th>
                                    <th>Contact</th>
                                    <th>City</th>
                                    <th>Interest</th>
                                    <th>Applied On</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredVolunteers.map((volunteer) => (
                                    <tr key={volunteer._id}>
                                        <td>
                                            <strong>
                                                {volunteer.fullName ||
                                                    volunteer.name ||
                                                    "—"}
                                            </strong>
                                        </td>

                                        <td>
                                            <span>
                                                {volunteer.email || "—"}
                                            </span>
                                            <br />
                                            <span>
                                                {volunteer.phone || "—"}
                                            </span>
                                        </td>

                                        <td>{volunteer.city || "—"}</td>

                                        <td>
                                            {volunteer.interest ||
                                                volunteer.areaOfInterest ||
                                                volunteer.role ||
                                                "—"}
                                        </td>

                                        <td>
                                            {formatDate(
                                                volunteer.createdAt
                                            )}
                                        </td>

                                        <td>
                                            <select
                                                className={`dashboard-status-select ${
                                                    volunteer.status ===
                                                    "Pending"
                                                        ? "pending"
                                                        : volunteer.status ===
                                                          "Approved"
                                                        ? "approved"
                                                        : volunteer.status ===
                                                          "Rejected"
                                                        ? "rejected"
                                                        : ""
                                                }`}
                                                value={
                                                    VOLUNTEER_STATUSES.includes(
                                                        volunteer.status
                                                    )
                                                        ? volunteer.status
                                                        : "Pending"
                                                }
                                                disabled={
                                                    updatingId ===
                                                    volunteer._id
                                                }
                                                onChange={(event) =>
                                                    handleStatusChange(
                                                        volunteer._id,
                                                        event.target.value
                                                    )
                                                }
                                                aria-label={`Status for ${
                                                    volunteer.fullName ||
                                                    volunteer.name ||
                                                    "volunteer"
                                                }`}
                                            >
                                                {VOLUNTEER_STATUSES.map(
                                                    (status) => (
                                                        <option
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {status}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </td>

                                        <td>
                                            <div className="dashboard-action-buttons">
                                                <button
                                                    type="button"
                                                    className="dashboard-view-button"
                                                    onClick={() =>
                                                        setSelectedVolunteer(
                                                            volunteer
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    type="button"
                                                    className="dashboard-delete-button"
                                                    disabled={
                                                        deletingId ===
                                                        volunteer._id
                                                    }
                                                    onClick={() =>
                                                        handleDelete(volunteer)
                                                    }
                                                >
                                                    {deletingId ===
                                                    volunteer._id
                                                        ? "Deleting..."
                                                        : "Delete"}
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

            {/* Volunteer Details Modal */}
            {selectedVolunteer && (
                <div
                    className="enquiry-modal-overlay"
                    onClick={() => setSelectedVolunteer(null)}
                >
                    <section
                        className="enquiry-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="volunteer-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="enquiry-modal-header">
                            <div>
                                <span className="dashboard-eyebrow">
                                    VOLUNTEER APPLICATION
                                </span>
                                <h2 id="volunteer-modal-title">
                                    Volunteer Details
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedVolunteer(null)}
                                aria-label="Close volunteer details"
                            >
                                ×
                            </button>
                        </div>

                        <div className="enquiry-modal-body">
                            <p>
                                <strong>Name</strong>
                                <span>
                                    {selectedVolunteer.fullName ||
                                        selectedVolunteer.name ||
                                        "—"}
                                </span>
                            </p>

                            <p>
                                <strong>Email</strong>
                                <span>
                                    {selectedVolunteer.email || "—"}
                                </span>
                            </p>

                            <p>
                                <strong>Phone</strong>
                                <span>
                                    {selectedVolunteer.phone || "—"}
                                </span>
                            </p>

                            <p>
                                <strong>City</strong>
                                <span>
                                    {selectedVolunteer.city || "—"}
                                </span>
                            </p>

                            <p>
                                <strong>Interest</strong>
                                <span>
                                    {selectedVolunteer.interest ||
                                        selectedVolunteer.areaOfInterest ||
                                        selectedVolunteer.role ||
                                        "—"}
                                </span>
                            </p>

                            <p>
                                <strong>Applied On</strong>
                                <span>
                                    {formatDate(
                                        selectedVolunteer.createdAt
                                    )}
                                </span>
                            </p>

                            <p>
                                <strong>Status</strong>
                                <span>
                                    {selectedVolunteer.status || "Pending"}
                                </span>
                            </p>

                            {selectedVolunteer.message && (
                                <div className="enquiry-message">
                                    <strong>Message</strong>
                                    <p>{selectedVolunteer.message}</p>
                                </div>
                            )}
                        </div>

                        <div className="enquiry-modal-footer">
                            <button
                                type="button"
                                className="dashboard-view-button"
                                onClick={() => setSelectedVolunteer(null)}
                            >
                                Close
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}

export default VolunteersSection;
