import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, Trash2, Loader2, AlertCircle, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { TimelineSidebar } from "../TimelineSidebar";
import {
    createFullActivity,
    ActivityFullFormDTO
} from "../../services/activity/createFullActivityService";
import {
    getUnitsByTimeline,
    UnitSimpleDTO
} from "../../services/unit/getUnitsByTimelineService";
import {
    getHistoryEventsByTimeline,
    HistoryEventSimpleDTO
} from "../../services/events/getHistoryEventsByTimelineService";
import {
    getUnitContents,
    UnitContentDTO
} from "../../services/unit/getUnitContentsService";
import { getUnitsByEvent } from "../../services/unitService";

type UnitWithContents = {
    id: string;
    title: string;
    contents: UnitContentDTO[];
};

const defaultAnswers = (type: string) => {
    if (type === "FILL_IN_THE_BLANK") return [{ text: "", isCorrect: true }];
    if (type === "TRUE_FALSE") return [{ text: "Verdadeiro", isCorrect: false }, { text: "Falso", isCorrect: false }];
    return Array.from({ length: 4 }, () => ({ text: "", isCorrect: false }));
};

const emptyQuestion = () => ({
    statement: "",
    type: "MULTIPLE_CHOICE",
    answers: defaultAnswers("MULTIPLE_CHOICE")
});

type Props = {
    initialData?: ActivityFullFormDTO;
    onSubmit?: (payload: ActivityFullFormDTO) => Promise<void>;
    isEdit?: boolean;
};

