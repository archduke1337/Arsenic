"use client";

import { Card, CardBody, Input, Button, Select, SelectItem, Chip, Progress } from "@nextui-org/react";
import { Upload, X, FolderOpen, Image as ImageIcon, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { storage } from "@/lib/appwrite";
import { ID } from "appwrite";

const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "";

interface BulkGalleryUploadProps {
    albumId?: string;
    eventType: string;
    onUploadComplete: (uploadedImages: any[]) => void;
    onError?: (error: string) => void;
}

interface UploadingFile {
    file: File;
    preview: string;
    progress: number;
    status: 'pending' | 'uploading' | 'complete' | 'error';
    url?: string;
    error?: string;
}

export default function BulkGalleryUpload({
    albumId,
    eventType,
    onUploadComplete,
    onError,
}: BulkGalleryUploadProps) {
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Create preview objects for all files
        const newFiles: UploadingFile[] = acceptedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            status: 'pending' as const,
        }));

        setUploadingFiles(prev => [...prev, ...newFiles]);
        startUpload(newFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
        },
        disabled: isUploading,
    });

    const startUpload = async (files: UploadingFile[]) => {
        setIsUploading(true);
        const uploadedImages: any[] = [];

        for (let i = 0; i < files.length; i++) {
            const fileData = files[i];

            try {
                // Update status to uploading
                setUploadingFiles(prev => prev.map((f, idx) =>
                    f.file === fileData.file ? { ...f, status: 'uploading' as const } : f
                ));

                // Simulate progress
                const progressInterval = setInterval(() => {
                    setUploadingFiles(prev => prev.map(f =>
                        f.file === fileData.file && f.progress < 90
                            ? { ...f, progress: f.progress + 10 }
                            : f
                    ));
                }, 100);

                // Upload to Appwrite Storage
                const fileId = ID.unique();
                const response = await storage.createFile(BUCKET_ID, fileId, fileData.file);
                clearInterval(progressInterval);

                // Get file URL
                const fileUrl = storage.getFileView(BUCKET_ID, response.$id).toString();

                // Update to complete
                setUploadingFiles(prev => prev.map(f =>
                    f.file === fileData.file
                        ? { ...f, status: 'complete' as const, progress: 100, url: fileUrl }
                        : f
                ));

                uploadedImages.push({
                    imageUrl: fileUrl,
                    albumId,
                    eventType,
                    caption: fileData.file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                });

            } catch (error) {
                console.error("Upload error:", error);
                setUploadingFiles(prev => prev.map(f =>
                    f.file === fileData.file
                        ? { ...f, status: 'error' as const, error: 'Upload failed' }
                        : f
                ));
                onError?.(`Failed to upload ${fileData.file.name}`);
            }
        }

        setIsUploading(false);
        onUploadComplete(uploadedImages);
    };

    const removeFile = (index: number) => {
        setUploadingFiles(prev => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const clearCompleted = () => {
        setUploadingFiles(prev => {
            const completed = prev.filter(f => f.status === 'complete');
            completed.forEach(f => URL.revokeObjectURL(f.preview));
            return prev.filter(f => f.status !== 'complete');
        });
    };

    const totalFiles = uploadingFiles.length;
    const completedFiles = uploadingFiles.filter(f => f.status === 'complete').length;
    const failedFiles = uploadingFiles.filter(f => f.status === 'error').length;

    return (
        <Card className="bg-zinc-900/50 border border-white/10">
            <CardBody className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-bold mb-1">Bulk Image Upload</h4>
                        <p className="text-sm text-gray-400">Upload multiple images at once</p>
                    </div>
                    {uploadingFiles.length > 0 && (
                        <Button
                            size="sm"
                            variant="flat"
                            onClick={clearCompleted}
                            isDisabled={completedFiles === 0}
                        >
                            Clear Completed
                        </Button>
                    )}
                </div>

                {/* Upload Progress Summary */}
                {totalFiles > 0 && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Upload Progress</span>
                            <span className="font-bold text-blue-400">
                                {completedFiles} / {totalFiles} complete
                            </span>
                        </div>
                        <Progress
                            value={(completedFiles / totalFiles) * 100}
                            color="primary"
                            size="sm"
                            className="mb-2"
                        />
                        {failedFiles > 0 && (
                            <p className="text-xs text-red-400">{failedFiles} failed</p>
                        )}
                    </div>
                )}

                {/* Drop Zone */}
                <div
                    {...getRootProps()}
                    className={`
                        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all
                        ${isDragActive
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/20 hover:border-white/40 bg-white/5'
                        }
                        ${isUploading ? 'pointer-events-none opacity-50' : ''}
                    `}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-3">
                        {isUploading ? (
                            <Upload className="w-12 h-12 text-blue-500 animate-pulse" />
                        ) : (
                            <FolderOpen className="w-12 h-12 text-gray-400" />
                        )}
                        <div>
                            <p className="text-lg font-semibold mb-1">
                                {isDragActive
                                    ? "Drop images here..."
                                    : "Drag & drop images or click to browse"}
                            </p>
                            <p className="text-sm text-gray-400">
                                Supports: JPG, PNG, WEBP, GIF • Max 5MB per image
                            </p>
                        </div>
                    </div>
                </div>

                {/* Uploading Files Grid */}
                {uploadingFiles.length > 0 && (
                    <div>
                        <h5 className="text-sm font-semibold text-gray-400 mb-3">
                            Uploading Files ({uploadingFiles.length})
                        </h5>
                        <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                            {uploadingFiles.map((fileData, index) => (
                                <div key={index} className="relative group">
                                    <div className="aspect-square rounded-lg overflow-hidden border border-white/10">
                                        <img
                                            src={fileData.preview}
                                            alt={fileData.file.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Status Overlay */}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        {fileData.status === 'pending' && (
                                            <Chip size="sm" color="default">Pending</Chip>
                                        )}
                                        {fileData.status === 'uploading' && (
                                            <div className="text-center">
                                                <Progress
                                                    value={fileData.progress}
                                                    color="primary"
                                                    size="sm"
                                                    className="w-20"
                                                />
                                                <p className="text-xs text-white mt-1">{fileData.progress}%</p>
                                            </div>
                                        )}
                                        {fileData.status === 'complete' && (
                                            <div className="p-2 bg-green-500 rounded-full">
                                                <Check size={20} className="text-white" />
                                            </div>
                                        )}
                                        {fileData.status === 'error' && (
                                            <Chip size="sm" color="danger">Failed</Chip>
                                        )}
                                    </div>

                                    {/* Remove Button */}
                                    {fileData.status !== 'uploading' && (
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            color="danger"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeFile(index)}
                                        >
                                            <X size={16} />
                                        </Button>
                                    )}

                                    {/* File Name */}
                                    <p className="text-xs text-gray-400 mt-1 truncate">
                                        {fileData.file.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
