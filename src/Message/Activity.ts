import { DataManager } from "../Data";
import { ActivityDeconstruct } from "./ChatMessages";
import { MasturbateMoan, PainMessage, TickleMessage } from "./MoanProvider";

const ActivityDict = new Map<string, (player: Character, sender: Character) => void>([
    ['Slap', (player,sender) => PainMessage(player, sender, 'Slap')],
    ['Bite', (player,sender) => PainMessage(player, sender, 'Bite')],
    ['Spank', (player,sender) => PainMessage(player, sender, 'Spank')],
    ['Kick', (player,sender) => PainMessage(player, sender, 'Kick')],
    ['Pinch', (player,sender) => PainMessage(player, sender, 'Pinch')],
    ['Tickle', (player,sender) => TickleMessage(player, sender, 'Tickle')],
    ['SpankItem', (player,sender) => PainMessage(player, sender, 'SpankItem')],
    ['TickleItem', (player,sender) => TickleMessage(player, sender, 'TickleItem')],
    ['MasturbateItem', (player,sender) => MasturbateMoan(player, sender, 'MasturbateItem')],
    ['ShockItem', (player,sender) => PainMessage(player, sender, 'ShockItem')],
    ['MasturbateHand', (player,sender) => MasturbateMoan(player, sender, 'MasturbateHand')],
    ['MasturbateFist', (player,sender) => MasturbateMoan(player, sender, 'MasturbateFist')],
    ['MasturbateFoot', (player,sender) => MasturbateMoan(player, sender, 'MasturbateFoot')],
    ['MasturbateTongue', (player,sender) => MasturbateMoan(player, sender, 'MasturbateTongue')],
]);

export function ActivityHandle(player: Character, sender: Character, data: IChatRoomMessage) {
    if (!DataManager.instance.data.settings.enable) return;
    if (!data.Dictionary) return;
    let activityInfo = ActivityDeconstruct(data.Dictionary);
    if (activityInfo == undefined) return;
    if (activityInfo.TargetCharacter.MemberNumber !== player.MemberNumber) return;

    let f = ActivityDict.get(activityInfo.ActivityName);
    if (f !== undefined) f(player,sender);
}