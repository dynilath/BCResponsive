import bcMod from 'bondage-club-mod-sdk';
import { DataManager } from './Data/Data';
import { ModName, ModVersion, GIT_REPO } from './Definition';
import { GUISetting } from './GUI/GUI';
import { MainMenu } from './GUI/MainMenu';
import { HookManager } from '@sugarch/bc-mod-hook-manager';
import { init } from './Message';

(function () {
    if (window.__load_flag__) return;
    window.__load_flag__ = false;

    let mod = bcMod.registerMod({ name: ModName, fullName: ModName, version: ModVersion, repository: GIT_REPO });

    HookManager.initWithMod(mod);

    GUISetting.init(mod, () => {
        return new MainMenu();
    });
    DataManager.init(mod);

    init();

    window.__load_flag__ = true;

    console.log(`${ModName} v${ModVersion} loaded.`);
})();
