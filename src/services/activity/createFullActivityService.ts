import { api } from "../../config/apiConfig";

export type AnswerFormDTO = {
    id?: string;
    text: string;
    isCorrect: boolean;
};

export type QuestionFormDTO = {
    id?: string;
    statement: string;
    type: string;
    answers: AnswerFormDTO[];
};

export type ActivityFullFormDTO = {
    id?: string;
    title: string;
    type: string;
    minimumScore: number;
    unitId?: string | null;
    historyEventId?: string | null;
    questions: QuestionFormDTO[];
    timelineId?: string;
};

export const createFullActivity = async (
    payload: ActivityFullFormDTO
) => {

    const response = await api.post(
        "/api/activities/full",
        payload
    );

    return response.data;
};