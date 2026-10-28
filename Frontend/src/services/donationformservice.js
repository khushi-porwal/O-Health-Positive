
import api from "./api";

export const donationFormService = async ({
  donorName,
  email,
  phone,
  amount,
  donationType,
  campaignId,
}) => {
  const response = await api.post("/donations/create-donate", {
    donorName,
    email,
    phone,
    amount: Number(amount),
    donationType,
    campaignId: campaignId || undefined,
  });

  return response.data;
};

// Monthly programs fetch karne ke liye
export const getMonthlyPrograms = async () => {
  const response = await api.get("/monthly-programs");
  return response.data;
};
