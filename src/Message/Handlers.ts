import { ChatRoomHandler, OrgasmMonitor } from "bc-utilities";
import { InvokeResponse } from "./MoanProvider";

export function OrgasmHandle(monitor: OrgasmMonitor) {
    const eventFunc = (event: OrgasmTriggerType) => ((pl: PlayerCharacter) => {
        if (CurrentScreen !== 'ChatRoom') return;
        InvokeResponse({ triggerType: "orgasm", type: event }, pl);
    })

    monitor.onOrgasm(eventFunc("Orgasmed"))
    monitor.onRuined(eventFunc("Ruined"))
    monitor.onResist(eventFunc("Resisted"))
}

export function ChatRoomHandle(handler: ChatRoomHandler) {
    handler.onAfterPlayerJoin((pl) => InvokeResponse({ triggerType: "event", type: "Join" }, pl));
    handler.onBeforePlayerLeave((pl) => InvokeResponse({ triggerType: "event", type: "Leave" }, pl));

    handler.onReceiveActivity((player, sender, data) => {
        if (data.TargetCharacter !== player.MemberNumber) return;

        InvokeResponse({
            triggerType: "activity",
            activity: data.ActivityName,
            bodypart: data.ActivityGroup,
            from: data.SourceCharacter,
            arousal: player.ArousalSettings?.Progress || 0
        }, player, sender);
    });
}