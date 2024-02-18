import { HTMLID } from "../GUI";
import { AGUIItem, IPoint, IRect, WithinRect } from "./AGUI";
import { Binding } from "./Binding";
import { StylesRect } from "./CSStyle";
import { ADrawTextButton } from "./Common";

export class ButtonEdit extends AGUIItem {
    private _text: HTMLInputElement | undefined;

    private _display_state: 'input' | 'button' = 'button';

    get text() {
        return this._text?.value ?? "";
    }

    private CreateInput() {
        let text = document.createElement("input");
        text.id = HTMLID(this.HTMLID);
        text.name = this.HTMLID;
        text.value = this.binding.value;
        text.setAttribute("screen-generated", CurrentScreen);

        text.className = "HideOnPopup";

        text.onchange = () => {
            this.binding.value = this.text.trim();
        };

        document.body.appendChild(text);

        return text;
    }

    constructor(readonly binding: Binding<string>, readonly HTMLID: string, readonly rect: IRect) {
        super();
        this._text = this.CreateInput();
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this.rect)) {
            if (this._display_state === 'button') {
                if (!this._text) this._text = this.CreateInput();
                this._display_state = 'input';
            }
        } else {
            if (this._display_state === 'input') {
                if (this._text) this.binding.value = this.text.trim();
                this._display_state = 'button';
            }
        }
    }

    OnChange(): void {
        this.binding.value = this.text.trim();
    }

    Draw(hasFocus: boolean): void {
        if (!hasFocus) {
            this.HideTextEdit();
            return;
        }

        if (!this._text) this._text = this.CreateInput();

        if (this._display_state === 'button') {
            this.HideTextEdit();
            ADrawTextButton(this.rect, this.binding.value, hasFocus);
        } else {
            this._text.hidden = false;

            StylesRect(this.rect, this._text);
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