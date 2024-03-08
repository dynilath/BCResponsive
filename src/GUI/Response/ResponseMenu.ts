import { GUISetting, IGUIScreen } from "../GUI";
import { AGUIScreen } from "../Widgets/AGUI";
import { ExitButton, TextRoundButton } from "../Widgets/Button";
import { BasicText, FitText, TitleText } from "../Widgets/Text";
import { ActivityModeInfo } from "./TriggerMode/ActivityModeInfo";
import { ResponseMenuState } from "./ResponseMenuState";
import { ResponseMessageList } from "./MessageList/ResponseMessageList";
import { SpicerModeInfo } from "./TriggerMode/SpicerModeInfo";
import { TriggerTab } from "./TriggerTab";
import { TriggerBaseInfo } from "./TriggerBaseInfo";
import { Switch } from "../Widgets/Switch";
import { GetText } from "../../i18n";
import { OrgasmModeInfo } from "./TriggerMode/OrgasmModeInfo";
import { MemberListPopup } from "./TriggerMode/MemberListPopup";

const MENU_BASE_Y = 200;
const MENU_BASE_X = 180;
const MENU_TOTAL_HEIGHT = 1000 - 120 - MENU_BASE_Y;
const MENU_TOTAL_WIDTH = 2000 - MENU_BASE_X * 2;

const SECTION_SPACING = 50;

const TRIGGER_TAB_WIDTH = 350;

const TRIGGER_INFO_BASE_X = 550;
const TRIGGER_INFO_SPACING = 30;

const TRIGGER_MESSAGE_WIDTH = 600;

const PersonaNameRect = {
    x: MENU_BASE_X,
    y: MENU_BASE_Y,
    width: TRIGGER_TAB_WIDTH,
    height: 60
}

const PersonaBlackListRect = {
    x: MENU_BASE_X,
    y: PersonaNameRect.y + PersonaNameRect.height + 10,
    width: TRIGGER_TAB_WIDTH,
    height: 60
}

const TRIGGER_INFO_BASE_Y = PersonaBlackListRect.y + PersonaBlackListRect.height + SECTION_SPACING;

const TriggerTabRect = {
    x: MENU_BASE_X,
    y: TRIGGER_INFO_BASE_Y,
    width: TRIGGER_TAB_WIDTH,
    height: MENU_TOTAL_HEIGHT + MENU_BASE_Y - TRIGGER_INFO_BASE_Y
}

const TriggerBaseInfoRect = {
    x: TriggerTabRect.x + TriggerTabRect.width + SECTION_SPACING,
    y: MENU_BASE_Y,
    ...TriggerBaseInfo.Metrics()
}

const TriggerExtendedInfoRect = {
    x: TriggerBaseInfoRect.x,
    y: MENU_BASE_Y + TriggerBaseInfoRect.height + TRIGGER_INFO_SPACING,
    width: TriggerBaseInfoRect.width,
    height: MENU_TOTAL_HEIGHT - TriggerBaseInfoRect.height - TRIGGER_INFO_SPACING
}

const RIGHT_REMAINING = MENU_TOTAL_WIDTH - TriggerTabRect.width - SECTION_SPACING - TriggerBaseInfoRect.width - SECTION_SPACING;

const TriggerMessageRect = {
    x: 2000 - MENU_BASE_X - RIGHT_REMAINING,
    y: MENU_BASE_Y,
    width: RIGHT_REMAINING,
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
    constructor(readonly prev: IGUIScreen | null = null, readonly persona: ResponsivePersonality) {
        super(prev);
        this._state = new ResponseMenuState(persona);

        this.triggerTab = new TriggerTab(this._state, TriggerTabRect);

        this.items = [
            new TitleText(),
            new FitText(PersonaNameRect, () => this.persona.name, { emphasis: true }),
            new TextRoundButton(PersonaBlackListRect, GetText("PersonaInfo::BlackList"), () =>
                GUISetting.setScreen(new MemberListPopup(this, GetText("MemberListPopup::PersonaBlackList::Title"), persona.blackList))),
            new ResponseMessageList(this, this._state, TriggerMessageRect),
            new ActivityModeInfo(this, this._state, TriggerExtendedInfoRect),
            new SpicerModeInfo(this, this._state, TriggerExtendedInfoRect),
            new OrgasmModeInfo(this, this._state, TriggerExtendedInfoRect),
            new TriggerBaseInfo(this._state, TriggerBaseInfoRect),
            this.triggerTab,
            new BasicText(TriggerDeleteModeSwitchText, GetText("PersonaMenu::DeleteMode"), { align: "right" }),
            new Switch(this.triggerTab.binding, TriggerDeleteModeSwitchRect),
            new ExitButton(() => this.Exit()),
        ];
    }
}

