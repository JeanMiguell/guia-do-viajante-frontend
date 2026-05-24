import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResults, EventResult } from "../services/resultService";
import { Sidebar } from "../pages/Sidebar";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { BarChart3 } from "lucide-react";
import { BottomNav } from "../app/components/BottomNav";

const PRIMARY = "#d6a84f";
const BG = "#f6f3eb";

export default function ResultsPage() {
  useAuthGuard();
  const [results, setResults] = useState<EventResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { timelineId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!timelineId) return;
    getResults(timelineId)
      .then(setResults)
      .catch((error: any) => {
        if (error.response?.status === 204) setResults([]);
      })
      .finally(() => setLoading(false));
  }, [timelineId]);

  if (!timelineId) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: BG }}>
        <p className="text-gray-500">Linha do tempo não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: BG }}>
      <Sidebar className="hidden md:flex fixed h-screen" />

      <main className="flex-1 md:ml-64 px-4 md:px-10 py-6 md:py-10 pb-24 md:pb-10 flex flex-col">

        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#1d2a3a]">Sua Jornada</h1>
          <p className="text-gray-500 mt-2">Acompanhe seu progresso em cada evento histórico.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-[#d6a84f] border-t-transparent animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#f4ead7] flex items-center justify-center mb-4">
              <BarChart3 size={28} className="text-[#d6a84f]" />
            </div>
            <p className="text-gray-700 font-black text-lg">Você ainda não iniciou sua jornada</p>
            <p className="text-gray-400 text-sm mt-1">Comece uma unidade para ver seu progresso aqui.</p>
            <button
              onClick={() => navigate(`/timeline/${timelineId}`)}
              className="mt-6 px-6 py-3 bg-[#d6a84f] hover:bg-[#c89a3f] text-white rounded-2xl font-bold text-sm transition"
            >
              Ir para a Linha do Tempo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {results.map((event) => {
              const completedUnits = event.units.filter((u) => u.status === "COMPLETED").length;
              const totalUnits = event.units.length;
              const percentage = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

              return (
                <div
                  key={event.eventId}
                  className="bg-white border border-[#e8dfcf] rounded-3xl overflow-hidden shadow-sm"
                >
                  {/* Imagem / banner */}
                  <div className="h-36 bg-[#f4ead7] relative overflow-hidden">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.eventName} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #f2e0b6 0%, #d6a84f 100%)" }}
                      >
                        <span className="text-5xl font-black text-white drop-shadow">
                          {event.eventName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-[#9b6d1d] border border-[#e8dfcf]">
                      {percentage}%
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Header */}
                    <div>
                      <h2 className="text-base font-black text-[#2d2d2d]">{event.eventName}</h2>
                      <p className="text-xs text-gray-400 mt-0.5">{completedUnits}/{totalUnits} unidades concluídas</p>
                    </div>

                    {/* Barra de progresso */}
                    <div className="w-full bg-[#f0e8d8] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, background: PRIMARY }}
                      />
                    </div>

                    {/* Resumo */}
                    <EventSummary units={event.units} />

                    {/* Lista de unidades */}
                    <div className="space-y-2">
                      {event.units.map((unit) => {
                        const color = getPerformanceColor(unit.correctAnswers, unit.totalQuestions);
                        return (
                          <div
                            key={unit.unitId}
                            className={`flex items-center justify-between px-3 py-2 rounded-2xl border text-xs ${color.container}`}
                          >
                            <div>
                              <p className="font-semibold text-gray-800">{unit.unitTitle}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">{getStatusLabel(unit.status)}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-xl text-[10px] font-black ${color.badge}`}>
                              {unit.status === "PENDING" ? "—" : `${unit.correctAnswers}/${unit.totalQuestions}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <BottomNav />
      </main>
    </div>
  );
}

function EventSummary({ units }: any) {
  const totalQuestions = units.reduce((acc: number, u: any) => acc + (u.totalQuestions || 0), 0);
  const totalCorrect = units.reduce((acc: number, u: any) => acc + (u.correctAnswers || 0), 0);
  const ratio = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;

  return (
    <div className="text-xs text-gray-600 bg-[#faf8f2] px-3 py-2 rounded-2xl border border-[#e8dfcf]">
      {getPerformanceMessage(ratio)} · <span className="font-semibold">{totalCorrect}</span> acertos no total
    </div>
  );
}

function getPerformanceMessage(ratio: number) {
  if (ratio === 1) return "Perfeito! Você dominou esse evento";
  if (ratio >= 0.7) return "Mandou bem! Você está evoluindo";
  if (ratio >= 0.4) return "Bom progresso! Continue praticando";
  if (ratio > 0) return "Você começou! Continue tentando";
  return "Ainda não iniciado";
}

function getStatusLabel(status: string) {
  switch (status) {
    case "COMPLETED": return "Concluída";
    case "IN_PROGRESS": return "Em andamento";
    case "PENDING": return "Pendente";
    default: return "";
  }
}

function getPerformanceColor(correct: number, total: number) {
  if (!total) return { container: "bg-gray-50 border-gray-200", badge: "bg-gray-200 text-gray-600" };
  const ratio = correct / total;
  if (ratio === 1) return { container: "bg-[#f3e7c9] border-[#d6a84f]", badge: "bg-[#d6a84f] text-white" };
  if (ratio >= 0.5) return { container: "bg-[#f9f3df] border-[#e5d49c]", badge: "bg-[#e5d49c] text-[#5c4a1a]" };
  return { container: "bg-[#fdf2f2] border-[#f5c2c2]", badge: "bg-[#f5c2c2] text-[#7a1f1f]" };
}
