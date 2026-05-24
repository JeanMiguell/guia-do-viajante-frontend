import { api } from "../../config/apiConfig";
import { ActivityFullFormDTO } from "./createFullActivityService";

export type ActivityType = "FIXATION" | "ASSESSMENT";

export type ActivitiesPage = {
    content: ActivityFullFormDTO[];
    totalPages: number;
    totalElements: number;
    last: boolean;
};

export const getActivitiesByTimeline = async (
    timelineId: string,
    type?: ActivityType,
    page = 0,
    size = 10
): Promise<ActivitiesPage> => {
    const response = await api.get(
        `/api/activities/timeline/${timelineId}`,
        { params: { ...(type ? { type } : {}), page, size } }
    );
    return response.data;
};
