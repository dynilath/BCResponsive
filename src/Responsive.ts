import bcMod from "bondage-club-mod-sdk";
import { ChatRoomHandle, OrgasmHandle } from "./Message/Handlers";
import { DataManager } from "./Data/Data";
import { CUSTOM_ACTION_TAG, ModName, ModVersion, GIT_REPO } from "./Definition";
import { ChatRoomAction, ChatRoomHandler, OrgasmMonitor } from "bc-utilities";
import { registerGUI } from "./GUI";

(function () {
  if (window.__load_flag__) return;
  window.__load_flag__ = false;

  let mod = bcMod.registerMod({
    name: ModName,
    fullName: ModName,
    version: ModVersion,
    repository: GIT_REPO,
  });

  OrgasmMonitor.init(mod).then(OrgasmHandle);
  ChatRoomHandler.init(mod).then(ChatRoomHandle);

  // GUISetting.init(mod, () => { return new MainMenu });

  registerGUI();

  DataManager.init(mod);
  ChatRoomAction.init(CUSTOM_ACTION_TAG);

  window.__load_flag__ = true;

  console.log(`${ModName} v${ModVersion} loaded.`);
})();
