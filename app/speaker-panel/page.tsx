"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useMemo } from "react";
import {
    Card, CardBody, Button, Chip, Progress, Spinner, Input, Select, SelectItem,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Badge
} from "@nextui-org/react";
import { Clock, Shield, Plus, Trash2, ChevronUp, AlertCircle, CheckCircle2, Gavel } from "lucide-react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { ID, Query } from "appwrite";
import { toast, Toaster } from "sonner";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

interface SpeakerQueueItem {
    $id?: string;
    position: number;
    delegateName: string;
    delegateId: string;
    school: string;
    topic: string;
    status: "waiting" | "speaking" | "completed";
    timeLimit: number; // in minutes
    startTime?: number;
    endTime?: number;
}

interface Motion {
    $id?: string;
    type: "POI" | "MOTION";
    delegateName: string;
    delegateId: string;
    description: string;
    status: "pending" | "approved" | "rejected";
    timestamp: number;
}

export default function SpeakerPanel() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(true);
    const [activeSession, setActiveSession] = useState<any>(null);
    const [speakerQueue, setSpeakerQueue] = useState<SpeakerQueueItem[]>([]);
    const [motions, setMotions] = useState<Motion[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState("");
    const [currentSpeaker, setCurrentSpeaker] = useState<SpeakerQueueItem | null>(null);
    const [sessionTimer, setSessionTimer] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [searchDelegate, setSearchDelegate] = useState("");

    const [newSpeaker, setNewSpeaker] = useState({ delegateName: "", school: "", topic: "", timeLimit: 3 });
    const [newMotion, setNewMotion] = useState({ type: "POI" as "POI" | "MOTION", delegateName: "", description: "" });

    // Fetch initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                const [eventsRes] = await Promise.all([
                    databases.listDocuments(DATABASE_ID, COLLECTIONS.EVENTS, [Query.limit(50)])
                ]);
                setEvents(eventsRes.documents as any[]);
                if (eventsRes.documents.length > 0) {
                    setSelectedEvent(eventsRes.documents[0].$id);
                }
            } catch (error) {
                console.error("Error loading data:", error);
                toast.error("Failed to load events");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Load speaker queue and motions when event changes
    useEffect(() => {
        if (selectedEvent) {
            loadSessionData();
        }
    }, [selectedEvent]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && currentSpeaker) {
            interval = setInterval(() => {
                setSessionTimer((prev) => {
                    const newTime = prev + 1;
                    const maxSeconds = (currentSpeaker?.timeLimit || 3) * 60;
                    if (newTime >= maxSeconds) {
                        setIsTimerActive(false);
                        toast.error(`Time's up for ${currentSpeaker?.delegateName}!`);
                    }
                    return newTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, currentSpeaker]);

    const loadSessionData = async () => {
        try {
            const [queueRes, motionsRes] = await Promise.all([
                databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.SPEAKER_UPDATES,
                    [Query.equal("eventId", selectedEvent), Query.orderAsc("position"), Query.limit(100)]
                ),
                databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.SPEAKER_UPDATES,
                    [Query.equal("eventId", selectedEvent), Query.equal("type", "POI"), Query.limit(50)]
                )
            ]);
            
            setSpeakerQueue((queueRes.documents || []) as any[]);
            setMotions((motionsRes.documents || []) as any[]);
            
            // Set current speaker as first waiting speaker
            const firstWaiting = (queueRes.documents || []).find((s: any) => s.status === "waiting");
            if (firstWaiting) {
                setCurrentSpeaker(firstWaiting as any);
            }
        } catch (error) {
            console.error("Error loading session data:", error);
        }
    };

    const addSpeakerToQueue = async () => {
        if (!newSpeaker.delegateName || !newSpeaker.school) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const position = speakerQueue.length + 1;
            await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.SPEAKER_UPDATES,
                ID.unique(),
                {
                    eventId: selectedEvent,
                    position,
                    delegateName: newSpeaker.delegateName,
                    school: newSpeaker.school,
                    topic: newSpeaker.topic,
                    timeLimit: newSpeaker.timeLimit,
                    status: "waiting",
                    type: "SPEAKER",
                    timestamp: Date.now()
                }
            );
            toast.success("Speaker added to queue");
            setNewSpeaker({ delegateName: "", school: "", topic: "", timeLimit: 3 });
            loadSessionData();
            onOpenChange();
        } catch (error) {
            console.error("Error adding speaker:", error);
            toast.error("Failed to add speaker");
        }
    };

    const startSpeaking = async (speaker: SpeakerQueueItem) => {
        try {
            setCurrentSpeaker(speaker);
            setSessionTimer(0);
            setIsTimerActive(true);
            
            if (speaker.$id) {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.SPEAKER_UPDATES,
                    speaker.$id,
                    { status: "speaking", startTime: Date.now() }
                );
            }
            toast.success(`Now speaking: ${speaker.delegateName}`);
            loadSessionData();
        } catch (error) {
            console.error("Error starting speaker:", error);
            toast.error("Failed to start speaking");
        }
    };

    const completeSpeech = async (speaker: SpeakerQueueItem) => {
        try {
            setIsTimerActive(false);
            
            if (speaker.$id) {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.SPEAKER_UPDATES,
                    speaker.$id,
                    { status: "completed", endTime: Date.now() }
                );
            }
            
            // Move to next waiting speaker
            const nextSpeaker = speakerQueue.find((s) => s.status === "waiting");
            if (nextSpeaker) {
                await startSpeaking(nextSpeaker);
            } else {
                setCurrentSpeaker(null);
                setSessionTimer(0);
                toast.info("No more speakers in queue");
            }
            loadSessionData();
        } catch (error) {
            console.error("Error completing speech:", error);
            toast.error("Failed to complete speech");
        }
    };

    const removeSpeaker = async (id: string) => {
        if (!confirm("Remove this speaker from queue?")) return;
        try {
            await databases.deleteDocument(DATABASE_ID, COLLECTIONS.SPEAKER_UPDATES, id);
            toast.success("Speaker removed");
            loadSessionData();
        } catch (error) {
            console.error("Error removing speaker:", error);
            toast.error("Failed to remove speaker");
        }
    };

    const submitMotion = async () => {
        if (!newMotion.delegateName || !newMotion.description) {
            toast.error("Please fill in all motion fields");
            return;
        }

        try {
            await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.SPEAKER_UPDATES,
                ID.unique(),
                {
                    eventId: selectedEvent,
                    type: newMotion.type,
                    delegateName: newMotion.delegateName,
                    description: newMotion.description,
                    status: "pending",
                    timestamp: Date.now()
                }
            );
            toast.success(`${newMotion.type} submitted`);
            setNewMotion({ type: "POI", delegateName: "", description: "" });
            loadSessionData();
        } catch (error) {
            console.error("Error submitting motion:", error);
            toast.error("Failed to submit motion");
        }
    };

    const approveMotion = async (id: string) => {
        try {
            await databases.updateDocument(DATABASE_ID, COLLECTIONS.SPEAKER_UPDATES, id, { status: "approved" });
            toast.success("Motion approved");
            loadSessionData();
        } catch (error) {
            toast.error("Failed to approve motion");
        }
    };

    const rejectMotion = async (id: string) => {
        try {
            await databases.updateDocument(DATABASE_ID, COLLECTIONS.SPEAKER_UPDATES, id, { status: "rejected" });
            toast.success("Motion rejected");
            loadSessionData();
        } catch (error) {
            toast.error("Failed to reject motion");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const pendingMotions = useMemo(() => motions.filter((m) => m.status === "pending"), [motions]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Spinner size="lg" color="warning" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <Toaster position="bottom-right" />
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3">
                                <Shield className="text-yellow-500" size={40} />
                                Speaker&apos;s Panel
                            </h1>
                            <p className="text-gray-400 mt-2">Real-time session management and speaker coordination</p>
                        </div>
                        <Button
                            color="warning"
                            onPress={onOpen}
                            startContent={<Plus size={20} />}
                        >
                            Add Speaker
                        </Button>
                    </div>

                    {/* Event Selection */}
                    <Select
                        label="Select Event"
                        selectedKeys={[selectedEvent]}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="max-w-xs"
                        classNames={{ trigger: "bg-zinc-900 border border-white/10" }}
                    >
                        {events.map((event) => (
                            <SelectItem key={event.$id} value={event.$id}>
                                {event.name}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                {/* Current Speaker Section */}
                {currentSpeaker && (
                    <Card className="bg-gradient-to-r from-yellow-900/20 via-orange-900/20 to-red-900/20 border border-yellow-500/30">
                        <CardBody className="p-8 space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold text-yellow-400">Currently Speaking</h2>
                                    <p className="text-gray-400">Monitor and manage active speaker</p>
                                </div>
                                <Chip color="warning" variant="shadow">
                                    {currentSpeaker.status.toUpperCase()}
                                </Chip>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-gray-400 text-sm">DELEGATE NAME</p>
                                        <p className="text-2xl font-bold">{currentSpeaker.delegateName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">SCHOOL</p>
                                        <p className="text-lg">{currentSpeaker.school}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">TOPIC</p>
                                        <p className="text-lg">{currentSpeaker.topic || "General Speech"}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="text-center p-6 bg-black/40 rounded-2xl border border-yellow-500/20">
                                        <p className="text-gray-400 text-sm mb-2">ELAPSED TIME</p>
                                        <p className="text-5xl font-mono font-bold text-yellow-400">
                                            {formatTime(sessionTimer)}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-2">
                                            Max: {currentSpeaker.timeLimit} min
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress */}
                            <Progress
                                value={(sessionTimer / ((currentSpeaker.timeLimit || 3) * 60)) * 100}
                                color="warning"
                                className="h-3"
                            />

                            {/* Controls */}
                            <div className="flex gap-4 flex-wrap">
                                {currentSpeaker.status === "waiting" && (
                                    <Button
                                        color="success"
                                        size="lg"
                                        onPress={() => startSpeaking(currentSpeaker)}
                                        startContent={<CheckCircle2 />}
                                    >
                                        Start Speaking
                                    </Button>
                                )}
                                {currentSpeaker.status === "speaking" && (
                                    <Button
                                        color="danger"
                                        size="lg"
                                        onPress={() => completeSpeech(currentSpeaker)}
                                        startContent={<Gavel />}
                                    >
                                        Complete Speech
                                    </Button>
                                )}
                                <Button
                                    variant="flat"
                                    onPress={() => setIsTimerActive(!isTimerActive)}
                                    startContent={<Clock />}
                                >
                                    {isTimerActive ? "Pause Timer" : "Resume Timer"}
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Speaker Queue */}
                    <Card className="lg:col-span-2 bg-zinc-900/50 border border-white/10">
                        <CardBody className="p-6 space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <ChevronUp size={20} /> Speaker Queue
                            </h3>

                            {speakerQueue.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">No speakers in queue</p>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {speakerQueue.map((speaker, idx) => (
                                        <div
                                            key={speaker.$id}
                                            className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-white/5 hover:border-yellow-500/30 transition-colors"
                                        >
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-3">
                                                    <Badge
                                                        content={idx + 1}
                                                        color={
                                                            speaker.status === "completed"
                                                                ? "success"
                                                                : speaker.status === "speaking"
                                                                    ? "warning"
                                                                    : "default"
                                                        }
                                                    >
                                                        <div className="w-10 h-10 bg-zinc-700 rounded-full" />
                                                    </Badge>
                                                    <div>
                                                        <p className="font-semibold">{speaker.delegateName}</p>
                                                        <p className="text-sm text-gray-400">{speaker.school}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Chip
                                                    size="sm"
                                                    color={
                                                        speaker.status === "completed"
                                                            ? "success"
                                                            : speaker.status === "speaking"
                                                                ? "warning"
                                                                : "default"
                                                    }
                                                >
                                                    {speaker.status}
                                                </Chip>
                                                {speaker.$id && (
                                                    <Button
                                                        isIconOnly
                                                        variant="light"
                                                        color="danger"
                                                        size="sm"
                                                        onPress={() => removeSpeaker(speaker.$id!)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Motions & POI */}
                    <Card className="bg-zinc-900/50 border border-white/10">
                        <CardBody className="p-6 space-y-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <AlertCircle size={20} /> Points & Motions
                            </h3>

                            {pendingMotions.length === 0 ? (
                                <p className="text-gray-400 text-center py-4 text-sm">No pending motions</p>
                            ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {pendingMotions.map((motion) => (
                                        <div
                                            key={motion.$id}
                                            className="p-3 bg-red-900/20 rounded-lg border border-red-500/30"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <Chip size="sm" color="danger" variant="flat">
                                                    {motion.type}
                                                </Chip>
                                                <div className="flex gap-1">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="success"
                                                        variant="light"
                                                        onPress={() => motion.$id && approveMotion(motion.$id)}
                                                    >
                                                        ✓
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                        onPress={() => motion.$id && rejectMotion(motion.$id)}
                                                    >
                                                        ✕
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className="text-sm font-semibold">{motion.delegateName}</p>
                                            <p className="text-xs text-gray-300 mt-1">{motion.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-4 border-t border-white/10 space-y-3">
                                <h4 className="font-semibold text-sm">Submit Motion</h4>
                                <Select
                                    label="Type"
                                    selectedKeys={[newMotion.type]}
                                    onChange={(e) => setNewMotion({ ...newMotion, type: e.target.value as "POI" | "MOTION" })}
                                    size="sm"
                                    classNames={{ trigger: "bg-zinc-800 h-10" }}
                                >
                                    <SelectItem key="POI">POI</SelectItem>
                                    <SelectItem key="MOTION">Motion</SelectItem>
                                </Select>
                                <Input
                                    placeholder="Delegate name"
                                    value={newMotion.delegateName}
                                    onChange={(e) => setNewMotion({ ...newMotion, delegateName: e.target.value })}
                                    size="sm"
                                    classNames={{ inputWrapper: "bg-zinc-800" }}
                                />
                                <Button
                                    color="warning"
                                    size="sm"
                                    fullWidth
                                    onPress={submitMotion}
                                >
                                    Submit
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Add Speaker Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
                <ModalContent>
                    <ModalHeader>Add Speaker to Queue</ModalHeader>
                    <ModalBody className="space-y-4">
                        <Input
                            label="Delegate Name"
                            placeholder="Enter delegate name"
                            value={newSpeaker.delegateName}
                            onChange={(e) => setNewSpeaker({ ...newSpeaker, delegateName: e.target.value })}
                        />
                        <Input
                            label="School/Institution"
                            placeholder="Enter school name"
                            value={newSpeaker.school}
                            onChange={(e) => setNewSpeaker({ ...newSpeaker, school: e.target.value })}
                        />
                        <Input
                            label="Topic (Optional)"
                            placeholder="Enter topic or leave blank"
                            value={newSpeaker.topic}
                            onChange={(e) => setNewSpeaker({ ...newSpeaker, topic: e.target.value })}
                        />
                        <Select
                            label="Time Limit (minutes)"
                            selectedKeys={[newSpeaker.timeLimit.toString()]}
                            onChange={(e) => setNewSpeaker({ ...newSpeaker, timeLimit: parseInt(e.target.value) })}
                        >
                            {[1, 2, 3, 4, 5].map((mins) => (
                                <SelectItem key={mins} value={mins}>
                                    {mins} minute{mins > 1 ? "s" : ""}
                                </SelectItem>
                            ))}
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" onPress={() => onOpenChange()}>
                            Cancel
                        </Button>
                        <Button color="warning" onPress={addSpeakerToQueue}>
                            Add Speaker
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
