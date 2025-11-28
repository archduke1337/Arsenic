import EventPageTemplate from "@/components/event-page-template";

export default function MUNPage() {
    return (
        <EventPageTemplate
            title="Model United Nations"
            description="Step into the shoes of world leaders and solve global crises through diplomacy and debate."
            color="from-blue-500 to-cyan-500"
            icon="🌍"
            stats={[
                { label: "Committees", value: "6" },
                { label: "Delegates", value: "300+" },
                { label: "Countries", value: "193" },
                { label: "Awards", value: "₹25k" },
            ]}
            features={[
                "UNSC: Address urgent threats to international peace and security.",
                "UNHRC: Protect and promote human rights worldwide.",
                "DISEC: Disarmament and International Security Committee.",
                "International Press: Report on the proceedings as a journalist.",
            ]}
        />
    );
}
