import { api } from "../config/apiConfig";

export const getActivitiesByUnit = async (unitId: string) => {
  const response = await api.get(`api/activities/unit/${unitId}`);
  return response.data;
};

export const getActivityById = async (activityId: string) => {
  const response = await api.get(`api/activities/${activityId}`);
  return response.data;
};

export const answerQuestion = async (data: {
  questionId: string;
  selectedAlternativeId?: string;
  typedAnswer?: string;
}) => {
  const response = await api.post(`api/activities/answer`, data);
  return response.data;
};

export const finishActivity = async (activityId: string) => {
  const response = await api.post(`api/activities/${activityId}/finish`);
  return response.data;
};

export const getActivityProgress = async (activityId: string) => {
  const response = await api.get(`api/activities/${activityId}/progress`);
  return response.data;
};

export const getAssessmentsByTimeline = async (
  timelineId: string,
  page = 0,
  size = 5
) => {
  const response = await api.get(
    `/api/activities/timeline/${timelineId}/evaluations?page=${page}&size=${size}`
  );

  return response.data;
};