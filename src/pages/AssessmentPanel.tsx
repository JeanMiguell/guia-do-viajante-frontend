import { X, Lock, ClipboardCheck, Percent, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  const handleStart = () => {
    if (!assessment.available) return;
    navigate(`/activities/start/${assessment.activityId}`);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Painel */}
      <div className="fixed right-0 top-0 w-[480px] h-screen bg-[#f6f3eb] border-l border-[#e8dfcf] z-50 flex flex-col shadow-xl">

        {/* Header */}
        <div className="px-8 py-6 border-b border-[#e8dfcf]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#9b6d1d] uppercase tracking-wide mb-1">
                {assessment.unitName}
              </p>
              <h2 className="text-2xl font-black text-[#1d2a3a] leading-tight">
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

        {/* Imagem */}
        {assessment.imageUrl && assessment.available && (
          <div className="px-8 pt-6">
            <img
              src={assessment.imageUrl}
              alt={assessment.activityName}
              className="w-full h-36 object-cover rounded-2xl border border-[#e8dfcf]"
            />
          </div>
        )}

        {/* Infos */}
        <div className="px-8 pt-6 space-y-3 flex-1">
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
        </div>

        {/* Resultado anterior se já realizada */}
        {assessment.alreadyCompleted && assessment.previousScore != null && (
          <div className={`mx-8 mb-4 p-4 rounded-2xl border flex items-center gap-3 ${assessment.previousApproved ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
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

        {/* Botão */}
        <div className="px-8 py-6 border-t border-[#e8dfcf]">
          {assessment.alreadyCompleted ? (
            <button
              disabled
              className="w-full py-4 rounded-2xl bg-green-100 text-green-700 font-black text-base flex items-center justify-center gap-2 cursor-not-allowed border border-green-200"
            >
              <CheckCircle size={18} />
              Avaliação Já Realizada
            </button>
          ) : assessment.available ? (
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-2xl bg-[#d6a84f] hover:bg-[#c89a3f] text-white font-black text-base transition shadow-sm"
            >
              Iniciar Avaliação
            </button>
          ) : (
            <button
              disabled
              className="w-full py-4 rounded-2xl bg-[#e8dfcf] text-[#b0a080] font-black text-base flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Lock size={18} />
              Avaliação Bloqueada
            </button>
          )}
        </div>
      </div>
    </>
  );
}
