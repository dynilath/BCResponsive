import { isTriggerActivity } from "../../Data";
import { AGUIItem, IPoint, IRect } from "../Widgets/AGUI";
import { ADrawText, ADrawTextButton } from "../Widgets/Common";
import { ResponseMenuState } from "./ResponseMenuState";


export class ActivityModeInfo extends AGUIItem {
    private _state: ResponseMenuState;
    private _rect: IRect;

    private readonly _activity_text: IPoint;
    private readonly _activity_state: IRect;

    private readonly _bodypart_text: IPoint;
    private readonly _bodypart_state: IRect;

    private readonly _allow_ids_text: IPoint;
    private readonly _allow_ids_state: IRect;

    constructor(state: ResponseMenuState, rect: IRect) {
        super();
        this._state = state;
        this._rect = rect;

        const itemHeight = 60;
        const spacing = 10;

        this._activity_text = { x: rect.x, y: rect.y + itemHeight / 2 };
        this._activity_state = { x: rect.x, y: rect.y + spacing + itemHeight, width: rect.width, height: itemHeight };

        this._bodypart_text = { x: rect.x, y: rect.y + (spacing + itemHeight) * 2 + itemHeight / 2 };
        this._bodypart_state = { x: rect.x, y: rect.y + (spacing + itemHeight) * 3, width: rect.width, height: itemHeight };

        this._allow_ids_text = { x: rect.x, y: rect.y + (spacing + itemHeight) * 4 + itemHeight / 2 };
        this._allow_ids_state = { x: rect.x, y: rect.y + (spacing + itemHeight) * 5, width: rect.width, height: itemHeight };
    }

    Draw(hasFocus: boolean): void {
        if (this._state.activeItem === null || !isTriggerActivity(this._state.activeItem.trigger)) return;
        ADrawText(this._activity_text, "On Activity:");
        ADrawTextButton(this._activity_state, this._state.activeItem.trigger.allow_activities.join(', '), hasFocus);

        ADrawText(this._bodypart_text, "On Bodyparts:");
        ADrawTextButton(this._bodypart_state, (v => v ? v.join(", ") : "All Bodyparts")(this._state.activeItem.trigger.allow_bodyparts), hasFocus);

        ADrawText(this._allow_ids_text, "On Members:");
        ADrawTextButton(this._allow_ids_state, (v => v ? v.join(", ") : "All IDs")(this._state.activeItem.trigger.allow_ids), hasFocus);
    }
}
