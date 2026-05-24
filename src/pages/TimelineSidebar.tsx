import {
  BookOpen,
  PlusCircle,
  LogOut,
  Bell,
  X
} from "lucide-react";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import { ConfirmDialog } from "../app/components/ConfirmDialog";
import { getProfile } from "../services/userService";
import { countPendingInvites } from "../services/userTimeline/countPendingInvitesService";
import {
  getPendingInvites,
  PendingInviteDTO
} from "../services/userTimeline/getPendingInvitesService";
import { acceptInvite } from "../services/userTimeline/acceptInviteService";
import { rejectInvite } from "../services/userTimeline/rejectInviteService";
import { toast } from "sonner";

const PRIMARY = "#d6a84f";
const PRIMARY_LIGHT = "#f3e7c9";
const BORDER = "#e5e0d6";
const BG = "#f6f3eb";

export function TimelineSidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const [openLogout, setOpenLogout] = useState(false);
  const [openInvites, setOpenInvites] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [pendingInvites, setPendingInvites] = useState(0);
  const [invites, setInvites] = useState<PendingInviteDTO[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);

  useEffect(() => {
    loadSidebarData();
  }, []);

  const refreshInviteCount = async () => {
    try {
      const inviteData = await countPendingInvites();
      setPendingInvites(inviteData.count);
    } catch { }
  };

  const loadSidebarData = async () => {
    try {
      const profile = await getProfile();
      setUserType(profile.userType);
      if (profile.userType === "STUDENT") {
        await refreshInviteCount();
      }
    } catch { }
  };

  const loadPendingInvites = async () => {
    setOpenInvites(true);
    try {
      setLoadingInvites(true);
      const data = await getPendingInvites();
      setInvites(data);
    } catch {
      setInvites([]);
    } finally {
      setLoadingInvites(false);
    }
  };

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await acceptInvite(inviteId);
      toast.success("Convite aceito com sucesso!");
      setInvites(prev => prev.filter(i => i.inviteId !== inviteId));
      await refreshInviteCount();
    } catch {
      toast.error("Erro ao aceitar convite.");
    }
  };

  const handleRejectInvite = async (inviteId: string) => {
    try {
      await rejectInvite(inviteId);
      toast.success("Convite recusado com sucesso!");
      setInvites(prev => prev.filter(i => i.inviteId !== inviteId));
      await refreshInviteCount();
    } catch {
      toast.error("Erro ao recusar convite.");
    }
  };

  const menuItems = [
    {
      id: "timelines",
      label: "Linhas do tempo",
      icon: BookOpen,
      path: "/timelines",
    },
    ...(userType === "TEACHER"
      ? [
        {
          id: "create",
          label: "Criar linha do tempo",
          icon: PlusCircle,
          path: "/timelines/full/create",
        }
      ]
      : [])
  ];

  return (
    <>
      <aside
        className="
          hidden
          md:flex
          w-64
          flex-col
          border-r
        "
        style={{
          background: BG,
          borderColor: BORDER
        }}
      >
        <div
          className="p-6 border-b"
          style={{ borderColor: BORDER }}
        >
          <h1
            className="
              text-lg
              font-extrabold
              text-gray-800
              leading-tight
            "
          >
            Guia do Tempo
          </h1>

          <p className="text-xs text-gray-500 mt-1">
            Painel de linhas do tempo
          </p>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-2">
          {menuItems.map((item) => {

            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  group
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  ${active
                    ? "bg-white shadow-sm"
                    : "text-gray-600 hover:bg-white hover:shadow-sm"
                  }
                `}
                style={{
                  border: active
                    ? `2px solid ${PRIMARY}`
                    : "2px solid transparent",
                }}
              >
                <div
                  className="
                    w-9
                    h-9
                    flex
                    items-center
                    justify-center
                    rounded-full
                  "
                  style={{
                    background: active
                      ? PRIMARY_LIGHT
                      : "#f1f1f1",
                    color: active
                      ? PRIMARY
                      : "#6b7280",
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <span
                  style={{
                    color: active
                      ? "#1f2937"
                      : "#4b5563",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {userType === "STUDENT" && (
          <div className="px-4 pb-3">
            <button
              onClick={loadPendingInvites}
              className="
                relative
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-2xl
                text-sm
                font-semibold
                text-gray-600
                hover:bg-white
                hover:shadow-sm
                transition-all
              "
            >
              <div
                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  rounded-full
                "
                style={{
                  background: "#f1f1f1",
                  color: PRIMARY,
                }}
              >
                <Bell className="w-5 h-5" />
              </div>

              <span>Convites</span>

              {pendingInvites > 0 && (
                <div
                  className="
                    absolute
                    right-4
                    min-w-[24px]
                    h-6
                    px-2
                    flex
                    items-center
                    justify-center
                    rounded-full
                    text-xs
                    font-bold
                    text-white
                  "
                  style={{
                    background: PRIMARY
                  }}
                >
                  {pendingInvites}
                </div>
              )}
            </button>
          </div>
        )}

        <div
          className="p-4 border-t"
          style={{ borderColor: BORDER }}
        >
          <button
            onClick={() => setOpenLogout(true)}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-2xl
              text-sm
              font-semibold
              text-gray-600
              hover:bg-white
              hover:shadow-sm
              transition-all
            "
          >
            <div
              className="
                w-9
                h-9
                flex
                items-center
                justify-center
                rounded-full
              "
              style={{
                background: "#f1f1f1",
                color: "#ef4444",
              }}
            >
              <LogOut className="w-5 h-5" />
            </div>

            <span>Sair</span>
          </button>

          <ConfirmDialog
            open={openLogout}
            title="Sair da conta"
            description="Tem certeza que deseja sair do sistema?"
            confirmText="Sair"
            cancelText="Cancelar"
            onCancel={() => setOpenLogout(false)}
            onConfirm={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          />
        </div>
      </aside>

      {/* ── BOTTOM NAV MOBILE ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e5e0d6] z-40">
        <div className="flex items-center justify-around px-2 py-1">
          {menuItems.map(({ id, label, icon: Icon, path }) => {
            const active = location.pathname === path;
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

          {userType === "STUDENT" && (
            <button
              onClick={loadPendingInvites}
              className="relative flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-2xl transition-all"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] font-semibold text-gray-400">Convites</span>
              {pendingInvites > 0 && (
                <span className="absolute top-1 right-0 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: PRIMARY }}>
                  {pendingInvites}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setOpenLogout(true)}
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span className="text-[10px] font-semibold text-red-400">Sair</span>
          </button>
        </div>
      </nav>

      {openInvites && (
        <>
          {/* Backdrop invisível pra fechar ao clicar fora */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenInvites(false)}
          />

          {/* Painel expandido à direita da sidebar (desktop) / cobrindo tela (mobile) */}
          <div
            className="fixed top-0 h-screen bg-[#f6f3eb] border-r z-50 flex flex-col shadow-xl left-0 right-0 md:right-auto md:w-80 md:left-64"
            style={{ borderColor: BORDER }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b" style={{ borderColor: BORDER }}>
              <div>
                <h2 className="text-base font-black text-[#1d2a3a]">Convites pendentes</h2>
                {pendingInvites > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">{pendingInvites} aguardando resposta</p>
                )}
              </div>
              <button
                onClick={() => setOpenInvites(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#e5e0d6] flex items-center justify-center text-gray-400 hover:text-gray-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto p-4">
              {loadingInvites ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-8 h-8 rounded-full border-4 border-[#d6a84f] border-t-transparent animate-spin" />
                </div>
              ) : invites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Bell className="w-8 h-8 text-[#d6c9a8] mb-3" />
                  <p className="text-sm text-gray-500 font-semibold">Nenhum convite pendente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invites.map((invite) => (
                    <div
                      key={invite.inviteId}
                      className="bg-white border border-[#e8dfcf] rounded-2xl p-4 space-y-3"
                    >
                      <div>
                        <p className="text-sm font-black text-[#2d2d2d]">{invite.timelineName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Convidado por <span className="font-semibold text-gray-600">{invite.teacherName}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptInvite(invite.inviteId)}
                          className="flex-1 py-2 rounded-xl text-white text-xs font-bold transition hover:opacity-90"
                          style={{ background: PRIMARY }}
                        >
                          Aceitar
                        </button>
                        <button
                          onClick={() => handleRejectInvite(invite.inviteId)}
                          className="flex-1 py-2 rounded-xl bg-[#f0ece2] text-gray-600 text-xs font-bold hover:bg-[#e8e0d0] transition"
                        >
                          Recusar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}