import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Pencil, BarChart3 } from "lucide-react";
import { getTimelines } from "../../services/timeline/getTimelinesService";
import { getProfile } from "../../services/userService";
import { TimelineSidebar } from "../../pages/TimelineSidebar";
import { setCurrentTimelineId } from "../../utils/useCurrentTimeline";

type Timeline = {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  userId?: string;
};

type User = {
  id: string;
};

const PRIMARY = "#d6a84f";

export function Timelines() {

  const navigate = useNavigate();

  const [timelines, setTimelines] = useState<Timeline[]>([]);

  const [loading, setLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {

      const [
        profileResponse,
        timelinesResponse
      ] = await Promise.all([
        getProfile(),
        getTimelines()
      ]);

      setCurrentUser(profileResponse);

      setTimelines(timelinesResponse.content);

    } catch {

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f6f3eb]">

      <TimelineSidebar />

      <div className="flex-1 pb-24 md:pb-0">

        <header className="px-10 py-8 border-b border-[#e5e0d6]">

          <h1 className="text-4xl font-black text-[#1d2a3a]">
            Escolha uma linha do tempo
          </h1>

          <p className="text-gray-500 mt-2">
            Selecione uma para começar a aprender
          </p>

        </header>

        {
          loading && (
            <div className="p-10 text-gray-500">
              Carregando...
            </div>
          )
        }

        {
          !loading && (
            <div
              className="
                p-10
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-3
                gap-8
              "
            >

              {
                timelines.map((t) => {

                  const isOwner =
                    currentUser?.id === t.userId;

                  return (
                    <div
                      key={t.id}
                      className="
                        relative
                        bg-white
                        border
                        border-[#e5e0d6]
                        rounded-3xl
                        overflow-hidden
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:shadow-xl
                        hover:border-[#d6a84f]
                      "
                    >

                      {
                        isOwner && (
                          <div className="absolute top-4 right-4 z-20">

                            <button
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === t.id
                                    ? null
                                    : t.id
                                )
                              }
                              className="
                                w-10
                                h-10
                                rounded-full
                                bg-white/90
                                backdrop-blur
                                flex
                                items-center
                                justify-center
                                shadow-md
                                hover:bg-[#f8f2e7]
                                transition
                              "
                            >

                              <MoreVertical size={18} />

                            </button>

                            {
                              openMenuId === t.id && (
                                <div
                                  className="
                                    absolute
                                    right-0
                                    mt-2
                                    w-52
                                    bg-white
                                    border
                                    border-[#ece5d8]
                                    rounded-2xl
                                    shadow-xl
                                    overflow-hidden
                                  "
                                >

                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/timelines/full/update/${t.id}`
                                      )
                                    }
                                    className="
                                      w-full
                                      flex
                                      items-center
                                      gap-3
                                      px-4
                                      py-3
                                      text-sm
                                      font-semibold
                                      hover:bg-[#f8f2e7]
                                      transition
                                    "
                                  >

                                    <Pencil
                                      size={16}
                                      className="text-[#b78b35]"
                                    />

                                    Editar timeline

                                  </button>

                                  <button
                                    onClick={() =>
                                      navigate(
                                        `/timelines/${t.id}/progress`
                                      )
                                    }
                                    className="
                                      w-full
                                      flex
                                      items-center
                                      gap-3
                                      px-4
                                      py-3
                                      text-sm
                                      font-semibold
                                      hover:bg-[#f8f2e7]
                                      transition
                                    "
                                  >

                                    <BarChart3
                                      size={16}
                                      className="text-[#b78b35]"
                                    />

                                    Progresso dos Alunos

                                  </button>

                                </div>
                              )
                            }

                          </div>
                        )
                      }

                      <div
                        onClick={() => {
                          setCurrentTimelineId(t.id);
                          navigate(`/timeline/${t.id}`);
                        }}
                        className="cursor-pointer"
                      >

                        <div className="h-52 bg-[#ececec] overflow-hidden">

                          {t.imageUrl ? (
                              <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-[#f4ead7] flex items-center justify-center">
                                <span className="text-5xl font-black text-[#d6a84f]">{t.name.charAt(0).toUpperCase()}</span>
                              </div>
                            )}

                        </div>

                        <div className="p-6">

                          <h2
                            className="
                              text-2xl
                              font-black
                              text-[#1d2a3a]
                              mb-3
                            "
                          >
                            {t.name}
                          </h2>

                          <p
                            className="
                              text-gray-600
                              line-clamp-3
                              leading-relaxed
                            "
                          >
                            {
                              t.description ||
                              "Sem descrição"
                            }
                          </p>

                        </div>

                        <div className="px-6 pb-6">

                          <div
                            className="
                              w-full
                              text-center
                              py-3
                              rounded-2xl
                              text-sm
                              font-bold
                              bg-[#f6f3eb]
                              border
                              border-[#e5e0d6]
                            "
                            style={{
                              color: PRIMARY
                            }}
                          >
                            Acessar
                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })
              }

            </div>
          )
        }

      </div>

    </div>
  );
}