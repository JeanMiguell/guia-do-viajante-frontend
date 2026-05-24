// pages/timeline/UpdateFullTimelinePage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Loader2
} from "lucide-react";

import {
    getFullTimelineById,
    TimelineFullDTO
} from "../../services/timeline/getFullTimelineById";

import {
    updateFullTimeline
} from "../../services/timeline/updateFullTimeline";

import {
    CreateFullTimelinePage
} from "./CreateFullTimelinePage";
import { toast } from "sonner";

export function UpdateFullTimelinePage() {

    const navigate = useNavigate();

    const { timelineId } = useParams();

    const [loading, setLoading] =
        useState(true);

    const [timeline, setTimeline] =
        useState<TimelineFullDTO | null>(null);

    useEffect(() => {

        async function loadTimeline() {

            try {

                if (!timelineId) {

                    navigate("/timelines");

                    return;
                }

                const data =
                    await getFullTimelineById(
                        timelineId
                    );

                setTimeline(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);
            }
        }

        loadTimeline();

    }, [timelineId, navigate]);

    async function handleUpdate(
        payload: TimelineFullDTO
    ) {

        try {

            if (!timelineId) return;

            await updateFullTimeline(
                timelineId,
                payload
            );

            toast.success(
                "Linha do tempo atualizada com sucesso!"
            );

            navigate("/timelines");

        } catch (error) {

            console.error(error);

            toast.error("Erro ao atualizar linha do tempo.");
        }
    }

    if (loading || !timeline) {

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
                    className="animate-spin text-[#d6a84f]"
                    size={42}
                />

            </div>
        );
    }

    return (
        <CreateFullTimelinePage
            initialData={timeline}
            onSubmit={handleUpdate}
            isEdit
        />
    );
}