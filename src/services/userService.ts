import { api } from "../config/apiConfig";

export const getProfile = async () => {
  const response = await api.get("api/users/me");
  return response.data;
};

export const completeProfile = async (data: {
  birthDate: string;
  gender: string;
  avatar?: string | null;
  userType: string;
}) => {
  await api.put("api/users/me/complete-profile", data);
};