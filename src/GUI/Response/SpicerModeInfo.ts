import { isTriggerSpicer } from "../../Data";
import { AGUIItem, IPoint, IRect } from "../Widgets/AGUI";
import { ADrawText, ADrawTextButton } from "../Widgets/Common";
import { ResponseMenuState } from "./ResponseMenuState";


export class SpicerModeInfo extends AGUIItem {
    private _state: ResponseMenuState;

    private readonly _min_arousal_text: IPoint;
    private readonly _min_arousal_input: IRect;

    private readonly _max_arousal_text: IPoint;
    private readonly _max_arousal_input: IRect;

    private readonly _apply_fav_text: IPoint;
    private readonly _apply_fav_switch: IRect;

    private readonly _allow_ids_text: IPoint;
    private readonly _allow_ids_state: IRect;

    constructor(state: ResponseMenuState, rect: IRect) {
        super();
        this._state = state;

        const itemHeight = 60;
        const spacing = 10;
        const arousalTextWidth = 250;

        let lineY = rect.y;
        const nl = (v: number) => v + spacing + itemHeight;

        this._min_arousal_text = { x: rect.x, y: lineY + itemHeight / 2 };
        this._min_arousal_input = { x: rect.x + arousalTextWidth, y: lineY, width: rect.width - arousalTextWidth, height: itemHeight };

        lineY = nl(lineY);
        this._max_arousal_text = { x: rect.x, y: lineY + itemHeight / 2 };
        this._max_arousal_input = { x: rect.x + arousalTextWidth, y: lineY, width: rect.width - arousalTextWidth, height: itemHeight };

        lineY = nl(lineY);
        this._apply_fav_text = { x: rect.x, y: lineY + itemHeight / 2 };
        this._apply_fav_switch = { x: rect.x + +rect.width - itemHeight * 2, y: lineY, width: itemHeight * 2, height: itemHeight };

        lineY = nl(lineY);
        this._allow_ids_text = { x: rect.x, y: lineY + itemHeight / 2 };
        lineY = nl(lineY);
        this._allow_ids_state = { x: rect.x, y: lineY, width: rect.width, height: itemHeight };
    }

    Draw(hasFocus: boolean): void {
        if (this._state.activeItem === null || !isTriggerSpicer(this._state.activeItem.trigger)) return;
        ADrawText(this._min_arousal_text, "Min Arousal:");

        ADrawTextButton(this._min_arousal_input, (v => v ? `${v}` : '0')(this._state.activeItem.trigger.min_arousal), hasFocus);

        ADrawText(this._max_arousal_text, "Max Arousal:");
        ADrawTextButton(this._max_arousal_input, (v => v ? `${v}` : '100')(this._state.activeItem.trigger.max_arousal), hasFocus);

        ADrawText(this._apply_fav_text, "Apply Favorites:");
        ADrawTextButton(this._apply_fav_switch, (v => v ? 'Yes' : 'No')(this._state.activeItem.trigger.apply_favorite), hasFocus);

        ADrawText(this._allow_ids_text, "On Members:");
        ADrawTextButton(this._allow_ids_state, (v => v ? v.join(", ") : "All IDs")(this._state.activeItem.trigger.allow_ids), hasFocus);
    }
}
