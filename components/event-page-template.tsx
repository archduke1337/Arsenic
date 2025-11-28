"use client";

import { Button, Card, CardBody } from "@heroui/react";
import Image from "next/image";
import { Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface EventPageProps {
    title: string;
    description: string;
    color: string;
    icon: string;
    stats: { label: string; value: string }[];
    features: string[];
    rulesUrl?: string;
    bgImage?: string;
}

export default function EventPageTemplate({
    title,
    description,
    color,
    icon,
    stats,
    features,
    rulesUrl = "#",
    bgImage = "https://images.unsplash.com/photo-1575320181282-9afab399332c?q=80&w=2070&auto=format&fit=crop",
}: EventPageProps) {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={bgImage}
                        alt={title}
                        fill
                        className="object-cover opacity-30"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-background`} />
                </div>

                <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className={`text-8xl mb-6 filter drop-shadow-lg`}>{icon}</div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                            {title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8">
                            {description}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button
                                as={Link}
                                href="/register"
                                size="lg"
                                className={`bg-gradient-to-r ${color} text-white font-bold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow`}
                                endContent={<ArrowRight />}
                            >
                                Register Now
                            </Button>
                            <Button
                                as={Link}
                                href={rulesUrl}
                                size="lg"
                                variant="bordered"
                                className="font-bold text-lg px-8 py-6"
                                startContent={<Download size={20} />}
                            >
                                Download Rules
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 mb-24">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="bg-background/60 backdrop-blur-md border border-white/10 shadow-xl">
                            <CardBody className="text-center py-8">
                                <div className={`text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${color}`}>
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">
                                    {stat.label}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-6 py-12 mb-24">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-8">Event Highlights</h2>
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-white shrink-0`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">{feature.split(":")[0]}</h3>
                                        <p className="text-gray-500">{feature.split(":")[1] || feature}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className={`aspect-square rounded-3xl bg-gradient-to-br ${color} p-1`}>
                        <div className="w-full h-full bg-background rounded-[22px] flex items-center justify-center relative overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`} />
                            <div className="text-9xl opacity-20">{icon}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
