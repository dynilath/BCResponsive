import { DefaultPersonaIndex, DefaultPersonaName, MaxPersonalities } from "../Definition";
import { i18n } from "../i18n";
import { DefaultValueV1TriggerActivities } from "./V1";
import { DefaultValueV1 } from "./V1";
import { FirstOr } from "./types";


export function getDefaultPersonaList() {
    const message_mapper = (_: string) => { return { type: "message", content: _ } as ResponseMessage; };
    const action_mapper = (_: string) => { return { type: "action", content: _ } as ResponseMessage; };

    const default_personality: ResponseItem[] = [{
        name: i18n("Default::ItemName::Pain"),
        enabled: true,
        trigger: {
            mode: "activity",
            allow_activities: DefaultValueV1TriggerActivities.pain
        },
        messages: DefaultValueV1.pain.map(message_mapper).concat([i18n("Default::Message::PainAction")].map(action_mapper))
    }, {
        name: i18n("Default::ItemName::Tickle"),
        enabled: true,
        trigger: {
            mode: "activity",
            allow_activities: DefaultValueV1TriggerActivities.tickle,
        },
        messages: DefaultValueV1.tickle.map(message_mapper).concat([i18n("Default::Message::TickleAction")].map(action_mapper))
    }, {
        name: i18n("Default::ItemName::Masturbate"),
        enabled: true,
        trigger: {
            mode: "activity",
            allow_activities: DefaultValueV1TriggerActivities.masturbate,
        },
        messages: DefaultValueV1.hot.map(message_mapper)
    }, {
        name: i18n("Default::ItemName::Orgasm"),
        enabled: true,
        trigger: {
            mode: "orgasm",
            type: "Any",
        },
        messages: DefaultValueV1.orgasm.map(message_mapper)
    }, {
        name: i18n("Default::ItemName::HighArousal"),
        enabled: true,
        trigger: {
            mode: "spicer",
            min_arousal: 80
        },
        messages: DefaultValueV1.hot.map(message_mapper)
    }, {
        name: i18n("Default::ItemName::MidArousal"),
        enabled: true,
        trigger: {
            mode: "spicer",
            min_arousal: 50,
            max_arousal: 80,
        },
        messages: DefaultValueV1.medium.map(message_mapper)
    }, {
        name: i18n("Default::ItemName::LowArousal"),
        enabled: true,
        trigger: {
            mode: "spicer",
            max_arousal: 50,
        },
        messages: DefaultValueV1.low.map(message_mapper)
    }];

    return Array.from({ length: MaxPersonalities }, (_, index) => index).map(
        FirstOr({
            name: DefaultPersonaName,
            index: DefaultPersonaIndex,
            responses: default_personality,
            blackList: []
        } as ResponsivePersonality, undefined)
    );
} export function getDefaultSettings(): ResponsiveSettingV2 {
    return Object.assign({}, {
        settings: { enabled: true }, active_personality: DefaultPersonaIndex, personalities: getDefaultPersonaList()
    });
}

