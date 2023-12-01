import { DebugMode, DefaultPersonaName, MaxPersonalities } from "./Definition";

const DefaultValueV1: ResponsiveSettingV1 = {
    settings: { enable: true },
    hot: ["n... Nyah♥", "Oooh", "mmmmmh!", "NYyaaA♥"],
    medium: ["mm", "aaaah", "nyAh♥"],
    light: ["nyah♥", "Aah!", "mh", "oh!♥", "mh♥"],
    low: ["", "", "mh", "♥oh♥", "ah", "...♥"],
    orgasm: ["Nya...Ny...NyaaAAaah!", "Mmmmh... MMmh... Hhhmmmm...", "Oooooh... Mmmmh... OooOOOOh!", "Mmmhnn... Nyhmm... Nyah!"],
    pain: ["Aie!", "Aoouch!", "Aaaaie!", "Ouch", "Aow"],
    tickle: ["Hahaha!", "Mmmmhahaha!", "Muhahah...", "Ha!Ha!"],
};

const DefaultValueV1TriggerActivities = {
    pain: ["Slap", "Bite", "Spank", "Kick", "Pinch", "SpankItem", "ShockItem"],
    tickle: ["Tickle", "TickleItem"],
    masturbate: ["MasturbateHand", "MasturbateFist", "MasturbateFoot", "MasturbateTongue", "MasturbateItem", "PenetrateFast", "PenetrateSlow", "PenetrateItem"],
}

function FirstOr<T, U>(v1: T, v2: U) {
    return (id: number) => {
        if (id === 0) return v1;
        else return v2;
    }
}

export function getDefaultPersonaList() {
    const message_mapper = (_: string) => { return { type: "message", content: _ } as ResponsiveMessage };
    const action_mapper = (_: string) => { return { type: "action", content: _ } as ResponsiveMessage };

    const default_personality: ResponsiveItem[] = [{
        name: "Pain",
        trigger: {
            mode: "activity",
            allow_activities: DefaultValueV1TriggerActivities.pain
        },
        messages: DefaultValueV1.pain.map(message_mapper).concat(["PLAYER_NAME feels the pain and frowned."].map(action_mapper))
    }, {
        name: "Tickle",
        trigger: {
            mode: "activity",
            allow_activities: DefaultValueV1TriggerActivities.tickle,
        },
        messages: DefaultValueV1.tickle.map(message_mapper).concat(["PLAYER_NAME squirms from the tickling."].map(action_mapper))
    }, {
        name: "Masturbate",
        trigger: {
            mode: "activity",
            allow_activities: DefaultValueV1TriggerActivities.masturbate,
        },
        messages: DefaultValueV1.hot.map(message_mapper)
    }, {
        name: "Orgasm",
        trigger: {
            mode: "orgasm",
        },
        messages: DefaultValueV1.orgasm.map(message_mapper)
    }, {
        name: "High Arousal",
        trigger: {
            mode: "spicer",
            min_arousal: 80
        },
        messages: DefaultValueV1.hot.map(message_mapper)
    }, {
        name: "Mid Arousal",
        trigger: {
            mode: "spicer",
            max_arousal: 80,
            min_arousal: 50
        },
        messages: DefaultValueV1.medium.map(message_mapper)
    }, {
        name: "Low Arousal",
        trigger: {
            mode: "spicer",
            max_arousal: 50,
        },
        messages: DefaultValueV1.low.map(message_mapper)
    }];

    return Array.from({ length: MaxPersonalities }, (_, index) => index).map(
        FirstOr({
            name: DefaultPersonaName,
            index: 0,
            responses: default_personality
        } as ResponsivePersonality, undefined)
    );
}

function getDefaultSettings(): ResponsiveSettingV2 {
    return Object.assign({}, {
        settings: { enabled: true }, active_personality: "Default", personalities: getDefaultPersonaList()
    });
}

function isStringArray(data: any): data is string[] {
    return Array.isArray(data) && data.every(_ => typeof _ === 'string');
}

function isNumberArray(data: any): data is number[] {
    return Array.isArray(data) && data.every(_ => typeof _ === 'number');
}

function isV1Setting(data: any): data is ResponsiveSettingV1 {
    if (data === undefined) return false;
    if (typeof data.settings !== "object") return false;
    if (typeof data.settings.enable !== "boolean") return false;
    if (!isStringArray(data.hot)) return false;
    if (!isStringArray(data.medium)) return false;
    if (!isStringArray(data.light)) return false;
    if (!isStringArray(data.low)) return false;
    if (!isStringArray(data.orgasm)) return false;
    if (!isStringArray(data.pain)) return false;
    if (!isStringArray(data.tickle)) return false;
    return true;
}

