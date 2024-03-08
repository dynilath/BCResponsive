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
}

type RoomEventTriggerType = "Join" | "Leave";

interface ResponsiveTriggerRoomEvent {
    mode: "event";
    event: RoomEventTriggerType;
}

type ResponseTrigger = ResponsiveTriggerActivity | ResponsiveTriggerOrgasm | ResponsiveTriggerSpicer | ResponsiveTriggerRoomEvent;

type ResponseTriggerMode = ResponseTrigger["mode"];

type ResponseMessageType = "action" | "message";

interface ResponseMessage {
    type: ResponseMessageType;
    content: string;
}

interface ResponseItem {
    name: string;
    enabled: boolean;
    trigger: ResponseTrigger;
    messages: ResponseMessage[];
}

interface ResponsivePersonality {
    name: string;
    index: number;
    blackList: number[];
    responses: ResponseItem[];
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