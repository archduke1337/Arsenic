import EventPageTemplate from "@/components/event-page-template";

export default function LokSabhaPage() {
    return (
        <EventPageTemplate
            title="Lok Sabha"
            description="Experience the heat of Indian parliamentary debates in the House of the People."
            color="from-orange-500 to-red-500"
            icon="🏛️"
            stats={[
                { label: "Constituencies", value: "543" },
                { label: "Parties", value: "10+" },
                { label: "Sessions", value: "4" },
                { label: "Prize Pool", value: "₹20k" },
            ]}
            features={[
                "Question Hour: Hold the government accountable.",
                "Zero Hour: Raise matters of urgent public importance.",
                "Bill Discussion: Debate and pass crucial legislation.",
                "Vote of No Confidence: Test the government's majority.",
            ]}
        />
    );
}
