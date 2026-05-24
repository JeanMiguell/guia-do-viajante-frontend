// services/timeline/createFullTimelineService.ts

import { api } from "../../config/apiConfig";

export type UnitContentCreateDTO = {
    title?: string;
    content: string;
    imageUrl?: string;
    pageOrder: number;
    hint: string;
};

export type UnitCreateDTO = {
    title: string;
    description?: string;
    orderIndex: number;
    contents: UnitContentCreateDTO[];
};

export type HistoryEventCreateDTO = {
    name: string;
    description: string;
    startYear?: string;
    endYear?: string;
    periodDescription?: string;
    eventType?: string;
    introText: string;
    imageUrl?: string;
    units: UnitCreateDTO[];
};

export type TimelineFullCreateDTO = {
    name: string;
    description: string;
    imageUrl?: string;
    visibility: string;
    events: HistoryEventCreateDTO[];
};

export const createFullTimeline = async (
    payload: TimelineFullCreateDTO
) => {

    const response = await api.post(
        "/api/timelines/full",
        payload
    );

    return response.data;
};