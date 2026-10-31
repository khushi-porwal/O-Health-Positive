import api from "./api";

export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data.orders || [];
};

export const getMyOrderById = async (orderId) => {
  const response = await api.get(`/orders/my-orders/${orderId}`);
  return response.data.order;
};