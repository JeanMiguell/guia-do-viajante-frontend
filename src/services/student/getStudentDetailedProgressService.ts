import { api } from "../../config/apiConfig";

export type QuestionAnswerDetailDTO = {
    questionStatement: string;
    studentAnswer: string | null;
    correctAnswer: string | null;
    correct: boolean;
};

export type ActivityResultDetailDTO = {
    activityId: string;
    activityTitle: string;
    type: "FIXATION" | "EVALUATIVE" | "ASSESSMENT";
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    approved: boolean;
    completedAt: string;
    questions: QuestionAnswerDetailDTO[];
};

export type StudentDetailedProgressDTO = {
    studentId: string;
    name: string;
    email: string;
    unitsCompleted: number;
    totalUnits: number;
    fixationResults: ActivityResultDetailDTO[];
    evaluativeResults: ActivityResultDetailDTO[];
    assessmentResults: ActivityResultDetailDTO[];
};

export const getStudentDetailedProgress = async (
    timelineId: string,
    studentId: string
): Promise<StudentDetailedProgressDTO> => {
    const response = await api.get(
        `/api/timelines/${timelineId}/students/${studentId}/progress`
    );
    return response.data;
};
