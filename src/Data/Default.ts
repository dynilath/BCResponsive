import { DefaultPersonaIndex, DefaultPersonaName, MaxPersonalities } from "../Definition";
import { DefaultValueV1TriggerActivities } from "./V1";
import { DefaultValueV1 } from "./V1";
import { FirstOr } from "./types";


export function getDefaultPersonaList() {
    const message_mapper = (_: string) => { return { type: "message", content: _ } as ResponsiveMessage; };
    const action_mapper = (_: string) => { return { type: "action", content: _ } as ResponsiveMessage; };

    const default_personality: ResponsiveItem[] = [{
        name: "Pain",
        trigger: {
            mode: "activity",
            allow_activities: DefaultValueV1TriggerActivities.pain
        },
        messages: DefaultValueV1.pain.map(message_mapper).concat(["{me} feels the pain and frowned."].map(action_mapper))
    }, {
        name: "Tickle",
        trigger: {
            mode: "activity",
            allow_activities: DefaultValueV1TriggerActivities.tickle,
        },
        messages: DefaultValueV1.tickle.map(message_mapper).concat(["{me} squirms from the tickling."].map(action_mapper))
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
            index: DefaultPersonaIndex,
            responses: default_personality
        } as ResponsivePersonality, undefined)
    );
} export function getDefaultSettings(): ResponsiveSettingV2 {
    return Object.assign({}, {
        settings: { enabled: true }, active_personality: DefaultPersonaIndex, personalities: getDefaultPersonaList()
    });
}

