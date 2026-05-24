import { api } from "../../config/apiConfig";

export type HistoryEventDTO = {
    id: string;
    name: string;
    description: string;
    startYear: string;
    endYear?: string;
    periodDescription: string;
    eventType: string;
    introText: string;
    imageUrl?: string;
    unlocked?: boolean;
    completed?: boolean;
};

export type TimelineDTO = {
    id: string;
    events: HistoryEventDTO[];
    totalEvents: number;
    unlockedEvents: number;
    completedEvents: number;
    progressPercentage: number;
};

export const getCompleteTimelineById = async (
    timelineId: string
): Promise<TimelineDTO> => {

    const response = await api.get(
        `/api/timelines/${timelineId}`
    );

    return response.data;
};