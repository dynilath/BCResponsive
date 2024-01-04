import { MaxTriggerNameLength } from "../../Definition";
import { HTMLID } from "../GUI";
import { AGUIItem, IPoint, IRect, WithinRect } from "../Widgets/AGUI";
import { ADrawTextButton } from "../Widgets/Common";
import { ResponseMenuState } from "./ResponseMenuState";

export class TriggerName extends AGUIItem {
    private _state: ResponseMenuState;
    private _rect: IRect;

    private _text: HTMLInputElement;

    private _display_state: 'input' | 'button' = 'button';

    constructor(state: ResponseMenuState, rect: IRect) {
        super();
        this._state = state;
        this._rect = rect;

        this._text = document.createElement("input");
        this._text.id = HTMLID("TriggerName");
        this._text.setAttribute("screen-generated", CurrentScreen);
        this._text.className = "HideOnPopup";
        this._text.maxLength = MaxTriggerNameLength;

        this.Reload();

        this._text.onchange = () => {
            this.OnChange();
        };

        document.body.appendChild(this._text);
    }

    private _last_item: ResponsiveItem | null = null;

    Reload() {
        if (this._last_item !== null) {
            if (this._display_state === 'input')
                this._last_item.name = this._text.value.trim().substring(0, MaxTriggerNameLength);
        }
        this._display_state = 'button';
        this._last_item = this._state.activeItem;
        this._text.value = this._last_item ? this._last_item.name : "";
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this._rect)) {
            if (this._display_state === 'button') {
                this._display_state = 'input';
            }
        } else {
            this.Reload();
        }
    }

    OnChange(): void {
        if (this._state.activeItem !== null) {
            this._state.activeItem.name = this._text.value.trim().substring(0, MaxTriggerNameLength);
        }
    }

    Draw(hasFocus: boolean): void {
        if (this._state.activeItem === null || !hasFocus) {
            this._text.style.display = 'none';
            this._text.hidden = true;
            return;
        }

        if (this._display_state === 'button') {
            this._text.style.display = 'none';
            this._text.hidden = true;
            ADrawTextButton(this._rect, this._state.activeItem.name, hasFocus);
        } else {
            this._text.hidden = false;

            const Ratio = MainCanvas.canvas.clientWidth / 2000;
            const Font = Math.min(MainCanvas.canvas.clientWidth / 50, MainCanvas.canvas.clientHeight / 25);

            const BaseBorder = Math.ceil(2 * Ratio);
            const BasePadding = 2 * Ratio;
            const Height = this._rect.height * Ratio - (BaseBorder + BasePadding) * 2;
            const Width = this._rect.width * Ratio - (BaseBorder + BasePadding) * 2;
            const Top = MainCanvas.canvas.offsetTop + this._rect.y * Ratio;
            const Left = MainCanvas.canvas.offsetLeft + this._rect.x * Ratio;

            Object.assign(this._text.style, {
                fontSize: Font + "px",
                fontFamily: CommonGetFontName(),
                position: "fixed",
                left: Left + "px",
                top: Top + "px",
                width: Width + "px",
                height: Height + "px",
                display: "inline",
                padding: BasePadding + "px",
                borderWidth: BaseBorder + "px"
            });
        }
    }

    Unload(): void {
        this._text.remove();
    }
}
