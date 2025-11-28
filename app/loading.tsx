import { Spinner } from "@nextui-org/react";

export default function Loading() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-black gap-4">
            <Spinner size="lg" color="primary" />
            <p className="text-gray-500 animate-pulse">Loading Arsenic Platform...</p>
        </div>
    );
}
