import { api } from "../../config/apiConfig";

export const rejectInvite = async (
    inviteId: string
): Promise<string> => {

    const response = await api.delete(
        `/api/user-timelines/${inviteId}/reject`
    );

    return response.data;
};