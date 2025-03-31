import { DataManager } from "../../../Data";
import { i18n } from "../../../i18n";
import { IGUIScreen } from "../../GUI";
import { AGUIItem, IPoint, IRect } from "../../Widgets/AGUI";
import { Binding } from "../../Widgets/Binding";
import { SegmentButton, SegmentButtonSetting } from "../../Widgets/SegmentButton";
import { BasicText } from "../../Widgets/Text";
import { ResponseMenuState } from "../ResponseMenuState";

const BASE_FONT_SIZE = 36;
const ITEM_HEIGHT = 60;
const ITEM_INNER_SPACING = 10;

class RoomEventTypeBinding extends Binding<RoomEventTriggerType> {
    constructor(readonly state: ResponseMenuState) { super(); }

    get value(): RoomEventTriggerType {
        return this.state.asRoomEvent(v => {
            if (v.event === undefined) v.event = "Join";
            return v.event;
        }) ?? "Join";
    }

    set value(v: RoomEventTriggerType) {
        this.state.asRoomEvent(t => t.event = v);
        DataManager.save();
    }
}

export class RoomEventModeInfo extends AGUIItem {
    private _components: AGUIItem[] = [];
    constructor(readonly parent: IGUIScreen, readonly state: ResponseMenuState, readonly rect: IRect) {
        super();

        const type_text = { x: rect.x, y: rect.y + BASE_FONT_SIZE / 2 };
        const type_state = { x: rect.x, y: rect.y + BASE_FONT_SIZE + ITEM_INNER_SPACING, width: rect.width, height: ITEM_HEIGHT };

        const segSetting: SegmentButtonSetting<RoomEventTriggerType> = {
            text: [
                { display: i18n("TriggerInfo::RoomEvent::Type::Join"), value: "Join" },
                { display: i18n("TriggerInfo::RoomEvent::Type::Leave"), value: "Leave" },
            ],
            binding: new RoomEventTypeBinding(state),
        }

        this._components = [
            new BasicText(type_text, i18n("TriggerInfo::RoomEvent::Type")),
            new SegmentButton(segSetting, type_state),
        ]
    }

    Draw(hasFocus: boolean): void {
        this.state.asRoomEvent(v => { this._components.forEach(v => v.Draw(hasFocus)); });
    }

    Click(mouse: IPoint): void {
        this.state.asRoomEvent(v => { this._components.forEach(v => v.Click(mouse)); });
    }
}