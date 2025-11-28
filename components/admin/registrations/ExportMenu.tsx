"use client";

import { useState } from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Download, FileText, File, FileSpreadsheet } from "lucide-react";
import {
    exportToCSV,
    exportToExcel,
    exportToPDF,
    formatRegistrationData,
    downloadBlob,
} from "@/lib/export-utils";
import { generateSingleBadgeWithQR, generateBatchBadgesWithQR } from "@/lib/badge-generator";
import { toast } from "sonner";

interface ExportMenuProps {
    registrations: any[];
    selectedIds?: string[];
    filterLabel?: string;
}

export default function ExportMenu({ registrations, selectedIds, filterLabel }: ExportMenuProps) {
    const [loading, setLoading] = useState(false);

    const dataToExport = selectedIds && selectedIds.length > 0
        ? registrations.filter(r => selectedIds.includes(r.$id))
        : registrations;

    const handleExport = async (format: string) => {
        if (dataToExport.length === 0) {
            toast.error("No data to export");
            return;
        }

        setLoading(true);
        try {
            const timestamp = new Date().toISOString().split('T')[0];
            const prefix = selectedIds && selectedIds.length > 0 ? 'selected' : (filterLabel || 'all');

            switch (format) {
                case 'csv':
                    const csvData = formatRegistrationData(dataToExport);
                    exportToCSV(csvData, `registrations-${prefix}-${timestamp}.csv`);
                    toast.success(`Exported ${dataToExport.length} registrations to CSV`);
                    break;

                case 'excel':
                    const excelData = formatRegistrationData(dataToExport);
                    exportToExcel(excelData, `registrations-${prefix}-${timestamp}.xlsx`, 'Registrations');
                    toast.success(`Exported ${dataToExport.length} registrations to Excel`);
                    break;

                case 'pdf':
                    const pdfData = formatRegistrationData(dataToExport);
                    const columns = Object.keys(pdfData[0]);
                    exportToPDF(
                        pdfData,
                        'Registration Report',
                        columns,
                        `registrations-${prefix}-${timestamp}.pdf`
                    );
                    toast.success(`Exported ${dataToExport.length} registrations to PDF`);
                    break;

                case 'badges':
                    toast.loading('Generating badges with QR codes...');
                    const badgeBlob = await generateBatchBadgesWithQR(dataToExport);
                    downloadBlob(badgeBlob, `badges-${prefix}-${timestamp}.pdf`);
                    toast.success(`Generated ${dataToExport.length} badges`);
                    break;

                default:
                    toast.error('Invalid export format');
            }
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    startContent={<Download size={16} />}
                    variant="flat"
                    isLoading={loading}
                >
                    Export {selectedIds && selectedIds.length > 0 && `(${selectedIds.length})`}
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Export options">
                <DropdownItem
                    key="csv"
                    startContent={<FileText size={16} />}
                    onClick={() => handleExport('csv')}
                >
                    Export as CSV
                </DropdownItem>
                <DropdownItem
                    key="excel"
                    startContent={<FileSpreadsheet size={16} />}
                    onClick={() => handleExport('excel')}
                >
                    Export as Excel
                </DropdownItem>
                <DropdownItem
                    key="pdf"
                    startContent={<File size={16} />}
                    onClick={() => handleExport('pdf')}
                >
                    Export as PDF
                </DropdownItem>
                <DropdownItem
                    key="badges"
                    startContent={<File size={16} />}
                    onClick={() => handleExport('badges')}
                    className="text-purple-400"
                >
                    Generate Badges (PDF)
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
