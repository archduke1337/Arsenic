"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MapPin, Calendar, Users } from "lucide-react";

interface Event {
     id: number;
     name: string;
     date: string;
     venue: string;
     footFallMin: number;
     footFallMax: number;
}

interface EventCardProps {
     event: Event;
     index: number;
}

export default function EventCard({ event, index }: EventCardProps) {
     const cardRef = useRef<HTMLDivElement>(null);
     const contentRef = useRef<HTMLDivElement>(null);
     const glowRef = useRef<HTMLDivElement>(null);

     const { contextSafe } = useGSAP({ scope: cardRef });

     const onMouseEnter = contextSafe(() => {
          gsap.to(cardRef.current, {
               y: -10,
               scale: 1.02,
               duration: 0.4,
               ease: "power2.out",
               boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          });

          gsap.to(glowRef.current, {
               opacity: 1,
               duration: 0.4,
               scale: 1.5,
          });

          gsap.to(contentRef.current, {
               y: -5,
               duration: 0.3,
          });
     });

     const onMouseLeave = contextSafe(() => {
          gsap.to(cardRef.current, {
               y: 0,
               scale: 1,
               duration: 0.4,
               ease: "power2.out",
               boxShadow: "0 0 0 rgba(0,0,0,0)"
          });

          gsap.to(glowRef.current, {
               opacity: 0,
               duration: 0.4,
               scale: 1,
          });

          gsap.to(contentRef.current, {
               y: 0,
               duration: 0.3,
          });
     });

     return (
          <div
               ref={cardRef}
               className="group relative w-full bg-white/5 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden cursor-pointer"
               onMouseEnter={onMouseEnter}
               onMouseLeave={onMouseLeave}
          >
               {/* Glow Effect Element */}
               <div
                    ref={glowRef}
                    className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] opacity-0 pointer-events-none"
               />

               <div ref={contentRef} className="p-6 relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="mb-4">
                         <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 rounded-full uppercase mb-3">
                              Event {String(event.id).padStart(2, '0')}
                         </span>
                         <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                              {event.name}
                         </h3>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mt-auto">
                         <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                              <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-blue-500">
                                   <Calendar size={18} />
                              </div>
                              <span className="font-medium">{event.date}</span>
                         </div>

                         <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                              <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-purple-500">
                                   <MapPin size={18} />
                              </div>
                              <span className="font-medium">{event.venue}</span>
                         </div>

                         <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                              <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-emerald-500">
                                   <Users size={18} />
                              </div>
                              <div className="flex flex-col">
                                   <span className="text-[10px] uppercase tracking-wider text-gray-500">Estimated Footfall</span>
                                   <span className="font-medium text-chrome">{event.footFallMin} - {event.footFallMax}</span>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Bottom Gradient Line */}
               <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
          </div>
     );
}
