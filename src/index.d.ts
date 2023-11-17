interface ResponsiveSettingV1 {
    settings: { enable: boolean };
    hot: string[];
    medium: string[];
    light: string[];
    low: string[];
    orgasm: string[];
    pain: string[];
    tickle: string[];
}

interface ResponsiveTriggerActivity {
    mode: "activity";
    allow_activities?: string[];
    allow_bodyparts?: string[];
    allow_ids?: number[];
}

interface ResponsiveTriggerOrgasm {
    mode: "orgasm";
    allow_activities?: string[];
    allow_bodyparts?: string[];
}

interface ResponsiveTriggerSpicer {
    mode: "spicer";
    min_arousal?: number;
    max_arousal?: number;
    apply_favorite?: boolean;
    allow_ids?: number[];
}

type ResponsiveTrigger = ResponsiveTriggerActivity | ResponsiveTriggerOrgasm | ResponsiveTriggerSpicer;

interface ResponsiveTriggerType {
    mode: "activity" | "orgasm" | "spicer";
    min_arousal?: number;
    max_arousal?: number;
    apply_favorite?: boolean;
    allow_activities?: string[];
    allow_bodyparts?: string[];
    allow_ids?: number[];
}

interface ResponsiveMessage {
    type: "action" | "message",
    content: string;
}

interface ResponsiveItem {
    name: string;
    trigger: ResponsiveTrigger;
    messages: ResponsiveMessage[];
}

interface ResponsivePersonality {
    name: string;
    responses: ResponsiveItem[];
}

interface ResponsiveSettingV2 {
    settings: { enabled: boolean };
    active_personality: string | null;
    personalities: ResponsivePersonality[];
}

type ResponsiveSetting = ResponsiveSettingV1 | ResponsiveSettingV2;

interface ResponsiveSolidSetting extends ResponsiveSetting { }

type ResponsivePartialSetting = Partial<ResponsiveSolidSetting>;

type ModSetting = { BCResponsive?: string };

interface Window {
    BCResponsive_Loaded?: boolean;
}