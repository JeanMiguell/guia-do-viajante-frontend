import { api } from "../config/apiConfig";

export type ActivityProgressDTO = {
  totalQuestions: number;
  answeredQuestions: number;
  percentage: number;
};

export const getActivityProgress = async (
  activityId: string
): Promise<ActivityProgressDTO> => {
  const response = await api.get(
    `api/activities/${activityId}/progress`
  );

  return response.data;
};