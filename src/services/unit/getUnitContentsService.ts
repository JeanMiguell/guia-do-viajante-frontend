import { api } from "../../config/apiConfig";

export type UnitContentDTO = {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    pageOrder: number;
    hint?: string;
    layout?: string;
};

export const getUnitContents = async (unitId: string): Promise<UnitContentDTO[]> => {
    const response = await api.get<UnitContentDTO[]>(`/api/events/${unitId}/contents`);
    return response.data;
};
