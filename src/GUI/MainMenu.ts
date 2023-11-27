
import { DataManager } from "../Data";
import { LocalizedText } from "../i18n";
import { GUISettingScreen, setSubscreen } from "./GUI";
import { TriggerSetting } from "./TriggerSetting";
import { AGUIScreen } from "./Widgets/AGUI";
import { ExitButton, TitleText } from "./Widgets/CommonButtons";

const titleBaseX = 200;
const titleBaseY = 160;

export class GUIMainMenu extends AGUIScreen {
    constructor(prev: GUISettingScreen | null = null) {
        super(prev, [
            new ExitButton(() => this.Exit()),
            new TitleText()
        ]);
    }
}