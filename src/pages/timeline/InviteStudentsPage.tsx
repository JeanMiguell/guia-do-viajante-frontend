import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Users, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { TimelineSidebar } from "../TimelineSidebar";
import { getStudents, StudentListDTO } from "../../services/user/getStudentsService";
import { sendInvite } from "../../services/userTimeline/sendInviteService";
import { useAuthGuard } from "../../hooks/useAuthGuard";

function TimelineNavTabs({ timelineId, active }: { timelineId: string; active: "timeline" | "activities" | "students" }) {
    const navigate = useNavigate();

    const tabs = [
        {
            key: "timeline",
            label: "Linha do Tempo",
            onClick: () => navigate(`/timelines/full/update/${timelineId}`)
        },
        {
            key: "activities",
            label: "Atividades",
            onClick: () => navigate(`/activities/timeline/${timelineId}`)
        },
        {
            key: "students",
            label: "Convidar Estudantes",
            icon: <Users size={18} />,
            onClick: () => {}
        },
        {
            key: "progress",
            label: "Progresso",
            icon: <BarChart3 size={18} />,
            onClick: () => navigate(`/timelines/${timelineId}/progress`)
        }
    ] as const;

    return (
        <div className="flex gap-4 mb-8 border-b border-[#e8dfcf]">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    type="button"
                    onClick={tab.onClick}
                    className={`px-6 py-4 font-bold text-lg transition-all border-b-4 flex items-center gap-2 ${
                        active === tab.key
                            ? "text-[#d6a84f] border-[#d6a84f]"
                            : "text-gray-500 border-transparent hover:text-gray-700"
                    }`}
                >
                    {"icon" in tab && tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export function InviteStudentsPage() {
    useAuthGuard();
    const navigate = useNavigate();
    const { timelineId } = useParams<{ timelineId: string }>();

    const [students, setStudents] = useState<StudentListDTO[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [sendingInvites, setSendingInvites] = useState(false);

    useEffect(() => {
        if (!timelineId) {
            navigate("/timelines");
            return;
        }
        loadStudents();
    }, [timelineId]);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const data = await getStudents(timelineId);
            setStudents(data);
        } catch (error) {
            console.error("Erro ao carregar estudantes:", error);
            toast.error("Erro ao carregar estudantes.");
        } finally {
            setLoading(false);
        }
    };

    const toggleStudentSelection = (studentId: string) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSendInvites = async () => {
        if (!timelineId || selectedStudents.length === 0) return;

        try {
            setSendingInvites(true);
            await sendInvite({ timelineId, studentIds: selectedStudents });
            toast.success("Estudantes convidados com sucesso!");
            setSelectedStudents([]);
            await loadStudents();
        } catch (error) {
            console.error("Erro ao enviar convites:", error);
            toast.error("Erro ao enviar convites.");
        } finally {
            setSendingInvites(false);
        }
    };

    if (!timelineId) return null;

    return (
        <div className="min-h-screen bg-[#f6f3eb] flex">
            <TimelineSidebar />

            <main className="flex-1 px-10 py-10 flex justify-center">
                <div className="w-full max-w-5xl">

                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-[#2d2d2d]">
                            Convidar Estudantes
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Convide estudantes para participar desta linha do tempo.
                        </p>
                    </div>

                    <TimelineNavTabs timelineId={timelineId} active="students" />

                    <section className="bg-white border border-[#e8dfcf] rounded-3xl p-8 shadow-sm">

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 size={30} className="animate-spin text-[#d6a84f]" />
                            </div>
                        ) : students.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                Nenhum estudante encontrado.
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {students.map((student) => (
                                        <div
                                            key={student.id}
                                            className="flex items-center justify-between p-5 border border-[#ece3d4] rounded-3xl bg-[#fffdf9]"
                                        >
                                            <div>
                                                <h3 className="font-black text-[#2d2d2d]">
                                                    {student.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {student.email}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {student.alreadyInvited && (
                                                    <span className="text-sm text-gray-500 font-semibold">
                                                        Já convidado
                                                    </span>
                                                )}
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student.id)}
                                                    disabled={student.alreadyInvited || sendingInvites}
                                                    onChange={() => toggleStudentSelection(student.id)}
                                                    className="w-5 h-5 accent-[#d6a84f] cursor-pointer disabled:cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSendInvites}
                                    disabled={selectedStudents.length === 0 || sendingInvites}
                                    className="mt-8 w-full bg-[#d6a84f] hover:bg-[#c89a3f] transition text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {sendingInvites ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Enviando convites...
                                        </>
                                    ) : (
                                        `Enviar convites (${selectedStudents.length})`
                                    )}
                                </button>
                            </>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
