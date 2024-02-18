import { GUISettingScreen } from "../GUI";
import { AGUIScreen } from "../Widgets/AGUI";
import { ExitButton } from "../Widgets/Button";
import { BasicText, TitleText } from "../Widgets/Text";
import { ActivityModeInfo } from "./TriggerMode/ActivityModeInfo";
import { ResponseMenuState } from "./ResponseMenuState";
import { ResponseMessageList } from "./MessageList/ResponseMessageList";
import { SpicerModeInfo } from "./TriggerMode/SpicerModeInfo";
import { TriggerTab } from "./TriggerTab";
import { TriggerBaseInfo } from "./TriggerBaseInfo";
import { Switch } from "../Widgets/Switch";
import { GetText } from "../../i18n";

const MENU_BASE_Y = 200;
const MENU_TOTAL_HEIGHT = 660;

const TRIGGER_TAB_BASE_X = 200;
const TRIGGER_TAB_WIDTH = 300;

const TRIGGER_INFO_BASE_X = 550;
const TRIGGER_INFO_SPACING = 30;

const TRIGGER_MESSAGE_BASE_X = 1200;
const TRIGGER_MESSAGE_WIDTH = 600;

const TriggerTabRect = {
    x: TRIGGER_TAB_BASE_X,
    y: MENU_BASE_Y,
    width: TRIGGER_TAB_WIDTH,
    height: MENU_TOTAL_HEIGHT
}

const TriggerBaseInfoRect = {
    x: TRIGGER_INFO_BASE_X,
    y: MENU_BASE_Y,
    ...TriggerBaseInfo.Metrics()
}

const TriggerExtendedInfoRect = {
    x: TRIGGER_INFO_BASE_X,
    y: MENU_BASE_Y + TriggerBaseInfoRect.height + TRIGGER_INFO_SPACING,
    width: TriggerBaseInfoRect.width,
    height: MENU_TOTAL_HEIGHT - TriggerBaseInfoRect.height - TRIGGER_INFO_SPACING
}

const TriggerMessageRect = {
    x: TRIGGER_MESSAGE_BASE_X,
    y: MENU_BASE_Y,
    width: TRIGGER_MESSAGE_WIDTH,
    height: MENU_TOTAL_HEIGHT
}

const TriggerDeleteModeSwitchRect = {
    x: TRIGGER_INFO_BASE_X + 1000,
    y: MENU_BASE_Y - 60 - TRIGGER_INFO_SPACING,
    width: 200,
    height: 60
}

const TriggerDeleteModeSwitchText = {
    x: TriggerDeleteModeSwitchRect.x - TRIGGER_INFO_SPACING,
    y: TriggerDeleteModeSwitchRect.y + TriggerDeleteModeSwitchRect.height / 2,
}

export class TriggerSetting extends AGUIScreen {
    private readonly _state: ResponseMenuState;
    private readonly triggerTab: TriggerTab;
    constructor(prev: GUISettingScreen | null = null, persona: ResponsivePersonality) {
        super(prev);
        this._state = new ResponseMenuState(persona);

        this.triggerTab = new TriggerTab(this._state, TriggerTabRect);

        this._items = [
            new TitleText(),
            new ResponseMessageList(this, this._state, TriggerMessageRect),
            new ActivityModeInfo(this, this._state, TriggerExtendedInfoRect),
            new SpicerModeInfo(this, this._state, TriggerExtendedInfoRect),
            new TriggerBaseInfo(this._state, TriggerBaseInfoRect),
            this.triggerTab,
            new BasicText(TriggerDeleteModeSwitchText, GetText("PersonaMenu::DeleteMode"), { align: "right" }),
            new Switch(this.triggerTab.binding, TriggerDeleteModeSwitchRect),
            new ExitButton(() => this.Exit()),
        ];
    }
}

