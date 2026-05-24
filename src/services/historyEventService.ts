import { api } from "../config/apiConfig";

export const createHistoryEvent = async (
  timelineId: string,
  payload: {
    name: string;
    description: string;
    startYear: string;
    endYear?: string | null;
    periodDescription: string;
    eventType: string;
    introText: string;
    imageUrl?: string | null;
  }
) => {

  const response = await api.post(
    `/api/history-events/create/${timelineId}`,
    payload
  );

  return response.data;
};

export const getEventsByTimeline = async (
  timelineId: string
) => {

  const response = await api.get(
    `/api/timelines/${timelineId}/events`
  );

  return response.data;
};