export function CreateFullActivityPage({ initialData, onSubmit, isEdit = false }: Props) {
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [units, setUnits] = useState<UnitSimpleDTO[]>([]);
    const [events, setEvents] = useState<HistoryEventSimpleDTO[]>([]);

    const [unitContents, setUnitContents] = useState<UnitContentDTO[]>([]);
    const [loadingContents, setLoadingContents] = useState(false);
    const [expandedPage, setExpandedPage] = useState<string | null>(null);

    const [eventUnits, setEventUnits] = useState<UnitWithContents[]>([]);
    const [loadingEventContents, setLoadingEventContents] = useState(false);
    const [expandedUnit, setExpandedUnit] = useState<string | null>(null);

    const [activity, setActivity] = useState<ActivityFullFormDTO>(
        initialData ?? {
            title: "",
            type: "FIXATION",
            minimumScore: 70,
            unitId: "",
            historyEventId: "",
            questions: [emptyQuestion()]
        }
    );

    const query = new URLSearchParams(location.search);
    const timelineIdFromQuery = query.get("timelineId") || undefined;
    const timelineId = initialData?.timelineId || timelineIdFromQuery;

    useEffect(() => {
        loadUnits();
        loadEvents();
    }, [timelineId]);

    // If editing, pre-load content panel based on activity type
    useEffect(() => {
        if (initialData?.unitId) loadUnitContents(initialData.unitId);
        if (initialData?.historyEventId) loadEventUnits(initialData.historyEventId);
    }, []);

    async function loadUnits() {
        if (!timelineId) return;
        try {
            const data = await getUnitsByTimeline(timelineId);
            setUnits(data);
        } catch {
            console.error("Erro ao carregar unidades");
        }
    }

    async function loadEvents() {
        if (!timelineId) return;
        try {
            const data = await getHistoryEventsByTimeline(timelineId);
            setEvents(data);
        } catch {
            console.error("Erro ao carregar eventos");
        }
    }

    async function loadUnitContents(unitId: string) {
        if (!unitId) { setUnitContents([]); return; }
        try {
            setLoadingContents(true);
            const data = await getUnitContents(unitId);
            setUnitContents(data.sort((a, b) => a.pageOrder - b.pageOrder));
            setExpandedPage(null);
        } catch {
            toast.error("Erro ao carregar conteúdo da unidade.");
        } finally {
            setLoadingContents(false);
        }
    }

    async function loadEventUnits(historyEventId: string) {
        if (!historyEventId) { setEventUnits([]); return; }
        try {
            setLoadingEventContents(true);
            setExpandedUnit(null);
            const units: { id: string; title: string }[] = await getUnitsByEvent(historyEventId);
            const withContents = await Promise.all(
                units.map(async (u) => {
                    const contents = await getUnitContents(u.id).catch(() => []);
                    return { id: u.id, title: u.title, contents: contents.sort((a, b) => a.pageOrder - b.pageOrder) };
                })
            );
            setEventUnits(withContents);
        } catch {
            toast.error("Erro ao carregar unidades do evento.");
        } finally {
            setLoadingEventContents(false);
        }
    }

    function addQuestion() {
        setActivity({ ...activity, questions: [...activity.questions, emptyQuestion()] });
    }

    function removeQuestion(i: number) {
        setActivity({ ...activity, questions: activity.questions.filter((_, idx) => idx !== i) });
    }

    function updateQuestion(i: number, value: string) {
        const updated = [...activity.questions];
        updated[i] = { ...updated[i], statement: value };
        setActivity({ ...activity, questions: updated });
    }

    function updateQuestionType(i: number, type: string) {
        const updated = [...activity.questions];
        updated[i] = { ...updated[i], type, answers: defaultAnswers(type) };
        setActivity({ ...activity, questions: updated });
    }

    function addAnswer(qi: number) {
        const updated = [...activity.questions];
        updated[qi].answers.push({ text: "", isCorrect: false });
        setActivity({ ...activity, questions: updated });
    }

    function removeAnswer(qi: number, ai: number) {
        const updated = [...activity.questions];
        updated[qi].answers = updated[qi].answers.filter((_, i) => i !== ai);
        setActivity({ ...activity, questions: updated });
    }

    function updateAnswerText(qi: number, ai: number, text: string) {
        const updated = [...activity.questions];
        updated[qi].answers[ai].text = text;
        setActivity({ ...activity, questions: updated });
    }

    function toggleAnswerCorrect(qi: number, ai: number) {
        const updated = [...activity.questions];
        updated[qi].answers[ai].isCorrect = !updated[qi].answers[ai].isCorrect;
        setActivity({ ...activity, questions: updated });
    }

    function validate(): boolean {
        if (!activity.title.trim()) {
            toast.error("Informe o título da atividade.");
            return false;
        }
        if (activity.type === "FIXATION" && !activity.unitId) {
            toast.error("Selecione uma unidade para o exercício de fixação.");
            return false;
        }
        if (activity.type === "ASSESSMENT" && !activity.historyEventId) {
            toast.error("Selecione um evento para a avaliação.");
            return false;
        }
        if (activity.questions.length === 0) {
            toast.error("Adicione pelo menos uma questão.");
            return false;
        }
        for (let i = 0; i < activity.questions.length; i++) {
            const q = activity.questions[i];
            if (!q.statement.trim()) {
                toast.error(`O enunciado da questão ${i + 1} está vazio.`);
                return false;
            }
            if (q.type !== "FILL_IN_THE_BLANK" && q.answers.length < 2) {
                toast.error(`A questão ${i + 1} precisa de pelo menos 2 respostas.`);
                return false;
            }
            if (!q.answers.some(a => a.isCorrect)) {
                toast.error(`Marque a resposta correta da questão ${i + 1}.`);
                return false;
            }
        }
        return true;
    }

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!validate()) return;
        try {
            setLoading(true);
            const payload = {
                ...activity,
                unitId: activity.type === "FIXATION" ? activity.unitId : null,
                historyEventId: activity.type === "ASSESSMENT" ? activity.historyEventId : null
            };
            if (onSubmit) {
                await onSubmit(payload);
            } else {
                await createFullActivity(payload);
                toast.success("Atividade criada com sucesso!");
                navigate(-1);
            }
        } catch {
            toast.error("Erro ao salvar atividade.");
        } finally {
            setLoading(false);
        }
    }

    const showContentPanel = activity.type === "FIXATION"
        ? (loadingContents || unitContents.length > 0)
        : (loadingEventContents || eventUnits.length > 0);

    return (
        <div className="min-h-screen bg-[#f6f3eb] flex">
            <TimelineSidebar />

            <main className="flex-1 px-4 md:px-10 py-6 md:py-10">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-black text-[#2d2d2d]">
                                {isEdit ? "Editar Atividade" : "Criar Atividade"}
                            </h1>
                            <p className="text-gray-500 mt-1 text-sm md:text-base">
                                Preencha as informações e adicione as questões.
                            </p>
                        </div>
                        {timelineId && (
                            <button
                                type="button"
                                onClick={() => navigate(`/activities/timeline/${timelineId}`)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-[#e8dfcf] text-gray-600 hover:border-[#d6a84f] hover:text-[#d6a84f] transition font-semibold text-sm self-start sm:self-auto whitespace-nowrap"
                            >
                                <AlertCircle size={16} />
                                Ver atividades
                            </button>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={`flex flex-col md:flex-row gap-8 items-start`}>

                        {/* ── LEFT: Formulário ── */}
                        <div className="flex-1 min-w-0 space-y-6">

                            {/* Card: Informações */}
                            <section className="bg-white border border-[#e8dfcf] rounded-3xl p-5 md:p-8 shadow-sm space-y-5">
                                <h2 className="text-xl font-black text-[#2d2d2d]">Informações da Atividade</h2>

                                {/* Título */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Título</label>
                                    <input
                                        value={activity.title}
                                        onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                                        placeholder="Ex: Exercício sobre Frações"
                                        className="w-full rounded-2xl border border-[#e5dccb] px-4 py-3 outline-none focus:border-[#d6a84f] bg-[#fcfbf8]"
                                    />
                                </div>

                                {/* Tipo + Nota mínima */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Tipo</label>
                                        <select
                                            value={activity.type}
                                            onChange={(e) => {
                                                setActivity({ ...activity, type: e.target.value, unitId: "", historyEventId: "" });
                                                setUnitContents([]);
                                                setEventUnits([]);
                                            }}
                                            className="w-full rounded-2xl border border-[#e5dccb] px-4 py-3 outline-none focus:border-[#d6a84f] bg-[#fcfbf8]"
                                        >
                                            <option value="FIXATION">Exercício de Fixação</option>
                                            <option value="ASSESSMENT">Avaliação</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Nota mínima (%)</label>
                                        <input
                                            type="number"
                                            value={activity.minimumScore}
                                            onChange={(e) => setActivity({ ...activity, minimumScore: Number(e.target.value) })}
                                            min={0} max={100}
                                            className="w-full rounded-2xl border border-[#e5dccb] px-4 py-3 outline-none focus:border-[#d6a84f] bg-[#fcfbf8]"
                                        />
                                    </div>
                                </div>

                                {/* Unidade ou Evento */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">
                                        {activity.type === "FIXATION" ? "Unidade" : "Evento"}
                                    </label>
                                    {activity.type === "FIXATION" ? (
                                        <select
                                            value={activity.unitId ?? ""}
                                            onChange={(e) => {
                                                setActivity({ ...activity, unitId: e.target.value });
                                                loadUnitContents(e.target.value);
                                            }}
                                            className="w-full rounded-2xl border border-[#e5dccb] px-4 py-3 outline-none focus:border-[#d6a84f] bg-[#fcfbf8]"
                                        >
                                            <option value="">Selecione uma unidade</option>
                                            {units.map((u) => (
                                                <option key={u.id} value={u.id}>{u.title}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <>
                                            <select
                                                value={activity.historyEventId ?? ""}
                                                onChange={(e) => {
                                                    setActivity({ ...activity, historyEventId: e.target.value });
                                                    loadEventUnits(e.target.value);
                                                }}
                                                className="w-full rounded-2xl border border-[#e5dccb] px-4 py-3 outline-none focus:border-[#d6a84f] bg-[#fcfbf8]"
                                            >
                                                <option value="">Selecione um evento</option>
                                                {events.map((ev) => (
                                                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                                                ))}
                                            </select>
                                            {activity.historyEventId && (
                                                <p className="text-xs text-[#9b6d1d] mt-1">
                                                    O conteúdo das unidades do evento aparece ao lado para referência.
                                                </p>
                                            )}
                                        </>
                                    )}
                                    {activity.type === "FIXATION" && activity.unitId && (
                                        <p className="text-xs text-[#9b6d1d] mt-1">
                                            O conteúdo da unidade aparece ao lado para referência.
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* Card: Questões */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-black text-[#2d2d2d]">Questões</h2>
                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="bg-[#d6a84f] hover:bg-[#c89a3f] transition text-white font-bold px-5 py-3 rounded-2xl flex items-center gap-2 text-sm"
                                    >
                                        <Plus size={16} />
                                        Nova Questão
                                    </button>
                                </div>

                                {activity.questions.map((question, qi) => (
                                    <div key={qi} className="bg-white border border-[#e8dfcf] rounded-3xl p-6 space-y-4 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#f4ead7] flex items-center justify-center font-black text-sm text-[#9b6d1d]">
                                                    {qi + 1}
                                                </div>
                                                <span className="font-black text-[#2d2d2d]">Questão {qi + 1}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(qi)}
                                                className="text-red-400 hover:bg-red-50 p-2 rounded-xl transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</label>
                                                <select
                                                    value={question.type}
                                                    onChange={(e) => updateQuestionType(qi, e.target.value)}
                                                    className="w-full rounded-xl border border-[#e5dccb] px-3 py-2 outline-none focus:border-[#d6a84f] bg-[#fcfbf8] text-sm"
                                                >
                                                    <option value="MULTIPLE_CHOICE">Múltipla Escolha</option>
                                                    <option value="TRUE_FALSE">Verdadeiro / Falso</option>
                                                    <option value="FILL_IN_THE_BLANK">Preencher Lacuna</option>
                                                </select>
                                            </div>
                                        </div>

                                        <textarea
                                            value={question.statement}
                                            onChange={(e) => updateQuestion(qi, e.target.value)}
                                            rows={3}
                                            placeholder="Digite o enunciado da questão..."
                                            className="w-full rounded-2xl border border-[#e5dccb] px-4 py-3 outline-none focus:border-[#d6a84f] bg-[#fcfbf8] resize-none text-sm"
                                        />

                                        {question.type === "FILL_IN_THE_BLANK" ? (
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Resposta correta</label>
                                                <input
                                                    value={question.answers[0]?.text ?? ""}
                                                    onChange={(e) => updateAnswerText(qi, 0, e.target.value)}
                                                    placeholder="Ex: 1500"
                                                    className="w-full rounded-2xl border border-[#e5dccb] px-4 py-3 outline-none focus:border-[#d6a84f] bg-[#fcfbf8] text-sm"
                                                />
                                                <p className="text-xs text-gray-400">A comparação é sem distinção de maiúsculas/minúsculas.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {question.answers.map((answer, ai) => (
                                                    <div key={ai} className="flex gap-2 items-center">
                                                        <span className="w-7 h-7 flex-shrink-0 rounded-full bg-[#f4ead7] flex items-center justify-center text-xs font-black text-[#9b6d1d]">
                                                            {String.fromCharCode(65 + ai)}
                                                        </span>
                                                        <input
                                                            value={answer.text}
                                                            onChange={(e) => updateAnswerText(qi, ai, e.target.value)}
                                                            placeholder={`Alternativa ${String.fromCharCode(65 + ai)}`}
                                                            className="flex-1 rounded-2xl border border-[#e5dccb] px-4 py-2.5 outline-none focus:border-[#d6a84f] bg-[#fcfbf8] text-sm"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleAnswerCorrect(qi, ai)}
                                                            className={`px-3 py-2.5 rounded-2xl font-bold text-xs transition flex-shrink-0 ${
                                                                answer.isCorrect
                                                                    ? "bg-green-500 text-white"
                                                                    : "bg-[#f4ead7] text-[#8a641f] hover:bg-[#ead5b0]"
                                                            }`}
                                                        >
                                                            {answer.isCorrect ? "✓ Correta" : "Correta"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeAnswer(qi, ai)}
                                                            className="text-red-400 hover:bg-red-50 p-2 rounded-xl transition flex-shrink-0"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}

                                                {question.type !== "TRUE_FALSE" && (
                                                    <button
                                                        type="button"
                                                        onClick={() => addAnswer(qi)}
                                                        className="mt-1 text-sm bg-[#f4ead7] text-[#8a641f] px-4 py-2 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#ead5b0] transition"
                                                    >
                                                        <Plus size={14} />
                                                        Adicionar Alternativa
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </section>

                            {/* Botão salvar */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#d6a84f] hover:bg-[#c89a3f] transition text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-70"
                            >
                                {loading ? (
                                    <><Loader2 size={20} className="animate-spin" /> Salvando...</>
                                ) : (
                                    isEdit ? "Atualizar Atividade" : "Criar Atividade"
                                )}
                            </button>
                        </div>

                        {/* ── RIGHT: Preview de conteúdo ── */}
                        {showContentPanel && (
                            <div className="w-full md:w-80 md:flex-shrink-0 md:sticky top-6">
                                <div className="bg-white border border-[#e8dfcf] rounded-3xl shadow-sm overflow-hidden">
                                    <div className="flex items-center gap-2 px-5 py-4 bg-[#f4ead7] border-b border-[#e8dfcf]">
                                        <BookOpen size={16} className="text-[#9b6d1d]" />
                                        <span className="text-sm font-black text-[#9b6d1d]">
                                            {activity.type === "FIXATION" ? "Conteúdo da Unidade" : "Conteúdo do Evento"}
                                        </span>
                                    </div>

                                    {(loadingContents || loadingEventContents) ? (
                                        <div className="flex items-center justify-center py-10">
                                            <Loader2 size={24} className="animate-spin text-[#d6a84f]" />
                                        </div>
                                    ) : activity.type === "FIXATION" ? (
                                        /* Páginas da unidade de fixação */
                                        <div className="divide-y divide-[#f0e8d8] max-h-[70vh] overflow-y-auto">
                                            {unitContents.map((page) => (
                                                <div key={page.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setExpandedPage(expandedPage === page.id ? null : page.id)}
                                                        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-[#fdfaf5] transition"
                                                    >
                                                        <span className="text-sm font-semibold text-[#2d2d2d] leading-tight">
                                                            <span className="text-xs text-gray-400 mr-1">p.{page.pageOrder}</span>
                                                            {page.title || "Página"}
                                                        </span>
                                                        {expandedPage === page.id
                                                            ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
                                                            : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
                                                        }
                                                    </button>
                                                    {expandedPage === page.id && (
                                                        <div className="px-5 pb-4 space-y-3 bg-[#fdfaf5]">
                                                            {page.imageUrl && (
                                                                <img src={page.imageUrl} alt={page.title} className="w-full max-h-36 object-cover rounded-xl" />
                                                            )}
                                                            {page.content && (
                                                                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{page.content}</p>
                                                            )}
                                                            {page.hint && (
                                                                <div className="bg-[#f4ead7] rounded-xl px-3 py-2 text-xs text-[#9b6d1d] font-medium">
                                                                    Dica: {page.hint}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        /* Unidades do evento avaliativo, cada uma expansível */
                                        <div className="divide-y divide-[#f0e8d8] max-h-[70vh] overflow-y-auto">
                                            {eventUnits.map((unit) => (
                                                <div key={unit.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                                                        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-[#fdfaf5] transition"
                                                    >
                                                        <span className="text-sm font-bold text-[#2d2d2d] leading-tight">{unit.title}</span>
                                                        {expandedUnit === unit.id
                                                            ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
                                                            : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
                                                        }
                                                    </button>
                                                    {expandedUnit === unit.id && (
                                                        <div className="divide-y divide-[#f0e8d8] bg-[#fdfaf5]">
                                                            {unit.contents.length === 0 ? (
                                                                <p className="px-5 py-3 text-xs text-gray-400">Nenhum conteúdo cadastrado.</p>
                                                            ) : unit.contents.map((page) => (
                                                                <div key={page.id} className="px-5 py-3 space-y-2">
                                                                    <p className="text-xs font-semibold text-[#2d2d2d]">
                                                                        <span className="text-gray-400 mr-1">p.{page.pageOrder}</span>
                                                                        {page.title || "Página"}
                                                                    </p>
                                                                    {page.imageUrl && (
                                                                        <img src={page.imageUrl} alt={page.title} className="w-full max-h-28 object-cover rounded-xl" />
                                                                    )}
                                                                    {page.content && (
                                                                        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">{page.content}</p>
                                                                    )}
                                                                    {page.hint && (
                                                                        <div className="bg-[#f4ead7] rounded-xl px-3 py-2 text-xs text-[#9b6d1d] font-medium">
                                                                            Dica: {page.hint}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </form>
            </main>
        </div>
    );
}
