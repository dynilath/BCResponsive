import bcMod from 'bondage-club-mod-sdk'
import { ChatRoomHandle, OrgasmHandle } from './Message/Handlers';
import { DataManager } from './Data/Data';
import { CUSTOM_ACTION_TAG, ModName, ModVersion, GIT_REPO } from './Definition';
import { GUISetting } from './GUI/GUI';
import { MainMenu } from './GUI/MainMenu';
import { ChatRoomAction, ChatRoomHandler, OrgasmMonitor } from 'bc-utilities';

(function () {
    if (window.__load_flag__) return;
    window.__load_flag__ = false;

    let mod = bcMod.registerMod({ name: ModName, fullName: ModName, version: ModVersion, repository: GIT_REPO });

    OrgasmMonitor.init(mod).then(OrgasmHandle);
    ChatRoomHandler.init(mod).then(ChatRoomHandle);

    GUISetting.init(mod, () => { return new MainMenu });
    DataManager.init(mod);
    ChatRoomAction.init(CUSTOM_ACTION_TAG);

    window.__load_flag__ = true;

    console.log(`${ModName} v${ModVersion} loaded.`);
})()