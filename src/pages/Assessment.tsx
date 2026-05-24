import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Lock, ClipboardList, CheckCircle, XCircle } from "lucide-react";
import { getAssessmentsByTimeline } from "../services/activityService";
import { AssessmentPanel } from "./AssessmentPanel";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { BottomNav } from "../app/components/BottomNav";

type Assessment = {
  activityId: string;
  activityName: string;
  unitName: string;
  available: boolean;
  imageUrl: string;
  minimumScore?: number;
  questionCount?: number;
  alreadyCompleted?: boolean;
  previousScore?: number;
  previousApproved?: boolean;
};

export function Assessment() {
  useAuthGuard();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [allAssessments, setAllAssessments] = useState<Assessment[]>([]);
  const [selected, setSelected] = useState<Assessment | null>(null);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { timelineId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!timelineId) { navigate("/timelines"); return; }
    setLoading(true);
    setError(false);
    Promise.all([
      getAssessmentsByTimeline(timelineId, page),
      getAssessmentsByTimeline(timelineId, 0, 999),
    ])
      .then(([pageRes, allRes]) => {
        setAssessments(pageRes.content);
        setHasNext(!pageRes.last);
        setAllAssessments(allRes.content);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [timelineId, page, navigate]);

  return (
    <div className="min-h-screen flex bg-[#f6f3eb]">
      <Sidebar className="hidden md:flex fixed h-screen" />

      <div className="flex-1 md:ml-64 flex flex-col md:flex-row gap-8 px-4 md:px-10 py-6 md:py-10 pb-24 md:pb-10 items-start">

        {/* ── COLUNA ESQUERDA: lista ── */}
        <div className="flex-1 min-w-0">

          <div className="mb-8">
            <h1 className="text-4xl font-black text-[#1d2a3a]">Avaliações</h1>
            <p className="text-gray-500 mt-2">Teste seus conhecimentos sobre os eventos da linha do tempo.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 rounded-full border-4 border-[#d6a84f] border-t-transparent animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ClipboardList size={48} className="text-[#d6c9a8] mb-4" />
              <p className="text-gray-500 font-semibold">Erro ao carregar avaliações.</p>
              <button
                onClick={() => { setError(false); setLoading(true); getAssessmentsByTimeline(timelineId!, page).then(res => { setAssessments(res.content); setHasNext(!res.last); }).catch(() => setError(true)).finally(() => setLoading(false)); }}
                className="mt-4 px-5 py-2 rounded-2xl bg-[#d6a84f] text-white font-bold text-sm hover:bg-[#c89a3f] transition"
              >
                Tentar novamente
              </button>
            </div>
          ) : assessments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ClipboardList size={48} className="text-[#d6c9a8] mb-4" />
              <p className="text-gray-500 font-semibold">Nenhuma avaliação disponível.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {assessments.map((a, index) => {
                  const locked = !a.available;
                  const done = a.alreadyCompleted;
                  return (
                    <div
                      key={a.activityId}
                      onClick={() => setSelected(a)}
                      className={`
                        flex items-center gap-5 p-5 rounded-3xl border transition-all cursor-pointer
                        ${locked && !done
                          ? "bg-[#f0ece2] border-[#e5dccb] opacity-70"
                          : done
                          ? "bg-[#f0f7f0] border-[#b8d9b8] shadow-sm hover:border-[#7cb97c] hover:shadow-md hover:-translate-y-0.5"
                          : "bg-white border-[#e8dfcf] shadow-sm hover:border-[#d6a84f] hover:shadow-md hover:-translate-y-0.5"
                        }
                      `}
                    >
                      <div className={`w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border ${done ? "bg-[#e8f5e8] border-[#b8d9b8]" : "bg-[#f4ead7] border-[#e8dfcf]"}`}>
                        {a.imageUrl && !locked ? (
                          <img src={a.imageUrl} alt={a.activityName} className="w-full h-full object-cover" />
                        ) : locked && !done ? (
                          <Lock size={22} className="text-[#b0a080]" />
                        ) : done ? (
                          <span className="text-2xl font-black text-green-600">✓</span>
                        ) : (
                          <span className="text-2xl font-black text-[#d6a84f]">{index + 1}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#9b6d1d] uppercase tracking-wide mb-0.5">{a.unitName}</p>
                        <h2 className="text-base font-black text-[#2d2d2d] truncate">{a.activityName}</h2>
                        {a.minimumScore != null && (
                          <p className="text-xs text-gray-400 mt-1">
                            Mínimo: <span className="font-semibold text-gray-600">{a.minimumScore}%</span>
                          </p>
                        )}
                      </div>

                      <div className="flex-shrink-0 flex flex-col items-end gap-1">
                        {done ? (
                          <>
                            <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full">Realizada</span>
                            {a.previousScore != null && (
                              <span className={`text-xs font-semibold ${a.previousApproved ? "text-green-600" : "text-red-500"}`}>
                                {a.previousScore}% — {a.previousApproved ? "Aprovado" : "Reprovado"}
                              </span>
                            )}
                          </>
                        ) : locked ? (
                          <span className="text-xs font-bold text-[#b0a080] bg-[#ede8da] px-3 py-1.5 rounded-full">Bloqueado</span>
                        ) : (
                          <span className="text-xs font-bold text-[#9b6d1d] bg-[#f4ead7] px-3 py-1.5 rounded-full">Disponível</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {(page > 0 || hasNext) && (
                <div className="flex items-center gap-3 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    disabled={page === 0}
                    className="px-5 py-2.5 rounded-2xl border border-[#e8dfcf] text-sm font-semibold text-gray-600 hover:border-[#d6a84f] hover:text-[#d6a84f] transition disabled:opacity-30 disabled:pointer-events-none"
                  >
                    ← Anterior
                  </button>
                  <span className="text-sm text-gray-400 font-medium">Página {page + 1}</span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNext}
                    className="px-5 py-2.5 rounded-2xl border border-[#e8dfcf] text-sm font-semibold text-gray-600 hover:border-[#d6a84f] hover:text-[#d6a84f] transition disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Próxima →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── COLUNA DIREITA: resumo ── */}
        {!loading && allAssessments.length > 0 && (() => {
          const total = allAssessments.length;
          const done = allAssessments.filter(a => a.alreadyCompleted).length;
          const available = allAssessments.filter(a => a.available && !a.alreadyCompleted).length;
          const approved = allAssessments.filter(a => a.previousApproved).length;

          return (
            <div className="w-full md:w-64 flex-shrink-0 md:sticky top-10 space-y-4">
              <div className="bg-white border border-[#e8dfcf] rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-[#2d2d2d] uppercase tracking-wide">Seu progresso</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-sm font-black text-[#2d2d2d]">{total}</span>
                  </div>
                  <div className="w-full bg-[#f0e8d8] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-[#d6a84f] transition-all"
                      style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
                    <span className="text-xs text-gray-500 flex-1">Realizadas</span>
                    <span className="text-xs font-black text-[#2d2d2d]">{done}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={15} className="text-[#d6a84f] flex-shrink-0" />
                    <span className="text-xs text-gray-500 flex-1">Disponíveis</span>
                    <span className="text-xs font-black text-[#2d2d2d]">{available}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle size={15} className="text-[#c0b090] flex-shrink-0" />
                    <span className="text-xs text-gray-500 flex-1">Bloqueadas</span>
                    <span className="text-xs font-black text-[#2d2d2d]">{total - done - available}</span>
                  </div>
                </div>
              </div>

              {done > 0 && (
                <div className="bg-white border border-[#e8dfcf] rounded-3xl p-6 shadow-sm space-y-3">
                  <h3 className="text-sm font-black text-[#2d2d2d] uppercase tracking-wide">Aprovações</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-[#d6a84f]">{approved}</span>
                    <span className="text-sm text-gray-400 pb-1">de {done}</span>
                  </div>
                  <div className="w-full bg-[#f0e8d8] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all"
                      style={{ width: done > 0 ? `${(approved / done) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {selected && (
        <AssessmentPanel assessment={selected} onClose={() => setSelected(null)} />
      )}
      <BottomNav />
    </div>
  );
}
