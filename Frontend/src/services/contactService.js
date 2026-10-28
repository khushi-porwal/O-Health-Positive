
import api from "./api";

// Public: Submit contact enquiry
export const createContact = async (contactData) => {
  const response = await api.post(
    "/contact/create-contact",
    contactData
  );

  return response.data;
};

// Admin: Get all contact enquiries
export const getContacts = async () => {
  const token = sessionStorage.getItem("adminToken");

  const response = await api.get("/contact", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Admin: Get one contact enquiry
export const getContactById = async (id) => {
  const token = sessionStorage.getItem("adminToken");

  const response = await api.get(`/contact/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Admin: Update contact status
export const updateContactStatus = async (id, status) => {
  const token = sessionStorage.getItem("adminToken");

  const response = await api.patch(
    `/contact/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Admin: Delete contact enquiry
export const deleteContact = async (id) => {
  const token = sessionStorage.getItem("adminToken");

  const response = await api.delete(`/contact/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
