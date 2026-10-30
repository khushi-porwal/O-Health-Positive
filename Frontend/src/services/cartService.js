import api from "./api";

export const getCart = async () => {
  const { data } = await api.get("/cart");
  return data;
};

export const addToCart = async ({
  vendorId,
  itemId,
  quantity = 1,
}) => {
  const { data } = await api.post("/cart/items", {
    vendorId,
    itemId,
    quantity,
  });

  return data;
};

export const updateCartItem = async ({
  vendorId,
  itemId,
  quantity,
}) => {
  const { data } = await api.patch(
    `/cart/items/${vendorId}/${itemId}`,
    { quantity }
  );

  return data;
};

export const removeCartItem = async ({ vendorId, itemId }) => {
  const { data } = await api.delete(
    `/cart/items/${vendorId}/${itemId}`
  );
  return data;
};