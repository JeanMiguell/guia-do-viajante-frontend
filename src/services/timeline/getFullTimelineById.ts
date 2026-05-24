import { api } from "../../config/apiConfig";

export type UnitContentFullDTO = {
    id?: string;
    title: string;
    content: string;
    imageUrl: string;
    pageOrder: number;
    hint: string;
    layout: string;
};

export type UnitFullDTO = {
    id?: string;
    title: string;
    description: string;
    orderIndex: number;
    contents: UnitContentFullDTO[];
};

export type HistoryEventFullDTO = {
    id?: string;
    name: string;
    description: string;
    startYear: string;
    endYear: string;
    periodDescription: string;
    eventType: string;
    introText: string;
    imageUrl: string;
    units: UnitFullDTO[];
};

export type TimelineFullDTO = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    visibility: string;
    events: HistoryEventFullDTO[];
};

export const getFullTimelineById = async (
    timelineId: string
): Promise<TimelineFullDTO> => {

    const response = await api.get(
        `/api/timelines/full/${timelineId}`
    );

    return response.data;
};