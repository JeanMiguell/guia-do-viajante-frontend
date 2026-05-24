import { api } from "../../config/apiConfig";

export interface UnitSimpleDTO {
    id: string;
    title: string;
}

export const getUnitsByTimeline = async (
    timelineId: string
): Promise<UnitSimpleDTO[]> => {

    const response = await api.get(
        `/api/events/timeline/${timelineId}`
    );

    return response.data;
};