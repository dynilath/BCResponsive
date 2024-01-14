import { HTMLID } from "../GUI";
import { AGUIItem, IPoint, IRect, WithinRect } from "./AGUI";
import { Binding } from "./Binding";
import { ADrawTextButton } from "./Common";

export class ButtonEdit extends AGUIItem {
    private _binding: Binding<string>;
    private _HTMLID: string;
    private _rect: IRect;
    private _text: HTMLInputElement | undefined;

    private _display_state: 'input' | 'button' = 'button';

    get text() {
        return this._text?.value ?? "";
    }

    private CreateInput() {
        let text = document.createElement("input");
        text.id = HTMLID(this._HTMLID);
        text.name = this._HTMLID;
        text.value = this._binding.value;
        text.setAttribute("screen-generated", CurrentScreen);

        text.className = "HideOnPopup";

        text.onchange = () => {
            this._binding.value = this.text.trim();
        };

        document.body.appendChild(text);

        return text;
    }

    constructor(bind: Binding<string>, id: string, rect: IRect) {
        super();
        this._binding = bind;
        this._rect = rect;
        this._HTMLID = id;

        this._text = this.CreateInput();
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this._rect)) {
            if (this._display_state === 'button') {
                if (!this._text) this._text = this.CreateInput();
                this._display_state = 'input';
            }
        } else {
            if (this._display_state === 'input') {
                if (this._text) this._binding.value = this.text.trim();
                this._display_state = 'button';
            }
        }
    }

    OnChange(): void {
        this._binding.value = this.text.trim();
    }

    Draw(hasFocus: boolean): void {
        if (!hasFocus) {
            this.HideTextEdit();
            return;
        }

        if (!this._text) this._text = this.CreateInput();

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
        if (this._text) this._text.remove();
        this._text = undefined;
    }

    Unload(): void {
        this.HideTextEdit();
    }
}