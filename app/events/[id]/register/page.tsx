"use client";

import { useState } from "react";
import { Button, Input, Select, SelectItem, Card, CardBody } from "@nextui-org/react";
import { useRouter, useParams } from "next/navigation";
import { toast, Toaster } from "sonner";

export default function EventRegistration() {
    const router = useRouter();
    const params = useParams();
    const eventId = params.id as string;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        institution: "",
        grade: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/registrations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId,
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    institution: formData.institution,
                    grade: formData.grade,
                    paymentStatus: "pending",
                }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Registration failed");
            }

            toast.success("Registration successful! Check your email for confirmation.");
            router.push(`/register/success?registrationId=${result.registrationId}&code=${result.code}`);
        } catch (error) {
            console.error("Registration error:", error);
            toast.error(error instanceof Error ? error.message : "Registration failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-6 bg-gray-50 dark:bg-black">
            <Toaster richColors position="top-center" />
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Event Registration
                    </h1>
                    <p className="text-gray-600">
                        Complete the form below to secure your spot
                    </p>
                </div>

                <Card>
                    <CardBody className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name"
                                    placeholder="Enter your name"
                                    value={formData.fullName}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, fullName: value })
                                    }
                                    required
                                />
                                <Input
                                    type="email"
                                    label="Email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, email: value })
                                    }
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <Input
                                    type="tel"
                                    label="Phone Number"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, phone: value })
                                    }
                                    required
                                />
                                <Input
                                    label="Institution/School"
                                    placeholder="Enter your institution"
                                    value={formData.institution}
                                    onValueChange={(value) =>
                                        setFormData({ ...formData, institution: value })
                                    }
                                    required
                                />
                            </div>

                            <Select
                                label="Grade/Year"
                                placeholder="Select your grade"
                                selectedKeys={formData.grade ? [formData.grade] : []}
                                onChange={(e) =>
                                    setFormData({ ...formData, grade: e.target.value })
                                }
                                required
                            >
                                <SelectItem key="9" value="9">Grade 9</SelectItem>
                                <SelectItem key="10" value="10">Grade 10</SelectItem>
                                <SelectItem key="11" value="11">Grade 11</SelectItem>
                                <SelectItem key="12" value="12">Grade 12</SelectItem>
                                <SelectItem key="college" value="college">College Student</SelectItem>
                            </Select>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    color="primary"
                                    size="lg"
                                    className="w-full"
                                    isLoading={isSubmitting}
                                >
                                    Confirm Registration
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
