import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getActivityProgress } from "../services/activityService";
import { getUnitsByEvent, getUnitById } from "../services/unitService";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

// ─── Confetti ────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = ["#d6a84f", "#f4d03f", "#2ecc71", "#3498db", "#e74c3c", "#9b59b6", "#f8c8a0"];

function Confetti({ show }: { show: boolean }) {
    const pieces = useRef(
        Array.from({ length: 60 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            delay: Math.random() * 0.8,
            duration: 1.8 + Math.random() * 1.2,
            size: 7 + Math.random() * 9,
            rotate: Math.random() * 720 - 360,
            circle: Math.random() > 0.5,
        }))
    );

    if (!show) return null;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {pieces.current.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: -30, x: `${p.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
                    animate={{ y: "105vh", opacity: 0, rotate: p.rotate, scale: 0.5 }}
                    transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
                    style={{
                        position: "absolute",
                        top: 0,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        borderRadius: p.circle ? "50%" : "2px",
                    }}
                />
            ))}
        </div>
    );
}

// ─── Stars ───────────────────────────────────────────────────────────────────

function StarRating({ percentage }: { percentage: number }) {
    const stars = [33, 66, 90];
    return (
        <div className="flex justify-center gap-3">
            {stars.map((threshold, i) => {
                const filled = percentage >= threshold;
                return (
                    <motion.span
                        key={i}
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.4 + i * 0.15, type: "spring", stiffness: 300 }}
                        className="text-4xl"
                    >
                        {filled ? "⭐" : "☆"}
                    </motion.span>
                );
            })}
        </div>
    );
}

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ percentage, approved }: { percentage: number; approved: boolean }) {
    const r = 52;
    const circ = 2 * Math.PI * r;
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const t = setTimeout(() => setProgress(percentage), 200);
        return () => clearTimeout(t);
    }, [percentage]);

    const color = approved ? "#d6a84f" : "#f97316";

    return (
        <div className="relative w-36 h-36 mx-auto">
            <svg width="144" height="144" className="-rotate-90">
                <circle cx="72" cy="72" r={r} fill="none" stroke="#e8dfcf" strokeWidth="10" />
                <circle
                    cx="72" cy="72" r={r} fill="none"
                    stroke={color} strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={circ - (circ * progress) / 100}
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="text-3xl font-black"
                    style={{ color }}
                >
                    {percentage}%
                </motion.span>
            </div>
        </div>
    );
}

// ─── Answer Dots ─────────────────────────────────────────────────────────────

function AnswerDots({ correct, total }: { correct: number; total: number }) {
    return (
        <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.06, type: "spring" }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        i < correct
                            ? "bg-[#d6a84f] text-white"
                            : "bg-[#ece3d4] text-gray-400"
                    }`}
                >
                    {i < correct ? "✓" : "✗"}
                </motion.div>
            ))}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ResultPage() {
    const navigate = useNavigate();
    const location = useLocation();
    useAuthGuard();

    const { result, activityId, unitId, timelineId: stateTimelineId } = location.state || {};
    const { timelineId: paramTimelineId } = useParams();
    const safeTimelineId = stateTimelineId || paramTimelineId;
    const isAssessment = !unitId;

    const [progress, setProgress] = useState<any>(null);
    const [nextUnit, setNextUnit] = useState<any>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (!location.state) {
            navigate("/timelines");
            return;
        }

        if (result?.approved) {
            setShowConfetti(true);
            const t = setTimeout(() => setShowConfetti(false), 3500);
            return () => clearTimeout(t);
        }
    }, []);

    useEffect(() => {
        if (activityId) {
            getActivityProgress(activityId)
                .then(setProgress)
                .catch((error: any) => {
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        localStorage.removeItem("token");
                        navigate("/login", { replace: true });
                    }
                });
        }

        if (unitId) loadNextUnit();
    }, [activityId, unitId, safeTimelineId]);

    async function loadNextUnit() {
        try {
            if (!unitId) return;
            const currentUnit = await getUnitById(unitId);
            const units = await getUnitsByEvent(currentUnit.eventId);
            const sorted = [...units].sort((a: any, b: any) =>
                (a.orderIndex ?? a.order ?? 0) - (b.orderIndex ?? b.order ?? 0)
            );
            const index = sorted.findIndex((u: any) => u.id === unitId);
            if (index !== -1 && sorted[index + 1]) {
                setNextUnit(sorted[index + 1]);
            }
        } catch (e: any) {
            if (e.response?.status === 401 || e.response?.status === 403) {
                localStorage.removeItem("token");
                navigate("/login", { replace: true });
            }
        }
    }

    if (!result) return null;

    const percentage = Math.round(result.score);
    const total = progress?.totalQuestions ?? 0;
    const correct = result.correctAnswers;
    const approved = result.approved;

    const headline = approved
        ? percentage === 100 ? "Perfeito! 🏆" : "Muito bem! 🎉"
        : "Continue tentando! 💪";

    const subtitle = approved
        ? isAssessment ? "Avaliação concluída com sucesso!" : "Você dominou esta lição!"
        : isAssessment ? "Você precisa de mais prática" : "Tente novamente para melhorar";

    return (
        <div className="min-h-screen bg-[#f6f3eb] flex items-center justify-center px-4 py-10">

            <Confetti show={showConfetti} />

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm space-y-5"
            >
                {/* HEADLINE */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-black text-[#2d2d2d]">{headline}</h1>
                    <p className="text-gray-500 mt-1">{subtitle}</p>
                </motion.div>

                {/* CARD PRINCIPAL */}
                <div className="bg-white border border-[#e5e0d6] rounded-3xl shadow-md overflow-hidden">

                    {/* FAIXA DE COR */}
                    <div
                        className="h-2"
                        style={{
                            background: approved
                                ? "linear-gradient(90deg, #d6a84f, #f4d03f)"
                                : "linear-gradient(90deg, #f97316, #fbbf24)"
                        }}
                    />

                    <div className="p-6 space-y-6">

                        {/* RING + ESTRELAS */}
                        <div className="space-y-4">
                            <ScoreRing percentage={percentage} approved={approved} />
                            <StarRating percentage={percentage} />
                        </div>

                        {/* PLACAR */}
                        {total > 0 && (
                            <div className="bg-[#f9f6ef] border border-[#ece3d4] rounded-2xl p-4 text-center">
                                <p className="text-3xl font-black text-[#2d2d2d]">
                                    {correct}
                                    <span className="text-lg font-semibold text-gray-400">/{total}</span>
                                </p>
                                <p className="text-sm text-gray-500 mt-0.5">respostas corretas</p>
                            </div>
                        )}

                        {/* DOTS */}
                        {total > 0 && <AnswerDots correct={correct} total={total} />}

                    </div>
                </div>

                {/* AÇÕES */}
                <div className="space-y-3">
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        onClick={() => {
                            if (nextUnit) { navigate(`/unit/${nextUnit.id}`); return; }
                            if (safeTimelineId) navigate(`/timeline/${safeTimelineId}`);
                            else navigate("/timelines");
                        }}
                        className="w-full py-4 rounded-2xl font-black text-white text-lg shadow-md transition-all hover:scale-[1.02] active:scale-95"
                        style={{ background: "linear-gradient(135deg, #d6a84f, #c89a3f)" }}
                    >
                        {nextUnit ? "Próxima unidade →" : "Concluído ✓"}
                    </motion.button>

                    <div className="grid grid-cols-2 gap-3">
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            onClick={() => safeTimelineId ? navigate(`/timeline/${safeTimelineId}`) : navigate("/timelines")}
                            className="py-3 rounded-2xl font-bold text-[#2d2d2d] bg-white border border-[#e8dfcf] hover:border-[#d6a84f] transition"
                        >
                            Linha do Tempo
                        </motion.button>
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.85 }}
                            onClick={() => {
                                if (isAssessment && activityId) navigate(`/activities/start/${activityId}`);
                                else if (unitId) navigate(`/activities/${unitId}`);
                                else navigate(-1);
                            }}
                            className="py-3 rounded-2xl font-bold text-[#2d2d2d] bg-white border border-[#e8dfcf] hover:border-[#d6a84f] transition"
                        >
                            Refazer
                        </motion.button>
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
