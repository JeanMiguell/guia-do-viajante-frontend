import { api } from "../config/apiConfig";

export interface UnitResult {
  unitId: string;
  unitTitle: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  correctAnswers: number;
  totalQuestions: number;
}

export interface EventResult {
  eventId: string;
  eventName: string;
  imageUrl?: string;
  units: UnitResult[];
}

export const getResults = async (timelineId: string): Promise<EventResult[]> => {
  const response = await api.get(`api/results/timeline/${timelineId}`);
  return response.data;
};