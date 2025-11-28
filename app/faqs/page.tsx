"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, Input, Chip, Accordion, AccordionItem } from "@heroui/react";
import { databases } from "@/lib/appwrite";
import { COLLECTIONS } from "@/lib/schema";
import { Query } from "appwrite";
import { Search, HelpCircle } from "lucide-react";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

const FAQ_CATEGORIES = ['GENERAL', 'REGISTRATION', 'PAYMENT', 'EVENT', 'ACCOMMODATION'] as const;

const categoryColors: Record<string, string> = {
    GENERAL: 'primary',
    REGISTRATION: 'secondary',
    PAYMENT: 'success',
    EVENT: 'warning',
    ACCOMMODATION: 'danger',
};

export default function FAQsPage() {
    const [faqs, setFaqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.FAQS,
                [Query.orderAsc("displayOrder")]
            );
            setFaqs(response.documents as unknown as any[]);
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredFAQs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const faqsByCategory = FAQ_CATEGORIES.reduce((acc, category) => {
        acc[category] = filteredFAQs.filter(f => f.category === category);
        return acc;
    }, {} as Record<string, any[]>);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="animate-pulse text-gray-400">Loading FAQs...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <div className="relative overflow-hidden py-20 bg-gradient-to-b from-blue-900/20 to-black">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="relative max-w-7xl mx-auto px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Find answers to common questions about our event
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto">
                        <Input
                            placeholder="Search FAQs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            startContent={<Search size={20} className="text-gray-400" />}
                            size="lg"
                            classNames={{
                                input: "bg-zinc-900",
                                inputWrapper: "bg-zinc-900 border border-white/10 hover:border-white/30",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* FAQs */}
            <div className="max-w-4xl mx-auto px-8 py-16 space-y-12">
                {FAQ_CATEGORIES.map((category) => {
                    const categoryFAQs = faqsByCategory[category];
                    if (categoryFAQs.length === 0) return null;

                    return (
                        <div key={category} className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Chip
                                    color={categoryColors[category] as "primary" | "secondary" | "success" | "warning" | "danger"}
                                    variant="flat"
                                    size="lg"
                                    className="font-bold"
                                >
                                    {category}
                                </Chip>
                                <span className="text-gray-500 text-sm">
                                    {categoryFAQs.length} {categoryFAQs.length === 1 ? 'question' : 'questions'}
                                </span>
                            </div>

                            <Accordion
                                variant="splitted"
                                className="px-0"
                            >
                                {categoryFAQs.map((faq, index) => (
                                    <AccordionItem
                                        key={faq.$id}
                                        aria-label={faq.question}
                                        title={faq.question}
                                        className="bg-zinc-900/50 border border-white/10 mb-2"
                                        classNames={{
                                            title: "text-white font-semibold",
                                            content: "text-gray-400 pb-4",
                                        }}
                                    >
                                        {faq.answer}
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    );
                })}

                {filteredFAQs.length === 0 && (
                    <div className="text-center py-20">
                        <HelpCircle size={64} className="mx-auto mb-4 text-gray-600" />
                        <h3 className="text-2xl font-semibold mb-2 text-gray-300">
                            {searchQuery ? "No results found" : "No FAQs available"}
                        </h3>
                        <p className="text-gray-500">
                            {searchQuery ? "Try a different search term" : "Check back soon for answers to common questions"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
