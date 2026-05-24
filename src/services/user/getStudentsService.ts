import { api } from "../../config/apiConfig";

export interface StudentListDTO {
    id: string;
    name: string;
    email: string;
    alreadyInvited: boolean;
}

export const getStudents = async (
    timelineId?: string
): Promise<StudentListDTO[]> => {

    const response = await api.get(
        "/api/users/students",
        {
            params: {
                timelineId
            }
        }
    );

    return response.data;
};