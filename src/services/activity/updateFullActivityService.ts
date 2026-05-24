import { api } from "../../config/apiConfig";

import {
    ActivityFullFormDTO
} from "./createFullActivityService";

export const updateFullActivity = async (
    activityId: string,
    payload: ActivityFullFormDTO
) => {

    const response = await api.put(
        `/api/activities/full/${activityId}`,
        payload
    );

    return response.data;
};