
import api from "./api";

export const sendChatMessage = async (message) => {
  const response = await api.post("/chatbot", {
    message,
  });

  return response.data;
};
