
import api from "./api";

export const getImpactStats = async () => {
  const response = await api.get("/impact-stats");
  return response.data;
};

export const createImpactStats = async (data) => {
  const response = await api.post("/impact-stats", data);
  return response.data;
};

export const updateImpactStats = async (data) => {
  const response = await api.put("/impact-stats", data);
  return response.data;
};
