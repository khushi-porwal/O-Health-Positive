// services/adminOrderService.js
import api from "./api";

export const getAdminOrders = async (params = {}) => {
  const { data } = await api.get("/admin/orders", { params });
  return data;
};

export const getAdminOrderDetails = async (id) => {
  const { data } = await api.get(`/admin/orders/${id}`);
  return data;
};

export const updateAdminOrderStatus = async (id, payload) => {
  const { data } = await api.patch(`/admin/orders/${id}/status`, payload);
  return data;
};