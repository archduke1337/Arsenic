"use client";

import { Card, CardBody, Switch } from "@nextui-org/react";

interface EventSettings {
    allowDoubleDelegation: boolean;
    hybridMode: boolean;
    internationalDelegates: boolean;
    merchandiseUpsell: boolean;
}

interface EventSettingsTogglesProps {
    settings: EventSettings;
    onChange: (settings: EventSettings) => void;
}

export default function EventSettingsToggles({ settings, onChange }: EventSettingsTogglesProps) {
    const updateSetting = (key: keyof EventSettings, value: boolean) => {
        onChange({ ...settings, [key]: value });
    };

    return (
        <Card className="bg-zinc-900/50 border border-white/10">
            <CardBody className="p-6">
                <h4 className="text-lg font-bold mb-4">Event Settings</h4>

                <div className="space-y-4">
                    <Switch
                        isSelected={settings.allowDoubleDelegation}
                        onValueChange={(val) => updateSetting('allowDoubleDelegation', val)}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Allow Double Delegation</span>
                            <span className="text-xs text-gray-400">
                                One delegate can represent two portfolios
                            </span>
                        </div>
                    </Switch>

                    <Switch
                        isSelected={settings.hybridMode}
                        onValueChange={(val) => updateSetting('hybridMode', val)}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Hybrid Mode</span>
                            <span className="text-xs text-gray-400">
                                Support both in-person and virtual participation
                            </span>
                        </div>
                    </Switch>

                    <Switch
                        isSelected={settings.internationalDelegates}
                        onValueChange={(val) => updateSetting('internationalDelegates', val)}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">International Delegates</span>
                            <span className="text-xs text-gray-400">
                                Allow registrations from outside India
                            </span>
                        </div>
                    </Switch>

                    <Switch
                        isSelected={settings.merchandiseUpsell}
                        onValueChange={(val) => updateSetting('merchandiseUpsell', val)}
                    >
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Merchandise Upsell</span>
                            <span className="text-xs text-gray-400">
                                Offer event merchandise during registration
                            </span>
                        </div>
                    </Switch>
                </div>
            </CardBody>
        </Card>
    );
}
