
import { DataManager } from "../Data";
import { GetText } from "../i18n";
import { GUISettingScreen, setSubscreen } from "./GUI";
import { PersonaSetting } from "./Persona/PersonaMenu";
import { TriggerSetting } from "./Response/ResponseMenu";
import { AGUIScreen } from "./Widgets/AGUI";
import { ExitButton } from "./Widgets/Button";
import { TextButton } from "./Widgets/Button";
import { TitleText } from "./Widgets/Text";

const titleBaseX = 200;
const titleBaseY = 200;

export class GUIMainMenu extends AGUIScreen {
    constructor(prev: GUISettingScreen | null = null) {
        super(prev);
        this._items = [
            new ExitButton(() => this.Exit()),
            new TitleText(),
            new TextButton({ x: titleBaseX, y: titleBaseY + 0, width: 400, height: 100 }, "Personality Setting", () => setSubscreen(new PersonaSetting(this))),
            new TextButton({ x: titleBaseX, y: titleBaseY + 110, width: 400, height: 100 }, "Response Setting", () => {
                const persona = DataManager.active_personality;
                if (!persona) return;
                setSubscreen(new TriggerSetting(this, persona));
            }),
        ]
    }
}