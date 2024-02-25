enum MoanType {
    Orgasm,
    Pain,
    Tickle
}

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
    forbid_ids?: number[];
}

type OrgasmTriggerType = "Orgasmed" | "Ruined" | "Resisted" | "Any";

interface ResponsiveTriggerOrgasm {
    mode: "orgasm";
    type: OrgasmTriggerType;
}

interface ResponsiveTriggerSpicer {
    mode: "spicer";
    min_arousal?: number;
    max_arousal?: number;
    apply_favorite?: boolean;
    allow_ids?: number[];
    forbid_ids?: number[];
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

type ResponsiveMessageType = "action" | "message";

interface ResponsiveMessage {
    type: ResponsiveMessageType,
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

type ModSetting = { BCResponsive?: string };

interface Window {
    __load_flag__?: boolean;
}
declare const __mod_version__: string;
declare const __mod_name__: string;
declare const __repo__: string;