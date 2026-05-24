import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Loader2,
    FileQuestion,
    Pencil,
    Plus,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Circle,
    Users,
    AlertCircle,
    BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { TimelineSidebar } from "../TimelineSidebar";
import { ActivityFullFormDTO, QuestionFormDTO, AnswerFormDTO } from "../../services/activity/createFullActivityService";
import { getActivitiesByTimeline, ActivityType } from "../../services/activity/getActivitiesByTimelineService";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ViewTimelineActivitiesPage() {
    const navigate = useNavigate();
    const { timelineId } = useParams();

    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [tab, setTab] = useState<ActivityType>("FIXATION");
    const [activities, setActivities] = useState<ActivityFullFormDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (!timelineId) { navigate("/timelines"); return; }
        loadActivities(tab, page);
    }, [timelineId, tab, page]);

    async function loadActivities(type: ActivityType, p: number) {
        try {
            setLoading(true);
            setExpandedId(null);
            const data = await getActivitiesByTimeline(timelineId!, type, p, 10);
            setActivities(data.content);
            setTotalPages(data.totalPages);
        } catch {
            toast.error("Erro ao carregar atividades.");
        } finally {
            setLoading(false);
        }
    }

    function changeTab(newTab: ActivityType) {
        setTab(newTab);
        setPage(0);
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f6f3eb] flex items-center justify-center">
                <Loader2 size={42} className="animate-spin text-[#d6a84f]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f3eb] flex">
            <TimelineSidebar />

            <main className="flex-1 px-10 py-10 flex justify-center">
                <div className="w-full max-w-5xl">

                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-black text-[#2d2d2d]">
                                Atividades
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Gerencie exercícios e avaliações da timeline.
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                navigate(`/activities/full/create?timelineId=${timelineId}`)
                            }
                            className="bg-[#d6a84f] hover:bg-[#c89a3f] transition text-white font-bold px-6 py-4 rounded-2xl flex items-center gap-3"
                        >
                            <Plus size={20} />
                            Nova Atividade
                        </button>
                    </div>

                    {/* ABAS DE NAVEGAÇÃO */}
                    <div className="flex gap-4 mb-8 border-b border-[#e8dfcf]">

                        <button
                            onClick={() => {
                                if (timelineId) {
                                    navigate(`/timelines/full/update/${timelineId}`);
                                }
                            }}
                            disabled={!timelineId}
                            className={`px-6 py-4 font-bold text-lg transition-all border-b-4 flex items-center gap-2 ${
                                timelineId
                                    ? "text-gray-500 border-transparent hover:text-gray-700"
                                    : "text-gray-300 border-transparent cursor-not-allowed"
                            }`}
                        >
                            Linha do Tempo
                            {!timelineId && <AlertCircle size={18} className="text-gray-400" />}
                        </button>

                        <div className="px-6 py-4 font-bold text-lg text-[#d6a84f] border-b-4 border-[#d6a84f] flex items-center gap-2">
                            Atividades
                        </div>

                        <button
                            onClick={() => { if (timelineId) navigate(`/timelines/${timelineId}/students`); }}
                            disabled={!timelineId}
                            className={`px-6 py-4 font-bold text-lg transition-all border-b-4 flex items-center gap-2 ${
                                timelineId
                                    ? "text-gray-500 border-transparent hover:text-gray-700"
                                    : "text-gray-300 border-transparent cursor-not-allowed"
                            }`}
                        >
                            <Users size={18} />
                            Convidar Estudantes
                            {!timelineId && <AlertCircle size={18} className="text-gray-400" />}
                        </button>

                        <button
                            onClick={() => { if (timelineId) navigate(`/timelines/${timelineId}/progress`); }}
                            disabled={!timelineId}
                            className={`px-6 py-4 font-bold text-lg transition-all border-b-4 flex items-center gap-2 ${
                                timelineId
                                    ? "text-gray-500 border-transparent hover:text-gray-700"
                                    : "text-gray-300 border-transparent cursor-not-allowed"
                            }`}
                        >
                            <BarChart3 size={18} />
                            Progresso
                        </button>

                    </div>

                    {/* FILTROS: FIXAÇÃO | AVALIAÇÃO */}
                    <div className="flex gap-3 mb-8">
                        <button
                            onClick={() => changeTab("FIXATION")}
                            className={`px-5 py-3 rounded-2xl font-bold transition ${
                                tab === "FIXATION"
                                    ? "bg-[#d6a84f] text-white"
                                    : "bg-white border border-[#e8dfcf] text-gray-700 hover:border-[#d6a84f]"
                            }`}
                        >
                            Exercícios de Fixação
                        </button>

                        <button
                            onClick={() => changeTab("ASSESSMENT")}
                            className={`px-5 py-3 rounded-2xl font-bold transition ${
                                tab === "ASSESSMENT"
                                    ? "bg-[#d6a84f] text-white"
                                    : "bg-white border border-[#e8dfcf] text-gray-700 hover:border-[#d6a84f]"
                            }`}
                        >
                            Avaliações
                        </button>
                    </div>

                    {/* EMPTY STATE */}
                    {activities.length === 0 && (
                        <div className="bg-white border border-[#e8dfcf] rounded-3xl p-14 text-center">
                            <FileQuestion size={48} className="mx-auto text-[#d6a84f] mb-5" />
                            <h2 className="text-2xl font-black text-[#2d2d2d]">
                                Nenhuma atividade cadastrada
                            </h2>
                            <p className="text-gray-500 mt-2">
                                Crie uma nova atividade para começar.
                            </p>
                        </div>
                    )}

                    {/* LISTA DE ATIVIDADES */}
                    <div className="space-y-6" key={`${tab}-${page}`}>
                        {activities.map((activity) => {
                            const expanded = expandedId === activity.id;

                            return (
                                <div
                                    key={activity.id}
                                    className="bg-white border border-[#e8dfcf] rounded-3xl overflow-hidden shadow-sm"
                                >
                                    {/* CABEÇALHO DO CARD */}
                                    <div
                                        className="p-8 cursor-pointer"
                                        onClick={() =>
                                            setExpandedId(
                                                expanded ? null : activity.id ?? null
                                            )
                                        }
                                    >
                                        <div className="flex items-center justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 flex-wrap">
                                                    <h2 className="text-2xl font-black text-[#2d2d2d]">
                                                        {activity.title}
                                                    </h2>

                                                    <span
                                                        className={`px-4 py-1 rounded-2xl text-sm font-bold ${
                                                            activity.type === "FIXATION"
                                                                ? "bg-[#eef5ea] text-[#3d7a34]"
                                                                : "bg-[#f4ead7] text-[#9b6d1d]"
                                                        }`}
                                                    >
                                                        {activity.type === "FIXATION"
                                                            ? "Fixação"
                                                            : "Avaliação"}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-gray-500 mt-2">
                                                    {activity.questions.length} questão(ões) •{" "}
                                                    Nota mínima: {activity.minimumScore}%
                                                </p>
                                            </div>

                                            <div
                                                className="flex items-center gap-3"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/activities/full/update/${activity.id}?timelineId=${timelineId}`
                                                        )
                                                    }
                                                    className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-[#e8dfcf] text-gray-600 hover:border-[#d6a84f] hover:text-[#d6a84f] transition font-semibold text-sm"
                                                >
                                                    <Pencil size={16} />
                                                    Editar
                                                </button>

                                                <div
                                                    className="cursor-pointer text-gray-500"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setExpandedId(
                                                            expanded ? null : activity.id ?? null
                                                        );
                                                    }}
                                                >
                                                    {expanded
                                                        ? <ChevronUp size={22} />
                                                        : <ChevronDown size={22} />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QUESTÕES (EXPANDIDO) */}
                                    {expanded && (
                                        <div className="border-t border-[#ece3d4] px-8 py-8 bg-[#fcfbf8] space-y-6">
                                            {activity.questions.map((question: QuestionFormDTO, questionIndex: number) => (
                                                <div
                                                    key={question.id ?? questionIndex}
                                                    className="bg-white border border-[#ece3d4] rounded-3xl p-6"
                                                >
                                                    <div className="flex items-center gap-3 mb-5">
                                                        <div className="w-10 h-10 rounded-full bg-[#f4ead7] flex items-center justify-center font-black text-[#9b6d1d]">
                                                            {questionIndex + 1}
                                                        </div>
                                                        <h3 className="text-xl font-black text-[#2d2d2d]">
                                                            Questão
                                                        </h3>
                                                    </div>

                                                    <p className="text-gray-700 leading-relaxed text-lg">
                                                        {question.statement}
                                                    </p>

                                                    <div className="space-y-3 mt-6">
                                                        {question.answers.map((answer: AnswerFormDTO, answerIndex: number) => (
                                                            <div
                                                                key={answer.id ?? answerIndex}
                                                                className={`border rounded-2xl px-5 py-4 flex items-center gap-4 ${
                                                                    answer.isCorrect
                                                                        ? "border-green-300 bg-green-50"
                                                                        : "border-[#ece3d4] bg-[#fcfbf8]"
                                                                }`}
                                                            >
                                                                {answer.isCorrect ? (
                                                                    <CheckCircle2
                                                                        size={22}
                                                                        className="text-green-600"
                                                                    />
                                                                ) : (
                                                                    <Circle
                                                                        size={22}
                                                                        className="text-gray-400"
                                                                    />
                                                                )}
                                                                <span
                                                                    className={`font-medium ${
                                                                        answer.isCorrect
                                                                            ? "text-green-700"
                                                                            : "text-gray-700"
                                                                    }`}
                                                                >
                                                                    {answer.text}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* PAGINAÇÃO */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="p-2 rounded-xl border border-[#e8dfcf] disabled:opacity-40 hover:border-[#d6a84f] transition"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-sm font-bold text-gray-600">
                                Página {page + 1} de {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="p-2 rounded-xl border border-[#e8dfcf] disabled:opacity-40 hover:border-[#d6a84f] transition"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}
