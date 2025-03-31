import { DataManager } from './Data/Data';
import { ModName, ModVersion, GIT_REPO } from './Definition';
import { GUISetting } from './GUI/GUI';
import { MainMenu } from './GUI/MainMenu';
import { HookManager } from '@sugarch/bc-mod-hook-manager';
import { init } from './Message';
import { once } from '@sugarch/bc-mod-utility';

once("__load_flag__", ()=> {
    HookManager.init({ name: ModName, fullName: ModName, version: ModVersion, repository: GIT_REPO });
    GUISetting.init(() => new MainMenu());
    DataManager.init();
    init();
    console.log(`${ModName} v${ModVersion} loaded.`);
});