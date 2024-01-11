import { Styles } from "../../Definition";
import { AGUIItem, IPoint, IRect, WithinRect } from "./AGUI";
import { Binding } from "./Binding";
import { ADrawCircleRect } from "./Common";


export class Switch extends AGUIItem {
    private _rect: IRect;
    private _radius: number;
    private _p_off: IPoint;
    private _p_on: IPoint;
    private _state: Binding<boolean>;

    private _animate_state: {
        last_update: number;
        value: number;
    };

    constructor(rect: IRect, state: Binding<boolean>) {
        super();

        const padding = 10;

        let width = rect.width;
        let height = rect.height;
        if (width > height * 2) {
            width = height * 2;
        } else if (height > width * 2) {
            height = width * 2;
        }
        this._rect = {
            x: rect.x + rect.width / 2 - width / 2,
            y: rect.y + rect.height / 2 - height / 2,
            width: width,
            height: height
        };

        const padding_radius = height / 2;
        this._radius = padding_radius - padding;
        this._p_off = { x: this._rect.x + padding_radius, y: this._rect.y + padding_radius };
        this._p_on = { x: this._rect.x + this._rect.width - padding_radius, y: this._rect.y + padding_radius };
        this._state = state;

        this._animate_state = {
            last_update: Date.now(),
            value: this._state.value ? 1 : 0
        };
    }

    Draw(hasFocus: boolean): void {
        const ctx = MainCanvas;

        const delta = Date.now() - this._animate_state.last_update;
        if (this._state.value) {
            this._animate_state.value = Math.min(1, this._animate_state.value + delta / 100);
        } else {
            this._animate_state.value = Math.max(0, this._animate_state.value - delta / 100);
        }
        this._animate_state.last_update = Date.now();

        const circle_pos = { x: this._p_off.x + (this._p_on.x - this._p_off.x) * this._animate_state.value, y: this._p_off.y };

        ADrawCircleRect(this._rect);

        ctx.fillStyle = this._state.value ? Styles.Switch.on : Styles.Switch.off;
        ctx.beginPath();
        ctx.arc(circle_pos.x, circle_pos.y, this._radius + 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this._rect))
            this._state.value = !this._state.value;
    }
}