import { X, Lock } from "lucide-react";

type Unit = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

type Props = {
  event: any;
  units: Unit[];
  onClose: () => void;
  onSelectUnit: (unitId: string) => void;
};

export function EventPanel({ event, units, onClose, onSelectUnit }: Props) {
  if (!event) return null;

  return (
    <>
      {/* overlay escuro no mobile */}
      <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={onClose} />

      <div
        className="
          fixed z-50
          bg-[#f6f3eb]
          border-[#e5e0d6]
          flex flex-col
          bottom-0 left-0 right-0 h-[85vh] rounded-t-3xl border-t
          md:bottom-auto md:left-auto md:right-0 md:top-0 md:w-[520px] md:h-screen md:rounded-none md:border-t-0 md:border-l
        "
      >
      {/* handle mobile */}
      <div className="flex justify-center pt-3 pb-1 md:hidden">
        <div className="w-10 h-1 rounded-full bg-[#d6c9a8]" />
      </div>

      {/* HEADER */}
      <div className="px-6 pt-4 md:pt-6 pb-2 flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{event.period}</p>
          <h2 className="text-xl font-black text-gray-800">
            {event.title}
          </h2>
        </div>

        <button onClick={onClose}>
          <X className="hover:scale-110 transition" />
        </button>
      </div>

      {/* CONTEÚDO COM SCROLL */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-10">

        {/* IMAGEM */}
        <div className="flex justify-center mb-6">
          <img
            src={event.imageUrl}
            className="w-[220px] h-[220px] object-cover"
          />
        </div>

        {/* TEXTO DO EVENTO */}
        {event.introText && (
          <div className="flex justify-center mb-6">
            <div
              className="
                bg-white
                border border-[#e5e0d6]
                rounded-2xl
                px-6 py-4
                text-sm
                text-gray-600
                leading-relaxed
                text-center
                shadow-sm
                max-w-[380px]
              "
            >
              {event.introText}
            </div>
          </div>
        )}

        {/* DESCRIÇÃO */}
        <p className="text-sm text-gray-600 mb-6 text-center">
          {event.description}
        </p>

        <div className="border-t border-[#e5e0d6] mb-6" />

        {/* UNIDADES */}
        <div className="flex flex-col gap-4">
          {units.map((unit) => {
            const locked = !unit.unlocked;

            return (
              <div
                key={unit.id}
                onClick={() => !locked && onSelectUnit(unit.id)}
                className={`
                  p-4 rounded-xl transition-all
                  ${
                    locked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : `
                        bg-white border border-[#e5e0d6]
                        hover:shadow-md hover:border-[#d6a84f]
                        cursor-pointer
                      `
                  }
                `}
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-sm">
                    {unit.title}
                  </h3>

                  {locked && <Lock className="w-4 h-4" />}
                </div>

                <p className="text-xs text-gray-500">
                  {unit.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
    </>
  );
}