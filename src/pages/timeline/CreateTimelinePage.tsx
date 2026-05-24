import { useState } from "react"
import {ImagePlus,Loader2} from "lucide-react";
import { TimelineSidebar } from "../TimelineSidebar";
import {createTimeline} from "../../services/timeline/createTimelineService";
import { uploadFile} from "../../services/uploadService";
import {createHistoryEvent} from "../../services/historyEventService";
import { toast } from "sonner";

export function CreateTimelinePage() {

    const [step, setStep] =
        useState<"TIMELINE" | "EVENTS">(
            "TIMELINE"
        );

    const [timelineId, setTimelineId] =
        useState<string | null>(null);

    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [visibility, setVisibility] =
        useState("PRIVATE");

    const [selectedFile, setSelectedFile] =
        useState<File | null>(null);

    const [preview, setPreview] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [eventName, setEventName] =
        useState("");

    const [eventDescription, setEventDescription] =
        useState("");

    const [eventIntroText, setEventIntroText] =
        useState("");

    const [eventType, setEventType] =
        useState("");

    const [periodDescription, setPeriodDescription] =
        useState("");

    const [startYear, setStartYear] =
        useState("");

    const [endYear, setEndYear] =
        useState("");

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        try {

            setLoading(true);

            let imageUrl:
                string | null = null;

            if (selectedFile) {

                imageUrl =
                    await uploadFile(
                        selectedFile
                    );
            }

            const response =
                await createTimeline({
                    name,
                    description,
                    imageUrl,
                    visibility,
                });

            setTimelineId(
                response.id
            );

            setStep("EVENTS");
            toast.success("Linha do tempo criada com sucesso!");

        } catch (error) {

            console.error(error);
            toast.error("Erro ao criar linha do tempo.");

        } finally {

            setLoading(false);
        }
    }

    async function handleCreateEvent(
        e: React.FormEvent
    ) {

        e.preventDefault();

        if (!timelineId) return;

        try {

            setLoading(true);

            await createHistoryEvent(
                timelineId,
                {
                    name: eventName,
                    description: eventDescription,
                    introText: eventIntroText,
                    eventType,
                    periodDescription,
                    startYear,
                    endYear,
                }
            );

            toast.success("Evento criado com sucesso!");

            setEventName("");
            setEventDescription("");
            setEventIntroText("");
            setEventType("");
            setPeriodDescription("");
            setStartYear("");
            setEndYear("");

        } catch (error) {

            console.error(error);

            toast.error("Erro ao criar evento.");

        } finally {

            setLoading(false);
        }
    }

    function handleSelectFile(
        event: React.ChangeEvent<HTMLInputElement>
    ) {

        const file =
            event.target.files?.[0];

        if (!file) return;

        setSelectedFile(file);

        setPreview(
            URL.createObjectURL(file)
        );
    }

    return (

        <div className="min-h-screen bg-[#f6f3eb] flex">

            <TimelineSidebar />

            <main className="flex-1 px-4 md:px-10 py-6 md:py-12 flex justify-center">

                <div className="w-full max-w-3xl">

                    <div className="mb-10">

                        <h1
                            className="
                                text-4xl
                                font-black
                                text-[#2d2d2d]
                            "
                        >
                            Criar Linha do Tempo
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Crie uma nova experiência de aprendizado.
                        </p>

                    </div>

                    <div className="flex gap-4 mb-8">

                        <button
                            type="button"
                            onClick={() =>
                                setStep("TIMELINE")
                            }
                            className={`
                                px-5
                                py-3
                                rounded-2xl
                                font-semibold
                                transition
                                ${
                                    step === "TIMELINE"
                                        ? "bg-[#d6a84f] text-white"
                                        : "bg-white border border-[#e5dccb] text-gray-700"
                                }
                            `}
                        >
                            Linha do Tempo
                        </button>

                        <button
                            type="button"
                            disabled={!timelineId}
                            onClick={() =>
                                setStep("EVENTS")
                            }
                            className={`
                                px-5
                                py-3
                                rounded-2xl
                                font-semibold
                                transition
                                ${
                                    step === "EVENTS"
                                        ? "bg-[#d6a84f] text-white"
                                        : "bg-white border border-[#e5dccb] text-gray-700"
                                }

                                disabled:opacity-50
                                disabled:cursor-not-allowed
                            `}
                        >
                            Eventos
                        </button>

                    </div>

                    {
                        step === "TIMELINE" && (

                            <form
                                onSubmit={handleSubmit}
                                className="
                                    bg-white
                                    border
                                    border-[#e8dfcf]
                                    rounded-3xl
                                    p-8
                                    shadow-sm
                                    space-y-8
                                "
                            >

                                <div className="space-y-2">

                                    <label
                                        className="
                                            text-sm
                                            font-semibold
                                            text-gray-700
                                        "
                                    >
                                        Nome
                                    </label>

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ex: História do Brasil"
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-[#e5dccb]
                                            px-4
                                            py-3
                                            outline-none
                                            focus:border-[#d6a84f]
                                            bg-[#fcfbf8]
                                        "
                                    />

                                </div>

                                <div className="space-y-2">

                                    <label
                                        className="
                                            text-sm
                                            font-semibold
                                            text-gray-700
                                        "
                                    >
                                        Descrição
                                    </label>

                                    <textarea
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(
                                                e.target.value
                                            )
                                        }
                                        rows={5}
                                        placeholder="Descreva sua linha do tempo..."
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-[#e5dccb]
                                            px-4
                                            py-3
                                            outline-none
                                            focus:border-[#d6a84f]
                                            bg-[#fcfbf8]
                                            resize-none
                                        "
                                    />

                                </div>

                                <div className="space-y-2">

                                    <label
                                        className="
                                            text-sm
                                            font-semibold
                                            text-gray-700
                                        "
                                    >
                                        Visibilidade
                                    </label>

                                    <select
                                        value={visibility}
                                        onChange={(e) =>
                                            setVisibility(
                                                e.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-[#e5dccb]
                                            px-4
                                            py-3
                                            outline-none
                                            focus:border-[#d6a84f]
                                            bg-[#fcfbf8]
                                        "
                                    >

                                        <option value="PRIVATE">
                                            Privada
                                        </option>

                                        <option value="PUBLIC">
                                            Pública
                                        </option>

                                    </select>

                                </div>

                                <div className="space-y-3">

                                    <label
                                        className="
                                            text-sm
                                            font-semibold
                                            text-gray-700
                                        "
                                    >
                                        Imagem da linha do tempo
                                    </label>

                                    <label
                                        className="
                                            border-2
                                            border-dashed
                                            border-[#d8ccb4]
                                            rounded-3xl
                                            bg-[#fcfbf8]
                                            p-8
                                            flex
                                            flex-col
                                            items-center
                                            justify-center
                                            gap-4
                                            cursor-pointer
                                            hover:border-[#d6a84f]
                                            transition
                                        "
                                    >

                                        {
                                            preview ? (

                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="
                                                        w-full
                                                        h-64
                                                        object-cover
                                                        rounded-2xl
                                                    "
                                                />

                                            ) : (

                                                <>

                                                    <div
                                                        className="
                                                            w-20
                                                            h-20
                                                            rounded-full
                                                            bg-[#f2eadc]
                                                            flex
                                                            items-center
                                                            justify-center
                                                        "
                                                    >

                                                        <ImagePlus
                                                            size={34}
                                                            className="text-[#b78b35]"
                                                        />

                                                    </div>

                                                    <div className="text-center">

                                                        <p className="font-semibold text-gray-700">
                                                            Clique para selecionar uma imagem
                                                        </p>

                                                        <p className="text-sm text-gray-500 mt-1">
                                                            PNG, JPG ou WEBP
                                                        </p>

                                                    </div>

                                                </>
                                            )
                                        }

                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleSelectFile}
                                        />

                                    </label>

                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        w-full
                                        bg-[#d6a84f]
                                        hover:bg-[#c89a3f]
                                        transition
                                        text-white
                                        font-bold
                                        py-4
                                        rounded-2xl
                                        flex
                                        items-center
                                        justify-center
                                        gap-3
                                        disabled:opacity-70
                                    "
                                >

                                    {
                                        loading ? (
                                            <>
                                                <Loader2
                                                    size={20}
                                                    className="animate-spin"
                                                />

                                                Criando...
                                            </>
                                        ) : (
                                            "Criar Linha do Tempo"
                                        )
                                    }

                                </button>

                            </form>
                        )
                    }

                    {
                        step === "EVENTS" && (

                            <form
                                onSubmit={handleCreateEvent}
                                className="
                                    bg-white
                                    border
                                    border-[#e8dfcf]
                                    rounded-3xl
                                    p-8
                                    shadow-sm
                                    space-y-8
                                "
                            >

                                <div>

                                    <h2
                                        className="
                                            text-3xl
                                            font-black
                                            text-[#2d2d2d]
                                        "
                                    >
                                        Eventos Históricos
                                    </h2>

                                    <p className="text-gray-500 mt-2">
                                        Adicione eventos à sua linha do tempo.
                                    </p>

                                </div>

                                <div className="space-y-2">

                                    <label className="text-sm font-semibold text-gray-700">
                                        Nome do Evento
                                    </label>

                                    <input
                                        type="text"
                                        value={eventName}
                                        onChange={(e) =>
                                            setEventName(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ex: Independência do Brasil"
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-[#e5dccb]
                                            px-4
                                            py-3
                                            bg-[#fcfbf8]
                                        "
                                    />

                                </div>

                                <div className="space-y-2">

                                    <label className="text-sm font-semibold text-gray-700">
                                        Descrição
                                    </label>

                                    <textarea
                                        rows={4}
                                        value={eventDescription}
                                        onChange={(e) =>
                                            setEventDescription(
                                                e.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-[#e5dccb]
                                            px-4
                                            py-3
                                            bg-[#fcfbf8]
                                            resize-none
                                        "
                                    />

                                </div>

                                <div className="space-y-2">

                                    <label className="text-sm font-semibold text-gray-700">
                                        Texto Introdutório
                                    </label>

                                    <textarea
                                        rows={5}
                                        value={eventIntroText}
                                        onChange={(e) =>
                                            setEventIntroText(
                                                e.target.value
                                            )
                                        }
                                        className="
                                            w-full
                                            rounded-2xl
                                            border
                                            border-[#e5dccb]
                                            px-4
                                            py-3
                                            bg-[#fcfbf8]
                                            resize-none
                                        "
                                    />

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div className="space-y-2">

                                        <label className="text-sm font-semibold text-gray-700">
                                            Data Inicial
                                        </label>

                                        <input
                                            type="date"
                                            value={startYear}
                                            onChange={(e) =>
                                                setStartYear(
                                                    e.target.value
                                                )
                                            }
                                            className="
                                                w-full
                                                rounded-2xl
                                                border
                                                border-[#e5dccb]
                                                px-4
                                                py-3
                                                bg-[#fcfbf8]
                                            "
                                        />

                                    </div>

                                    <div className="space-y-2">

                                        <label className="text-sm font-semibold text-gray-700">
                                            Data Final
                                        </label>

                                        <input
                                            type="date"
                                            value={endYear}
                                            onChange={(e) =>
                                                setEndYear(
                                                    e.target.value
                                                )
                                            }
                                            className="
                                                w-full
                                                rounded-2xl
                                                border
                                                border-[#e5dccb]
                                                px-4
                                                py-3
                                                bg-[#fcfbf8]
                                            "
                                        />

                                    </div>

                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div className="space-y-2">

                                        <label className="text-sm font-semibold text-gray-700">
                                            Tipo do Evento
                                        </label>

                                        <input
                                            type="text"
                                            value={eventType}
                                            onChange={(e) =>
                                                setEventType(
                                                    e.target.value
                                                )
                                            }
                                            className="
                                                w-full
                                                rounded-2xl
                                                border
                                                border-[#e5dccb]
                                                px-4
                                                py-3
                                                bg-[#fcfbf8]
                                            "
                                        />

                                    </div>

                                    <div className="space-y-2">

                                        <label className="text-sm font-semibold text-gray-700">
                                            Período
                                        </label>

                                        <input
                                            type="text"
                                            value={periodDescription}
                                            onChange={(e) =>
                                                setPeriodDescription(
                                                    e.target.value
                                                )
                                            }
                                            className="
                                                w-full
                                                rounded-2xl
                                                border
                                                border-[#e5dccb]
                                                px-4
                                                py-3
                                                bg-[#fcfbf8]
                                            "
                                        />

                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        w-full
                                        bg-[#d6a84f]
                                        hover:bg-[#c89a3f]
                                        transition
                                        text-white
                                        font-bold
                                        py-4
                                        rounded-2xl
                                        flex
                                        items-center
                                        justify-center
                                        gap-3
                                        disabled:opacity-70
                                    "
                                >

                                    {
                                        loading ? (
                                            <>
                                                <Loader2
                                                    size={20}
                                                    className="animate-spin"
                                                />

                                                Criando...
                                            </>
                                        ) : (
                                            "Criar Evento"
                                        )
                                    }

                                </button>

                            </form>
                        )
                    }

                </div>

            </main>

        </div>
    );
}