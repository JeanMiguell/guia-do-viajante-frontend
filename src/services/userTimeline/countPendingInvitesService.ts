import { api } from "../../config/apiConfig";

export interface PendingInviteCountDTO {
    count: number;
}

export const countPendingInvites = async (): Promise<PendingInviteCountDTO> => {

    const response = await api.get(
        "/api/user-timelines/pending/count"
    );

    return response.data;
};