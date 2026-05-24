import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    children?: ReactNode;
}

export function ConfirmDialog({
    open,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20"
                onClick={(e) => { e.stopPropagation(); onCancel(); }}
            />

            {/* Modal */}
            <div
                className="relative bg-[#f6f3eb] border border-[#e8dfcf] rounded-3xl shadow-xl w-full max-w-sm p-7 space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div>
                    <h2 className="text-xl font-black text-[#1d2a3a]">{title}</h2>
                    {description && (
                        <p className="text-sm text-gray-500 mt-1">{description}</p>
                    )}
                </div>

                <div className="flex gap-3 pt-1">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-2xl border border-[#e8dfcf] bg-white text-sm font-bold text-gray-600 hover:border-[#d6a84f] hover:text-[#d6a84f] transition"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
