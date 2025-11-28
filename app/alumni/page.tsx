"use client";

import { Card, CardBody, Avatar, Chip, Button, Input } from "@nextui-org/react";
import { Twitter, Linkedin, Globe, Award } from "lucide-react";

export default function Alumni() {
    const alumni = [
        {
            name: "Sarah Chen",
            batch: "2022",
            role: "Secretary General",
            achievement: "Currently at Harvard University",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            badges: ["Distinguished Alumnus", "Best Delegate '21"]
        },
        {
            name: "Rahul Verma",
            batch: "2021",
            role: "Head of Delegate Affairs",
            achievement: "Policy Analyst at UN India",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
            badges: ["Founder's Circle"]
        },
        {
            name: "Priya Sharma",
            batch: "2023",
            role: "USG Administration",
            achievement: "Law Student at NLS Bangalore",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
            badges: ["Best Speaker '22", "Mentor"]
        },
        {
            name: "Michael Lee",
            batch: "2020",
            role: "Director General",
            achievement: "Tech Entrepreneur",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
            badges: ["Legacy Member"]
        },
    ];

    return (
        <div className="min-h-screen py-16 px-6 bg-gray-50 dark:bg-black">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <Chip color="warning" variant="flat" className="mb-4">Legacy of Excellence</Chip>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">
                        Arsenic Alumni Network
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
                        Our graduates are making waves across the globe in policy, law, technology, and leadership.
                    </p>

                    <div className="flex justify-center gap-4">
                        <Button size="lg" color="primary" variant="shadow">
                            Join Alumni Network
                        </Button>
                        <Button size="lg" variant="bordered">
                            View Success Stories
                        </Button>
                    </div>
                </div>

                {/* Alumni Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {alumni.map((person, index) => (
                        <Card key={index} className="hover:scale-105 transition-transform duration-300">
                            <CardBody className="p-6 text-center">
                                <div className="relative inline-block mb-4">
                                    <Avatar
                                        src={person.image}
                                        className="w-24 h-24 mx-auto"
                                        isBordered
                                        color="warning"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-amber-100 dark:bg-amber-900/50 p-1.5 rounded-full border-2 border-white dark:border-black">
                                        <Award size={16} className="text-amber-600 dark:text-amber-400" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-1">{person.name}</h3>
                                <p className="text-primary text-sm font-medium mb-2">{person.role} &apos;{person.batch.slice(2)}</p>
                                <p className="text-gray-500 text-sm mb-4 h-10">{person.achievement}</p>

                                <div className="flex flex-wrap justify-center gap-2 mb-4">
                                    {person.badges.map((badge, i) => (
                                        <Chip key={i} size="sm" variant="flat" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                                            {badge}
                                        </Chip>
                                    ))}
                                </div>

                                <div className="flex justify-center gap-3">
                                    <Button isIconOnly size="sm" variant="light"><Linkedin size={18} /></Button>
                                    <Button isIconOnly size="sm" variant="light"><Twitter size={18} /></Button>
                                    <Button isIconOnly size="sm" variant="light"><Globe size={18} /></Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* Newsletter Section */}
                <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-4">Stay Connected</h2>
                        <p className="text-blue-200 mb-8">
                            Subscribe to our alumni newsletter for exclusive updates, mentorship opportunities, and reunion events.
                        </p>
                        <div className="flex gap-2 max-w-md mx-auto">
                            <Input
                                placeholder="Enter your email"
                                classNames={{ inputWrapper: "bg-white/10 border-white/20 text-white" }}
                            />
                            <Button color="primary" className="font-bold">Subscribe</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
