
import api from "./api";

export const createPaymentOrder = async (donation, idempotencyKey) => {
  console.log("PHONEPE CREATE ORDER API CALLED");

  const response = await api.post(
    "/donations/create-order",
    donation,
    {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    }
  );

  console.log("PHONEPE RESPONSE:", response.data);

  return response.data;
};
export const verifyPayment = async (merchantOrderId) => {
  const response = await api.post(
    "/donations/verify-payment",
    { merchantOrderId }
  );

  return response.data;
};
