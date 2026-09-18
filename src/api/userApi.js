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

export const updateUserPassword = async ({ currentPassword, newPassword }) => {
  const response = await api.patch("/user/change-password", {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response.data;
};