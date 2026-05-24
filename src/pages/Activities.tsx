import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { getCurrentTimelineId } from "../utils/useCurrentTimeline";

import {
  getActivitiesByUnit,
  getActivityById,
  answerQuestion,
  finishActivity,
} from "../services/activityService";

const PRIMARY = "#d6a84f";
const BG = "#f6f3eb";

const LETTER_LABELS = ["A", "B", "C", "D", "E"];

export function Activities() {
  const navigate = useNavigate();
  const { unitId, activityId } = useParams();
  useAuthGuard();

  const [activity, setActivity] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [correctAnswerText, setCorrectAnswerText] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (activityId) {
          const data = await getActivityById(activityId);
          if (data.alreadyCompleted) {
            navigate("/result", { state: { result: data.previousResult, activityId, unitId, timelineId: getCurrentTimelineId() }, replace: true });
            return;
          }
          setActivity(data);
          setQuestions(data.questions || []);
          return;
        }
        if (unitId) {
          const activities = await getActivitiesByUnit(unitId);
          if (!activities.length) return;
          const data = await getActivityById(activities[0].id);
          if (data.alreadyCompleted) {
            navigate("/result", { state: { result: data.previousResult, activityId: activities[0].id, unitId, timelineId: getCurrentTimelineId() }, replace: true });
            return;
          }
          setActivity(data);
          setQuestions(data.questions || []);
        }
      } catch (e: any) {
        if (e.response?.status === 401 || e.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [unitId, activityId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#d6a84f] border-t-transparent animate-spin" />
          <p className="text-gray-500 font-semibold">Carregando atividade...</p>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <p className="text-gray-500">Nenhuma atividade encontrada</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const total = questions.length;
  const progressPercent = total > 0 ? (answeredCount / total) * 100 : 0;
  const isLast = currentQuestion === questions.length - 1;

  async function handleAnswer(altId: string) {
    if (feedback || selected) return;
    setSelected(altId);

    if (currentQ.questionType === "ASSOCIATION") return;

    const response = await answerQuestion({
      questionId: currentQ.id,
      selectedAlternativeId: altId,
    });

    setFeedback(response.correct ? "correct" : "incorrect");
    setAnsweredCount((prev) => prev + 1);

    setTimeout(async () => {
      setSelected(null);
      setFeedback(null);

      if (!isLast) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        const result = await finishActivity(activity.id);
        navigate("/result", { state: { result, activityId: activity.id, unitId: unitId || activity.unitId, timelineId: getCurrentTimelineId() } });
      }
    }, 900);
  }

  async function handleFillInTheBlank() {
    if (feedback || !typedAnswer.trim()) return;

    const response = await answerQuestion({
      questionId: currentQ.id,
      typedAnswer: typedAnswer.trim(),
    });

    setFeedback(response.correct ? "correct" : "incorrect");
    setCorrectAnswerText(response.correctAnswerText ?? null);
    setAnsweredCount((prev) => prev + 1);

    setTimeout(async () => {
      setFeedback(null);
      setTypedAnswer("");
      setCorrectAnswerText(null);

      if (!isLast) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        const result = await finishActivity(activity.id);
        navigate("/result", { state: { result, activityId: activity.id, unitId: unitId || activity.unitId, timelineId: getCurrentTimelineId() } });
      }
    }, 1400);
  }

  async function handleAssociationNext() {
    setAnsweredCount((prev) => prev + 1);
    if (!isLast) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const result = await finishActivity(activity.id);
      navigate("/result", { state: { result, activityId: activity.id, unitId: unitId || activity.unitId, timelineId: getCurrentTimelineId() } });
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG }}>

      {/* HEADER */}
      <header className="px-4 pt-5 pb-3 max-w-xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white border border-[#e5e0d6] flex items-center justify-center hover:border-[#d6a84f] transition"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-700 truncate">{activity.title}</p>
          </div>
          <span className="text-sm font-bold text-[#d6a84f]">
            {currentQuestion + 1}/{total}
          </span>
        </div>

        {/* BARRA DE PROGRESSO */}
        <div className="w-full bg-[#e7e1d6] h-3 rounded-full overflow-hidden">
          <motion.div
            className="h-3 rounded-full"
            style={{ background: `linear-gradient(90deg, ${PRIMARY}, #f4c430)` }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </header>

      {/* QUESTÃO */}
      <main className="flex-1 flex flex-col px-4 pb-6 max-w-xl mx-auto w-full">

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >

            {/* CARD DA PERGUNTA */}
            <div className="bg-white rounded-3xl border border-[#e5e0d6] shadow-sm p-6 mb-5 mt-2">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                  style={{ background: PRIMARY }}
                >
                  {currentQuestion + 1}
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Questão
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                {currentQ.questionText}
              </p>
            </div>

            {/* ALTERNATIVAS */}
            <div className="space-y-3 flex-1">

              {/* MÚLTIPLA ESCOLHA / VERDADEIRO-FALSO */}
              {currentQ.questionType !== "FILL_IN_THE_BLANK" && currentQ.alternatives && currentQ.alternatives.map((alt: any, i: number) => {
                const isSelected = selected === alt.id;
                const isCorrect = isSelected && feedback === "correct";
                const isWrong = isSelected && feedback === "incorrect";

                return (
                  <motion.button
                    key={alt.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAnswer(alt.id)}
                    disabled={!!feedback || !!selected}
                    className={`
                      w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2
                      text-left transition-all duration-200
                      ${isCorrect
                        ? "border-green-400 bg-green-50"
                        : isWrong
                        ? "border-red-400 bg-red-50"
                        : isSelected
                        ? "border-[#d6a84f] bg-[#fef9ee]"
                        : "border-[#e5e0d6] bg-white hover:border-[#d6a84f] hover:bg-[#fef9ee]"
                      }
                    `}
                  >
                    <span
                      className={`
                        w-9 h-9 rounded-full flex items-center justify-center
                        text-sm font-black flex-shrink-0 transition-colors
                        ${isCorrect
                          ? "bg-green-500 text-white"
                          : isWrong
                          ? "bg-red-500 text-white"
                          : isSelected
                          ? "bg-[#d6a84f] text-white"
                          : "bg-[#f2ead8] text-[#8a641f]"
                        }
                      `}
                    >
                      {isCorrect ? "✓" : isWrong ? "✗" : LETTER_LABELS[i]}
                    </span>
                    <span className={`font-medium text-sm leading-snug ${
                      isCorrect ? "text-green-800"
                      : isWrong ? "text-red-800"
                      : "text-gray-700"
                    }`}>
                      {alt.optionText}
                    </span>
                  </motion.button>
                );
              })}

              {/* FILL IN THE BLANK */}
              {currentQ.questionType === "FILL_IN_THE_BLANK" && (
                <div className="space-y-3">
                  <input
                    value={typedAnswer}
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleFillInTheBlank()}
                    disabled={!!feedback}
                    placeholder="Digite sua resposta..."
                    className="w-full px-5 py-4 rounded-2xl border-2 border-[#e5e0d6] bg-white text-gray-800 font-medium outline-none focus:border-[#d6a84f] transition disabled:opacity-60"
                  />
                  {feedback === "incorrect" && correctAnswerText && (
                    <p className="text-sm text-gray-500 px-1">
                      Resposta correta: <span className="font-bold text-gray-700">{correctAnswerText}</span>
                    </p>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleFillInTheBlank}
                    disabled={!!feedback || !typedAnswer.trim()}
                    className="w-full py-4 rounded-2xl font-black text-white text-base shadow-md transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg, #d6a84f, #c89a3f)` }}
                  >
                    Confirmar
                  </motion.button>
                </div>
              )}

              {/* ASSOCIATION */}
              {currentQ.associations && (
                <div className="space-y-3">
                  {currentQ.associations.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-white border border-[#e5e0d6] rounded-2xl px-5 py-4"
                    >
                      <span className="font-semibold text-gray-800">{item.left}</span>
                      <span className="text-[#d6a84f] font-bold">↔</span>
                      <span className="text-gray-600 font-medium">{item.right}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* FEEDBACK */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-4 px-5 py-4 rounded-2xl flex items-center gap-3 font-bold ${
                    feedback === "correct"
                      ? "bg-green-50 border border-green-300 text-green-700"
                      : "bg-red-50 border border-red-300 text-red-700"
                  }`}
                >
                  <span className="text-xl">{feedback === "correct" ? "🎉" : "😅"}</span>
                  {feedback === "correct" ? "Correto! Boa resposta!" : "Quase! Continue tentando."}
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </AnimatePresence>

      </main>

      {/* BOTÃO ASSOCIATION */}
      {currentQ.associations && (
        <div className="px-4 pb-6 max-w-xl mx-auto w-full">
          <button
            onClick={handleAssociationNext}
            className="w-full py-4 rounded-2xl font-black text-white text-base shadow-md transition-all hover:scale-[1.02] active:scale-95"
            style={{ background: `linear-gradient(135deg, ${PRIMARY}, #c89a3f)` }}
          >
            {isLast ? "Finalizar" : "Próxima →"}
          </button>
        </div>
      )}

    </div>
  );
}
