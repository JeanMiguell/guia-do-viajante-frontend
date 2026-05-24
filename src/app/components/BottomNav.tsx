import { useNavigate, useLocation } from "react-router-dom";
import { Home, FileText, BarChart3, User, LogOut } from "lucide-react";
import { getCurrentTimelineId } from "../../utils/useCurrentTimeline";
import { ConfirmDialog } from "./ConfirmDialog";
import { useState } from "react";

const PRIMARY = "#d6a84f";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openLogout, setOpenLogout] = useState(false);

  const timelineId = getCurrentTimelineId();
  const withTimeline = (base: string) => timelineId ? `${base}/${timelineId}` : "/timelines";

  const items = [
    { id: "timeline",   label: "Início",     icon: Home,     path: withTimeline("/timeline") },
    { id: "assessment", label: "Avaliações", icon: FileText,  path: withTimeline("/assessment") },
    { id: "results",    label: "Progresso",  icon: BarChart3, path: withTimeline("/results") },
    { id: "perfil",     label: "Perfil",     icon: User,      path: "/perfil" },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e0d6] z-40">
        <div className="flex items-center justify-around px-2 py-1">
          {items.map(({ id, label, icon: Icon, path }) => {
            const active = location.pathname.startsWith("/" + path.split("/")[1]);
            return (
              <button
                key={id}
                onClick={() => navigate(path)}
                className="flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-2xl transition-all"
                style={{ background: active ? "#f4ead7" : "transparent" }}
              >
                <Icon className="w-5 h-5" style={{ color: active ? PRIMARY : "#9ca3af" }} />
                <span className="text-[10px] font-semibold" style={{ color: active ? PRIMARY : "#9ca3af" }}>
                  {label}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setOpenLogout(true)}
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="text-[10px] font-semibold text-red-400">Sair</span>
          </button>
        </div>
      </nav>

      <ConfirmDialog
        open={openLogout}
        title="Sair da linha do tempo"
        description="Deseja voltar para a lista de linhas do tempo?"
        confirmText="Sair"
        cancelText="Cancelar"
        onCancel={() => setOpenLogout(false)}
        onConfirm={() => navigate("/timelines")}
      />
    </>
  );
}
