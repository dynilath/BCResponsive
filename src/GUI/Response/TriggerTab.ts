import { Styles } from "../../Definition";
import { GetText } from "../../i18n";
import { AGUIItem, IPoint, IRect, WithinRect } from "../Widgets/AGUI";
import { ADrawCircleRect, ADrawRoundRect, ADrawTextFit } from "../Widgets/Common";
import { PageDial, PageDialBinding } from "../Widgets/PageDial";
import { ResponseMenuState } from "./ResponseMenuState";


export class TriggerTab extends AGUIItem {
    private _parent: ResponseMenuState;

    readonly _layout_items: IRect[];

    readonly item_height = 60;
    readonly item_border = 5;

    readonly _upper_rect: IRect;

    readonly _page_rect: IRect;
    private _page_binding: PageDialBinding;
    private pageDial: PageDial;

    constructor(parent: ResponseMenuState, rect: IRect) {
        super();
        this._parent = parent;

        const button_spacing = 5;

        const button_height = 60;
        const button_width = 120;
        const page_text_width = 100;

        const item_width = rect.width - this.item_border * 2;
        const item_count = Math.max(1, Math.floor((rect.height - button_height - this.item_border * 2) / (this.item_height + button_spacing)));


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

        this._page_rect = {
            x: rect.x,
            y: rect.y + rect.height - button_height,
            width: rect.width,
            height: button_height
        };

        this._page_binding = {
            page: 0,
            maxPage: 0,
            update: () => { }
        };

        this.pageDial = new PageDial(this._page_rect, this._page_binding);
    }

    Draw(hasFocus: boolean): void {
        this._page_binding.maxPage = Math.ceil(this._parent.targetPersona.responses.length / this._layout_items.length);
        const mouse = { x: MouseX, y: MouseY };

        this.pageDial.Draw(hasFocus);

        ADrawRoundRect(this._upper_rect, this.item_height / 2 + this.item_border, { fill: "White", stroke: "Black" });
        let focusing = -1;
        if (hasFocus) {
            this._layout_items.forEach((rect, index) => {
                if (WithinRect(mouse, rect)) focusing = index;
            });
        }

        this._layout_items.forEach((rect, index) => {
            const targetIdx = index + this._page_binding.page * this._layout_items.length;

            if (targetIdx == this._parent.targetPersona.index) {
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
        this.pageDial.Click(mouse);

        this._layout_items.forEach((rect, index) => {
            const targetIdx = index + this._page_binding.page * this._layout_items.length;
            if (WithinRect(mouse, rect)) {
                if (targetIdx == this._parent.targetPersona.responses.length) {
                    this._parent.targetPersona.responses.push({ name: GetText("Default::NewResponseName"), trigger: { mode: "activity", allow_activities: [] }, messages: [] });
                    this._parent.targetItem = this._parent.targetPersona.responses[targetIdx];
                } else if (targetIdx < this._parent.targetPersona.responses.length) {
                    this._parent.targetItem = this._parent.targetPersona.responses[targetIdx];
                }
            }
        });
    }
}
