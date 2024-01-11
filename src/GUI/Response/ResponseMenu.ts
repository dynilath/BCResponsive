import { GetText } from "../../i18n";
import { GUISettingScreen } from "../GUI";
import { AGUIScreen } from "../Widgets/AGUI";
import { Binding } from "../Widgets/Binding";
import { ButtonEdit } from "../Widgets/ButtonEdit";
import { ExitButton } from "../Widgets/Button";
import { BasicText } from "../Widgets/Text";
import { TitleText } from "../Widgets/Text";
import { ActivityModeInfo } from "./TriggerMode/ActivityModeInfo";
import { ResponseMenuState } from "./ResponseMenuState";
import { ResponseMessageList } from "./MessageList/ResponseMessageList";
import { SpicerModeInfo } from "./TriggerMode/SpicerModeInfo";
import { TriggerTab } from "./TriggerTab";
import { SegmentButton } from "../Widgets/SegmentButton";

export class TriggerSetting extends AGUIScreen {
    private readonly _state: ResponseMenuState;
    constructor(prev: GUISettingScreen | null = null, persona: ResponsivePersonality) {
        const CommonFontSize = 36;

        const MenuBaseY = 200;
        const MenuBaseItemHeight = 70;

        const TriggerTabBaseX = 200;

        const TriggerInfoBaseX = 550;
        const TriggerInfoNextX = TriggerInfoBaseX + 150;
        const TriggerInfoNextWidth = 450;
        const TriggerInfoHeight = 60;

        const TriggerMessageBaseX = 1200;
        const TriggerMessageWidth = 600;

        super(prev);
        this._state = new ResponseMenuState(persona);
        this._items = [
            new TitleText(),
            new BasicText({ x: TriggerInfoBaseX, y: MenuBaseY + TriggerInfoHeight / 2 }, GetText("Name:")),
            new ButtonEdit(this._state.TriggerName(), "TriggerName", { x: TriggerInfoNextX, y: MenuBaseY, width: TriggerInfoNextWidth, height: TriggerInfoHeight }),
            new ResponseMessageList(this, this._state, {
                x: TriggerMessageBaseX,
                y: MenuBaseY,
                width: TriggerMessageWidth,
                height: 660
            }),
            new BasicText({ x: TriggerInfoBaseX, y: MenuBaseY + MenuBaseItemHeight + TriggerInfoHeight / 2 }, GetText("Mode:")),
            new SegmentButton(this._state.TriggerMode(), {
                x: TriggerInfoNextX,
                y: MenuBaseY + MenuBaseItemHeight,
                width: TriggerInfoNextWidth,
                height: TriggerInfoHeight
            }),
            new ActivityModeInfo(this._state, {
                x: TriggerInfoBaseX,
                y: MenuBaseY + MenuBaseItemHeight * 2 + TriggerInfoHeight / 2,
                width: TriggerInfoNextWidth + TriggerInfoNextX - TriggerInfoBaseX,
                height: 450
            }),
            new SpicerModeInfo(this._state, {
                x: TriggerInfoBaseX,
                y: MenuBaseY + MenuBaseItemHeight * 2 + TriggerInfoHeight / 2,
                width: TriggerInfoNextWidth + TriggerInfoNextX - TriggerInfoBaseX,
                height: 450
            }),
            new ExitButton(() => this.Exit()),
            new TriggerTab(this._state, { x: TriggerTabBaseX, y: MenuBaseY, width: 300, height: 660 }),
        ];
    }
}

