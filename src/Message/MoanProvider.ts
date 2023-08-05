import { ChatRoomAutoInterceptMessage } from "./ChatMessages";
import { MoanType } from "../Definition";
import { ShuffleStr } from "../utils";
import { DataManager } from "../Data";


let ShiftingMoans: ResponsiveSetting = {
    hot: [],
    medium: [],
    light: [],
    low: [],
    orgasm: [],
    pain: [],
    tickle: [],
};

function NextMoanString(key: keyof ResponsiveSetting) {
    if (ShiftingMoans[key].length === 0) {
        let r = DataManager.instance.data[key];
        if (r.length > 0) ShiftingMoans[key] = ShuffleStr(r);
    }

    if (ShiftingMoans[key].length > 0) {
        return ShiftingMoans[key].shift() as string;
    }

    return '';
}

function TypedMoan(player: Character, sender: Character, t: MoanType) {
    let k: keyof ResponsiveSetting | undefined;
    if (t === MoanType.Orgasm) k = 'orgasm';
    else if (t === MoanType.Pain) k = 'pain';
    else if (t === MoanType.Tickle) k = 'tickle';
    if (!k) return '';
    return NextMoanString(k).replaceAll('MY_NAME', CharacterNickname(player)).replaceAll('SOURCE_NAME', CharacterNickname(sender));
}

function BaseMoan(player: Character, Arousal: number, shift?: number) {
    let factor = Math.floor(Arousal / 20);
    if (shift) factor -= shift;
    if (factor < 0) factor = 0;
    else if (factor > 5) factor = 5;
    const Tkeys: (keyof ResponsiveSetting)[] = ['low', 'low', 'light', 'medium', 'hot', 'hot'];
    let k = Tkeys[factor];
    return NextMoanString(k).replaceAll('MY_NAME', CharacterNickname(player));
}

function MixMoan(player: Character, sender: Character, t: MoanType, act: string) {
    let actFactor = player.ArousalSettings.Activity.find(_ => _.Name === act)?.Self;
    if (!actFactor) return '';

    let threthold1 = Math.max(10, (4 - actFactor) * 25);
    let threthold2 = threthold1 + 40;
    let arousal = player.ArousalSettings.Progress;

    let typed = TypedMoan(player, sender, t);
    let base = BaseMoan(player, arousal);

    if (arousal <= threthold1) {
        return typed;
    } else {
        let m = BaseMoan(player, arousal);
        if (!m) return typed;
        else {
            if (arousal <= threthold2)  return typed + "♥" + base + "♥";
            else return "♥" + base + "♥";
        }
    }
}

function BaseMoanStepped(player: Character, act: string) {
    let actFactor = player.ArousalSettings.Activity.find(_ => _.Name === act)?.Self;
    if (!actFactor) return '';

    let threthold1 = Math.max(10, (4 - actFactor) * 25);
    let threthold2 = threthold1 + 40;
    let arousal = player.ArousalSettings.Progress;

    if (arousal <= threthold1) return BaseMoan(player, arousal, 1);
    else if (arousal <= threthold2) return BaseMoan(player, arousal, 0);
    else return BaseMoan(player, arousal, -1);
}

export function MasturbateMoan(player: Character, sender: Character, masturSrc: 'MasturbateHand' | 'MasturbateFist' | 'MasturbateFoot' | 'MasturbateItem' | 'MasturbateTongue') {
    ChatRoomAutoInterceptMessage(ElementValue("InputChat"), BaseMoanStepped(player, masturSrc));
}

export function PainMessage(player: Character, sender: Character, painSrc: 'Bite' | 'Slap' | 'Pinch' | 'Spank' | 'SpankItem' | 'ShockItem' | 'Kick') {
    if (!DataManager.instance.data.pain) return;
    ChatRoomAutoInterceptMessage(ElementValue("InputChat"), MixMoan(player, sender, MoanType.Pain, painSrc));
}

export function OrgasmMessage(player: Character, sender: Character) {
    if (!DataManager.instance.data.orgasm) return;
    ChatRoomAutoInterceptMessage(ElementValue("InputChat"), TypedMoan(player, sender, MoanType.Orgasm));
}

export function TickleMessage(player: Character, sender: Character, tickleSrc: 'TickleItem' | 'Tickle') {
    if (!DataManager.instance.data.tickle) return;
    ChatRoomAutoInterceptMessage(ElementValue("InputChat"), MixMoan(player, sender, MoanType.Tickle, tickleSrc));
}