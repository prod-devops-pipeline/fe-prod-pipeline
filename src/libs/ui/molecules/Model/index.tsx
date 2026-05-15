import { X, Trash2,   Loader2 } from "lucide-react";
import Button from "../../atoms/button";

interface ModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
   
}

function Modal({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isLoading = false,
 
}: ModalProps) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all ">
                
                {!isLoading && (
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}

                <div className="flex flex-col items-center text-center">
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50`}>
                       <Trash2 className="h-7 w-7 text-red-500" ></Trash2>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 ">
                        {title}
                    </h3>
                    {message && (
                        <p className="mt-3 text-sm text-gray-500 ">
                            {message}
                        </p>
                    )}
                </div>

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                    <Button
                        className="w-full sm:w-32 py-2.5 text-sm font-medium text-gray-700 bg-gray-400 rounded-xl hover:bg-gray-300 transition-colors disabled:opacity-50"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        className={`w-full sm:w-32 py-2.5 text-sm font-medium text-white rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2  disabled:opacity-70 bg-red-500 hover:bg-red-600 shadow-red-500/30`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
