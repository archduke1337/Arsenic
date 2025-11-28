import EventPageTemplate from "@/components/event-page-template";

export default function RajyaSabhaPage() {
    return (
        <EventPageTemplate
            title="Rajya Sabha"
            description="Engage in high-level policy deliberation in the Council of States."
            color="from-green-500 to-emerald-500"
            icon="📜"
            stats={[
                { label: "States", value: "28" },
                { label: "Members", value: "245" },
                { label: "Sessions", value: "4" },
                { label: "Prize Pool", value: "₹20k" },
            ]}
            features={[
                "State Representation: Voice the concerns of your state.",
                "Expert Review: Scrutinize bills passed by the Lok Sabha.",
                "Special Debates: Discuss long-term national policies.",
                "Private Member Bills: Introduce your own legislation.",
            ]}
        />
    );
}
