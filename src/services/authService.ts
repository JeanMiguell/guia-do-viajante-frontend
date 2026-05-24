import { api } from "../config/apiConfig";

export const login = async (email: string, password: string) => {
  const response = await api.post("api/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const loginWithGoogle = async (idToken: string, userType: string = "STUDENT") => {
  const response = await api.post("api/auth/login/google", { idToken, userType });
  return response.data;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  birthDate?: string | null;
  gender?: string | null;
  avatar?: string | null;
  userType?: string;
}) => {
  const response = await api.post("api/auth/register", data);
  return response.data;
};