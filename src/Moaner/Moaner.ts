import bcMod from 'bondage-club-mod-sdk'
import { ActivityDeconstruct } from '../utils/ChatMessages';

(function () {

    let SolidSettingValue: SolidSetting = {
        hot: [],
        medium: [],
        light: [],
        low: [],
        orgasm: [],
        pain: [],
        tickle: [],
    };

    let CurrentMoanSetting: MoanSetting = {};

    const mod_version = '' + 2;
    const mod_name = 'TamperMonkey Moaner Reloaded'

    let mod = bcMod.registerMod(mod_name, mod_version);

    window.BCMoanerReloaded_Loaded = false;

    function ChatRoomInterceptMessage(cur_msg: string, msg: string) {
        if (!msg) return;
        ElementValue("InputChat", cur_msg + "... " + msg);
        ChatRoomSendChat();
    }

    function ChatRoomNormalMessage(msg: string) {
        if (!msg) return;
        let backupChatRoomTargetMemberNumber = ChatRoomTargetMemberNumber;
        let oldmsg = ElementValue("InputChat");
        ElementValue("InputChat", msg);
        ChatRoomSendChat();
        ElementValue("InputChat", oldmsg);
        ChatRoomTargetMemberNumber = backupChatRoomTargetMemberNumber;
    }

    function ChatRoomAutoInterceptMessage(cur_msg: string, msg: string) {
        if (IsSimpleChat(cur_msg) && ChatRoomTargetMemberNumber == null) {
            ChatRoomInterceptMessage(cur_msg, msg);
        } else {
            ChatRoomNormalMessage(msg);
        }
    }

    let enabled = false;

    function ShuffleStr(src: string[]) {
        let temp: string[] = JSON.parse(JSON.stringify(src));
        let ret: string[] = []
        while (temp.length > 0) {
            let d = Math.floor(Math.random() * temp.length);
            ret.push(temp[d]);
            temp.splice(d, 1);
        }
        return ret;
    }

    window.BCMoanerReloaded = function (enable: boolean, src: MoanSetting) {
        enabled = enable;
        if (!enabled) return;
        CurrentMoanSetting = JSON.parse(JSON.stringify(src));

        for (const k in CurrentMoanSetting) {
            let r = CurrentMoanSetting[k as keyof MoanSetting];
            if (SolidSettingValue.hasOwnProperty(k) && r) {
                SolidSettingValue[k as keyof SolidSetting] = ShuffleStr(r);
            }
        }
    }

    function TypedMoan(t: MoanType) {
        let k: keyof SolidSetting | undefined;
        if (t === MoanType.Orgasm) k = 'orgasm';
        else if (t === MoanType.Pain) k = 'pain';
        else if (t === MoanType.Tickle) k = 'tickle';
        if (!k) return '';

        if (SolidSettingValue[k].length === 0) {
            let r = CurrentMoanSetting[k];
            if (r) SolidSettingValue[k] = ShuffleStr(r)
        }
        if (SolidSettingValue[k].length > 0) {
            return SolidSettingValue[k].shift() as string;
        }
        return '';
    }

    function BaseMoan(Arousal: number, shift?: number) {
        let factor = Math.floor(Arousal / 20);
        if (shift) factor -= shift;
        if (factor < 0) factor = 0;
        else if (factor > 5) factor = 5;
        const Tkeys: (keyof SolidSetting)[] = ['low', 'low', 'light', 'medium', 'hot', 'hot'];
        let k = Tkeys[factor];

        if (SolidSettingValue[k].length === 0) {
            let r = CurrentMoanSetting[k];
            if (r) SolidSettingValue[k] = ShuffleStr(r)
        }
        if (SolidSettingValue[k].length > 0) {
            return SolidSettingValue[k].shift() as string;
        }
        return '';
    }

    function MixMoan(player: Character, t: MoanType, act: string) {
        let actFactor = player.ArousalSettings.Activity.find(_ => _.Name === act)?.Self;
        if (!actFactor) return '';

        let threthold1 = Math.max(10, (4 - actFactor) * 25);
        let threthold2 = threthold1 + 40;
        let arousal = player.ArousalSettings.Progress;
        if (arousal <= threthold1) {
            return TypedMoan(t);
        } else {
            let m = BaseMoan(arousal);
            if (!m) return TypedMoan(t);
            else {
                if (arousal <= threthold2) {
                    return TypedMoan(t) + "♥" + BaseMoan(arousal) + "♥";
                }
                else {
                    return "♥" + BaseMoan(arousal) + "♥";
                }
            }
        }
    }

    function BaseMoanStepped(player: Character, act: string) {
        let actFactor = player.ArousalSettings.Activity.find(_ => _.Name === act)?.Self;
        if (!actFactor) return '';

        let threthold1 = Math.max(10, (4 - actFactor) * 25);
        let threthold2 = threthold1 + 40;
        let arousal = player.ArousalSettings.Progress;
        if (arousal <= threthold1) {
            return BaseMoan(arousal, 1);
        }
        else if (arousal <= threthold2) {
            return BaseMoan(arousal, 0);
        }
        else {
            return BaseMoan(arousal, -1);
        }
    }

    function IsSimpleChat(msg: string) {
        return msg.trim().length > 0 && !msg.startsWith("/") && !msg.startsWith("(") && !msg.startsWith("*");
    }

    function MasturbateMoan(player: Character, masturSrc: 'MasturbateHand' | 'MasturbateFist' | 'MasturbateFoot' | 'MasturbateItem' | 'MasturbateTongue') {
        ChatRoomAutoInterceptMessage(ElementValue("InputChat"), BaseMoanStepped(player, masturSrc));
    }

    function PainMessage(player: Character, painSrc: 'Bite' | 'Slap' | 'Pinch' | 'Spank' | 'SpankItem' | 'ShockItem') {
        if (!SolidSettingValue.pain) return;
        ChatRoomAutoInterceptMessage(ElementValue("InputChat"), MixMoan(player, MoanType.Pain, painSrc));
    }

    function OrgasmMessage(player: Character) {
        if (!SolidSettingValue.orgasm) return;
        ChatRoomAutoInterceptMessage(ElementValue("InputChat"), TypedMoan(MoanType.Orgasm));
    }

    function TickleMessage(player: Character, tickleSrc: 'TickleItem' | 'Tickle') {
        if (!SolidSettingValue.tickle) return;
        ChatRoomAutoInterceptMessage(ElementValue("InputChat"), MixMoan(player, MoanType.Tickle, tickleSrc));
    }

    const BasicFilter = (expectType: string, call: (self: Character, sender: Character, data: IChatRoomMessage) => void) => {
        return function (player: Character | undefined, data: IChatRoomMessage) {
            if (!enabled) return;
            if (data.Type !== expectType) return;
            if (player === undefined || player.MemberNumber === undefined) return
            if (player.GhostList && player.GhostList.indexOf(data.Sender) >= 0) return;
            let sender = ChatRoomCharacter.find(c => c.MemberNumber == data.Sender);
            if (sender === undefined) return;
            call(player, sender, data);
        }
    };

    const ActionDict = new Map<string, (player: Character) => void>([
        ['ActionActivitySpankItem', (player) => PainMessage(player, 'SpankItem')],
        ['ActionActivityTickleItem', (player) => TickleMessage(player, 'TickleItem')],
        ['ActionActivityMasturbateItem', (player) => MasturbateMoan(player, 'MasturbateItem')],
        ['ActionActivityShockItem', (player) => PainMessage(player, 'ShockItem')],
    ]);

    const ActionHandler = BasicFilter('Action', (player: Character, sender: Character, data: IChatRoomMessage) => {
        if (!data.Dictionary || !data.Dictionary.some(_ => _.Tag === 'DestinationCharacter' && _.MemberNumber === player.MemberNumber)) return;
        let f = ActionDict.get(data.Content);
        if (f !== undefined) f(player);
    });

    const ActivityDict = new Map<string, (player: Character) => void>([
        ['Slap', (player) => PainMessage(player, 'Slap')],
        ['Bite', (player) => PainMessage(player, 'Bite')],
        ['Spank', (player) => PainMessage(player, 'Spank')],
        ['Pinch', (player) => PainMessage(player, 'Pinch')],
        ['Tickle', (player) => TickleMessage(player, 'Tickle')],
        ['MasturbateHand', (player) => MasturbateMoan(player, 'MasturbateHand')],
        ['MasturbateFist', (player) => MasturbateMoan(player, 'MasturbateFist')],
        ['MasturbateFoot', (player) => MasturbateMoan(player, 'MasturbateFoot')],
        ['MasturbateTongue', (player) => MasturbateMoan(player, 'MasturbateTongue')],
    ]);

    const ActivityHandler = BasicFilter('Activity', (player: Character, sender: Character, data: IChatRoomMessage) => {
        if (!data.Dictionary) return;
        let activityInfo = ActivityDeconstruct(data.Dictionary);
        if (activityInfo == undefined) return;
        if (activityInfo.TargetCharacter.MemberNumber !== player.MemberNumber) return;

        let f = ActivityDict.get(activityInfo.ActivityName);
        if (f !== undefined) f(player);
    });

    const OrgasmHandle = (C: Character) => {
        if (!enabled) return;
        if (CurrentScreen !== 'ChatRoom' || !Player) return;
        if (Player.MemberNumber !== C.MemberNumber) return;
        OrgasmMessage(Player);
    };

    function InitHooks() {
        mod.hookFunction('ChatRoomMessage', 9, (args, next) => {
            next(args);
            ActivityHandler(Player, args[0] as IChatRoomMessage);
        });
        mod.hookFunction('ChatRoomMessage', 9, (args, next) => {
            next(args);
            ActionHandler(Player, args[0] as IChatRoomMessage);
        });
        mod.hookFunction('ActivityOrgasmStart', 9, (args, next) => {
            OrgasmHandle(args[0] as Character);
            next(args);
        });
    }

    InitHooks();

    window.BCMoanerReloaded_Loaded = true;

    console.log(`${mod_name} v${mod_version} loaded.`);
})()