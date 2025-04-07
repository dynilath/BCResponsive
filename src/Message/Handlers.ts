import { InvokeResponse } from './MoanProvider';
import { ChatRoomMessageHandlerEvents, OrgasmEvents, ChatRoomEvents } from '@sugarch/bc-event-handler';

const eventFunc =
    (event: OrgasmTriggerType) =>
    ({ Player }: { Player: Character }) => {
        if (CurrentScreen !== 'ChatRoom') return;
        InvokeResponse({ triggerType: 'orgasm', type: event }, Player);
    };

export function init () {
    ChatRoomEvents.on('PlayerJoin', (player)=>InvokeResponse({ triggerType: 'event', type: 'Join' }, player))
    ChatRoomEvents.on('PlayerLeave', (player)=>InvokeResponse({ triggerType: 'event', type: 'Leave' }, player))
    
    OrgasmEvents.on('orgasmed', eventFunc('Orgasmed'));
    OrgasmEvents.on('ruined', eventFunc('Ruined'));
    OrgasmEvents.on('resisted', eventFunc('Resisted'));

    ChatRoomMessageHandlerEvents.on('Activity', (data, sender, message, metadata) => {
        if (metadata?.TargetCharacter !== sender.MemberNumber) return;
        if (!metadata?.ActivityName || !metadata?.GroupName || !sender.MemberNumber) return;
        InvokeResponse(
            {
                triggerType: 'activity',
                activity: metadata.ActivityName,
                bodypart: metadata.GroupName,
                from: sender.MemberNumber,
                arousal: sender.ArousalSettings?.Progress || 0,
            },
            Player,
            sender
        );
    });
}
