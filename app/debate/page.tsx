import EventPageTemplate from "@/components/event-page-template";

export default function DebatePage() {
    return (
        <EventPageTemplate
            title="Debate Championship"
            description="Showcase your rhetorical skills and logical reasoning in a battle of wits."
            color="from-purple-500 to-pink-500"
            icon="⚖️"
            stats={[
                { label: "Teams", value: "50+" },
                { label: "Rounds", value: "5" },
                { label: "Topics", value: "10" },
                { label: "Prize Pool", value: "₹15k" },
            ]}
            features={[
                "Asian Parliamentary: 3-on-3 format focusing on policy.",
                "British Parliamentary: 2-on-2 format with opening/closing factions.",
                "Turncoat: Switch sides mid-speech to test adaptability.",
                "Extempore: Impromptu speaking on random topics.",
            ]}
        />
    );
}
