
import api from "./api";

// 1. Get public campaigns
export const getCampaigns = async (category) => {
  const response = await api.get("/campaigns", {
    params: category ? { category } : {},
  });

  return response.data;
};

// 2. Get all campaigns for admin
export const getAdminCampaigns = async () => {
  const response = await api.get("/campaigns/admin");
  return response.data;
};

// 3. Create campaign
export const createCampaign = async (campaignData) => {
  const response = await api.post("/campaigns", campaignData);
  return response.data;
};

// 4. Update campaign
export const updateCampaign = async (id, campaignData) => {
  const response = await api.patch(
    `/campaigns/${id}`,
    campaignData
  );

  return response.data;
};

// 5. Delete campaign
export const deleteCampaign = async (id) => {
  const response = await api.delete(`/campaigns/${id}`);
  return response.data;
};
