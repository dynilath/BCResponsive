import { ModName } from "../Definition";
import { GetText } from "../i18n";
import { UI } from "./pageRouter";
import { Icons } from "./Icons";

const unloadOnce = async () => {
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (CurrentScreen !== "Preference") {
      UI.unload("responsive-settings");
      break;
    }
  }
};

export function registerGUI() {
  PreferenceRegisterExtensionSetting({
    Identifier: ModName,
    Image: Icons.responsive_main,
    ButtonText: () => GetText("setting_button_text"),
    load: () => {
      UI.load("responsive-settings");
      unloadOnce();
    },
    run: () => {
      if (UI.loadIfNotLoaded("responsive-settings")) {
        unloadOnce();
      }
    },
    click: () => { },
    unload: () => {
      UI.unload("responsive-settings");
    },
    exit: () => {
      UI.unload("responsive-settings");
    },
  });
}
