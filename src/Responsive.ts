import bcMod from 'bondage-club-mod-sdk'
import { ActivityHandle, OrgasmHandle } from './Message/Handlers';
import { ChatMessageHandler } from './Message/ChatMessageHandler';
import { DataManager } from './Data/Data';
import { ModName, ModVersion } from './Definition';
import { GUISetting } from './GUI/GUI';
import { GUIMainMenu } from './GUI/MainMenu';

(function () {
    if (window.BCResponsive_Loaded) return;

    let mod = bcMod.registerMod({ name: ModName, fullName: ModName, version: ModVersion, repository: 'https://gitlab.com/dynilath/BCResponsive' });

    window.BCResponsive_Loaded = false;

    mod.hookFunction('ChatRoomMessage', 9, (args, next) => {
        next(args);
        ActivityHandle(Player, args[0] as IChatRoomMessage);
    });

    mod.hookFunction('ActivityOrgasmStart', 9, (args, next) => {
        next(args);
        OrgasmHandle(Player, args[0] as Character);
    });

    GUISetting.init(mod, () => { return new GUIMainMenu });
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

    window.BCResponsive_Loaded = true;

    console.log(`${ModName} v${ModVersion} loaded.`);
})()