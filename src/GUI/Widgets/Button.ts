import { Styles } from "../../Definition";
import { Icons } from "../Icons";
import { AGUIItem, IPoint, IRect, WithinRect as WithinRect } from "./AGUI";
import { ADrawCircleRect, ADrawIcon, ADrawRoundRect, ADrawTextButton, ADrawTextFit } from "./Common";
import { ADrawIconTextButton, ADrawIconButton } from "./Common";


export class StdButton extends AGUIItem {

    constructor(readonly rect: IRect, readonly text: string, readonly callback: () => void, readonly icon: string | null = null) {
        super();
    }

    Draw(hasFocus: boolean) {
        if (this.icon && this.text) {
            ADrawIconTextButton(this.rect, this.text, this.icon);
        } else if (this.icon) {
            ADrawIconButton(this.rect, this.icon);
        } else if (this.text) {
            ADrawIconTextButton(this.rect, this.text, "");
        }
    }

    Click(mouse: IPoint) {
        if (WithinRect(mouse, this.rect)) this.callback();
    }
}

export class DynamicTextRoundButton extends AGUIItem {
    constructor(readonly rect: IRect, readonly text: () => string, readonly callback: () => void, readonly enabled?: () => boolean) {
        super();
    }

    Draw(hasFocus: boolean): void {
        if (!this.enabled || this.enabled()) {
            if (hasFocus && WithinRect({ x: MouseX, y: MouseY }, this.rect)) {
                ADrawCircleRect(this.rect, { fill: Styles.Button.hover });
            } else {
                ADrawCircleRect(this.rect, { fill: Styles.Button.idle });
            }
            ADrawTextFit(this.rect, this.text());
        } else {
            ADrawCircleRect(this.rect, { stroke: Styles.Button.disabled });
            ADrawTextFit(this.rect, this.text(), { color: Styles.Button.disabled });
        }
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this.rect)) this.callback();
    }
}

export class TextRoundButton extends AGUIItem {
    constructor(readonly rect: IRect, readonly text: string, readonly callback: () => void, readonly enabled?: () => boolean) {
        super();
    }

    Draw(hasFocus: boolean): void {
        if (!this.enabled || this.enabled()) {
            if (hasFocus && WithinRect({ x: MouseX, y: MouseY }, this.rect)) {
                ADrawCircleRect(this.rect, { fill: Styles.Button.hover });
            } else {
                ADrawCircleRect(this.rect, { fill: Styles.Button.idle });
            }
            ADrawTextFit(this.rect, this.text);
        } else {
            ADrawCircleRect(this.rect, { stroke: Styles.Button.disabled });
            ADrawTextFit(this.rect, this.text, { color: Styles.Button.disabled });
        }
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this.rect)) this.callback();
    }
}

export class TextButton extends AGUIItem {
    constructor(readonly rect: IRect, readonly text: string, readonly callback: () => void) {
        super();
    }

    Draw(hasFocus: boolean) {
        ADrawTextButton(this.rect, this.text, hasFocus);
    }

    Click(mouse: IPoint) {
        if (WithinRect(mouse, this.rect)) this.callback();
    }
}

export class ExitButton extends AGUIItem {
    private _rect: IRect = {
        x: 1815,
        y: 75,
        width: 90,
        height: 90
    };

    callback: () => void;

    constructor(callback: () => void) {
        super();
        this.callback = callback;
    }

    Draw(hasFocus: boolean) {
        ADrawIconButton(this._rect, "Icons/Exit.png", hasFocus);
    }

    Click(mouse: IPoint) {
        if (WithinRect(mouse, this._rect)) this.callback();
    }
}

export class IconRoundButton extends AGUIItem {
    private readonly icon_rect: IRect;

    constructor(readonly rect: IRect, readonly radius: number, readonly icon: keyof typeof Icons, readonly callback: () => void) {
        super();
        const spacing = rect.height * 0.15
        this.icon_rect = {
            x: rect.x + rect.width / 2 - rect.height / 2 + spacing,
            y: rect.y + spacing,
            width: rect.height - spacing * 2,
            height: rect.height - spacing * 2
        }
    }

    Draw(hasFocus: boolean) {
        if (hasFocus && WithinRect({ x: MouseX, y: MouseY }, this.rect)) {
            ADrawRoundRect(this.rect, this.radius, { fill: Styles.Button.hover });
        } else {
            ADrawRoundRect(this.rect, this.radius, { fill: Styles.Button.idle });
        }
        ADrawIcon(this.icon_rect, this.icon);
    }

    Click(mouse: IPoint) {
        if (WithinRect(mouse, this.rect)) this.callback();
    }
}
