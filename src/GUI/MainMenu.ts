
import { DataManager } from "../Data";
import { GetText } from "../i18n";
import { GUISettingScreen, setSubscreen } from "./GUI";
import { PersonaSetting } from "./Persona/PersonaMenu";
import { TriggerSetting } from "./Response/ResponseMenu";
import { AGUIScreen } from "./Widgets/AGUI";
import { Binding } from "./Widgets/Binding";
import { ExitButton, TextRoundButton } from "./Widgets/Button";
import { TextButton } from "./Widgets/Button";
import { Switch } from "./Widgets/Switch";
import { BasicText, TitleText } from "./Widgets/Text";

const MENU_BASE_X = 200;
const MENU_BASE_Y = 200;

const ITEM_WIDTH = 400;
const ITEM_HEIGHT = 100;
const ITEM_SPACING = 20;

const SWITCH_HEIGHT = 80;

class MasterSwitch extends Binding<boolean> {
    get value(): boolean {
        return DataManager.instance.data.settings.enabled;
    }
    set value(v: boolean) {
        DataManager.instance.data.settings.enabled = v;
    }

    static instance: MasterSwitch = new MasterSwitch();
}

export class GUIMainMenu extends AGUIScreen {
    constructor(prev: GUISettingScreen | null = null) {
        super(prev);

        this._items = [
            new ExitButton(() => this.Exit()),
            new TitleText(),
            new BasicText({ x: MENU_BASE_X + ITEM_SPACING + ITEM_HEIGHT * 2, y: MENU_BASE_Y + ITEM_HEIGHT / 2 }, GetText("MainMenu::MainSwitch")),
            new Switch(MasterSwitch.instance, {
                x: MENU_BASE_X,
                y: MENU_BASE_Y + ITEM_HEIGHT / 2 - SWITCH_HEIGHT / 2,
                width: SWITCH_HEIGHT * 2, height: SWITCH_HEIGHT
            }),
            new TextRoundButton({
                x: MENU_BASE_X,
                y: MENU_BASE_Y + (ITEM_HEIGHT + ITEM_SPACING) * 2,
                width: ITEM_WIDTH, height: ITEM_HEIGHT
            }, GetText("MainMenu::PersonalitySetting"), () => setSubscreen(new PersonaSetting(this))),
            new TextRoundButton({
                x: MENU_BASE_X,
                y: MENU_BASE_Y + (ITEM_HEIGHT + ITEM_SPACING) * 3,
                width: ITEM_WIDTH, height: ITEM_HEIGHT
            }, GetText("MainMenu::ResponseSetting"), () => {
                const persona = DataManager.active_personality;
                if (!persona) return;
                setSubscreen(new TriggerSetting(this, persona));
            }),
        ]
    }
}