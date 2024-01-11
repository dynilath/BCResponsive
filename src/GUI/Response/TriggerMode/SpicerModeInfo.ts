import { isTriggerSpicer } from "../../../Data";
import { AGUIItem, IPoint, IRect, WithinRect } from "../../Widgets/AGUI";
import { ButtonEdit } from "../../Widgets/ButtonEdit";
import { ADrawText, ADrawTextButton } from "../../Widgets/Common";
import { Switch } from "../../Widgets/Switch";
import { ResponseMenuState } from "../ResponseMenuState";

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

    private readonly _switch: Switch;

    private _editList: AGUIItem[] = [];

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

        this._editList = [
            new ButtonEdit(this._state.SpicerMinArousal(), "MinArousal", this._min_arousal_input),
            new ButtonEdit(this._state.SpicerMaxArousal(), "MaxArousal", this._max_arousal_input),
        ];

        this._switch = new Switch(this._apply_fav_switch, this._state.SpicerApplyFavorite());
    }

    Draw(hasFocus: boolean): void {
        this._state.asSpicer(v => {
            ADrawText(this._min_arousal_text, "Min Arousal:");
            ADrawText(this._max_arousal_text, "Max Arousal:");
            this._editList.forEach(v => v.Draw(hasFocus));

            ADrawText(this._apply_fav_text, "Apply Favorites:");
            this._switch.Draw(hasFocus);

            //ADrawTextButton(this._apply_fav_switch, (v => v ? 'Yes' : 'No')(v.apply_favorite), hasFocus);

            ADrawText(this._allow_ids_text, "On Members:");
            ADrawTextButton(this._allow_ids_state, (v => v ? v.join(", ") : "All IDs")(v.allow_ids), hasFocus);

        }, () => {
            this._editList.forEach(v => v.Draw(false));
        });
    }

    Click(mouse: IPoint): void {
        this._state.asSpicer(v => {
            this._editList.forEach(v => v.Click(mouse));
            this._switch.Click(mouse);
        });
    }

    Unload(): void {
        this._editList.forEach(v => v.Unload());
    }
}