import { api } from "../../config/apiConfig";

export const getTimelines = async (
  page = 0,
  size = 10
) => {

  const response = await api.get(
    `/api/timelines?page=${page}&size=${size}`
  );

  return response.data;
};