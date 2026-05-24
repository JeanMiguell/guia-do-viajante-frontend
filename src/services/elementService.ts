import { api } from "../config/apiConfig";

export const getElementsByContent = async (contentId: string) => {
  const response = await api.get(`api/contents/${contentId}/elements`);
  return response.data;
};