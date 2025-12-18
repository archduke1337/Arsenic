"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import EventCard from "@/components/events/event-card";

const EVENTS = [
    { id: 1, name: "The Diplomatia Summit", date: "25-26 April", venue: "Maharaj Agrasen College", footFallMin: 450, footFallMax: 1400 },
    { id: 2, name: "Arsenic Summit × DWPS MUN", date: "2-3 May", venue: "DWPS KP3", footFallMin: 350, footFallMax: 700 },
    { id: 3, name: "Ariestiea MUN", date: "16-17 May", venue: "NLU / Hindu college", footFallMin: 600, footFallMax: 1600 },
    { id: 4, name: "The Indian Conclave", date: "13-14 June", venue: "Online", footFallMin: 500, footFallMax: 1200 },
    { id: 5, name: "Aquarius Summit", date: "19-20 June", venue: "DU NC", footFallMin: 400, footFallMax: 900 },
    { id: 6, name: "Arsenic Summit × Manthan MUN", date: "10-11 July", venue: "The Manthan School", footFallMin: 350, footFallMax: 650 },
    { id: 7, name: "Krishna Yuva Sansad", date: "18-19 July", venue: "DU NC", footFallMin: 750, footFallMax: 1600 },
    { id: 8, name: "Atman Youth Conclave", date: "25-26 July", venue: "DU NC", footFallMin: 750, footFallMax: 1600 },
    { id: 9, name: "Samvadhya MUN", date: "1-2 August", venue: "DU NC", footFallMin: 750, footFallMax: 1600 },
    { id: 10, name: "Arsenic Summit × Paramount MUN", date: "13-14 August", venue: "Paramount School Dwarka", footFallMin: 350, footFallMax: 550 },
    { id: 11, name: "Arsenic Summit - the Occurrence", date: "22-23 August", venue: "Satyawati Bhawan", footFallMin: 900, footFallMax: 1600 },
    { id: 12, name: "Arsenic Summit × GDGIS MUN", date: "3-4 October", venue: "GDGIS Noida Extension", footFallMin: 550, footFallMax: 900 },
    { id: 13, name: "Arsenic Summit × Panchayat", date: "10-11 October", venue: "DU NC", footFallMin: 750, footFallMax: 1600 },
    { id: 14, name: "Arsenic Summit × Gagan Public School MUN", date: "17-18 October", venue: "GPS Noida Extension", footFallMin: 300, footFallMax: 650 },
    { id: 15, name: "DWPS Intra MUN", date: "24-25 October", venue: "DWPS KP3", footFallMin: 250, footFallMax: 400 },
    { id: 16, name: "The Indian Conclave - Offline Edition", date: "24-25 October", venue: "DU NC", footFallMin: 800, footFallMax: 1600 },
    { id: 17, name: "Arsenic Summit × East Point School MUN", date: "7-8 November", venue: "EPS ; Vasundhara Enclave", footFallMin: 250, footFallMax: 400 },
    { id: 18, name: "Agnira MUN", date: "14-15 November", venue: "DU NC", footFallMin: 750, footFallMax: 1600 },
    { id: 19, name: "Richmond", date: "May", venue: "Richmond School", footFallMin: 350, footFallMax: 600 },
    { id: 20, name: "Sapphire", date: "November", venue: "Sapphire International, Noida", footFallMin: 400, footFallMax: 600 },
];

export default function EventsPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // Header Animation
        tl.from(headerRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        // Cards Staggered Animation
        tl.from(".event-card-wrapper", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.5");

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div ref={headerRef} className="text-center mb-20 relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wide mb-4">
                        2025 CALENDAR
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white">
                        Upcoming <span className="text-blue-600 dark:text-blue-500">Events</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-8">
                        Join us at the most prestigious diplomatic simulations and youth conferences across the nation.
                    </p>
                    {/* Chrome Subheading as requested */}
                    <h2 className="text-3xl font-bold text-chrome tracking-wide uppercase">
                        Experience The Legacy
                    </h2>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {EVENTS.map((event, index) => (
                        <div key={event.id} className="event-card-wrapper">
                            <EventCard event={event} index={index} />
                        </div>
                    ))}
                </div>

                {/* Footer Stats - Optional Context */}
                <div className="mt-20 border-t border-gray-200 dark:border-gray-800 pt-10 text-center">
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                        Total Projected Footfall: <span className="font-semibold text-gray-900 dark:text-white">10,550 - 21,750</span> Delegates
                    </p>
                </div>
            </div>
        </div>
    );
}
