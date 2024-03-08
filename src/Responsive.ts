import bcMod from 'bondage-club-mod-sdk'
import { ActivityHandle, OrgasmHandle } from './Message/Handlers';
import { DataManager } from './Data/Data';
import { CUSTOM_ACTION_TAG, ModName, ModVersion, GIT_REPO } from './Definition';
import { GUISetting } from './GUI/GUI';
import { MainMenu } from './GUI/MainMenu';
import { ChatRoomAction, OrgasmMonitor } from 'bc-utilities';

(function () {
    if (window.__load_flag__) return;
    window.__load_flag__ = false;

    let mod = bcMod.registerMod({ name: ModName, fullName: ModName, version: ModVersion, repository: GIT_REPO });


    mod.hookFunction('ChatRoomMessage', 9, (args, next) => {
        next(args);
        ActivityHandle(Player, args[0] as ServerChatRoomMessage);
    });

    const orgasm = new OrgasmMonitor(mod);
    OrgasmHandle(orgasm);

    GUISetting.init(mod, () => { return new MainMenu });
    DataManager.init(mod);
    ChatRoomAction.init(CUSTOM_ACTION_TAG);

    window.__load_flag__ = true;

    console.log(`${ModName} v${ModVersion} loaded.`);
})()