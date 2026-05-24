import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import { Lock, CheckCircle, Star } from 'lucide-react';
import { Sidebar } from '../Sidebar';
import { BottomNav } from '../../app/components/BottomNav';
import { motion } from 'framer-motion';
import { useParams } from "react-router-dom";
import { getUnitsByEvent } from '../../services/unitService';
import { EventPanel } from '../../app/components/ui/EventPanel';
import { useRef } from "react";
import { setCurrentTimelineId } from "../../utils/useCurrentTimeline";
import { getCompleteTimelineById, TimelineDTO } from '../../services/timeline/getCompleteTimelineService';

type TimelineEvent = {
  id: string;
  title: string;
  year: string;
  locked: boolean;
  completed: boolean;
  color: string;
  imageUrl?: string;
  introText?: string;
};

const PRIMARY = "#d6a84f";
const PRIMARY_DARK = "#a67c2e";
const BG = "#f6f3eb";

function ElbowConnector({
  fromX,
  toX,
  locked,
}: {
  fromX: number;
  toX: number;
  locked: boolean;
}) {
  const height = 72;
  const cx = 100;
  const startX = cx + fromX;
  const endX = cx + toX;
  const midY = height / 2;
  const r = 16;

  const goingRight = endX > startX;
  const rx = goingRight ? r : -r;


  const d = [
    `M ${startX} 0`,
    `L ${startX} ${midY - r}`,
    `Q ${startX} ${midY} ${startX + rx} ${midY}`,
    `L ${endX - rx} ${midY}`,
    `Q ${endX} ${midY} ${endX} ${midY + r}`,
    `L ${endX} ${height}`,
  ].join(' ');

  return (
    <svg width="200" height={height} className="mx-auto">
      <path
        d={d}
        fill="none"
        stroke={locked ? '#d4d4d4' : PRIMARY}
        strokeWidth="3"
        strokeDasharray="6 6"
        strokeLinecap="round"
        opacity={locked ? 0.3 : 0.4}
      />
    </svg>
  );
}

