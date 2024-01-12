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
    allow_activities: string[];
    allow_bodyparts?: string[];
    allow_ids?: number[];
}

interface ResponsiveTriggerOrgasm {
    mode: "orgasm";
}

interface ResponsiveTriggerSpicer {
    mode: "spicer";
    min_arousal?: number;
    max_arousal?: number;
    apply_favorite?: boolean;
    allow_ids?: number[];
}

type ResponsiveTrigger = ResponsiveTriggerActivity | ResponsiveTriggerOrgasm | ResponsiveTriggerSpicer;

type ResponsiveTriggerMode = ResponsiveTrigger["mode"];

interface ResponsiveTriggerType {
    mode: ResponsiveTriggerMode;
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
    enabled: boolean;
    trigger: ResponsiveTrigger;
    messages: ResponsiveMessage[];
}

interface ResponsivePersonality {
    name: string;
    index: number;
    responses: ResponsiveItem[];
}

interface ResponsiveSettingV2 {
    settings: { enabled: boolean };
    active_personality: number | null;
    personalities: (ResponsivePersonality | undefined)[];
}

type ResponsiveSetting = ResponsiveSettingV1 | ResponsiveSettingV2;

interface ResponsiveSolidSetting extends ResponsiveSetting { }

type ResponsivePartialSetting = Partial<ResponsiveSolidSetting>;

type ModSetting = { BCResponsive?: string };

interface Window {
    BCResponsive_Loaded?: boolean;
}