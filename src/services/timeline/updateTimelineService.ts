import { api } from "../../config/apiConfig";

export type UpdateTimelineDTO = {
    name: string;
    description: string;
    imageUrl?: string | null;
    visibility: string;
};

export const updateTimeline = async (
    timelineId: string,
    payload: UpdateTimelineDTO
) => {

    const response = await api.put(
        `/api/timelines/${timelineId}`,
        payload
    );

    return response.data;
};