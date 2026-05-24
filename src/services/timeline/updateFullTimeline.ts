import { api } from "../../config/apiConfig";
import { TimelineFullDTO } from "./getFullTimelineById";

export const updateFullTimeline = async (
    timelineId: string,
    payload: TimelineFullDTO
) => {

    const response = await api.put(
        `/api/timelines/full/${timelineId}`,
        payload
    );

    return response.data;
};