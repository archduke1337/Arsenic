"use client";

import { Card, CardBody, Button } from "@nextui-org/react";

export default function AdminContact() {
    // TODO: Fetch from Appwrite
    const submissions: Array<{
        id: number;
        name: string;
        email: string;
        subject: string;
        message: string;
        date: string;
        status: string;
    }> = [];

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Contact Submissions
                </h1>

                <div className="space-y-4">
                    {submissions.map((submission) => (
                        <Card key={submission.id}>
                            <CardBody className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {submission.subject}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            From: {submission.name} ({submission.email}) • {submission.date}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {submission.status === "unread" && (
                                            <Button size="sm" color="primary" variant="flat">
                                                Mark as Read
                                            </Button>
                                        )}
                                        <Button size="sm" color="danger" variant="flat">
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                    {submission.message}
                                </p>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
