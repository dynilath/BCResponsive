import { getDefaultSettings } from "./Default";
import { MaxPersonalities } from "../Definition";
import { FirstOr } from "./types";
import { DefaultValueV1TriggerActivities } from "./V1";
import { isStringArray, isNumberArray } from "./types";

export function pickV2Setting(data: any): ResponsiveSettingV2 {
    if (!((d: any): d is ResponsiveSettingV2 => {
        return typeof d === "object" && typeof d.settings === "object"
            && (d.active_personality === null || typeof d.active_personality === "number")
            && Array.isArray(d.personalities);
    })(data)) return getDefaultSettings();

    let ret = {};
    if (typeof data.settings.enabled === "boolean") {
        Object.assign(ret, { settings: { enabled: data.settings.enabled } });
    } else {
        Object.assign(ret, { settings: { enabled: true } });
    }

    if (typeof data.active_personality === "number") {
        Object.assign(ret, { active_personality: data.active_personality });
    } else {
        Object.assign(ret, { active_personality: null });
    }

    if (Array.isArray(data.personalities)) {
        let triggers = data.personalities.map(V2ValidatePersonality).filter((_: any) => _ !== undefined) as ResponsivePersonality[];

        let result_array: (ResponsivePersonality | undefined)[] = [];

        for (let i = 0; i < MaxPersonalities; i++) {
            result_array.push(triggers.find(_ => _.index === i));
        }

        Object.assign(ret, { personalities: result_array });
    } else {
        Object.assign(ret, { personalities: [] });
    }

    return ret as ResponsiveSettingV2;
}

export function V1SettingToV2Setting(data: ResponsiveSettingV1): ResponsiveSettingV2 {
    let def = getDefaultSettings();
    def.settings.enabled = data.settings.enable;
    const v1mapper = (_: string) => { return { type: "message", content: _ } as ResponseMessage; };
    def.personalities = Array.from({ length: MaxPersonalities }, (_, index) => index).map(FirstOr({
        name: "Default",
        index: 0,
        responses: [
            { name: "Pain", trigger: { mode: "activity", allow_activities: DefaultValueV1TriggerActivities.pain }, messages: data.pain.map(v1mapper) },
            { name: "Tickle", trigger: { mode: "activity", allow_activities: DefaultValueV1TriggerActivities.tickle }, messages: data.tickle.map(v1mapper) },
            { name: "Masturbate", trigger: { mode: "activity", allow_activities: DefaultValueV1TriggerActivities.masturbate }, messages: data.hot.map(v1mapper) },
            { name: "Orgasm", trigger: { mode: "orgasm" }, messages: data.orgasm.map(v1mapper) },
            { name: "High Arousal", trigger: { mode: "spicer", min_arousal: 80 }, messages: data.hot.map(v1mapper) },
            { name: "Mid Arousal", trigger: { mode: "spicer", max_arousal: 80, min_arousal: 50 }, messages: data.medium.map(v1mapper) },
            { name: "Low Arousal", trigger: { mode: "spicer", max_arousal: 50 }, messages: data.low.map(v1mapper) },
        ] as ResponseItem[],
        blackList: []
    }, undefined));
    return def;
}
export function V2ValidatePersonality(arg: Partial<ResponsivePersonality> | undefined): ResponsivePersonality | undefined {
    if (!((d: any): d is ResponsivePersonality => {
        return d !== undefined && d !== null && typeof d === "object" && typeof d.name === "string" && typeof d.index === "number" && Array.isArray(d.responses);
    })(arg)) return undefined;

    if (!isNumberArray(arg.blackList))
        arg.blackList = [];

    let responses = arg.responses.map((j: Partial<ResponseItem>): ResponseItem | undefined => {
        if (typeof j !== "object") return undefined;
        if (typeof j.name !== "string") return undefined;
        if (typeof j.trigger !== "object") return undefined;

        const enabled = j.enabled === undefined ? true : j.enabled;

        const trigger = ((): ResponseTrigger | undefined => {
            if (!(["activity", "orgasm", "spicer", "event"] as ResponseTriggerMode[]).includes(j.trigger.mode)) return undefined;
            if (j.trigger.mode === "activity") {
                let allow_activities = j.trigger.allow_activities;
                let allow_bodyparts = j.trigger.allow_bodyparts;
                let allow_ids = j.trigger.allow_ids;
                if (allow_activities !== undefined && !isStringArray(allow_activities)) return undefined;
                if (allow_bodyparts !== undefined && !isStringArray(allow_bodyparts)) return undefined;
                if (allow_ids !== undefined && !isNumberArray(allow_ids)) return undefined;
                return { mode: "activity", allow_activities, allow_bodyparts, allow_ids };
            } else if (j.trigger.mode === "orgasm") {
                let type = j.trigger.type;
                if (type === undefined) type = "Orgasmed";
                if (!(["Orgasmed", "Ruined", "Resisted", "Any"] as OrgasmTriggerType[]).includes(type)) return undefined;
                return { mode: "orgasm", type };
            } else if (j.trigger.mode === "spicer") {
                let min_arousal = j.trigger.min_arousal;
                let max_arousal = j.trigger.max_arousal;
                let apply_favorite = j.trigger.apply_favorite;
                let allow_ids = j.trigger.allow_ids;
                if (min_arousal !== undefined && typeof min_arousal !== "number") return undefined;
                if (max_arousal !== undefined && typeof max_arousal !== "number") return undefined;
                if (apply_favorite !== undefined && typeof apply_favorite !== "boolean") return undefined;
                if (allow_ids !== undefined && !isNumberArray(allow_ids)) return undefined;
                return { mode: "spicer", min_arousal, max_arousal, apply_favorite, allow_ids };
            } else if (j.trigger.mode === "event") {
                let event = j.trigger.event;
                if (!["Join", "Leave"].includes(event)) return undefined;
                return { mode: "event", event };
            }
            return undefined;
        })();
        if (trigger === undefined) return undefined;

        if (!Array.isArray(j.messages)) return undefined;
        let messages = j.messages.map((k: Partial<ResponseMessage>): ResponseMessage | undefined => {
            if (typeof k !== "object") return undefined;
            if (k.type !== "action" && k.type !== "message") return undefined;
            if (typeof k.content !== "string") return undefined;
            return { type: k.type, content: k.content };
        }).filter((_: any) => _ !== undefined) as ResponseMessage[];

        return { name: j.name, enabled, trigger, messages };
    }).filter((_: any) => _ !== undefined) as ResponseItem[];

    return { name: arg.name, index: arg.index, responses: responses, blackList: arg.blackList };
}

