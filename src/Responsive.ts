import bcMod from 'bondage-club-mod-sdk'
import { ActivityHandle, OrgasmHandle } from './Message/Handlers';
import { DataManager } from './Data/Data';
import { ModName, ModVersion, Repository } from './Definition';
import { GUISetting } from './GUI/GUI';
import { GUIMainMenu } from './GUI/MainMenu';

(function () {
    if (window.BCResponsive_Loaded) return;

    let mod = bcMod.registerMod({ name: ModName, fullName: ModName, version: ModVersion, repository: Repository });

    window.BCResponsive_Loaded = false;

    mod.hookFunction('ChatRoomMessage', 9, (args, next) => {
        next(args);
        ActivityHandle(Player, args[0] as ServerChatRoomMessage);
    });

    mod.hookFunction('ActivityOrgasmStart', 9, (args, next) => {
        next(args);
        OrgasmHandle(Player, args[0] as Character);
    });

    GUISetting.init(mod, () => { return new GUIMainMenu });
    DataManager.init(mod);

    window.BCResponsive_Loaded = true;

    console.log(`${ModName} v${ModVersion} loaded.`);
})()