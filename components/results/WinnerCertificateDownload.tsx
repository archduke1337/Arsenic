"use client";

import { Button } from "@nextui-org/react";
import { Download } from "lucide-react";
import { useState } from "react";
import { generateCertificate } from "@/lib/certificate-generator";
import { downloadBlob } from "@/lib/export-utils";
import { toast } from "sonner";

export default function WinnerCertificateDownload({ award }: { award: any }) {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const certData = {
                $id: award.$id,
                name: award.registration?.name || 'Winner',
                school: award.registration?.school,
                eventType: award.eventType,
                awardCategory: award.category,
                committee: award.registration?.committee,
                eventDate: 'November 2024',
                eventLocation: 'Arsenic Summit'
            };

            const blob = await generateCertificate(certData, 'modern');
            downloadBlob(blob, `certificate-${award.registration?.name || 'winner'}.pdf`);
            toast.success("Certificate downloaded successfully!");
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download certificate");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Button
            color="warning"
            size="lg"
            className="w-full font-bold text-black"
            startContent={<Download size={20} />}
            isLoading={downloading}
            onClick={handleDownload}
        >
            Download Official Certificate
        </Button>
    );
}
