"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardBody, Button, Progress, Image } from "@nextui-org/react";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { storage } from "@/lib/appwrite";
import { ID } from "appwrite";

const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || "";

interface MultiImageUploadProps {
    maxFiles?: number;
    onUploadComplete: (urls: string[]) => void;
    existingImages?: string[];
    label?: string;
    maxFileSize?: number; // in MB
    onError?: (error: string) => void;
}

export default function MultiImageUpload({
    maxFiles = 3,
    onUploadComplete,
    existingImages = [],
    label = "Upload Images",
    maxFileSize = 5, // 5MB default
    onError,
}: MultiImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
    const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingImages);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setErrorMessage("");

        // Validate file sizes
        const oversizedFiles = acceptedFiles.filter(file => file.size > maxFileSize * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            const errorMsg = `Files too large: ${oversizedFiles.map(f => f.name).join(", ")}. Max size: ${maxFileSize}MB`;
            setErrorMessage(errorMsg);
            onError?.(errorMsg);
            return;
        }

        setUploading(true);
        const urls: string[] = [];

        for (const file of acceptedFiles.slice(0, maxFiles - uploadedUrls.length)) {
            try {
                const fileId = ID.unique();
                setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

                // Simulate progress
                const progressInterval = setInterval(() => {
                    setUploadProgress((prev) => ({
                        ...prev,
                        [file.name]: Math.min((prev[file.name] || 0) + 10, 90)
                    }));
                }, 100);

                // Upload to Appwrite Storage
                const response = await storage.createFile(BUCKET_ID, fileId, file);
                clearInterval(progressInterval);

                // Get file URL
                const fileUrl = storage.getFileView(BUCKET_ID, response.$id).toString();
                urls.push(fileUrl);

                setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
            } catch (error) {
                console.error("Upload error:", error);
                const errorMsg = `Failed to upload ${file.name}`;
                setErrorMessage(errorMsg);
                onError?.(errorMsg);
                setUploadProgress((prev) => {
                    const newProgress = { ...prev };
                    delete newProgress[file.name];
                    return newProgress;
                });
            }
        }

        const allUrls = [...uploadedUrls, ...urls];
        setUploadedUrls(allUrls);
        onUploadComplete(allUrls);
        setUploading(false);

        // Clear progress after a delay
        setTimeout(() => setUploadProgress({}), 1000);
    }, [uploadedUrls, maxFiles, maxFileSize, onUploadComplete, onError]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
        },
        maxFiles: maxFiles - uploadedUrls.length,
        disabled: uploadedUrls.length >= maxFiles || uploading,
    });

    const removeImage = (index: number) => {
        const newUrls = uploadedUrls.filter((_, i) => i !== index);
        setUploadedUrls(newUrls);
        onUploadComplete(newUrls);
    };

    return (
        <Card className="bg-zinc-900/50 border border-white/10">
            <CardBody className="p-6">
                <h4 className="text-sm font-semibold mb-3">{label}</h4>

                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-400" />
                        <p className="text-xs text-red-400">{errorMessage}</p>
                    </div>
                )}

                {/* Uploaded Images Preview */}
                {uploadedUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {uploadedUrls.map((url, index) => (
                            <div key={index} className="relative group">
                                <Image
                                    src={url}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full aspect-video object-cover rounded-lg"
                                />
                                <Button
                                    isIconOnly
                                    size="sm"
                                    color="danger"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeImage(index)}
                                >
                                    <X size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Area */}
                {uploadedUrls.length < maxFiles && (
                    <div
                        {...getRootProps()}
                        className={`
                            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                            ${isDragActive
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-white/20 hover:border-white/40 bg-white/5'
                            }
                            ${uploading ? 'pointer-events-none opacity-50' : ''}
                        `}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center gap-2">
                            {uploading ? (
                                <Upload className="w-8 h-8 text-blue-500 animate-pulse" />
                            ) : (
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                            )}
                            <p className="text-sm text-gray-400">
                                {isDragActive
                                    ? "Drop images here..."
                                    : `Drag & drop images, or click to select`}
                            </p>
                            <p className="text-xs text-gray-500">
                                {uploadedUrls.length}/{maxFiles} uploaded • Max {maxFileSize}MB each
                            </p>
                        </div>
                    </div>
                )}

                {/* Upload Progress */}
                {Object.keys(uploadProgress).length > 0 && (
                    <div className="mt-4 space-y-2">
                        {Object.entries(uploadProgress).map(([fileName, progress]) => (
                            <div key={fileName}>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span className="truncate max-w-[200px]">{fileName}</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress
                                    value={progress}
                                    color="primary"
                                    size="sm"
                                    className="w-full"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
