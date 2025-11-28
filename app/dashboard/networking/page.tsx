"use client";

import { Card, CardBody, Avatar, Button, Chip, Input } from "@heroui/react";
import { Search, MessageCircle, MapPin } from "lucide-react";

export default function NetworkingPage() {
    // TODO: Fetch from Appwrite Realtime
    const delegates: any[] = [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Find Your Co-Delegates</h1>
                    <p className="text-gray-500">Connect with other participants in your committee.</p>
                </div>
                <div className="w-full md:w-auto">
                    <Input
                        startContent={<Search size={18} className="text-gray-400" />}
                        placeholder="Search delegates..."
                        className="w-full md:w-[300px]"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {delegates.map((delegate) => (
                    <Card key={delegate.id} className="hover:scale-[1.02] transition-transform">
                        <CardBody className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="relative">
                                    <Avatar
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${delegate.name}`}
                                        className="w-16 h-16"
                                        isBordered
                                        color={delegate.status === "online" ? "success" : "default"}
                                    />
                                    {delegate.status === "online" && (
                                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
                                    )}
                                </div>
                                <Button isIconOnly variant="light" radius="full">
                                    <MessageCircle size={20} className="text-primary" />
                                </Button>
                            </div>

                            <h3 className="font-bold text-lg">{delegate.name}</h3>
                            <p className="text-primary font-medium mb-1">{delegate.role}</p>

                            <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                                <MapPin size={14} />
                                <span>{delegate.school}</span>
                            </div>

                            <div className="flex gap-2">
                                <Chip size="sm" variant="flat">{delegate.committee}</Chip>
                                <Chip size="sm" variant="flat" color="secondary">Delegate</Chip>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}
