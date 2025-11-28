"use client";

import {
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Button, Chip, Divider, Card, CardBody
} from "@nextui-org/react";
import { User, Mail, Phone, School, Calendar, DollarSign, CreditCard, CheckCircle, XCircle, MapPin } from "lucide-react";
import QRCodeDisplay from "./QRCodeDisplay";

interface RegistrationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    registration: any;
    onCheckIn?: (id: string) => void;
}

export default function RegistrationDetailModal({
    isOpen,
    onClose,
    registration,
    onCheckIn,
}: RegistrationDetailModalProps) {
    if (!registration) return null;

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'PENDING': return 'warning';
            case 'FAILED': return 'danger';
            case 'REFUNDED': return 'default';
            default: return 'default';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="4xl"
            scrollBehavior="inside"
            classNames={{
                base: "bg-zinc-900 border border-white/10",
                header: "border-b border-white/10",
                body: "py-6",
                footer: "border-t border-white/10",
            }}
        >
            <ModalContent>
                <ModalHeader>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold">Registration Details</h2>
                        {registration.checkedIn && (
                            <Chip color="success" variant="flat" startContent={<CheckCircle size={14} />}>
                                Checked In
                            </Chip>
                        )}
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Personal Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Information */}
                            <Card className="bg-white/5 border border-white/10">
                                <CardBody className="p-4 space-y-3">
                                    <h3 className="text-lg font-bold mb-2">Personal Information</h3>

                                    <div className="flex items-center gap-3">
                                        <User size={18} className="text-blue-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">Full Name</p>
                                            <p className="font-semibold">{registration.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Mail size={18} className="text-purple-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">Email</p>
                                            <p className="font-mono text-sm">{registration.email}</p>
                                        </div>
                                    </div>

                                    {registration.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone size={18} className="text-green-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">Phone</p>
                                                <p className="font-mono">{registration.phone}</p>
                                            </div>
                                        </div>
                                    )}

                                    {registration.school && (
                                        <div className="flex items-center gap-3">
                                            <School size={18} className="text-yellow-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">School/Institution</p>
                                                <p>{registration.school}</p>
                                            </div>
                                        </div>
                                    )}

                                    {registration.city && (
                                        <div className="flex items-center gap-3">
                                            <MapPin size={18} className="text-orange-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">City</p>
                                                <p>{registration.city}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>

                            {/* Event Details */}
                            <Card className="bg-white/5 border border-white/10">
                                <CardBody className="p-4 space-y-3">
                                    <h3 className="text-lg font-bold mb-2">Event Details</h3>

                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Event Type</p>
                                        <Chip color="primary" variant="flat">
                                            {registration.eventType?.replace(/_/g, ' ') || 'Not specified'}
                                        </Chip>
                                    </div>

                                    {registration.committee && (
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">Committee</p>
                                            <p className="font-semibold">{registration.committee}</p>
                                        </div>
                                    )}

                                    {registration.preferences && (
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">Preferences</p>
                                            <p className="text-sm">{registration.preferences}</p>
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Registration Date</p>
                                        <p className="text-sm">
                                            {new Date(registration.$createdAt).toLocaleString('en-IN', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Payment Info */}
                            <Card className="bg-white/5 border border-white/10">
                                <CardBody className="p-4 space-y-3">
                                    <h3 className="text-lg font-bold mb-2">Payment Information</h3>

                                    <div className="flex items-center gap-3">
                                        <DollarSign size={18} className="text-green-400" />
                                        <div>
                                            <p className="text-xs text-gray-400">Amount</p>
                                            <p className="text-2xl font-bold">₹{registration.amount?.toLocaleString('en-IN') || 0}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Payment Status</p>
                                        <Chip color={getPaymentStatusColor(registration.paymentStatus)} size="lg">
                                            {registration.paymentStatus || 'PENDING'}
                                        </Chip>
                                    </div>

                                    {registration.transactionId && (
                                        <div className="flex items-center gap-3">
                                            <CreditCard size={18} className="text-blue-400" />
                                            <div>
                                                <p className="text-xs text-gray-400">Transaction ID</p>
                                                <p className="font-mono text-sm">{registration.transactionId}</p>
                                            </div>
                                        </div>
                                    )}

                                    {registration.paymentMethod && (
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">Payment Method</p>
                                            <p className="text-sm">{registration.paymentMethod}</p>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>

                            {/* Check-in Info */}
                            {registration.checkedIn && registration.checkedInAt && (
                                <Card className="bg-green-500/10 border border-green-500/30">
                                    <CardBody className="p-4">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle size={24} className="text-green-400" />
                                            <div>
                                                <p className="font-semibold">Checked In</p>
                                                <p className="text-sm text-gray-400">
                                                    {new Date(registration.checkedInAt).toLocaleString('en-IN', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            )}
                        </div>

                        {/* Right Column - QR Code */}
                        <div>
                            <QRCodeDisplay
                                registrationId={registration.$id}
                                attendeeName={registration.name}
                                eventType={registration.eventType}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {!registration.checkedIn && onCheckIn && (
                        <Button
                            color="success"
                            startContent={<CheckCircle size={16} />}
                            onClick={() => onCheckIn(registration.$id)}
                        >
                            Check In Now
                        </Button>
                    )}
                    <Button variant="flat" onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
