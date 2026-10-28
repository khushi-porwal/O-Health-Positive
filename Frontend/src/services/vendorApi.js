
import api from "./api";

// ============================================
// PUBLIC: FEATURED VENDORS
// ============================================

// Get featured vendors for the public website
export const getFeaturedVendors = async () => {
  const response = await api.get("/vendors/featured");
  return response.data;
};

// ============================================
// PUBLIC: PRODUCTS OF A SPECIFIC VENDOR
// ============================================

// Get products belonging to the selected vendor
export const getVendorProducts = async (vendorId) => {
  if (!vendorId) {
    throw new Error("Vendor ID is required.");
  }

  const response = await api.get(
    `/vendors/${encodeURIComponent(vendorId)}/products`
  );

  return response.data;
};

// ============================================
// ADMIN: MANAGE VENDORS
// ============================================

// Get all vendors
export const getAllVendors = async () => {
  const response = await api.get("/vendors/admin");
  return response.data;
};

// Add a new vendor
export const createVendor = async (vendorData) => {
  const response = await api.post(
    "/vendors/admin",
    vendorData
  );

  return response.data;
};

// Update an existing vendor
export const updateVendor = async (vendorId, vendorData) => {
  const response = await api.patch(
    `/vendors/admin/${vendorId}`,
    vendorData
  );

  return response.data;
};

// Delete a vendor
export const deleteVendor = async (vendorId) => {
  const response = await api.delete(
    `/vendors/admin/${vendorId}`
  );

  return response.data;
};

// ============================================
// ADMIN: VENDOR NOMINATIONS
// ============================================

// Get all vendor nominations
export const getVendorNominations = async () => {
  const response = await api.get(
    "/vendors/admin/nominations"
  );

  return response.data;
};

// Update nomination status
export const updateVendorNominationStatus = async (
  nominationId,
  status
) => {
  const response = await api.patch(
    `/vendors/admin/nominations/${nominationId}/status`,
    { status }
  );

  return response.data;
};

// ============================================
// PUBLIC: SUBMIT VENDOR NOMINATION
// ============================================

export const nominateVendor = async (vendorData) => {
  const response = await api.post(
    "/vendors/nominate",
    vendorData
  );

  return response.data;
};

// ============================================
// DEFAULT EXPORT
// ============================================

const vendorApi = {
  getFeaturedVendors,
  getVendorProducts,
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor,
  getVendorNominations,
  updateVendorNominationStatus,
  nominateVendor,
};

export default vendorApi;
