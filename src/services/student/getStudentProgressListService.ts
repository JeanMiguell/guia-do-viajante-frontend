import { api } from "../../config/apiConfig";

export type StudentProgressSummaryDTO = {
    studentId: string;
    name: string;
    email: string;
    unitsCompleted: number;
    totalUnits: number;
};

export type StudentProgressPage = {
    content: StudentProgressSummaryDTO[];
    totalPages: number;
    totalElements: number;
    number: number;
};

export const getStudentProgressList = async (
    timelineId: string,
    page = 0,
    size = 10
): Promise<StudentProgressPage> => {
    const response = await api.get(`/api/timelines/${timelineId}/students`, {
        params: { page, size }
    });
    return response.data;
};
