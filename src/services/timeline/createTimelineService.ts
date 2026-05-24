import { api } from "../../config/apiConfig";

export type CreateTimelineDTO = {
    name: string;
    description: string;
    imageUrl?: string | null;
    visibility: string;
};

export const createTimeline = async (
    payload: CreateTimelineDTO
) => {

    const response = await api.post(
        "/api/timelines",
        payload
    );

    return response.data;
};