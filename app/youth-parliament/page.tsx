import EventPageTemplate from "@/components/event-page-template";

export default function YouthParliamentPage() {
    return (
        <EventPageTemplate
            title="Youth Parliament"
            description="A platform for young minds to discuss national issues and propose solutions."
            color="from-yellow-500 to-amber-500"
            icon="🇮🇳"
            stats={[
                { label: "Delegates", value: "100+" },
                { label: "Portfolios", value: "Various" },
                { label: "Duration", value: "1 Day" },
                { label: "Prize Pool", value: "₹10k" },
            ]}
            features={[
                "National Agenda: Discuss pressing issues facing the youth.",
                "Policy Making: Draft and propose youth-centric policies.",
                "Leadership: Develop leadership and public speaking skills.",
                "Networking: Connect with like-minded young changemakers.",
            ]}
        />
    );
}
