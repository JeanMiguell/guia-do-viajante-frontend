import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Loader2, ImagePlus, ChevronDown, ChevronUp, AlertCircle, Users, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { TimelineSidebar } from "../TimelineSidebar";
import { createFullTimeline } from "../../services/timeline/createFullTimelineService";
import { TimelineFullDTO } from "../../services/timeline/getFullTimelineById";
import { uploadFile } from "../../services/uploadService";

// ─── Types ───────────────────────────────────────────────────────────────────

type UnitContent = { title: string; content: string; imageUrl: string; pageOrder: number; hint: string; layout: string };
type Unit        = { title: string; description: string; orderIndex: number; contents: UnitContent[] };
type HistoryEvent = { name: string; description: string; startYear: string; endYear: string; periodDescription: string; eventType: string; introText: string; imageUrl: string; units: Unit[] };
type TimelineForm = { name: string; description: string; imageUrl: string; visibility: string; events: HistoryEvent[] };

type Props = {
    initialData?: TimelineFullDTO;
    onSubmit?:    (payload: TimelineFullDTO) => Promise<void>;
    isEdit?:      boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const emptyEvent   = (): HistoryEvent => ({ name: "", description: "", startYear: "", endYear: "", periodDescription: "", eventType: "", introText: "", imageUrl: "", units: [] });
const emptyUnit    = (orderIndex: number): Unit => ({ title: "", description: "", orderIndex, contents: [] });
const emptyContent = (pageOrder: number): UnitContent => ({ title: "", content: "", imageUrl: "", pageOrder, hint: "", layout: "TEXT_LEFT" });

const INPUT  = "w-full rounded-2xl border border-[#e5dccb] px-4 py-3 outline-none focus:border-[#d6a84f] bg-[#fcfbf8]";
const LABEL  = "text-sm font-semibold text-gray-700";
const FIELD  = "space-y-2";

// Componente reutilizável de upload de imagem
function ImageUpload({
    imageUrl,
    onUpload,
}: {
    imageUrl: string;
    onUpload: (url: string) => void;
}) {
    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const url = await uploadFile(file);
            onUpload(url);
        } catch (err) {
            console.error(err);
        }
    };

    if (imageUrl) {
        return (
            <div className="flex flex-col items-center gap-3">
                <img src={imageUrl} alt="Preview" className="max-h-40 max-w-full object-contain rounded-2xl border border-[#e8dfcf]" />
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-[#9b6d1d] hover:text-[#d6a84f] transition">
                    <ImagePlus size={16} />
                    Trocar imagem
                    <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </label>
            </div>
        );
    }

    return (
        <label className="border-2 border-dashed border-[#d8ccb4] rounded-2xl bg-[#fcfbf8] py-5 px-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#d6a84f] transition">
            <ImagePlus className="text-[#b78b35]" size={24} />
            <p className="text-gray-500 text-sm">Clique para selecionar uma imagem</p>
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function CreateFullTimelinePage({ initialData, onSubmit, isEdit = false }: Props) {
    const navigate = useNavigate();

    const [loading, setLoading]       = useState(false);
    const [timelineId, setTimelineId] = useState<string>(initialData?.id || "");
    const [openEvents, setOpenEvents] = useState<number[]>([0]);
    const [openUnits, setOpenUnits] = useState<string[]>([]);
    const [openContents, setOpenContents] = useState<string[]>([]);

    const [timeline, setTimeline] = useState<TimelineFullDTO>(
        initialData ?? { id: "", name: "", description: "", imageUrl: "", visibility: "PRIVATE", events: [emptyEvent()] }
    );

    // ─── Updaters ──────────────────────────────────────────────────────────────

    const updateTimeline = (field: keyof TimelineForm, value: string) =>
        setTimeline({ ...timeline, [field]: value });

    const updateEvent = (i: number, field: keyof HistoryEvent, value: string) => {
        const e = [...timeline.events];
        e[i] = { ...e[i], [field]: value };
        setTimeline({ ...timeline, events: e });
    };

    const updateUnit = (ei: number, ui: number, field: keyof Unit, value: string | number) => {
        const e = [...timeline.events];
        e[ei].units[ui] = { ...e[ei].units[ui], [field]: value };
        setTimeline({ ...timeline, events: e });
    };

    const updateContent = (ei: number, ui: number, ci: number, field: keyof UnitContent, value: string | number) => {
        const e = [...timeline.events];
        e[ei].units[ui].contents[ci] = { ...e[ei].units[ui].contents[ci], [field]: value };
        setTimeline({ ...timeline, events: e });
    };

    // ─── Add / Remove ──────────────────────────────────────────────────────────

    const addEvent    = () => { setTimeline({ ...timeline, events: [...timeline.events, emptyEvent()] }); setOpenEvents([...openEvents, timeline.events.length]); };
    const removeEvent = (i: number) => { setTimeline({ ...timeline, events: timeline.events.filter((_, idx) => idx !== i) }); setOpenEvents(openEvents.filter(idx => idx !== i)); };
    const toggleEvent = (i: number) => setOpenEvents(prev => prev.includes(i) ? prev.filter(idx => idx !== i) : [...prev, i]);

    const unitKey = (ei: number, ui: number) => `${ei}-${ui}`;
    const toggleUnit = (ei: number, ui: number) => { const k = unitKey(ei, ui); setOpenUnits(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]); };

    const addUnit    = (ei: number) => { const e = [...timeline.events]; const ui = e[ei].units.length; e[ei].units.push(emptyUnit(ui + 1)); setTimeline({ ...timeline, events: e }); setOpenUnits(prev => [...prev, unitKey(ei, ui)]); };
    const removeUnit = (ei: number, ui: number) => { const e = [...timeline.events]; e[ei].units = e[ei].units.filter((_, i) => i !== ui).map((u, i) => ({ ...u, orderIndex: i + 1 })); setTimeline({ ...timeline, events: e }); setOpenUnits(prev => prev.filter(x => x !== unitKey(ei, ui))); };

    const contentKey = (ei: number, ui: number, ci: number) => `${ei}-${ui}-${ci}`;
    const toggleContent = (ei: number, ui: number, ci: number) => { const k = contentKey(ei, ui, ci); setOpenContents(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]); };

    const addContent    = (ei: number, ui: number) => { const e = [...timeline.events]; const c = e[ei].units[ui].contents; const ci = c.length; c.push(emptyContent(ci + 1)); setTimeline({ ...timeline, events: e }); setOpenContents(prev => [...prev, contentKey(ei, ui, ci)]); };
    const removeContent = (ei: number, ui: number, ci: number) => { const e = [...timeline.events]; e[ei].units[ui].contents = e[ei].units[ui].contents.filter((_, i) => i !== ci).map((c, i) => ({ ...c, pageOrder: i + 1 })); setTimeline({ ...timeline, events: e }); setOpenContents(prev => prev.filter(x => x !== contentKey(ei, ui, ci))); };

    // ─── Submit ────────────────────────────────────────────────────────────────

    function validate(): boolean {
        if (!timeline.name.trim()) {
            toast.error("Informe o nome da linha do tempo.");
            return false;
        }
        if (timeline.events.length === 0) {
            toast.error("Adicione pelo menos um tópico.");
            return false;
        }
        for (let ei = 0; ei < timeline.events.length; ei++) {
            const ev = timeline.events[ei];
            if (!ev.name.trim()) {
                toast.error(`O tópico ${ei + 1} precisa de um nome.`);
                setOpenEvents(prev => prev.includes(ei) ? prev : [...prev, ei]);
                return false;
            }
            for (let ui = 0; ui < ev.units.length; ui++) {
                if (!ev.units[ui].title.trim()) {
                    toast.error(`A unidade ${ui + 1} do tópico "${ev.name}" precisa de um título.`);
                    setOpenEvents(prev => prev.includes(ei) ? prev : [...prev, ei]);
                    return false;
                }
            }
        }
        return true;
    }

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        if (!validate()) return;
        try {
            setLoading(true);
            let result: TimelineFullDTO;
            if (onSubmit) {
                await onSubmit(timeline);
                result = timeline;
            } else {
                result = await createFullTimeline(timeline);
            }
            if (result.id) {
                setTimelineId(result.id);
                if (!onSubmit) toast.success("Linha do tempo criada com sucesso!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar a linha do tempo.");
        } finally {
            setLoading(false);
        }
    }

    // ─── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#f6f3eb] flex">
            <TimelineSidebar />

            <main className="flex-1 px-4 md:px-10 py-6 md:py-10 pb-28 md:pb-10 flex justify-center">
                <div className="w-full max-w-5xl">

                    {/* Header */}
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-4xl font-black text-[#2d2d2d]">
                            {isEdit ? "Editar Linha do Tempo" : "Criar Linha do Tempo"}
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm md:text-base">
                            Cadastre a linha do tempo, tópicos, unidades e conteúdos em uma única estrutura.
                        </p>
                    </div>

                    {/* Abas */}
                    <div className="flex gap-1 md:gap-4 mb-6 md:mb-8 border-b border-[#e8dfcf] overflow-x-auto">
                        <div className="px-3 md:px-6 py-3 md:py-4 font-bold text-sm md:text-lg text-[#d6a84f] border-b-4 border-[#d6a84f] whitespace-nowrap flex-shrink-0">
                            Linha do Tempo
                        </div>
                        <button
                            type="button"
                            onClick={() => { if (timelineId) navigate(`/activities/timeline/${timelineId}`); }}
                            disabled={!timelineId}
                            title={!timelineId ? "Salve a linha do tempo primeiro para gerenciar atividades" : undefined}
                            className={`px-3 md:px-6 py-3 md:py-4 font-bold text-sm md:text-lg transition-all border-b-4 flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${timelineId ? "text-gray-500 border-transparent hover:text-gray-700" : "text-gray-300 border-transparent cursor-not-allowed"}`}
                        >
                            Atividades
                            {!timelineId && <AlertCircle size={14} className="text-gray-400" />}
                        </button>
                        <button
                            type="button"
                            onClick={() => { if (timelineId) navigate(`/timelines/${timelineId}/students`); }}
                            disabled={!timelineId}
                            title={!timelineId ? "Salve a linha do tempo primeiro para convidar estudantes" : undefined}
                            className={`px-3 md:px-6 py-3 md:py-4 font-bold text-sm md:text-lg transition-all border-b-4 flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${timelineId ? "text-gray-500 border-transparent hover:text-gray-700" : "text-gray-300 border-transparent cursor-not-allowed"}`}
                        >
                            <Users size={14} className="md:w-[18px] md:h-[18px]" />
                            <span className="hidden sm:inline">Convidar </span>Estudantes
                            {!timelineId && <AlertCircle size={14} className="text-gray-400" />}
                        </button>
                        <button
                            type="button"
                            onClick={() => { if (timelineId) navigate(`/timelines/${timelineId}/progress`); }}
                            disabled={!timelineId}
                            title={!timelineId ? "Salve a linha do tempo primeiro para ver o progresso" : undefined}
                            className={`px-3 md:px-6 py-3 md:py-4 font-bold text-sm md:text-lg transition-all border-b-4 flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${timelineId ? "text-gray-500 border-transparent hover:text-gray-700" : "text-gray-300 border-transparent cursor-not-allowed"}`}
                        >
                            <BarChart3 size={14} className="md:w-[18px] md:h-[18px]" />
                            Progresso
                            {!timelineId && <AlertCircle size={14} className="text-gray-400" />}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* ── Informações da Linha do Tempo ── */}
                        <section className="bg-white border border-[#e8dfcf] rounded-3xl p-5 md:p-8 shadow-sm space-y-6">
                            <div>
                                <h2 className="text-2xl font-black text-[#2d2d2d]">Informações da Linha do Tempo</h2>
                                <p className="text-gray-500 mt-1">Dados principais da experiência de aprendizagem.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className={FIELD}>
                                    <label className={LABEL}>Nome</label>
                                    <input value={timeline.name} onChange={e => updateTimeline("name", e.target.value)} placeholder="Ex: História do Brasil" className={INPUT} />
                                </div>
                                <div className={FIELD}>
                                    <label className={LABEL}>Visibilidade</label>
                                    <select value={timeline.visibility} onChange={e => updateTimeline("visibility", e.target.value)} className={INPUT}>
                                        <option value="PRIVATE">Privada</option>
                                        <option value="PUBLIC">Pública</option>
                                    </select>
                                </div>
                            </div>

                            <div className={FIELD}>
                                <label className={LABEL}>Descrição</label>
                                <textarea value={timeline.description} onChange={e => updateTimeline("description", e.target.value)} rows={3} placeholder="Descreva o objetivo dessa linha do tempo..." className={`${INPUT} resize-none`} />
                            </div>

                            <div className={FIELD}>
                                <label className={LABEL}>Imagem</label>
                                <ImageUpload imageUrl={timeline.imageUrl} onUpload={url => updateTimeline("imageUrl", url)} />
                            </div>
                        </section>

                        {/* ── Tópicos ── */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-[#2d2d2d]">Tópicos</h2>
                                    <p className="text-gray-500 mt-1">Cada tópico pode ter uma ou mais unidades.</p>
                                </div>
                                <button type="button" onClick={addEvent} className="bg-[#d6a84f] hover:bg-[#c89a3f] transition text-white font-bold px-5 py-3 rounded-2xl flex items-center gap-2">
                                    <Plus size={18} /> Adicionar Tópico
                                </button>
                            </div>

                            {timeline.events.map((event, ei) => {
                                const isOpen = openEvents.includes(ei);
                                return (
                                    <div key={ei} className="bg-white border border-[#e8dfcf] rounded-3xl shadow-sm overflow-hidden">

                                        {/* Header do tópico */}
                                        <div className="p-6 flex items-center justify-between bg-[#fcfbf8] border-b border-[#e8dfcf]">
                                            <button type="button" onClick={() => toggleEvent(ei)} className="flex items-center gap-3 text-left">
                                                <div className="w-10 h-10 rounded-full bg-[#f2eadc] flex items-center justify-center text-[#b78b35] font-black">{ei + 1}</div>
                                                <div>
                                                    <h3 className="text-xl font-black text-[#2d2d2d]">{event.name || `Tópico ${ei + 1}`}</h3>
                                                    <p className="text-sm text-gray-500">{event.units.length} unidade(s)</p>
                                                </div>
                                                {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                            </button>
                                            <button type="button" onClick={() => removeEvent(ei)} className="text-red-400 hover:bg-red-50 p-2 rounded-xl transition">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        {isOpen && (
                                            <div className="p-8 space-y-6">

                                                {/* Campos do tópico */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div className={FIELD}>
                                                        <label className={LABEL}>Nome do tópico</label>
                                                        <input value={event.name} onChange={e => updateEvent(ei, "name", e.target.value)} placeholder="Ex: A Chegada ao Brasil" className={INPUT} />
                                                    </div>
                                                    <div className={FIELD}>
                                                        <label className={LABEL}>Tipo</label>
                                                        <input value={event.eventType} onChange={e => updateEvent(ei, "eventType", e.target.value)} placeholder="Ex: Exploração" className={INPUT} />
                                                    </div>
                                                    <div className={FIELD}>
                                                        <label className={LABEL}>Data inicial</label>
                                                        <input type="date" value={event.startYear} onChange={e => updateEvent(ei, "startYear", e.target.value)} className={INPUT} />
                                                    </div>
                                                    <div className={FIELD}>
                                                        <label className={LABEL}>Data final</label>
                                                        <input type="date" value={event.endYear} onChange={e => updateEvent(ei, "endYear", e.target.value)} className={INPUT} />
                                                    </div>
                                                </div>

                                                <div className={FIELD}>
                                                    <label className={LABEL}>Período</label>
                                                    <input value={event.periodDescription} onChange={e => updateEvent(ei, "periodDescription", e.target.value)} placeholder="Ex: Século XV" className={INPUT} />
                                                </div>

                                                <div className={FIELD}>
                                                    <label className={LABEL}>Descrição</label>
                                                    <textarea value={event.description} onChange={e => updateEvent(ei, "description", e.target.value)} rows={3} className={`${INPUT} resize-none`} />
                                                </div>

                                                <div className={FIELD}>
                                                    <label className={LABEL}>Texto introdutório</label>
                                                    <textarea value={event.introText} onChange={e => updateEvent(ei, "introText", e.target.value)} rows={3} className={`${INPUT} resize-none`} />
                                                </div>

                                                <div className={FIELD}>
                                                    <label className={LABEL}>Imagem</label>
                                                    <ImageUpload imageUrl={event.imageUrl} onUpload={url => updateEvent(ei, "imageUrl", url)} />
                                                </div>

                                                {/* ── Unidades ── */}
                                                <div className="space-y-4 pt-2">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-lg font-black text-[#2d2d2d]">Unidades</h4>
                                                        <button type="button" onClick={() => addUnit(ei)} className="bg-[#f4ead7] text-[#8a641f] hover:bg-[#ead5b0] transition px-4 py-2 rounded-2xl font-bold flex items-center gap-2">
                                                            <Plus size={17} /> Adicionar Unidade
                                                        </button>
                                                    </div>

                                                    {event.units.map((unit, ui) => {
                                                        const isUnitOpen = openUnits.includes(unitKey(ei, ui));
                                                        return (
                                                        <div key={ui} className="border border-[#ece3d4] rounded-3xl bg-[#fffdf9] overflow-hidden">
                                                            <div className="flex items-center justify-between px-6 py-4 bg-[#faf7f2] border-b border-[#ece3d4]">
                                                                <button type="button" onClick={() => toggleUnit(ei, ui)} className="flex items-center gap-3 text-left">
                                                                    <div className="w-7 h-7 rounded-full bg-[#f2eadc] flex items-center justify-center text-[#b78b35] font-black text-xs">{ui + 1}</div>
                                                                    <span className="text-base font-black text-[#2d2d2d]">{unit.title || `Unidade ${ui + 1}`}</span>
                                                                    {isUnitOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                                                </button>
                                                                <button type="button" onClick={() => removeUnit(ei, ui)} className="text-red-400 hover:bg-red-50 p-2 rounded-xl transition">
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>

                                                            {isUnitOpen && <div className="p-6 space-y-5">
                                                            <div className={FIELD}>
                                                                <label className={LABEL}>Título da unidade</label>
                                                                <input value={unit.title} onChange={e => updateUnit(ei, ui, "title", e.target.value)} placeholder="Ex: Expansão Marítima" className={INPUT} />
                                                            </div>

                                                            <div className={FIELD}>
                                                                <label className={LABEL}>Descrição da unidade</label>
                                                                <textarea value={unit.description} onChange={e => updateUnit(ei, ui, "description", e.target.value)} rows={3} className={`${INPUT} resize-none`} />
                                                            </div>

                                                            {/* ── Conteúdos ── */}
                                                            <div className="space-y-4 pt-1">
                                                                <div className="flex items-center justify-between">
                                                                    <h6 className="font-black text-[#2d2d2d]">Conteúdos da Unidade</h6>
                                                                    <button type="button" onClick={() => addContent(ei, ui)} className="bg-white border border-[#d6a84f] text-[#9b6d1d] hover:bg-[#fdf6e9] transition px-4 py-2 rounded-2xl font-bold flex items-center gap-2">
                                                                        <Plus size={16} /> Adicionar Conteúdo
                                                                    </button>
                                                                </div>

                                                                {unit.contents.map((content, ci) => {
                                                                    const isContentOpen = openContents.includes(contentKey(ei, ui, ci));
                                                                    return (
                                                                    <div key={ci} className="bg-white border border-[#e8dfcf] rounded-2xl overflow-hidden">
                                                                        <div className="flex items-center justify-between px-5 py-3 bg-[#fdfcf9] border-b border-[#e8dfcf]">
                                                                            <button type="button" onClick={() => toggleContent(ei, ui, ci)} className="flex items-center gap-2 text-left">
                                                                                <div className="w-6 h-6 rounded-full bg-[#f2eadc] flex items-center justify-center text-[#b78b35] font-black text-[10px]">{ci + 1}</div>
                                                                                <span className="font-bold text-sm text-[#2d2d2d]">{content.title || `Conteúdo ${ci + 1}`}</span>
                                                                                {isContentOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                                                                            </button>
                                                                            <button type="button" onClick={() => removeContent(ei, ui, ci)} className="text-red-400 hover:bg-red-50 p-1.5 rounded-xl transition">
                                                                                <Trash2 size={15} />
                                                                            </button>
                                                                        </div>

                                                                        {isContentOpen && <div className="p-5 space-y-5">
                                                                        <div className={FIELD}>
                                                                            <label className={LABEL}>Título</label>
                                                                            <input value={content.title} onChange={e => updateContent(ei, ui, ci, "title", e.target.value)} placeholder="Título do conteúdo" className={INPUT} />
                                                                        </div>

                                                                        <div className={FIELD}>
                                                                            <label className={LABEL}>Conteúdo</label>
                                                                            <textarea
                                                                                value={content.content}
                                                                                ref={el => {
                                                                                    if (el) {
                                                                                        el.style.height = "auto";
                                                                                        el.style.height = el.scrollHeight + "px";
                                                                                    }
                                                                                }}
                                                                                onChange={e => {
                                                                                    updateContent(ei, ui, ci, "content", e.target.value);
                                                                                    e.target.style.height = "auto";
                                                                                    e.target.style.height = e.target.scrollHeight + "px";
                                                                                }}
                                                                                rows={4}
                                                                                placeholder="Texto do conteúdo..."
                                                                                className={`${INPUT} resize-none overflow-hidden`}
                                                                            />
                                                                        </div>

                                                                        <div className={FIELD}>
                                                                            <label className={LABEL}>Dica</label>
                                                                            <textarea value={content.hint} onChange={e => updateContent(ei, ui, ci, "hint", e.target.value)} rows={2} placeholder="Dica para o aluno..." className={`${INPUT} resize-none`} />
                                                                        </div>

                                                                        <div className={FIELD}>
                                                                            <label className={LABEL}>Layout</label>
                                                                            <select value={content.layout} onChange={e => updateContent(ei, ui, ci, "layout", e.target.value)} className={INPUT}>
                                                                                <option value="TEXT_LEFT">Texto à esquerda, imagem à direita</option>
                                                                                <option value="TEXT_RIGHT">Imagem à esquerda, texto à direita</option>
                                                                                <option value="TEXT_ONLY">Somente texto</option>
                                                                                <option value="IMAGE_ONLY">Somente imagem</option>
                                                                            </select>
                                                                        </div>

                                                                        <div className={FIELD}>
                                                                            <label className={LABEL}>Imagem</label>
                                                                            <ImageUpload imageUrl={content.imageUrl} onUpload={url => updateContent(ei, ui, ci, "imageUrl", url)} />
                                                                        </div>
                                                                        </div>}
                                                                    </div>
                                                                    );
                                                                })}
                                                            </div>
                                                            </div>}
                                                        </div>
                                                        );
                                                    })}
                                                </div>

                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </section>

                        <button type="submit" disabled={loading} className="w-full bg-[#d6a84f] hover:bg-[#c89a3f] transition text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-70">
                            {loading
                                ? <><Loader2 size={20} className="animate-spin" /> Salvando...</>
                                : isEdit ? "Atualizar Linha do Tempo" : "Criar Linha do Tempo"
                            }
                        </button>

                    </form>
                </div>
            </main>
        </div>
    );
}
