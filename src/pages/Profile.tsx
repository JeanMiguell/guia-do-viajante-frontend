import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../pages/Sidebar";
import { getProfile } from "../services/userService";
import { getTimelines } from "../services/timeline/getTimelinesService";

import { User, Mail, Calendar, Venus, Mars, BookOpen } from "lucide-react";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { setCurrentTimelineId } from "../utils/useCurrentTimeline";
import { BottomNav } from "../app/components/BottomNav";

interface UserDTO {
  id: string;
  name: string;
  email: string;
  birthdate: string;
  avatar: string;
  gender: string;
}

interface Timeline {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
}


export function Profile() {
  useAuthGuard();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDTO | null>(null);
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [profile, timelinesRes] = await Promise.all([
        getProfile(),
        getTimelines(0, 20),
      ]);
      setUser(profile);

      const tls: Timeline[] = timelinesRes.content ?? [];
      setTimelines(tls);
    } catch {
      // silencia erros de carregamento parcial
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f6f3eb]">
      <Sidebar className="hidden md:flex fixed h-screen" />

      <main className="flex-1 md:ml-64 px-4 md:px-10 py-6 md:py-10 pb-24 md:pb-10 overflow-x-hidden min-w-0">

        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-black text-[#1d2a3a]">Perfil</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Suas informações e progresso como viajante do tempo.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 rounded-full border-4 border-[#d6a84f] border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-start w-full min-w-0">

            {/* ── COLUNA ESQUERDA ── */}
            <div className="flex flex-col gap-4 w-full md:w-80 md:flex-shrink-0">

              {/* Avatar + nome */}
              {user && (
                <div className="bg-white border border-[#e8dfcf] rounded-3xl p-6 shadow-sm flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#f4ead7] border border-[#e8dfcf] flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      : <User size={28} className="text-[#d6a84f]" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-black text-[#1d2a3a] leading-tight">{user.name}</p>
                    {user.gender && (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-bold text-[#9b6d1d] bg-[#f4ead7] px-2.5 py-1 rounded-full">
                        {user.gender === "FEMALE" ? <Venus size={11} /> : user.gender === "MALE" ? <Mars size={11} /> : null}
                        {translateGender(user.gender)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Informações */}
              {user && (
                <div className="bg-white border border-[#e8dfcf] rounded-3xl p-5 shadow-sm space-y-3">
                  <h2 className="text-xs font-black text-[#2d2d2d] uppercase tracking-wide">Informações</h2>
                  <InfoRow icon={Mail} label="Email" value={user.email} />
                  <InfoRow icon={Calendar} label="Nascimento" value={formatDate(user.birthdate)} />
                </div>
              )}
            </div>

            {/* ── COLUNA DIREITA ── */}
            <div className="flex-1 min-w-0 w-full space-y-6">

              {/* Linhas do tempo */}
              {timelines.length > 0 && (
                <div>
                  <h2 className="text-sm font-black text-[#2d2d2d] uppercase tracking-wide mb-3">
                    Minhas linhas do tempo
                  </h2>
                  <div className="space-y-3">
                    {timelines.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setCurrentTimelineId(t.id);
                          navigate(`/timeline/${t.id}`);
                        }}
                        className="w-full flex items-center gap-3 p-4 bg-white border border-[#e8dfcf] rounded-3xl shadow-sm hover:border-[#d6a84f] hover:shadow-md hover:-translate-y-0.5 transition-all text-left overflow-hidden"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-[#f4ead7] border border-[#e8dfcf] flex-shrink-0 overflow-hidden">
                          {t.imageUrl
                            ? <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center">
                                <BookOpen size={18} className="text-[#d6a84f]" />
                              </div>
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-[#2d2d2d] truncate">{t.name}</p>
                          {t.description && (
                            <p className="text-xs text-gray-400 truncate mt-0.5">{t.description}</p>
                          )}
                        </div>
                        <span className="ml-auto text-[#d6a84f] text-lg flex-shrink-0">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
        <BottomNav />
      </main>
    </div>
  );
}


function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#faf8f2] border border-[#e8dfcf]">
      <div className="w-8 h-8 rounded-xl bg-[#f4ead7] flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-[#9b6d1d]" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-[#2d2d2d]">{value}</p>
      </div>
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return "—";
  const [year, month, day] = date.split("-");
  const months = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  return `${Number(day)} de ${months[Number(month) - 1]} de ${year}`;
}

function translateGender(gender: string) {
  switch (gender) {
    case "MASCULINO": return "Masculino";
    case "FEMININO": return "Feminino";
    default: return gender;
  }
}
