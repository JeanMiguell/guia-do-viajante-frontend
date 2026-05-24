import { api } from "../../config/apiConfig";

export interface PendingInviteDTO {
    inviteId: string;
    timelineId: string;
    timelineName: string;
    teacherName: string;
}

export const getPendingInvites = async (): Promise<PendingInviteDTO[]> => {

    const response = await api.get(
        "/api/user-timelines/pending"
    );

    return response.data;
};