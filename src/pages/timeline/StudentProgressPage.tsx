import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Users, ChevronLeft, ChevronRight, X, CheckCircle, XCircle, BarChart3, AlertCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { TimelineSidebar } from "../TimelineSidebar";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import {
    getStudentProgressList,
    StudentProgressSummaryDTO,
} from "../../services/student/getStudentProgressListService";
import {
    getStudentDetailedProgress,
    StudentDetailedProgressDTO,
    ActivityResultDetailDTO,
    QuestionAnswerDetailDTO,
} from "../../services/student/getStudentDetailedProgressService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
    });
}

function ProgressBar({ value, max }: { value: number; max: number }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 bg-[#e8dfcf] rounded-full h-2 overflow-hidden">
                <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: "linear-gradient(90deg, #d6a84f, #f4c430)" }}
                />
            </div>
            <span className="text-xs font-bold text-[#9b6d1d] w-10 text-right">{pct}%</span>
        </div>
    );
}

// ─── Activity Result Card ─────────────────────────────────────────────────────

function QuestionRow({ q, index }: { q: QuestionAnswerDetailDTO; index: number }) {
    return (
        <div className={`rounded-xl border p-3 text-sm ${
            q.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
        }`}>
            <div className="flex items-start gap-2">
                <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                    q.correct ? "bg-green-500" : "bg-red-500"
                }`}>
                    {index + 1}
                </span>
                <p className="font-medium text-gray-800 leading-snug">{q.questionStatement}</p>
            </div>
            <div className="mt-2 ml-7 space-y-1">
                <p className="text-xs text-gray-500">
                    Respondeu:{" "}
                    <span className={`font-semibold ${q.correct ? "text-green-700" : "text-red-600"}`}>
                        {q.studentAnswer ?? "—"}
                    </span>
                </p>
                {!q.correct && q.correctAnswer && (
                    <p className="text-xs text-gray-500">
                        Correto:{" "}
                        <span className="font-semibold text-green-700">{q.correctAnswer}</span>
                    </p>
                )}
            </div>
        </div>
    );
}

function ActivityCard({ result }: { result: ActivityResultDetailDTO }) {
    const [expanded, setExpanded] = useState(false);
    const wrong = result.totalQuestions - result.correctAnswers;
    const pct = result.totalQuestions > 0
        ? Math.round((result.correctAnswers / result.totalQuestions) * 100)
        : 0;
    const approved = result.approved;
    const isAssessment = result.type === "ASSESSMENT";
    const hasQuestions = isAssessment && result.questions?.length > 0;

    return (
        <div className={`border rounded-2xl overflow-hidden ${
            approved ? "border-green-200" : "border-[#ece3d4]"
        }`}>
            {/* Header */}
            <div className={`px-5 py-4 flex items-start justify-between gap-3 ${
                approved ? "bg-green-50" : "bg-[#fffdf9]"
            }`}>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#2d2d2d] leading-snug">{result.activityTitle}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(result.completedAt)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${
                        approved ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}>
                        {result.score}%
                    </span>
                    {approved
                        ? <CheckCircle size={18} className="text-green-500" />
                        : <XCircle size={18} className="text-red-400" />
                    }
                </div>
            </div>

            {/* Stats */}
            {result.totalQuestions > 0 && (
                <div className={`px-5 pb-4 pt-3 border-t space-y-3 ${
                    approved ? "bg-green-50 border-green-100" : "bg-[#fffdf9] border-[#f0e8d8]"
                }`}>
                    <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                            <span>Desempenho</span>
                            <span className="font-semibold">{result.correctAnswers}/{result.totalQuestions} questões</span>
                        </div>
                        <div className="w-full bg-[#e8dfcf] rounded-full h-2 overflow-hidden">
                            <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{
                                    width: `${pct}%`,
                                    background: approved
                                        ? "linear-gradient(90deg, #22c55e, #4ade80)"
                                        : "linear-gradient(90deg, #d6a84f, #f4c430)",
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-green-100 border border-green-200">
                            <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                            <div>
                                <p className="text-[10px] text-green-700 font-semibold">Acertos</p>
                                <p className="text-sm font-black text-green-800">{result.correctAnswers}</p>
                            </div>
                        </div>
                        <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border ${
                            wrong > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
                        }`}>
                            <XCircle size={14} className={wrong > 0 ? "text-red-500 flex-shrink-0" : "text-gray-400 flex-shrink-0"} />
                            <div>
                                <p className={`text-[10px] font-semibold ${wrong > 0 ? "text-red-600" : "text-gray-500"}`}>Erros</p>
                                <p className={`text-sm font-black ${wrong > 0 ? "text-red-700" : "text-gray-500"}`}>{wrong}</p>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#f4ead7] border border-[#e8dfcf]">
                            <BarChart3 size={14} className="text-[#9b6d1d] flex-shrink-0" />
                            <div>
                                <p className="text-[10px] text-[#9b6d1d] font-semibold">Nota</p>
                                <p className="text-sm font-black text-[#7a5219]">{result.score}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Expandir questões — só para avaliações */}
                    {hasQuestions && (
                        <button
                            onClick={() => setExpanded(v => !v)}
                            className="w-full flex items-center justify-between pt-2 text-xs font-bold text-[#9b6d1d] hover:text-[#7a5219] transition"
                        >
                            <span>Ver questão a questão</span>
                            <ChevronDown
                                size={15}
                                className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                            />
                        </button>
                    )}
                </div>
            )}

            {/* Lista de questões */}
            <AnimatePresence>
                {expanded && hasQuestions && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-4 pt-2 space-y-2 border-t border-[#e8dfcf] bg-white">
                            {result.questions.map((q, i) => (
                                <QuestionRow key={i} q={q} index={i} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function DetailPanel({
    detail,
    loading,
    onClose,
}: {
    detail: StudentDetailedProgressDTO | null;
    loading: boolean;
    onClose: () => void;
}) {
    const [tab, setTab] = useState<"fixation" | "assessment">("fixation");

    useEffect(() => { setTab("fixation"); }, [detail]);

    const tabs = [
        { key: "fixation" as const, label: "Fixação", results: detail?.fixationResults ?? [] },
        { key: "assessment" as const, label: "Avaliação", results: detail?.assessmentResults ?? [] },
    ];

    const activeResults = tabs.find(t => t.key === tab)?.results ?? [];
    const progressPct = detail && detail.totalUnits > 0
        ? Math.round((detail.unitsCompleted / detail.totalUnits) * 100)
        : 0;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full w-full max-w-lg bg-white border-l border-[#e8dfcf] shadow-2xl z-50 flex flex-col"
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-[#e8dfcf] flex items-center justify-between">
                    <h2 className="text-xl font-black text-[#2d2d2d]">Detalhe do Aluno</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-[#f6f3eb] transition"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {loading || !detail ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 size={32} className="animate-spin text-[#d6a84f]" />
                    </div>
                ) : (
                    <>
                        {/* Student summary */}
                        <div className="px-6 py-5 border-b border-[#e8dfcf] space-y-3 bg-[#fcfbf8]">
                            <div>
                                <h3 className="text-lg font-black text-[#2d2d2d]">{detail.name}</h3>
                                <p className="text-sm text-gray-500">{detail.email}</p>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Unidades concluídas</span>
                                    <span>{detail.unitsCompleted}/{detail.totalUnits}</span>
                                </div>
                                <ProgressBar value={detail.unitsCompleted} max={detail.totalUnits} />
                            </div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                                progressPct >= 70
                                    ? "bg-green-100 text-green-700"
                                    : progressPct > 0
                                    ? "bg-[#f4ead7] text-[#9b6d1d]"
                                    : "bg-gray-100 text-gray-500"
                            }`}>
                                <BarChart3 size={13} />
                                {progressPct}% concluído
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-[#e8dfcf]">
                            {tabs.map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    className={`flex-1 py-3 text-sm font-bold transition-all border-b-2 ${
                                        tab === t.key
                                            ? "text-[#d6a84f] border-[#d6a84f]"
                                            : "text-gray-500 border-transparent hover:text-gray-700"
                                    }`}
                                >
                                    {t.label}
                                    <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                                        tab === t.key ? "bg-[#f4ead7] text-[#9b6d1d]" : "bg-gray-100 text-gray-500"
                                    }`}>
                                        {t.results.length}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Results list */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
                            {activeResults.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <AlertCircle size={36} className="mx-auto mb-3 opacity-40" />
                                    <p className="font-semibold">Nenhuma atividade realizada</p>
                                </div>
                            ) : (
                                activeResults.map(r => (
                                    <ActivityCard key={r.activityId} result={r} />
                                ))
                            )}
                        </div>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function StudentProgressPage() {
    useAuthGuard();
    const navigate = useNavigate();
    const { timelineId } = useParams<{ timelineId: string }>();

    const [students, setStudents] = useState<StudentProgressSummaryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [detail, setDetail] = useState<StudentDetailedProgressDTO | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        if (!timelineId) { navigate("/timelines"); return; }
        loadStudents(page);
    }, [timelineId, page]);

    async function loadStudents(p: number) {
        try {
            setLoading(true);
            const data = await getStudentProgressList(timelineId!, p, 10);
            setStudents(data.content);
            setTotalPages(data.totalPages);
        } catch {
            toast.error("Erro ao carregar alunos.");
        } finally {
            setLoading(false);
        }
    }

    async function openDetail(studentId: string) {
        setSelectedStudentId(studentId);
        setDetail(null);
        setDetailLoading(true);
        try {
            const data = await getStudentDetailedProgress(timelineId!, studentId);
            setDetail(data);
        } catch {
            toast.error("Erro ao carregar progresso do aluno.");
            setSelectedStudentId(null);
        } finally {
            setDetailLoading(false);
        }
    }

    if (!timelineId) return null;

    return (
        <div className="min-h-screen bg-[#f6f3eb] flex">
            <TimelineSidebar />

            <main className="flex-1 px-10 py-10 flex justify-center">
                <div className="w-full max-w-5xl">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-[#2d2d2d]">Progresso dos Alunos</h1>
                        <p className="text-gray-500 mt-2">Acompanhe o desempenho dos estudantes nesta linha do tempo.</p>
                    </div>

                    {/* Nav tabs */}
                    <div className="flex gap-4 mb-8 border-b border-[#e8dfcf]">
                        {[
                            { label: "Linha do Tempo", path: `/timelines/full/update/${timelineId}` },
                            { label: "Atividades", path: `/activities/timeline/${timelineId}` },
                            { label: "Convidar Estudantes", path: `/timelines/${timelineId}/students` },
                        ].map(tab => (
                            <button
                                key={tab.label}
                                onClick={() => navigate(tab.path)}
                                className="px-6 py-4 font-bold text-lg text-gray-500 border-b-4 border-transparent hover:text-gray-700 transition-all"
                            >
                                {tab.label}
                            </button>
                        ))}
                        <div className="px-6 py-4 font-bold text-lg text-[#d6a84f] border-b-4 border-[#d6a84f] flex items-center gap-2">
                            <BarChart3 size={18} />
                            Progresso
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 size={36} className="animate-spin text-[#d6a84f]" />
                        </div>
                    ) : students.length === 0 ? (
                        <div className="bg-white border border-[#e8dfcf] rounded-3xl p-14 text-center">
                            <Users size={48} className="mx-auto text-[#d6a84f] mb-5" />
                            <h2 className="text-2xl font-black text-[#2d2d2d]">Nenhum aluno inscrito</h2>
                            <p className="text-gray-500 mt-2">Convide estudantes para visualizar o progresso deles.</p>
                            <button
                                onClick={() => navigate(`/timelines/${timelineId}/students`)}
                                className="mt-6 px-6 py-3 bg-[#d6a84f] hover:bg-[#c89a3f] text-white font-bold rounded-2xl transition"
                            >
                                Convidar estudantes
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white border border-[#e8dfcf] rounded-3xl overflow-hidden shadow-sm">
                                {/* Table header */}
                                <div className="grid grid-cols-[2fr_2fr_1fr_auto] gap-4 px-6 py-4 bg-[#fcfbf8] border-b border-[#e8dfcf] text-xs font-bold text-gray-500 uppercase tracking-wide">
                                    <span>Aluno</span>
                                    <span>Progresso</span>
                                    <span className="text-center">Unidades</span>
                                    <span />
                                </div>

                                {/* Rows */}
                                {students.map(student => (
                                    <div
                                        key={student.studentId}
                                        className={`grid grid-cols-[2fr_2fr_1fr_auto] gap-4 items-center px-6 py-5 border-b border-[#f0e8d8] last:border-0 hover:bg-[#fdfaf5] transition ${
                                            selectedStudentId === student.studentId ? "bg-[#fef9ee]" : ""
                                        }`}
                                    >
                                        <div>
                                            <p className="font-black text-[#2d2d2d]">{student.name}</p>
                                            <p className="text-sm text-gray-500">{student.email}</p>
                                        </div>
                                        <ProgressBar value={student.unitsCompleted} max={student.totalUnits} />
                                        <p className="text-center text-sm font-bold text-gray-600">
                                            {student.unitsCompleted}/{student.totalUnits}
                                        </p>
                                        <button
                                            onClick={() => openDetail(student.studentId)}
                                            className="px-4 py-2 rounded-2xl border border-[#e8dfcf] text-sm font-bold text-gray-600 hover:border-[#d6a84f] hover:text-[#d6a84f] transition whitespace-nowrap"
                                        >
                                            Ver detalhes
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4 mt-6">
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
                        </>
                    )}
                </div>
            </main>

            {/* Detail panel overlay */}
            {selectedStudentId && (
                <>
                    <div
                        className="fixed inset-0 bg-black/20 z-40"
                        onClick={() => setSelectedStudentId(null)}
                    />
                    <DetailPanel
                        detail={detail}
                        loading={detailLoading}
                        onClose={() => setSelectedStudentId(null)}
                    />
                </>
            )}
        </div>
    );
}
