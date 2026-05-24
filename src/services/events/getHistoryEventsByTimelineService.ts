import { api } from "../../config/apiConfig";

export interface HistoryEventSimpleDTO {
    id: string;
    name: string;
}

export const getHistoryEventsByTimeline = async (
    timelineId: string
): Promise<HistoryEventSimpleDTO[]> => {

    const response = await api.get(
        `/api/history-events/timeline/${timelineId}`
    );

    return response.data.map((event: any) => ({
        id: event.id,
        name: event.name
    }));
};