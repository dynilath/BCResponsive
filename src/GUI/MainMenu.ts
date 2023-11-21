
import { DataManager } from "../Data";
import { LocalizedText } from "../i18n";
import { DrawExit, DrawSettingButton, DrawTitle, isClickExit } from "./Draw";
import { GUISettingScreen, setSubscreen } from "./GUI";
import { TriggerSetting } from "./TriggerSetting";

const titleBaseX = 200;
const titleBaseY = 160;

export class GUIMainMenu extends GUISettingScreen {
    Run(): void {
        const data = DataManager.instance.data;
        DrawExit();
        DrawTitle();
        DrawCheckbox(titleBaseX, titleBaseY, 64, 64, LocalizedText("setting_enable"), data.settings.enabled);
        DrawSettingButton(titleBaseX, titleBaseY + 90, "Triggers", "White", "Icons/Start.png");
        DrawSettingButton(titleBaseX, titleBaseY + 200, "Messages", "White", "Icons/Chat.png");
    }

    Click(): void {
        const data = DataManager.instance.data;
        if (isClickExit()) {
            this.Exit();
            return;
        }
        if (MouseIn(titleBaseX, titleBaseY, 64, 64)) {
            data.settings.enabled = !data.settings.enabled;
            return;
        }
        if (MouseIn(titleBaseX, titleBaseY + 90, 400, 90)) {
            setSubscreen(new TriggerSetting(this));
        }
        if (MouseIn(titleBaseX, titleBaseY + 200, 400, 90)) {

        }
    }

    Unload(): void {
    }
}