export function Timeline() {
  const navigate = useNavigate();
  useAuthGuard();

  const { timelineId } = useParams();

  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineDTO | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    if (timelineId) {
      setCurrentTimelineId(timelineId);
    }
  }, [timelineId]);

  useEffect(() => {
    if (!timelineId) {
      navigate("/timelines");
      return;
    }

    async function loadTimeline() {
      try {
        if (!timelineId) {
          navigate("/timelines");
          return;
        }
        const data = await getCompleteTimelineById(timelineId);

        setTimelineData(data);

        const mapped: TimelineEvent[] = data.events.map((e) => ({
          id: e.id,
          title: e.name,
          year: e.endYear
            ? `${new Date(e.startYear).getFullYear()} - ${new Date(e.endYear).getFullYear()}`
            : e.startYear
              ? `${new Date(e.startYear).getFullYear()}`
              : "",
          locked: e.unlocked === false,
          completed: e.completed ?? false,
          color: PRIMARY,
          imageUrl: e.imageUrl ?? undefined,
          introText: e.introText ?? undefined,
        }));

        setEvents(mapped);

      } catch (error: any) {
        console.error("Erro ao carregar timeline", error);

        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        }
      }
    }

    loadTimeline();
  }, [timelineId, navigate]);

  /* 🔥 CLICK EVENTO */
  const handleEventClick = useCallback(async (event: TimelineEvent) => {
    if (event.locked) return;

    try {
      setSelectedEvent(event);

      const data = await getUnitsByEvent(event.id);
      setUnits(data);

    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      }
    }
  }, [navigate]);

  const completedEvents = timelineData?.completedEvents ?? 0;
  const totalEvents = timelineData?.totalEvents ?? 0;
  const progressPercentage = timelineData?.progressPercentage ?? 0;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [segments, setSegments] = useState<any[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    const points = circleRefs.current
      .map((el, index) => {
        if (!el) return null;

        const rect = el.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2 - containerRect.left;
        const centerY = rect.top + rect.height / 2 - containerRect.top;

        const radius = rect.width / 2;

        const isLeft = index % 2 === 0;

        return {
          centerX,
          centerY,
          radius,
          isLeft,
        };
      })
      .filter(Boolean) as any[];

    if (points.length < 2) return;

    const newSegments = [];

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      const nextEvent = events[i + 1];

      const isEven = i % 2 === 0;

      // 👉 SAÍDA
      let fromX, fromY;

      if (isEven) {
        // sai pela lateral
        fromX = current.isLeft
          ? current.centerX + current.radius
          : current.centerX - current.radius;
        fromY = current.centerY;
      } else {
        fromX = current.centerX;
        fromY = current.centerY + current.radius;
      }

      let toX, toY;

      if (isEven) {
        // entra por cima
        toX = next.centerX;
        toY = next.centerY - next.radius;
      } else {
        toX = next.isLeft
          ? next.centerX + next.radius
          : next.centerX - next.radius;
        toY = next.centerY;
      }

      newSegments.push({
        from: { x: fromX, y: fromY },
        to: { x: toX, y: toY },
        color: nextEvent.locked ? "#d4d4d4" : PRIMARY,
      });
    }

    setSegments(newSegments);
  }, [events]);

  if (!timelineId) return null;

  if (!timelineData) {
    return (
      <div className="p-10 text-gray-500">
        Carregando linha do tempo...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: BG }}>

      {/* SIDEBAR */}
      <Sidebar className="hidden lg:flex fixed h-screen" />

      {/* CONTEÚDO */}
      <div className="flex-1 md:ml-64">

        {/* FLEX PRINCIPAL */}
        <div className="flex min-h-screen">

          {/* TIMELINE + HEADER */}
          <div
            className="flex-1 transition-all duration-300"
            style={{
              marginRight: selectedEvent ? "520px" : "0px"
            }}
          >

            {/* HEADER */}
            <header className="px-6 lg:px-1 py-3 lg:py-4 max-w-4xl mx-auto">

              <h1 className="text-xl lg:text-2xl font-black text-gray-800">
                Linha do Tempo
              </h1>

              <div className="mt-3 space-y-1">
                <div className="w-full bg-[#e7e1d6] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercentage}%`,
                      background: PRIMARY
                    }}
                  />
                </div>

                <div className="flex justify-end text-xs text-gray-500 font-semibold">
                  {completedEvents}/{totalEvents}
                </div>
              </div>

            </header>

            <main
              ref={containerRef}
              className="relative p-4 sm:p-6 lg:p-10 max-w-4xl mx-auto pb-28"
            >

              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                {segments.map((seg, i) => (
                  <path
                    key={i}
                    d={`
      M ${seg.from.x} ${seg.from.y}
      C ${seg.from.x} ${(seg.from.y + seg.to.y) / 2},
        ${seg.to.x} ${(seg.from.y + seg.to.y) / 2},
        ${seg.to.x} ${seg.to.y}
    `}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="4"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                  />
                ))}
              </svg>

              {events.map((event, index) => {

                const isLeft = index % 2 === 0;

                return (
                  <div
                    key={event.id}
                    className="flex flex-col items-center relative z-10 mb-24"
                  >

                    {/* LINHA DO EVENTO */}
                    <div
                      className={`w-full flex ${isLeft ? "justify-start" : "justify-end"
                        }`}
                    >
                      <motion.div
                        className="flex flex-col items-center max-w-[200px]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                      >

                        <button
                          onClick={() => handleEventClick(event)}
                          disabled={event.locked}
                          className="flex flex-col items-center transition-transform hover:scale-105 active:scale-95"
                        >

                          {/* CÍRCULO */}
                          <div
                            ref={(el) => { circleRefs.current[index] = el; }}
                            className="w-[150px] h-[150px] rounded-full flex items-center justify-center border-4 relative overflow-hidden"
                            style={{
                              backgroundColor: event.locked
                                ? '#e5e5e5'
                                : event.completed
                                  ? PRIMARY
                                  : '#ffffff',
                              borderColor: event.locked ? '#d4d4d4' : PRIMARY,
                              boxShadow: event.locked
                                ? '0 4px 0 #c4c4c4'
                                : `0 4px 0 ${PRIMARY_DARK}`,
                            }}
                          >

                            {event.locked ? (
                              <Lock className="w-6 h-6 text-gray-400" />
                            ) : event.completed ? (
                              <CheckCircle className="w-8 h-8 text-white" />
                            ) : event.imageUrl ? (
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-full h-full object-cover scale-125"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #f2e0b6 0%, #d6a84f 100%)" }}>
                                <span className="text-4xl font-black text-white drop-shadow">
                                  {event.title.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}

                            {event.completed && (
                              <motion.div
                                className="absolute -top-1 -right-1 bg-[#a67c2e] rounded-full w-6 h-6 flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <Star className="w-4 h-4 text-white fill-white" />
                              </motion.div>
                            )}
                          </div>

                          {/* TEXTO */}
                          <div className="text-center mt-2">
                            <div className="text-[18px] font-black text-gray-400">
                              {event.year}
                            </div>
                            <div
                              className={`text-[16px] font-black ${event.locked ? 'text-gray-400' : 'text-gray-800'
                                }`}
                            >
                              {event.title}
                            </div>
                          </div>

                        </button>
                      </motion.div>
                    </div>

                  </div>
                );
              })}

            </main>

            <BottomNav />

          </div>

          {/* 🔥 PANEL NA DIREITA */}
          {selectedEvent && (
            <EventPanel
              event={selectedEvent}
              units={units}
              onClose={() => {
                setSelectedEvent(null);
                setUnits([]);
              }}
              onSelectUnit={(unitId) => navigate(`/unit/${unitId}`)}
            />
          )}

        </div>
      </div>
    </div>
  );
}