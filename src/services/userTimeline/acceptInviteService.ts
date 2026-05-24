import { api } from "../../config/apiConfig";

export const acceptInvite = async (
    inviteId: string
): Promise<string> => {

    const response = await api.patch(
        `/api/user-timelines/${inviteId}/accept`
    );

    return response.data;
};