import { api } from "../../config/apiConfig";

export interface InviteUserDTO {
    timelineId: string;
    studentIds: string[];
}

export const sendInvite = async (
    dto: InviteUserDTO
): Promise<string> => {

    const response = await api.post(
        "/api/user-timelines/invite",
        dto
    );

    return response.data;
};