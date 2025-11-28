import RegistrationForm from "@/components/registration/registration-form";

export default function RegisterPage() {
    return (
        <div className="min-h-screen py-20 px-6 bg-gray-50 dark:bg-black">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Event Registration</h1>
                <p className="text-gray-500">Join the Arsenic Summit 2024</p>
            </div>

            <RegistrationForm />
        </div>
    );
}
