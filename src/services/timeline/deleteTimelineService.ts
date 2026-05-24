import { api } from "../../config/apiConfig";

export const deleteTimeline = async (
    timelineId: string
) => {

    const response = await api.delete(
        `/api/timelines/${timelineId}`
    );

    return response.data;
};