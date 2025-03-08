import { ModName } from "../Definition";
import { GetText } from "../i18n";
import { UI } from "./mainPage";
import { Icons } from "./Icons";

export function registerGUI() {
  PreferenceRegisterExtensionSetting({
    Identifier: ModName,
    Image: Icons.responsive_main,
    ButtonText: () => GetText("setting_button_text"),
    load: () => {
      UI.load("responsive-settings");

      (async () => {
        while (true) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (CurrentScreen !== "Preference") {
            UI.unload("responsive-settings");
            break;
          }
        }
      })();
    },
    run: () => {
      UI.loadIfNotLoaded("responsive-settings");
    },
    click: () => {},
    unload: () => {
      UI.unload("responsive-settings");
    },
    exit: () => {
      UI.unload("responsive-settings");
    },
  });
}
