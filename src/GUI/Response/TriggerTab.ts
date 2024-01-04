import { Colors } from "../../Definition";
import { AGUIItem, IPoint, IRect, WithinRect } from "../Widgets/AGUI";
import { ADrawFramedRect, ADrawTextButton, ADrawTextFit } from "../Widgets/Common";
import { ResponseMenuState } from "./ResponseMenuState";


export class TriggerTab extends AGUIItem {
    private _parent: ResponseMenuState;

    private _active_rect_state: { state: 'idle' | 'focused' | 'active'; value: number; }[];

    private _last_update: number = 0;

    private _page: number = 0;
    private _max_page: number = 0;

    private _layout_items: IRect[];
    private _layout_prev_button: IRect;
    private _layout_next_button: IRect;
    private _layout_page_text: IRect;

    private _expansion_size = 5;

    constructor(parent: ResponseMenuState, rect: IRect) {
        super();
        this._parent = parent;
        this._last_update = Date.now();

        const button_spacing = 5;
        const item_height = 70;

        const button_height = 50;
        const button_width = 50;
        const page_text_width = 100;

        const item_width = rect.width;
        const item_count = Math.max(1, Math.floor((rect.height - button_height + button_spacing) / (item_height + button_spacing)));

        this._layout_prev_button = {
            x: rect.x,
            y: rect.y + rect.height - button_height,
            width: button_width,
            height: button_height
        };

        this._layout_next_button = {
            x: rect.x + rect.width - button_width,
            y: rect.y + rect.height - button_height,
            width: button_width,
            height: button_height
        };

        this._layout_page_text = {
            x: rect.x + rect.width / 2 - page_text_width / 2,
            y: rect.y + rect.height - button_height,
            width: page_text_width,
            height: button_height
        };

        this._active_rect_state = Array.from({ length: item_count }, _ => { return { state: 'idle', value: 0 }; });

        this._layout_items = Array.from({ length: item_count }, (_, index) => {
            return {
                x: rect.x + this._expansion_size,
                y: rect.y + index * (item_height + button_spacing) + this._expansion_size,
                width: item_width - this._expansion_size * 2,
                height: item_height - this._expansion_size * 2
            };
        });

        this.calPage();
    }

    calPage() {
        this._max_page = Math.ceil((this._parent.targetPersona.responses.length + 1) / this._layout_items.length) - 1;
        this._page = Math.min(this._max_page, this._page);
    }

    update_state(focus: number) {
        const delta = Date.now() - this._last_update;
        this._last_update = Date.now();

        const active = this._parent.activeItem;

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
        ADrawTextButton(this._layout_prev_button, "<", hasFocus);
        ADrawTextFit(this._layout_page_text, `${this._page + 1}/${this._max_page + 1}`);
        ADrawTextButton(this._layout_next_button, ">", hasFocus);
        let focusing = -1;

        if (hasFocus) {
            this._layout_items.forEach((rect, index) => {
                if (WithinRect({ x: MouseX, y: MouseY }, rect)) focusing = index;
            });
            this.update_state(focusing);
        }

        this._layout_items.forEach((rect, index) => {
            const state = this._active_rect_state[index];
            const expansion = this._expansion_size * state.value;
            const frect = {
                x: rect.x - expansion,
                y: rect.y - expansion,
                width: rect.width + expansion * 2,
                height: rect.height + expansion * 2
            };

            const targetIdx = index + this._page * this._layout_items.length;

            const bgcolor = (() => {
                if (focusing === index) return Colors.Hover;
                else if (state.state === 'active') return Colors.Active;
                else return 'White';
            })();

            if (targetIdx == this._parent.targetPersona.responses.length) {
                ADrawFramedRect(frect, bgcolor, "Grey");
                ADrawTextFit(rect, "Add New");
            } else if (targetIdx < this._parent.targetPersona.responses.length) {
                ADrawFramedRect(frect, bgcolor);
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
                        this._parent.activeItem = this._parent.targetPersona.responses[targetIdx];
                        this.calPage();
                    } else if (targetIdx < this._parent.targetPersona.responses.length) {
                        this._parent.activeItem = this._parent.targetPersona.responses[targetIdx];
                    }
                }
            });
        }
    }
}
