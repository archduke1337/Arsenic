"use client";

import { useState } from "react";
import { Button, Input, Select, SelectItem, Card, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function EventRegistration() {
    const router = useRouter();
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

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        alert("Registration successful! Check your email for confirmation.");
        router.push("/events");
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen py-12 px-6 bg-gray-50">
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
