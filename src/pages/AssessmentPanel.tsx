import { X, Lock, ClipboardCheck, Percent, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

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

type Props = {
  assessment: Assessment;
  onClose: () => void;
};

export function AssessmentPanel({ assessment, onClose }: Props) {
  const navigate = useNavigate();
  const startY = useRef<number>(0);
  const dragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => { startY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e: React.TouchEvent) => { if (e.changedTouches[0].clientY - startY.current > 80) onClose(); };
  const handleMouseDown = (e: React.MouseEvent) => { dragging.current = true; startY.current = e.clientY; };
  const handleMouseUp = (e: React.MouseEvent) => { if (dragging.current && e.clientY - startY.current > 80) onClose(); dragging.current = false; };

  const handleStart = () => {
    if (!assessment.available) return;
    navigate(`/activities/start/${assessment.activityId}`);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      <div className="
        fixed z-50 bg-[#f6f3eb] border-[#e8dfcf] flex flex-col shadow-xl
        bottom-0 left-0 right-0 h-[90vh] rounded-t-3xl border-t
        md:bottom-auto md:left-auto md:right-0 md:top-0 md:w-[480px] md:h-screen md:rounded-none md:border-t-0 md:border-l
      ">

        {/* handle mobile */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab select-none md:hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <div className="w-10 h-1 rounded-full bg-[#d6c9a8]" />
        </div>

        {/* Header */}
        <div className="px-6 md:px-8 py-4 md:py-6 border-b border-[#e8dfcf]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#9b6d1d] uppercase tracking-wide mb-1">
                {assessment.unitName}
              </p>
              <h2 className="text-xl md:text-2xl font-black text-[#1d2a3a] leading-tight">
                {assessment.activityName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white border border-[#e8dfcf] flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-[#d6a84f] transition flex-shrink-0 mt-0.5"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scroll */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 pt-5 pb-4 space-y-3">

          {/* Imagem */}
          {assessment.imageUrl && assessment.available && (
            <img
              src={assessment.imageUrl}
              alt={assessment.activityName}
              className="w-full h-32 md:h-36 object-cover rounded-2xl border border-[#e8dfcf]"
            />
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {assessment.questionCount != null && (
              <div className="bg-white border border-[#e8dfcf] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#f4ead7] flex items-center justify-center flex-shrink-0">
                  <BookOpen size={16} className="text-[#9b6d1d]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Questões</p>
                  <p className="text-base font-black text-[#2d2d2d]">{assessment.questionCount}</p>
                </div>
              </div>
            )}
            {assessment.minimumScore != null && (
              <div className="bg-white border border-[#e8dfcf] rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#f4ead7] flex items-center justify-center flex-shrink-0">
                  <Percent size={16} className="text-[#9b6d1d]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium">Mínimo</p>
                  <p className="text-base font-black text-[#2d2d2d]">{assessment.minimumScore}%</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-[#e8dfcf] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardCheck size={15} className="text-[#9b6d1d]" />
              <span className="text-xs font-bold text-[#9b6d1d] uppercase tracking-wide">Instruções</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Responda todas as questões com atenção. Você precisa atingir a nota mínima para ser aprovado nesta avaliação.
            </p>
          </div>

          {/* Resultado anterior */}
          {assessment.alreadyCompleted && assessment.previousScore != null && (
            <div className={`p-4 rounded-2xl border flex items-center gap-3 ${assessment.previousApproved ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              {assessment.previousApproved
                ? <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                : <XCircle size={20} className="text-red-500 flex-shrink-0" />
              }
              <div>
                <p className="text-sm font-black text-gray-800">Sua nota: {assessment.previousScore}%</p>
                <p className={`text-xs font-semibold ${assessment.previousApproved ? "text-green-700" : "text-red-600"}`}>
                  {assessment.previousApproved ? "Aprovado" : "Não aprovado"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botão */}
        <div className="px-6 md:px-8 py-5 border-t border-[#e8dfcf]">
          {assessment.alreadyCompleted ? (
            <button disabled className="w-full py-4 rounded-2xl bg-green-100 text-green-700 font-black text-base flex items-center justify-center gap-2 cursor-not-allowed border border-green-200">
              <CheckCircle size={18} />
              Avaliação Já Realizada
            </button>
          ) : assessment.available ? (
            <button onClick={handleStart} className="w-full py-4 rounded-2xl bg-[#d6a84f] hover:bg-[#c89a3f] text-white font-black text-base transition shadow-sm">
              Iniciar Avaliação
            </button>
          ) : (
            <button disabled className="w-full py-4 rounded-2xl bg-[#e8dfcf] text-[#b0a080] font-black text-base flex items-center justify-center gap-2 cursor-not-allowed">
              <Lock size={18} />
              Avaliação Bloqueada
            </button>
          )}
        </div>
      </div>
    </>
  );
}
