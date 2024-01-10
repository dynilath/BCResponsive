import { HTMLID } from "../GUI";
import { AGUIItem, IPoint, IRect, WithinRect } from "./AGUI";
import { Binding } from "./Binding";
import { ADrawTextButton } from "./Common";

export class ButtonEdit extends AGUIItem {
    private _binding: Binding<string>;
    private _HTMLID: string;
    private _rect: IRect;
    private _text: HTMLInputElement;

    private _display_state: 'input' | 'button' = 'button';

    constructor(bind: Binding<string>, id: string, rect: IRect) {
        super();
        this._binding = bind;
        this._rect = rect;
        this._HTMLID = id;

        this._text = document.createElement("input");
        this._text.id = HTMLID(this._HTMLID);
        this._text.setAttribute("screen-generated", CurrentScreen);
        this._text.className = "HideOnPopup";

        this._text.value = this._binding.value;

        this._text.onchange = () => {
            this._display_state = 'button';
            this._binding.value = this._text.value.trim();
        };

        document.body.appendChild(this._text);
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this._rect)) {
            if (this._display_state === 'button') {
                this._text.value = this._binding.value;
                this._display_state = 'input';
            }
        } else {
            if (this._display_state === 'input') {
                this._display_state = 'button';
                this._binding.value = this._text.value.trim();
            }
        }
    }

    OnChange(): void {
        this._binding.value = this._text.value.trim();
    }

    Draw(hasFocus: boolean): void {
        if (!hasFocus) {
            this.HideTextEdit();
            return;
        }

        if (this._display_state === 'button') {
            this.HideTextEdit();
            ADrawTextButton(this._rect, this._binding.value, hasFocus);
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

    HideTextEdit(): void {
        this._text.style.display = 'none';
        this._text.hidden = true;
    }

    Unload(): void {
        this._text.remove();
    }

}