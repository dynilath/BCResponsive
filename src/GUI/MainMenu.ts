
import { DataManager } from "../Data";
import { LocalizedText } from "../i18n";
import { GUISettingScreen, setSubscreen } from "./GUI";
import { PersonaSetting } from "./PersonaMenu";
import { TriggerSetting } from "./TriggerSetting";
import { AGUIScreen } from "./Widgets/AGUI";
import { ExitButton, TextButton, TitleText } from "./Widgets/Common";

const titleBaseX = 200;
const titleBaseY = 200;

export class GUIMainMenu extends AGUIScreen {
    constructor(prev: GUISettingScreen | null = null) {
        super(prev, [
            new ExitButton(() => this.Exit()),
            new TitleText(),
            new TextButton({ x: titleBaseX, y: titleBaseY + 0, width: 400, height: 100 }, "Personality Setting", () => this.gotoPersonaSetting()),
            new TextButton({ x: titleBaseX, y: titleBaseY + 110, width: 400, height: 100 }, "Response Setting", () => { }),
        ]);
    }

    gotoPersonaSetting() {
        setSubscreen(new PersonaSetting(this));
    }
}