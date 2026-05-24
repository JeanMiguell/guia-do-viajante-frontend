import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, BarChart3, User, LogOut } from 'lucide-react';
import { ConfirmDialog } from '../app/components/ConfirmDialog';
import { useState } from 'react';
import { getCurrentTimelineId } from "../utils/useCurrentTimeline";

const PRIMARY = "#d6a84f";
const PRIMARY_LIGHT = "#f3e7c9";
const BORDER = "#e5e0d6";
const BG = "#f6f3eb";

export function Sidebar({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openLogout, setOpenLogout] = useState(false);

  const timelineId = getCurrentTimelineId();

  const withTimeline = (base: string) => {
    return timelineId ? `${base}/${timelineId}` : "/timelines";
  };

  const menuItems = [
    { id: 'timeline', label: 'Linha do Tempo', icon: Home, path: withTimeline('/timeline') },
    { id: 'assessment', label: 'Avaliação', icon: FileText, path: withTimeline('/assessment') },
    { id: 'resultados', label: 'Progresso', icon: BarChart3, path: withTimeline('/results') },
    { id: 'perfil', label: 'Perfil', icon: User, path: '/perfil' },
  ];

  return (
    <aside
      className={`hidden md:flex w-64 flex-col border-r ${className}`}
      style={{ background: BG, borderColor: BORDER }}
    >

      {/* HEADER */}
      <div className="p-6 border-b" style={{ borderColor: BORDER }}>
        <h1 className="text-lg font-extrabold text-gray-800 leading-tight">
          Guia do Viajante<br />do Tempo
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Explore a história do Brasil
        </p>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 mt-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname.startsWith('/' + item.path.split('/')[1]);

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                group w-full flex items-center gap-3 px-4 py-3 rounded-2xl
                text-sm font-semibold transition-all duration-200
                ${active
                  ? 'bg-white shadow-sm'
                  : 'text-gray-600 hover:bg-white hover:shadow-sm'}
              `}
              style={{
                border: active ? `2px solid ${PRIMARY}` : '2px solid transparent'
              }}
            >
              <div
                className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
                style={{
                  background: active ? PRIMARY_LIGHT : '#f1f1f1',
                  color: active ? PRIMARY : '#6b7280'
                }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <span className="flex-1 text-left" style={{ color: active ? '#1f2937' : '#4b5563' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t" style={{ borderColor: BORDER }}>
        <button
          onClick={() => setOpenLogout(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-white hover:shadow-sm transition-all"
        >
          <div
            className="w-9 h-9 flex items-center justify-center rounded-full"
            style={{ background: '#f1f1f1', color: '#ef4444' }}
          >
            <LogOut className="w-5 h-5" />
          </div>
          <span>Sair</span>
        </button>

        <ConfirmDialog
          open={openLogout}
          title="Sair da linha do tempo"
          description="Deseja voltar para a lista de linhas do tempo?"
          confirmText="Sair"
          cancelText="Cancelar"
          onCancel={() => setOpenLogout(false)}
          onConfirm={() => navigate("/timelines")}
        />
      </div>
    </aside>
  );
}
