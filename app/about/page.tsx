"use client";

import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Target, Shield, Zap, Globe, Users, Gavel, Mic, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    const values = [
        {
            icon: Target,
            title: "Excellence",
            description: "Striving for the highest standards in debate and diplomacy.",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: Shield,
            title: "Integrity",
            description: "Upholding ethical principles and fostering honest dialogue.",
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            icon: Zap,
            title: "Innovation",
            description: "Embracing new ideas and modernizing parliamentary simulations.",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ];

    const offerings = [
        { title: "Model UN", icon: Globe, desc: "Simulating UN committees to solve global crises." },
        { title: "Lok Sabha", icon: Users, desc: "Drafting bills and debating national policy." },
        { title: "Rajya Sabha", icon: Gavel, desc: "Reviewing legislation with elder statesmanship." },
        { title: "Debate", icon: Mic, desc: "Clashing ideologies in a battle of wits." },
    ];

    return (
        <div className="min-h-screen bg-black text-white" ref={containerRef}>
            {/* Parallax Hero Section */}
            <div className="relative h-[70vh] overflow-hidden flex items-center justify-center">
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1596720426673-e4e15688cafb?auto=format&fit=crop&q=80"
                        alt="Indian Parliament"
                        fill
                        className="object-cover"
                    />
                </motion.div>

                <div className="relative z-20 text-center max-w-4xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Chip color="primary" variant="shadow" className="mb-6">EST. 2024</Chip>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Arsenic Summit</span>
                        </h1>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            A premier platform empowering the next generation of leaders through
                            immersive parliamentary simulations and competitive discourse.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Mission & Vision Section */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                        <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                            To provide a world-class platform for students to develop diplomatic skills,
                            critical thinking, and public speaking. We believe in the power of youth
                            to shape the future through constructive dialogue and informed debate.
                        </p>
                        <p className="text-lg text-gray-400 leading-relaxed">
                            At Arsenic Summit, we go beyond traditional simulations. We create an
                            environment where every voice matters, and every delegate has the
                            opportunity to make a lasting impact.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl transform rotate-3 opacity-20 blur-xl" />
                        <div className="relative w-full h-96 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80"
                                alt="Mission"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Values Section */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                        <p className="text-gray-400">The principles that guide every aspect of our summit.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((val, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                            >
                                <Card className="bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all h-full">
                                    <CardBody className="p-8 text-center">
                                        <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${val.bg} ${val.color}`}>
                                            <val.icon size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                                        <p className="text-gray-400">{val.description}</p>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* What We Offer */}
                <div className="mb-32">
                    <div className="bg-gradient-to-r from-zinc-900 to-black rounded-3xl p-12 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-12 text-center">What We Offer</h2>
                            <div className="grid md:grid-cols-4 gap-6">
                                {offerings.map((offer, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-white/5 p-6 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors"
                                    >
                                        <offer.icon className="w-10 h-10 text-blue-400 mb-4" />
                                        <h3 className="font-bold mb-2">{offer.title}</h3>
                                        <p className="text-sm text-gray-400">{offer.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6">Ready to Make History?</h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        Join hundreds of delegates from across the nation in this celebration of democracy.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button
                            as={Link}
                            href="/register"
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 font-bold text-white shadow-lg shadow-blue-500/25"
                            endContent={<ArrowRight />}
                        >
                            Register Now
                        </Button>
                        <Button
                            as={Link}
                            href="/team"
                            size="lg"
                            variant="bordered"
                            className="text-white border-white/20 font-semibold"
                        >
                            Meet the Team
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
