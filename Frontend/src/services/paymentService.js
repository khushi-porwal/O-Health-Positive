
import api from "./api";

export const createPaymentOrder = async (donation, idempotencyKey) => {
  const response = await api.post(
    "/donations/create-order",
    donation,
    {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    }
  );

  return response.data;
};

export const verifyPayment = async (merchantOrderId) => {
  const response = await api.post(
    "/donations/verify-payment",
    { merchantOrderId }
  );

  return response.data;
};
