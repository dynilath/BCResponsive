import { GUISettingScreen, hasFocus, setSubscreen } from "../GUI";
import { AGUIItem, IPoint, IRect, WithinRect } from "../Widgets/AGUI";
import { ADrawFramedRect, ADrawTextButton, ADrawTextFit, ExitButton, TitleText } from "../Widgets/Common";


export class TriggerSetting extends GUISettingScreen {
    private _prev: GUISettingScreen | null;

    private _target: ResponsivePersonality;
    private _targetTrigger: ResponsiveTrigger | null = null;

    get activeTrigger(): ResponsiveTrigger | null {
        return this._targetTrigger;
    }

    set activeTrigger(value: ResponsiveTrigger | null) {
        this._targetTrigger = value;
    }

    get targetPersona(): ResponsivePersonality {
        return this._target;
    }

    private _items: AGUIItem[] = [];

    constructor(prev: GUISettingScreen | null = null, persona: ResponsivePersonality) {
        super();
        this._prev = prev;
        this._target = persona;

        if (persona.responses.length > 0)
            this._targetTrigger = persona.responses[0].trigger;

        this._items = [
            new ResponseTab(this, { x: 200, y: 200, width: 300, height: 650 }),
            new ExitButton(() => this.Exit()),
            new TitleText(),
        ];
    }

    Run(): void {
        this._items.forEach(item => item.Draw(hasFocus(this)));
    }

    Click(): void {
        this._items.forEach(item => item.Click({ x: MouseX, y: MouseY }));
    }

    Exit(): void {
        setSubscreen(this._prev);
    }
}


export class ResponseTab extends AGUIItem {
    private _parent: {
        targetPersona: ResponsivePersonality,
        activeTrigger: ResponsiveTrigger | null
    };

    private _active_rect_state: { state: 'idle' | 'focused' | 'active', value: number }[];

    private _last_update: number = 0;

    private _page: number;
    private _max_page: number;

    private _layout_items: IRect[];
    private _layout_prev_button: IRect;
    private _layout_next_button: IRect;
    private _layout_page_text: IRect;

    constructor(parent: { targetPersona: ResponsivePersonality, activeTrigger: ResponsiveTrigger | null }, rect: IRect) {
        super();
        this._parent = parent;
        this._active_rect_state = this._parent.targetPersona.responses.map(_ => { return { state: 'idle', value: 0 } });
        this._last_update = Date.now();

        const button_spacing = 5;
        const item_height = 75;

        const item_button_spacing = 15;
        const button_height = 50;
        const button_width = 50;
        const page_text_width = 100;

        const item_width = rect.width;
        const item_count = Math.max(1, Math.floor((rect.height - item_button_spacing - button_height + button_spacing) / (item_height + button_spacing)));

        this._page = 0;
        this._max_page = Math.ceil(this._parent.targetPersona.responses.length / item_count) - 1;

        this._layout_items = Array.from({ length: item_count }, (_, index) => {
            return {
                x: rect.x,
                y: rect.y + index * (item_height + button_spacing),
                width: item_width,
                height: item_height
            }
        });

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
    }

    update_state(focus: number) {
        const delta = Date.now() - this._last_update;
        this._last_update = Date.now();

        const active = this._parent.activeTrigger;

        this._active_rect_state.forEach((state, index) => {
            const id = index + this._page * this._layout_items.length;
            if (id >= this._parent.targetPersona.responses.length) {
                state.state = 'idle';
                state.value = 0;
                return;
            }

            if (active && active == this._parent.targetPersona.responses[id].trigger) {
                state.state = 'active';
                state.value = 0.6;
            } else if (focus == index) {
                state.state = 'focused';
                state.value = Math.min(1, state.value + delta / 100);
            } else {
                state.state = 'idle';
                state.value = Math.max(0, state.value - delta / 100);
            }
        });
    }

    Draw(hasFocus: boolean): void {
        ADrawTextButton(this._layout_prev_button, "<", hasFocus);
        ADrawTextFit(this._layout_page_text, `${this._page + 1}/${this._max_page + 1}`);
        ADrawTextButton(this._layout_next_button, ">", hasFocus);
        if (hasFocus) {
            let focusing = -1;
            this._layout_items.forEach((rect, index) => {
                if (WithinRect({ x: MouseX, y: MouseY }, rect)) {
                    focusing = index;
                }
            });
            this.update_state(focusing);
        }

        this._layout_items.forEach((rect, index) => {
            const state = this._active_rect_state[index];
            const response = this._parent.targetPersona.responses[index + this._page * this._layout_items.length];

            if (!response) return;

            const expansion = 5 * (1 - state.value);
            const frect = { x: rect.x + expansion, y: rect.y + expansion, width: rect.width - expansion * 2, height: rect.height - expansion * 2 };

            if (state.state == 'active')
                ADrawFramedRect(frect, "Cyan");
            else
                ADrawFramedRect(frect, "White");

            ADrawTextFit(rect, response.name);
        });
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this._layout_prev_button)) {
            this._page = Math.max(0, this._page - 1);
        } else if (WithinRect(mouse, this._layout_next_button)) {
            this._page = Math.min(this._max_page, this._page + 1);
        } else {
            this._layout_items.forEach((rect, index) => {
                if (WithinRect(mouse, rect)) {
                    this._parent.activeTrigger = this._parent.targetPersona.responses[index + this._page * this._layout_items.length].trigger;
                }
            });
        }
    }
}