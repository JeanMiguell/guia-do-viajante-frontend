import { api } from "../../config/apiConfig";

export const getTimelineById = async (id: string) => {
  const response = await api.get(`/api/timelines/find/${id}`);
  return response.data;
};