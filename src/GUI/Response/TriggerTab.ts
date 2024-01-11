import { Styles } from "../../Definition";
import { GetText } from "../../i18n";
import { AGUIItem, IPoint, IRect, WithinRect } from "../Widgets/AGUI";
import { ADrawCircleRect, ADrawRoundRect, ADrawTextFit } from "../Widgets/Common";
import { ResponseMenuState } from "./ResponseMenuState";


export class TriggerTab extends AGUIItem {
    private _parent: ResponseMenuState;

    private _active_rect_state: { state: 'idle' | 'focused' | 'active'; value: number; }[];

    private _last_update: number = 0;

    private _page: number = 0;
    private _max_page: number = 0;

    readonly _layout_items: IRect[];
    readonly _layout_prev_button: IRect;
    readonly _layout_next_button: IRect;
    readonly _layout_page_text: IRect;

    readonly item_height = 60;
    readonly item_border = 5;

    readonly _upper_rect: IRect;
    readonly _lower_rect: IRect;

    constructor(parent: ResponseMenuState, rect: IRect) {
        super();
        this._parent = parent;
        this._last_update = Date.now();

        const button_spacing = 5;

        const button_height = 60;
        const button_width = 120;
        const page_text_width = 100;

        const item_width = rect.width - this.item_border * 2;
        const item_count = Math.max(1, Math.floor((rect.height - button_height - this.item_border * 2) / (this.item_height + button_spacing)));

        this._active_rect_state = Array.from({ length: item_count }, _ => { return { state: 'idle', value: 0 }; });

        this._layout_items = Array.from({ length: item_count }, (_, index) => {
            return {
                x: rect.x + this.item_border,
                y: rect.y + this.item_border + index * (this.item_height + button_spacing),
                width: item_width,
                height: this.item_height
            };
        });

        this._upper_rect = {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: this.item_border * 2 + item_count * (this.item_height + button_spacing) - button_spacing
        };

        this._lower_rect = {
            x: rect.x,
            y: rect.y + rect.height - button_height,
            width: rect.width,
            height: button_height
        };

        this._layout_prev_button = {
            x: this._lower_rect.x + this.item_border,
            y: this._lower_rect.y + this.item_border,
            width: button_width - this.item_border * 2,
            height: button_height - this.item_border * 2
        };

        this._layout_next_button = {
            x: this._lower_rect.x + this._lower_rect.width - button_width + this.item_border,
            y: this._layout_prev_button.y,
            width: this._layout_prev_button.width,
            height: this._layout_prev_button.height
        };

        this._layout_page_text = {
            x: rect.x + rect.width / 2 - page_text_width / 2,
            y: this._layout_prev_button.y,
            width: page_text_width,
            height: this._layout_prev_button.height
        };

        this.calPage();
    }

    calPage() {
        this._max_page = Math.ceil((this._parent.targetPersona.responses.length + 1) / this._layout_items.length) - 1;
        this._page = Math.min(this._max_page, this._page);
    }

    update_state(focus: number) {
        const delta = Date.now() - this._last_update;
        this._last_update = Date.now();

        const active = this._parent.targetItem;

        this._active_rect_state.forEach((state, index) => {
            const idx = index + this._page * this._layout_items.length;
            if (idx > this._parent.targetPersona.responses.length) {
                state.state = 'idle';
                state.value = 0;
                return;
            }

            if (focus == index) {
                state.state = 'focused';
                state.value = Math.min(1, state.value + delta / 100);
            } else {
                state.state = 'idle';
                state.value = Math.max(0, state.value - delta / 100);
            }

            if (active && active == this._parent.targetPersona.responses[idx]) {
                state.state = 'active';
            }
        });
    }

    Draw(hasFocus: boolean): void {
        const mouse = { x: MouseX, y: MouseY };
        ADrawRoundRect(this._upper_rect, this.item_height / 2 + this.item_border, { fill: "White", stroke: "Black" });
        ADrawCircleRect(this._lower_rect, { fill: "White", stroke: "Black" });

        ADrawCircleRect(this._layout_prev_button, { fill: hasFocus && WithinRect(mouse, this._layout_prev_button) ? Styles.Button.hover : "White", stroke: "none" });
        ADrawTextFit(this._layout_prev_button, "<");

        ADrawCircleRect(this._layout_next_button, { fill: hasFocus && WithinRect(mouse, this._layout_next_button) ? Styles.Button.hover : "White", stroke: "none" });
        ADrawTextFit(this._layout_next_button, ">");

        ADrawTextFit(this._layout_page_text, `${this._page + 1}/${this._max_page + 1}`);

        let focusing = -1;

        if (hasFocus) {
            this._layout_items.forEach((rect, index) => {
                if (WithinRect(mouse, rect)) focusing = index;
            });
            this.update_state(focusing);
        }

        this._layout_items.forEach((rect, index) => {
            const state = this._active_rect_state[index];

            const targetIdx = index + this._page * this._layout_items.length;

            if (state.state === 'active') {
                ADrawCircleRect(rect, { fill: Styles.Tab.active })
            }

            if (focusing === index && targetIdx <= this._parent.targetPersona.responses.length) {
                ADrawCircleRect(rect, { fill: Styles.Tab.hover, stroke: "none" })
            }

            if (targetIdx == this._parent.targetPersona.responses.length) {
                ADrawTextFit(rect, GetText("Add New"), { color: Styles.Text.Lesser });
            } else if (targetIdx < this._parent.targetPersona.responses.length) {
                ADrawTextFit(rect, this._parent.targetPersona.responses[targetIdx].name);
            }
        });
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this._layout_prev_button)) {
            this._page = Math.max(0, this._page - 1);
        } else if (WithinRect(mouse, this._layout_next_button)) {
            this._page = Math.min(this._max_page, this._page + 1);
        } else {
            this._layout_items.forEach((rect, index) => {
                const targetIdx = index + this._page * this._layout_items.length;
                if (WithinRect(mouse, rect)) {
                    if (targetIdx == this._parent.targetPersona.responses.length) {
                        this._parent.targetPersona.responses.push({ name: "New Response", trigger: { mode: "activity", allow_activities: [] }, messages: [] });
                        this._parent.targetItem = this._parent.targetPersona.responses[targetIdx];
                        this.calPage();
                    } else if (targetIdx < this._parent.targetPersona.responses.length) {
                        this._parent.targetItem = this._parent.targetPersona.responses[targetIdx];
                    }
                }
            });
        }
    }
}
