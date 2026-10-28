
import api from "./api";

// Existing registration function ko preserve karo.
// export const registerVolunteer = async (volunteerData) => {
//   const response = await api.post(
//     "/volunteers/register",
//     volunteerData
//   );

//   return response.data;
// };
 export const createCampaign = async (campaignData) => {
  const response = await api.post(
    "/volunteers/register",
    campaignData
  );

  return response.data;
};

export const getVolunteers = async () => {
  const token = sessionStorage.getItem("adminToken");

  const response = await api.get("/volunteers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateVolunteerStatus = async (id, status) => {
  const token = sessionStorage.getItem("adminToken");

  const response = await api.patch(
    `/volunteers/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteVolunteer = async (id) => {
  const token = sessionStorage.getItem("adminToken");

  const response = await api.delete(`/volunteers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
