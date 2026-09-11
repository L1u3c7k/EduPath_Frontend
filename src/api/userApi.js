import api from "./api";

export const updateUser = async (payload) => {
  // Matched to backend path: PATCH /api/v1/users/profile
  const response = await api.patch("/user/profile", payload);
  return response.data;
};

export const getUser = async () => {
  // Matched to backend path: GET /api/v1/users/
  const response = await api.get("/user/");
  return response.data;
};

export const updateUserPassword = async (payload) => {
  // Matched to backend path: PATCH /api/v1/users/change-password
  const response = await api.patch("/user/change-password", payload);
  return response.data;
};