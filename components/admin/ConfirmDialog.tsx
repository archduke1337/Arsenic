"use client";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import { AlertCircle } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDangerous = false,
}: ConfirmDialogProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            classNames={{
                base: "bg-zinc-950 border border-white/10",
                header: "border-b border-white/10",
                footer: "border-t border-white/10",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex gap-2 items-center">
                            {isDangerous && (
                                <div className="p-2 bg-red-500/10 rounded-full">
                                    <AlertCircle size={20} className="text-red-500" />
                                </div>
                            )}
                            <span>{title}</span>
                        </ModalHeader>
                        <ModalBody>
                            <p className="text-sm text-gray-400">{message}</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="default"
                                variant="light"
                                onPress={onClose}
                            >
                                {cancelText}
                            </Button>
                            <Button
                                color={isDangerous ? "danger" : "primary"}
                                onPress={() => {
                                    onConfirm();
                                    onClose();
                                }}
                            >
                                {confirmText}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
