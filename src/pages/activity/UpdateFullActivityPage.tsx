import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import { Loader2 } from "lucide-react";

import { toast } from "sonner";

import {
    getActivitiesByTimeline
} from "../../services/activity/getActivitiesByTimelineService";

import {
    updateFullActivity
} from "../../services/activity/updateFullActivityService";

import {
    ActivityFullFormDTO
} from "../../services/activity/createFullActivityService";

import {
    CreateFullActivityPage
} from "./CreateFullActivityPage";

export function UpdateFullActivityPage() {

    const navigate =
        useNavigate();

    const { activityId } =
        useParams();

    const [loading, setLoading] =
        useState(true);

    const [activity, setActivity] =
        useState<ActivityFullFormDTO | null>(
            null
        );

    useEffect(() => {

        async function loadActivity() {

            try {

                if (!activityId) {

                    navigate("/timelines");

                    return;
                }

                /*
                    COMO O ENDPOINT AGORA RETORNA
                    TODAS AS ATIVIDADES DA TIMELINE,
                    precisamos pegar a timelineId
                    da query string.
                */

                const params =
                    new URLSearchParams(
                        window.location.search
                    );

                const timelineId =
                    params.get("timelineId");

                if (!timelineId) {

                    toast.error(
                        "Timeline não informada."
                    );

                    navigate("/timelines");

                    return;
                }

                const data =
                    await getActivitiesByTimeline(
                        timelineId,
                        undefined,
                        0,
                        200
                    );

                const foundActivity =
                    data.content.find(
                        activity =>
                            activity.id === activityId
                    );

                if (!foundActivity) {

                    toast.error(
                        "Atividade não encontrada."
                    );

                    navigate("/timelines");

                    return;
                }

                setActivity(foundActivity);

            } catch (error) {

                toast.error(
                    "Erro ao carregar atividade."
                );

            } finally {

                setLoading(false);
            }
        }

        loadActivity();

    }, [activityId, navigate]);

    async function handleUpdate(
        payload: ActivityFullFormDTO
    ) {

        try {

            if (!activityId) return;

            await updateFullActivity(
                activityId,
                payload
            );

            toast.success(
                "Atividade atualizada com sucesso!"
            );

            if (activity?.timelineId) {

    navigate(
        `/activities/timeline/${activity.timelineId}`
    );
}

        } catch (error) {

            console.error(error);
            toast.error(
                "Erro ao atualizar atividade."
            );
        }
    }

    if (loading || !activity) {

        return (

            <div
                className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    bg-[#f6f3eb]
                "
            >

                <Loader2
                    size={40}
                    className="
                        animate-spin
                        text-[#d6a84f]
                    "
                />

            </div>
        );
    }

    return (

        <CreateFullActivityPage
            initialData={activity}
            onSubmit={handleUpdate}
            isEdit
        />
    );
}