import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUnitContents } from "../services/unitContentService";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { getCurrentTimelineId } from "../utils/useCurrentTimeline";
import defaultContent from "../images/default-content.png";
import mascot from "../images/mascote_correndo.png";
import mascotOld from "../assets/mascot.png";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

const PRIMARY = "#d6a84f";
const PRIMARY_DARK = "#a67c2e";
const BG = "#f6f3eb";

type UnitContent = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  hint?: string;
  pageOrder: number;
  layout?: string;
};

function TrailProgress({ current, total }: { current: number; total: number }) {
  const pct = total <= 1 ? 100 : (current / (total - 1)) * 100;

  return (
    <div className="relative flex items-center w-full px-4 py-0" style={{ height: 56 }}>

      {/* trilha */}
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-2 rounded-full" style={{ background: "#e0d8c8" }} />
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2 h-2 rounded-full transition-all duration-500"
        style={{ width: `calc(${pct}% - 0px)`, background: `linear-gradient(90deg, ${PRIMARY_DARK}, ${PRIMARY})` }}
      />

      {/* checkpoints */}
      {Array.from({ length: total }).map((_, i) => {
        const left = total === 1 ? 50 : (i / (total - 1)) * 100;
        const done = i < current;
        const active = i === current;
        return (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 transition-all duration-300"
            style={{
              left: `calc(${left}% * (100% - 32px) / 100% + 16px)`,
              width: active ? 18 : 14,
              height: active ? 18 : 14,
              background: done ? PRIMARY_DARK : active ? PRIMARY : "#e0d8c8",
              borderColor: done || active ? PRIMARY_DARK : "#c8bfad",
              boxShadow: active ? `0 0 0 3px ${PRIMARY}44` : "none",
            }}
          />
        );
      })}

      {/* mascote — só desktop */}
      <img
        src={mascot}
        alt="mascote"
        className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 drop-shadow-md hidden md:block"
        style={{
          left: `calc(${pct}% * (100% - 32px) / 100% + 16px)`,
          top: "50%",
          height: 80,
          width: "auto",
        }}
      />
    </div>
  );
}

export function UnitPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  useAuthGuard();

  const [contents, setContents] = useState<UnitContent[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [imageExplored, setImageExplored] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    if (id) {
      getUnitContents(id)
        .then(setContents)
        .catch((error: any) => {
          if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem("token");
            navigate("/login", { replace: true });
          }
        });
    }
  }, [id, navigate]);

  const currentContent = contents[currentPage];
  const isLastPage = currentPage === contents.length - 1;

  const scrollRef = useRef<HTMLDivElement>(null);

  const goNext = () => { setCurrentPage((p) => p + 1); setImageExplored(false); setShowHint(false); scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }); };
  const goPrev = () => { setCurrentPage((p) => p - 1); setImageExplored(false); setShowHint(false); scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }); };

  if (!currentContent) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: BG }}>
        <span>Carregando...</span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: BG }}>

      {/* TOPO */}
      <div className="flex-shrink-0 flex items-center gap-4 px-4 pr-6 pt-3" style={{ background: BG }}>
        <button
          onClick={() => setShowExitModal(true)}
          className="flex items-center gap-1.5 text-gray-600 hover:text-black transition text-sm font-medium whitespace-nowrap flex-shrink-0 py-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <div className="flex-1">
          <TrailProgress current={currentPage} total={contents.length} />
        </div>
        <span className="text-xs font-bold text-gray-400 whitespace-nowrap flex-shrink-0">
          {currentPage + 1} / {contents.length}
        </span>
      </div>

      {/* CONTEÚDO */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col items-center px-6 pb-10 pt-4">
        <div className="bg-white max-w-6xl w-full rounded-2xl shadow-sm border border-[#e5e0d6] p-8 space-y-6">

          <div className="text-center">
            <h1 className="text-xl font-black text-gray-800">{currentContent.title}</h1>
          </div>

          {(() => {
            const layout = currentContent.layout ?? "TEXT_LEFT";
            const textOnly = layout === "TEXT_ONLY";
            const imageOnly = layout === "IMAGE_ONLY";
            const imageLeft = layout === "TEXT_RIGHT";

            const textBlock = (
              <div className="flex-1 flex flex-col gap-5 w-full">
                {showHint && currentContent.hint && (
                  <div className="flex items-center gap-3">
                    <img src={mascotOld} alt="mascote" className="w-16 h-16 md:w-36 md:h-36 object-contain flex-shrink-0 drop-shadow-sm self-end" />
                    <div className="relative bg-[#fff8ec] border border-[#e8d9b0] rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
                      <div className="absolute -left-2 bottom-4 w-0 h-0" style={{ borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: "10px solid #e8d9b0" }} />
                      <div className="absolute -left-1.5 bottom-4 w-0 h-0" style={{ borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderRight: "9px solid #fff8ec" }} />
                      <p className="text-base text-[#7a5c1e] font-medium">💡 {currentContent.hint}</p>
                    </div>
                  </div>
                )}
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">{currentContent.content}</p>
              </div>
            );

            const imageBlock = (
              <div className="relative w-full md:w-[48%] md:flex-shrink-0">
                <img
                  src={currentContent.imageUrl || defaultContent}
                  alt="Imagem da unidade"
                  onClick={() => { setImageExplored(true); setShowHint(true); }}
                  className={`w-full max-h-[320px] md:max-h-[440px] object-contain rounded-2xl cursor-pointer transition-all duration-500 ${imageExplored ? "grayscale-0" : "grayscale"}`}
                />
                {!imageExplored && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                    Clique para explorar
                  </div>
                )}
              </div>
            );

            if (textOnly) return <div className="flex flex-col gap-5">{textBlock}</div>;
            if (imageOnly) return <div className="flex justify-center">{imageBlock}</div>;

            return (
              <div className={`flex flex-col md:flex-row gap-8 items-center ${imageLeft ? "md:flex-row-reverse" : ""}`}>
                {textBlock}
                {imageBlock}
              </div>
            );
          })()}


          {isLastPage && (
            <div className="text-center space-y-3">
              <p className="text-[#a67c2e] font-semibold">✔ Conteúdo concluído!</p>
              <button
                onClick={() => navigate(`/activities/${id}`)}
                className="px-6 py-3 rounded-xl font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-lg"
                style={{ background: PRIMARY, color: "black" }}
              >
                Iniciar Exercícios
              </button>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              disabled={currentPage === 0}
              onClick={goPrev}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-[#e8dfcf] text-sm font-semibold text-gray-600 hover:border-[#d6a84f] hover:text-[#d6a84f] transition disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft size={16} /> Anterior
            </button>

            <button
              disabled={isLastPage}
              onClick={goNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none"
              style={{ background: PRIMARY }}
            >
              Próximo <ChevronRight size={16} />
            </button>
          </div>

        </div>
      </div>

      {showExitModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#e5e0d6] shadow-xl">
            <h2 className="text-lg font-black text-gray-800 mb-2">Sair da unidade?</h2>
            <p className="text-sm text-gray-500 mb-6">Seu progresso nesta unidade será perdido.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 rounded-xl border border-[#e8dfcf] text-sm font-semibold text-gray-600 hover:border-[#d6a84f] transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const timelineId = getCurrentTimelineId();
                  timelineId ? navigate(`/timeline/${timelineId}`) : navigate(-1);
                }}
                className="px-4 py-2 text-white rounded-xl text-sm font-bold"
                style={{ background: "#ef4444" }}
              >
                Sair mesmo assim
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
