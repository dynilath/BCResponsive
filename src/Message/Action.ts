import { DataManager } from "../Data";
import { MasturbateMoan, PainMessage, TickleMessage } from "./MoanProvider";

const ActionDict = new Map<string, (player: Character) => void>([
    ['ActionActivitySpankItem', (player) => PainMessage(player, 'SpankItem')],
    ['ActionActivityTickleItem', (player) => TickleMessage(player, 'TickleItem')],
    ['ActionActivityMasturbateItem', (player) => MasturbateMoan(player, 'MasturbateItem')],
    ['ActionActivityShockItem', (player) => PainMessage(player, 'ShockItem')],
]);

export function ActionHandle(player: Character, sender: Character, data: IChatRoomMessage) {
    if (!DataManager.instance.data.settings.enable) return;
    if (!data.Dictionary || !data.Dictionary.some(_ => _.Tag === 'DestinationCharacter' && _.MemberNumber === player.MemberNumber)) return;
    let f = ActionDict.get(data.Content);
    if (f !== undefined) f(player);
}