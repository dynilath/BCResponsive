import { DataManager } from "../Data";
import { ActivityDeconstruct, Monitor, OrgasmMonitor } from "bc-utilities";
import { InvokeResponse } from "./MoanProvider";

export function ActivityHandle(player: PlayerCharacter | undefined, data: ServerChatRoomMessage) {
    if (!DataManager.instance.data.settings.enabled) return;
    if (player === undefined || player.MemberNumber === undefined) return;
    if (data.Type !== "Activity") return;

    if (player.GhostList && player.GhostList.indexOf(data.Sender) >= 0) return;
    let sender = ChatRoomCharacter.find(c => c.MemberNumber == data.Sender);
    if (sender === undefined) return;

    if (!data.Dictionary) return;
    let activityInfo = ActivityDeconstruct(data.Dictionary);
    if (activityInfo == undefined) return;
    if (activityInfo.TargetCharacter.MemberNumber !== player.MemberNumber) return;
    if (sender.MemberNumber !== activityInfo.SourceCharacter.MemberNumber) return;

    InvokeResponse({
        triggerType: "activity",
        activity: activityInfo.ActivityName,
        bodypart: activityInfo.ActivityGroup,
        from: activityInfo.SourceCharacter.MemberNumber,
        arousal: player.ArousalSettings?.Progress || 0
    }, player, sender);
}

export function OrgasmHandle(monitor: OrgasmMonitor) {
    const eventFunc = (event: OrgasmTriggerType) => ((pl: PlayerCharacter) => {
        if (CurrentScreen !== 'ChatRoom') return;
        InvokeResponse({ triggerType: "orgasm", type: event }, pl);
    })

    monitor.AddOrgasmEvent(eventFunc("Orgasmed"))
    monitor.AddRuinedEvent(eventFunc("Ruined"))
    monitor.AddResistEvent(eventFunc("Resisted"))
}