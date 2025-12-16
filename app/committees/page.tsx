"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Gavel, Users, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Static premium data for "The Best" look
const COMMITTEES = [
    {
        id: "disec",
        name: "Disarmament & International Security",
        abbr: "DISEC",
        type: "International",
        image: "https://images.unsplash.com/photo-1575320181282-9afab399332c?q=80&w=1200",
        desc: "Addressing cyber warfare protocols and the regulation of autonomous weapons systems in modern combat.",
        difficulty: "High",
        agenda: "Regulation of AWS",
        capacity: 120
    },
    {
        id: "unhrc",
        name: "Human Rights Council",
        abbr: "UNHRC",
        type: "International",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200",
        desc: "Protecting fundamental freedoms and addressing systematic violations ensuring justice for all nations.",
        difficulty: "Moderate",
        agenda: "Right to Privacy in Digital Age",
        capacity: 80
    },
    {
        id: "loksabha",
        name: "Lok Sabha",
        abbr: "Lok Sabha",
        type: "National",
        image: "https://images.unsplash.com/photo-1596520774490-5e4f9a4e4e75?q=80&w=1200",
        desc: "The House of the People. Discussing national education policies and agricultural reforms for a new India.",
        difficulty: "Moderate",
        agenda: "National Education Policy 2024",
        capacity: 543
    },
    {
        id: "unsc",
        name: "Security Council",
        abbr: "UNSC",
        type: "International",
        image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200",
        desc: "The highest body for maintaining peace. Tackling the immediate escalating crisis in the Eastern European bloc.",
        difficulty: "Advanced",
        agenda: "Crisis in Eastern Europe",
        capacity: 15
    },
    {
        id: "aipppm",
        name: "All India Political Parties Meet",
        abbr: "AIPPM",
        type: "National",
        image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1200",
        desc: "A high-octane debate on electoral reforms and the implementation of uniform civil codes across states.",
        difficulty: "Variable",
        agenda: "Electoral Reforms Bill",
        capacity: 60
    },
    {
        id: "ip",
        name: "International Press",
        abbr: "IP",
        type: "Press",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200",
        desc: "Journalists, photographers, and caricaturists capturing the essence of diplomacy and uncovering the truth.",
        difficulty: "Creative",
        agenda: "Journalism & Photography",
        capacity: 40
    }
];

const categories = ["All", "International", "National", "Press"];

export default function CommitteesPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const filteredCommittees = COMMITTEES.filter(c => {
        const matchesCategory = selectedCategory === "All" || c.type === selectedCategory;
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.abbr.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-white selection:bg-blue-200 dark:selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-white">

            {/* Header Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(219,234,254,0.5),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(0,50,100,0.15),transparent_70%)]" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-medium text-blue-600 dark:text-blue-400 mb-6 shadow-sm backdrop-blur-md">
                            <Sparkles size={14} />
                            <span>Elite Simulations</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-6 text-slate-900 dark:text-white">
                            Diplomatic <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-400 bg-clip-text text-transparent bg-[200%_auto] animate-shine">Committees</span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
                            Engage in high-level debate across our varied dynamic councils, from critical crises to legislative assemblies.
                        </p>
                    </motion.div>

                    {/* Controls */}
                    <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
                        {/* Search */}
                        <div className="relative group w-full max-w-xs">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 dark:text-white/30 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search committees..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full py-3 pl-10 pr-6 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/50 focus:ring-2 focus:ring-blue-100 dark:focus:ring-0 focus:bg-white dark:focus:bg-white/10 transition-all shadow-sm"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex bg-white dark:bg-white/5 p-1 rounded-full border border-slate-200 dark:border-white/10 shadow-sm">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                                        ? "bg-slate-900 dark:bg-white text-white dark:text-black shadow-md"
                                        : "text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Grid Section */}
            <section className="px-6 pb-32">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCommittees.map((committee, index) => (
                            <motion.div
                                key={committee.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="group relative h-[420px] rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-none shadow-sm"
                            >
                                {/* Image Half */}
                                <div className="relative h-1/2 overflow-hidden">
                                    <Image
                                        src={committee.image}
                                        alt={committee.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#020202] to-transparent " />
                                    <div className="absolute top-4 left-4">
                                        <div className="px-3 py-1 bg-white/90 dark:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-full text-xs font-medium text-slate-900 dark:text-white shadow-lg">
                                            {committee.abbr}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <div className={`px-3 py-1 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${committee.difficulty === "High" ? "bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-100 dark:border-rose-500/30" :
                                            committee.difficulty === "Advanced" ? "bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-100 dark:border-amber-500/30" :
                                                "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-100 dark:border-blue-500/30"
                                            }`}>
                                            {committee.difficulty}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Half */}
                                <div className="relative flex-1 p-6 flex flex-col border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
                                    <div className="mb-auto">
                                        <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium tracking-wider uppercase mb-2">
                                            {committee.type === "International" ? <Globe size={12} /> :
                                                committee.type === "National" ? <Gavel size={12} /> : <Users size={12} />}
                                            {committee.type} Body
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                            {committee.name}
                                        </h3>
                                        <p className="text-slate-500 dark:text-white/50 text-sm leading-relaxed line-clamp-2">
                                            {committee.desc}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-widest font-semibold">Agenda</span>
                                            <span className="text-xs font-medium text-slate-700 dark:text-white/80 line-clamp-1">{committee.agenda}</span>
                                        </div>
                                        <button className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-white/50 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
