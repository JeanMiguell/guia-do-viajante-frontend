import { api } from "../config/apiConfig";

export const getUnitsByEvent = async (eventId: string) => {
  const response = await api.get(`api/events/${eventId}/units`);
  return response.data;
};

export const getUnitById = async (unitId: string) => {
  const response = await api.get(`api/events/units/${unitId}`);
  return response.data;
};