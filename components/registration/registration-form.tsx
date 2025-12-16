"use client";

import { useState } from "react";
import { Card, CardBody, Button, Progress } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import EventSelectionStep from "./steps/event-selection";
import PersonalDetailsStep from "./steps/personal-details";
import PaymentStep from "./steps/payment";

export type RegistrationData = {
  eventType: string;
  conference: string;
  committee?: string;
  country?: string;
  constituency?: string;
  party?: string;
  fullName: string;
  email: string;
  phone: string;
  institution: string;
  amount: number;
  couponCode?: string;
  registrationId?: string;
  orderId?: string;
  code?: string;
};

const initialData: RegistrationData = {
  eventType: "",
  conference: "",
  fullName: "",
  email: "",
  phone: "",
  institution: "",
  amount: 1500, // Base amount
  couponCode: "",
  code: "",
};

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegistrationData>(initialData);
  const [direction, setDirection] = useState(0);

  const nextStep = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const updateData = (updates: Partial<RegistrationData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2 font-semibold text-gray-400 dark:text-gray-500">
          <span>Selection</span>
          <span>Details</span>
          <span>Payment</span>
        </div>
        <Progress 
          value={(step / 3) * 100} 
          color="primary" 
          className="h-2"
          classNames={{ indicator: "bg-gradient-to-r from-blue-500 to-cyan-500" }}
        />
      </div>

      <Card className="min-h-[500px] overflow-visible bg-white/5 dark:bg-zinc-900 border-white/10">
        <CardBody className="p-0 overflow-hidden relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="p-8 w-full h-full"
            >
              {step === 1 && (
                <EventSelectionStep data={data} updateData={updateData} />
              )}
              {step === 2 && (
                <PersonalDetailsStep data={data} updateData={updateData} />
              )}
              {step === 3 && (
                <PaymentStep data={data} updateData={updateData} />
              )}
            </motion.div>
          </AnimatePresence>
        </CardBody>
      </Card>

      <div className="flex justify-between mt-6 gap-4">
        <Button
          variant="flat"
          onPress={prevStep}
          isDisabled={step === 1}
          startContent={<ChevronLeft size={18} />}
          className="dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
        >
          Back
        </Button>
        
        {step < 3 ? (
          <Button
            color="primary"
            onPress={nextStep}
            endContent={<ChevronRight size={18} />}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 font-bold text-white shadow-lg shadow-blue-500/30"
          >
            Next Step
          </Button>
        ) : (
          <Button
            color="success"
            className="font-bold text-white shadow-lg shadow-green-500/30"
            startContent={<Check size={18} />}
            isDisabled // Payment step handles submission
          >
            Complete Payment
          </Button>
        )}
      </div>
    </div>
  );
}
