import { GetText } from "../../i18n";
import { AGUIItem, IPoint, IRect, ISize } from "../Widgets/AGUI";
import { ButtonEdit } from "../Widgets/ButtonEdit";
import { SegmentButton } from "../Widgets/SegmentButton";
import { Switch } from "../Widgets/Switch";
import { BasicText } from "../Widgets/Text";
import { ResponseMenuState } from "./ResponseMenuState";

const TRIGGER_INFO_BASE_WIDTH = 150;
const TRIGGER_INFO_NEXT_WIDTH = 450;
const TRIGGER_INFO_HEIGHT = 60;
const TRIGGER_INFO_SPACING = 10;

export class TriggerBaseInfo extends AGUIItem {
    private components: AGUIItem[];

    constructor(readonly state: ResponseMenuState, readonly rect: IRect) {
        super();
        const nextX = rect.x + TRIGGER_INFO_BASE_WIDTH;

        const _name_text = { x: rect.x, y: rect.y + TRIGGER_INFO_HEIGHT / 2 };
        const _name_input = { x: nextX, y: rect.y, width: TRIGGER_INFO_NEXT_WIDTH, height: TRIGGER_INFO_HEIGHT };

        const _enabled_text = { x: rect.x, y: _name_text.y + TRIGGER_INFO_HEIGHT + TRIGGER_INFO_SPACING };
        const _enabled_input = {
            x: nextX + TRIGGER_INFO_NEXT_WIDTH - TRIGGER_INFO_HEIGHT * 2, y: _name_input.y + TRIGGER_INFO_HEIGHT + TRIGGER_INFO_SPACING,
            width: TRIGGER_INFO_HEIGHT * 2, height: TRIGGER_INFO_HEIGHT
        };

        const _mode_text = { x: rect.x, y: _enabled_text.y + TRIGGER_INFO_HEIGHT + TRIGGER_INFO_SPACING };
        const _mode_input = {
            x: nextX, y: _enabled_input.y + TRIGGER_INFO_HEIGHT + TRIGGER_INFO_SPACING,
            width: TRIGGER_INFO_NEXT_WIDTH, height: TRIGGER_INFO_HEIGHT
        };

        this.components = [
            new BasicText(_name_text, GetText("TriggerInfo::Name")),
            new ButtonEdit(this.state.TriggerName(), "InputTriggerName", _name_input),
            new BasicText(_enabled_text, GetText("TriggerInfo::OnOff")),
            new Switch(this.state.TriggerEnabled(), _enabled_input),
            new BasicText(_mode_text, GetText("TriggerInfo::Mode")),
            new SegmentButton(this.state.TriggerMode(), _mode_input)
        ]
    }

    Draw(hasFocus: boolean): void {
        this.components.forEach(c => c.Draw(hasFocus));
    }

    Click(mouse: IPoint): void {
        this.components.forEach(c => c.Click(mouse));
    }

    Unload(): void {
        this.components.forEach(c => c.Unload());
    }

    static Metrics(): ISize {
        return {
            width: TRIGGER_INFO_BASE_WIDTH + TRIGGER_INFO_NEXT_WIDTH,
            height: TRIGGER_INFO_HEIGHT * 3 + TRIGGER_INFO_SPACING * 4
        }
    }
}