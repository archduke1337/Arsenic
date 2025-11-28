"use client";

import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from "@heroui/react";
import { Download, X } from "lucide-react";
import { generateCertificate, CertificateTemplate } from "@/lib/certificate-generator";

interface CertificatePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

export default function CertificatePreviewModal({ isOpen, onClose, data }: CertificatePreviewModalProps) {
    const [template, setTemplate] = useState<CertificateTemplate>('modern');
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && data) {
            generatePreview();
        }
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [isOpen, data, template]);

    const generatePreview = async () => {
        setLoading(true);
        try {
            const certData = {
                $id: data.$id,
                name: data.registration?.name || 'Winner Name',
                school: data.registration?.school,
                eventType: data.eventType,
                awardCategory: data.category,
                committee: data.registration?.committee,
                eventDate: 'November 2024',
                eventLocation: 'Arsenic Summit'
            };

            const blob = await generateCertificate(certData, template, data.$id); // Use Award ID as Cert ID for consistency with verification
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
        } catch (error) {
            console.error("Preview generation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (previewUrl) {
            const link = document.createElement('a');
            link.href = previewUrl;
            link.download = `certificate-${data.registration?.name || 'winner'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="5xl"
            classNames={{
                base: "bg-zinc-900 border border-white/10 h-[90vh]",
                body: "p-0 overflow-hidden",
                header: "border-b border-white/10",
                footer: "border-t border-white/10",
            }}
        >
            <ModalContent>
                <ModalHeader className="flex justify-between items-center">
                    <span>Certificate Preview</span>
                    <div className="flex items-center gap-4 mr-8">
                        <Select
                            size="sm"
                            label="Template"
                            className="w-40"
                            selectedKeys={[template]}
                            onChange={(e) => setTemplate(e.target.value as CertificateTemplate)}
                        >
                            <SelectItem key="modern" value="modern">Modern</SelectItem>
                            <SelectItem key="classic" value="classic">Classic</SelectItem>
                            <SelectItem key="formal" value="formal">Formal</SelectItem>
                        </Select>
                    </div>
                </ModalHeader>
                <ModalBody className="bg-zinc-950 flex items-center justify-center p-4">
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-400">Generating preview...</p>
                        </div>
                    ) : (
                        previewUrl && (
                            <iframe
                                src={`${previewUrl}#toolbar=0&view=Fit`}
                                className="w-full h-full rounded-lg shadow-2xl border border-white/5"
                                title="Certificate Preview"
                            />
                        )
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button variant="flat" onClick={onClose}>
                        Close
                    </Button>
                    <Button
                        color="primary"
                        startContent={<Download size={18} />}
                        onClick={handleDownload}
                    >
                        Download PDF
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
