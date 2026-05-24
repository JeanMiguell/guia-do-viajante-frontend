import { api } from "../config/apiConfig";

export const getUnitContents = async (unitId: string) => {
  const response = await api.get(`api/events/${unitId}/contents`);
  return response.data;
};