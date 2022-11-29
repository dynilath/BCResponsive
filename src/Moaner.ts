import bcMod from 'bondage-club-mod-sdk'
import { ActivityHandle } from './Message/Activity';
import { ChatMessageHandler } from './Message/ChatMessageHandler';
import { ActivityDeconstruct } from './Message/ChatMessages';
import { DataManager } from './Data';
import { ModName, ModVersion } from './Definition';
import { GUISetting } from './GUI/GUI';
import { OrgasmMessage } from './Message/MoanProvider';
import { ShuffleStr } from './utils';

(function () {
    if (window.BCMoanerReloaded_Loaded) return;

    let mod = bcMod.registerMod({ name: ModName, fullName: ModName, version: ModVersion });

    window.BCMoanerReloaded_Loaded = false;

    window.BCMoanerReloaded = function (enable: boolean, src: MoanerPartialSetting) {
        let data: MoanerSolidSetting = {
            settings: { enable },
            low: [],
            light: [],
            medium: [],
            hot: [],
            orgasm: [],
            pain: [],
            tickle: [],
        }

        const validate = (p: any): string[] => {
            if (!Array.isArray(p)) return []
            return p.filter(_ => typeof _ === 'string');
        };

        for (const k in src) {
            if (k === 'settings') continue;
            let r = validate(src[k as keyof MoanerPartialSetting]);
            if (data.hasOwnProperty(k) && r) {
                (data[k as keyof MoanerSolidSetting] as string[]) = JSON.parse(JSON.stringify(r));
            }
        }

        DataManager.instance.PushMergeData(data);
    }

    const OrgasmHandle = (C: Character) => {
        if (!DataManager.instance.data.settings.enable) return;
        if (CurrentScreen !== 'ChatRoom' || !Player) return;
        if (Player.MemberNumber !== C.MemberNumber) return;
        OrgasmMessage(Player);
    };

    const chatMessageHandler = new ChatMessageHandler;

    mod.hookFunction('ChatRoomMessage', 9, (args, next) => {
        next(args);
        chatMessageHandler.Run(Player, args[0] as IChatRoomMessage);
    });

    mod.hookFunction('ActivityOrgasmStart', 9, (args, next) => {
        OrgasmHandle(args[0] as Character);
        next(args);
    });

    chatMessageHandler.Register('Activity', ActivityHandle);

    const GUI = new GUISetting;
    GUI.load(mod);

    DataManager.init();

    function LoadAndMessage() {
        DataManager.instance.ServerTakeData();
        console.log(`${ModName} v${ModVersion} ready.`);
    }

    mod.hookFunction('LoginResponse', 0, (args, next) => {
        next(args);
        LoadAndMessage();
    });

    if (Player && Player.MemberNumber) {
        LoadAndMessage();
    }

    window.BCMoanerReloaded_Loaded = true;

    console.log(`${ModName} v${ModVersion} loaded.`);
})()