function pickV2Setting(data: any): ResponsiveSettingV2 {
    if (data === undefined) return getDefaultSettings();
    let ret = {};
    if (typeof data.settings !== "object" || typeof data.settings.enabled !== "boolean") {
        Object.assign(ret, { settings: { enabled: true } });
    } else {
        Object.assign(ret, { settings: { enabled: data.settings.enabled } });
    }

    if (typeof data.active_personality === "string") {
        Object.assign(ret, { active_personality: data.active_personality });
    } else {
        Object.assign(ret, { active_personality: null });
    }

    if (Array.isArray(data.personalities)) {
        let triggers = data.triggers.map((i: any): ResponsivePersonality | undefined => {
            if (typeof i !== "object") return undefined;
            if (typeof i.name !== "string") return undefined;
            if (typeof i.index !== "number") return undefined;

            if (!Array.isArray(i.responses)) return undefined;

            let responses = i.responses.map((j: any): ResponsiveItem | undefined => {
                if (typeof j !== "object") return undefined;
                if (typeof j.name !== "string") return undefined;
                if (typeof j.trigger !== "object") return undefined;

                let trigger = ((): ResponsiveTrigger | undefined => {
                    if (typeof j.trigger.mode !== "string") return undefined;
                    if (j.trigger.mode === "activity") {
                        let allow_activities = j.trigger.allow_activities;
                        let allow_bodyparts = j.trigger.allow_bodyparts;
                        if (allow_activities !== undefined && !isStringArray(allow_activities)) return undefined;
                        if (allow_bodyparts !== undefined && !isStringArray(allow_bodyparts)) return undefined;
                        return { mode: "activity", allow_activities, allow_bodyparts };
                    } else if (j.trigger.mode === "orgasm") {
                        return { mode: "orgasm" };
                    } else if (j.trigger.mode === "spicer") {
                        let min_arousal = j.trigger.min_arousal;
                        let max_arousal = j.trigger.max_arousal;
                        let apply_favorite = j.trigger.apply_favorite;
                        let allow_ids = j.trigger.allow_ids;
                        if (min_arousal !== undefined && typeof min_arousal !== "number") return undefined;
                        if (max_arousal !== undefined && typeof max_arousal !== "number") return undefined;
                        if (apply_favorite !== undefined && typeof apply_favorite !== "boolean") return undefined;
                        if (!isNumberArray(allow_ids)) return undefined;
                        return { mode: "spicer", min_arousal, max_arousal, apply_favorite, allow_ids };
                    }
                    return undefined;
                })();
                if (trigger === undefined) return undefined;

                if (!Array.isArray(j.messages)) return undefined;
                let messages = j.messages.map((k: any): ResponsiveMessage | undefined => {
                    if (typeof k !== "object") return undefined;
                    if (typeof k.type !== "string") return undefined;
                    if (k.type !== "action" && k.type !== "message") return undefined;

                    if (typeof k.content !== "string") return undefined;

                    return { type: k.type, content: k.content };
                }).filter((_: any) => _ !== undefined) as ResponsiveMessage[];

                return { name: j.name, trigger: trigger, messages: messages };
            }).filter((_: any) => _ !== undefined) as ResponsiveItem[];

            return { name: i.name, index: i.index, responses: responses };
        }).filter((_: any) => _ !== undefined) as ResponsivePersonality[];

        let result_array: (ResponsivePersonality | undefined)[] = [];

        for (let i = 0; i < MaxPersonalities; i++) {
            result_array.push(triggers.find(_ => _.index === i));
        }

        Object.assign(ret, { triggers: triggers });
    } else {
        Object.assign(ret, { triggers: [] });
    }

    return ret as ResponsiveSettingV2;
}

function V1SettingToV2Setting(data: ResponsiveSettingV1): ResponsiveSettingV2 {
    let def = getDefaultSettings();
    def.settings.enabled = data.settings.enable;
    const v1mapper = (_: string) => { return { type: "message", content: _ } as ResponsiveMessage };
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
        ] as ResponsiveItem[]
    }, undefined));
    return def;
}

function DeserializeData(str: string | undefined): ResponsiveSettingV2 {
    if (str === undefined) return getDefaultSettings();

    let d = LZString.decompressFromBase64(str);
    let data = {};

    try {
        let decoded = JSON.parse(d);
        data = decoded;
    } catch { }

    if (isV1Setting(data)) {
        return V1SettingToV2Setting(data);
    }

    return pickV2Setting(data);
}

export class DataManager {
    private static _instance: DataManager | undefined;

    static init() {
        if (this._instance === undefined)
            this._instance = new DataManager;
        if (DebugMode) {
            (window as any)["ShowResponsiveData"] = () => {
                return this._instance?.modData;
            }
        }
    }

    static get instance() {
        this.init();
        return DataManager._instance as DataManager;
    }

    static load() {
        this.instance.ServerTakeData();
    }

    static save() {
        this.instance.ServerStoreData();
    }

    static get_active_personality() {
        let data = this.instance.data;
        if (data.active_personality === null) return undefined;
        return data.personalities.find((_: ResponsivePersonality | undefined) => _ && _.name === data.active_personality);
    }

    modData: ResponsivePartialSetting = {};

    private EncodeDataStr(): string {
        return LZString.compressToBase64(JSON.stringify(this.modData));
    }

    private DecodeDataStr(str: string | undefined) {
        if (str === undefined) {
            Object.assign(this.modData, getDefaultSettings());
            return;
        }

        Object.assign(this.modData, DeserializeData(str));
    }

    ServerStoreData() {
        if (Player && Player.OnlineSettings) {
            ((Player.OnlineSettings as any) as ModSetting).BCResponsive = this.EncodeDataStr();
            if (ServerAccountUpdate) {
                ServerAccountUpdate.QueueData({ OnlineSettings: Player.OnlineSettings });
            }
        }
    }

    ServerTakeData() {
        if (Player && Player.OnlineSettings) {
            let rawData = (Player.OnlineSettings as ModSetting).BCResponsive;
            if (rawData === undefined) {
                let oldData = (Player.OnlineSettings as any) as { BCMoanerReloaded?: string };
                rawData = oldData.BCMoanerReloaded;
                if (rawData !== undefined) delete oldData.BCMoanerReloaded;
            }
            this.DecodeDataStr(rawData);
        }
    }

    get data() {
        return this.modData as ResponsiveSettingV2;
    }

    set data(d: ResponsiveSettingV2) {
        this.modData = d;
    }
}

