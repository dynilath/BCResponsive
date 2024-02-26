import { TriggerData, TriggerDataActivity, TriggerDataOrgasm, isTriggerDataActivity, isTriggerDataOrgasm } from "./types";
import { DataManager, isTriggerOrgasm } from "../Data";
import { ChatRoomAutoInterceptMessage } from "./ChatMessages";
import { ReplaceField } from "./MessageFields";
import { ChatRoomAction } from "bc-utilities";

export function InvokeResponse(data: TriggerData, player: Character | undefined, target?: Character) {
    const active_personality = DataManager.active_personality;

    if (active_personality === undefined) return;

    if (isTriggerDataActivity(data)) {
        InvokeResponseForActivity(active_personality, data, player, target);
    } else if (isTriggerDataOrgasm(data)) {
        InvokeResponseForOrgasm(active_personality, data, player);
    }
}

function InvokeResponseForActivity(persona: ResponsivePersonality, data: TriggerDataActivity, player: Character | undefined, target: Character | undefined) {
    if (persona.blackList.includes(data.from)) return;

    let selected = (() => {
        let actived_messages = persona.responses.filter(i => {
            if (!i.enabled) return false;
            const trigger = i.trigger;
            if (trigger.mode !== "activity") return false;
            if (trigger.allow_activities !== undefined && !trigger.allow_activities.includes(data.activity)) return false;
            if (trigger.allow_bodyparts !== undefined && !trigger.allow_bodyparts.includes(data.bodypart)) return false;
            if (trigger.allow_ids !== undefined && !trigger.allow_ids.includes(data.from)) return false;
            return true;
        }).reduce((acc, cur) => { return acc.concat(cur.messages); }, [] as ResponseMessage[]);

        if (actived_messages.length === 0) return undefined;
        return actived_messages[Math.floor(Math.random() * actived_messages.length)];
    })();
    if (selected === undefined) return;

    if (selected.type === "message") {
        let selected_spicer = (() => {
            let actived_spicers = persona.responses.filter(i => {
                if (!i.enabled) return false;
                const trigger = i.trigger;
                if (trigger.mode !== "spicer") return false;
                if (trigger.min_arousal !== undefined && data.arousal < trigger.min_arousal) return false;
                if (trigger.max_arousal !== undefined && data.arousal > trigger.max_arousal) return false;
                if (trigger.allow_ids !== undefined && !trigger.allow_ids.includes(data.from)) return false;
                return true;
            }).reduce((acc, cur) => { return acc.concat(cur.messages); }, [] as ResponseMessage[]);
            if (actived_spicers.length === 0) return undefined;
            return actived_spicers[Math.floor(Math.random() * actived_spicers.length)];
        })();
        if (selected_spicer === undefined) {
            ChatRoomAutoInterceptMessage(ReplaceField(selected.content, player, target));
        } else {
            ChatRoomAutoInterceptMessage(ReplaceField(selected_spicer.content, player, target) + " " + ReplaceField(selected.content, player, target));
        }
    } else if (selected.type === "action") {
        ChatRoomAction.instance.SendAction(ReplaceField(selected.content, player, target));
    }
}

function InvokeResponseForOrgasm(persona: ResponsivePersonality, data: TriggerDataOrgasm, player: Character | undefined) {
    let selected = (() => {
        let actived_messages = persona.responses.filter(i => {
            if (!i.enabled) return false;
            const trigger = i.trigger;
            if (!isTriggerOrgasm(trigger)) return false;
            if (trigger.type !== "Any" && trigger.type !== data.type) return false;
            return true;
        }).reduce((acc, cur) => { return acc.concat(cur.messages); }, [] as ResponseMessage[]);

        if (actived_messages.length === 0) return undefined;
        return actived_messages[Math.floor(Math.random() * actived_messages.length)];
    })();
    if (selected === undefined) return;

    if (selected.type === "message") {
        ChatRoomAutoInterceptMessage(ReplaceField(selected.content, player, undefined));
    } else if (selected.type === "action") {
        ChatRoomAction.instance.SendAction(ReplaceField(selected.content, player, undefined));
    }
}