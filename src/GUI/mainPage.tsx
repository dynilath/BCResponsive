import { DataManager } from "../Data";
import { GetText } from "../i18n";
import {
  IconButton,
  PlainText,
  Switch,
  BondageReact,
  TextRoundButton,
  IconRoundButton,
  HorizontalLayout,
} from "bondage-react";
import { createBinding } from "bondage-react/bindings";
import { Icons } from "./Icons";
import { GIT_REPO, ModVersion } from "../Definition";
import { GUIPage } from "./GUITypes";

export function MainSettingComponent({
  setPage,
}: {
  setPage: (page: GUIPage) => void;
}) {
  const enable_binding = createBinding(
    DataManager.instance.data.settings,
    "enabled"
  );

  return (
    <BondageReact>
      <IconButton
        position={{ left: 1815, top: 75, width: 90, height: 90 }}
        icon="./Icons/Exit.png"
        onClick={() => PreferenceSubscreenExtensionsExit()}
      />

      <PlainText
        position={{ left: 200, top: 100, width: 1200, height: 50 }}
        text={`${GetText("responsive_setting_title")} v${ModVersion}`}
        shadow={true}
      />

      <HorizontalLayout
        position={{ left: 200, top: 200, width: 1200, height: 100 }}
      >
        <Switch
          position={{ width: 160, height: 80 }}
          binding={enable_binding}
        />
        <PlainText
          position={{ width: 400, height: 80 }}
          text={GetText("MainMenu::MainSwitch")}
        />
      </HorizontalLayout>

      <TextRoundButton
        position={{ left: 200, top: 320, width: 400, height: 100 }}
        text={GetText("MainMenu::PersonalitySetting")}
        onClick={() => setPage("persona")}
      />

      <TextRoundButton
        position={{ left: 200, top: 440, width: 400, height: 100 }}
        text={GetText("MainMenu::ResponseSetting")}
        onClick={() => setPage("response")}
      />

      <IconRoundButton
        position={{ left: 1700, top: 800, width: 100, height: 100 }}
        icon={Icons.github}
        onClick={() => window.open(GIT_REPO)}
      />
    </BondageReact>
  );
}
