import { Styles } from "../../Definition";
import { GetText } from "../../i18n";
import { AGUIItem, IPoint, IRect, ISize, WithinRect } from "../Widgets/AGUI";
import { ADrawCircleRect, ADrawRoundRect, ADrawTextFit } from "../Widgets/Common";
import { PageDial, PageDialBinding } from "../Widgets/PageDial";
import { ResponseMenuState } from "./ResponseMenuState";

const ITEM_HEIGHT = 60;
const ITEM_SPACING = 5;
const ITEM_BORDER = 5;
const PAGE_PANEL_HEIGHT = 50;

export class TriggerTab extends AGUIItem {
    private _parent: ResponseMenuState;

    readonly _layout_items: IRect[];

    readonly _upper_rect: IRect;

    readonly _page_rect: IRect;
    private _page_binding: PageDialBinding;
    private pageDial: PageDial;

    constructor(parent: ResponseMenuState, rect: IRect) {
        super();
        this._parent = parent;

        this._page_rect = {
            x: rect.x,
            y: rect.y + rect.height - PAGE_PANEL_HEIGHT,
            width: rect.width,
            height: PAGE_PANEL_HEIGHT
        };

        const item_width = rect.width - ITEM_BORDER * 2;
        const item_count = Math.max(1, Math.floor((rect.height - PAGE_PANEL_HEIGHT - ITEM_BORDER * 2 + ITEM_SPACING) / (ITEM_HEIGHT + ITEM_SPACING)));

        this._layout_items = Array.from({ length: item_count }, (_, index) => {
            return {
                x: rect.x + ITEM_BORDER,
                y: rect.y + ITEM_BORDER + index * (ITEM_HEIGHT + ITEM_SPACING),
                width: item_width,
                height: ITEM_HEIGHT
            };
        });

        this._upper_rect = {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: ITEM_BORDER * 2 + item_count * (ITEM_HEIGHT + ITEM_SPACING) - ITEM_SPACING
        };

        this._page_binding = {
            page: 0,
            maxPage: 0,
            update: () => { }
        };

        this.pageDial = new PageDial(this._page_rect, this._page_binding);
    }

    Draw(hasFocus: boolean): void {
        this._page_binding.maxPage = Math.ceil((this._parent.targetPersona.responses.length + 1) / this._layout_items.length);
        const mouse = { x: MouseX, y: MouseY };

        this.pageDial.Draw(hasFocus);

        ADrawRoundRect(this._upper_rect, ITEM_HEIGHT / 2 + ITEM_BORDER, { fill: "White", stroke: "Black" });
        let focusing = -1;
        if (hasFocus) {
            this._layout_items.forEach((rect, index) => {
                if (WithinRect(mouse, rect)) focusing = index;
            });
        }

        this._layout_items.forEach((rect, index) => {
            const targetIdx = index + this._page_binding.page * this._layout_items.length;

            if (this._parent.targetItem && this._parent.targetPersona.responses[targetIdx] == this._parent.targetItem) {
                ADrawCircleRect(rect, { fill: Styles.Tab.active })
            }

            if (focusing === index && targetIdx <= this._parent.targetPersona.responses.length) {
                ADrawCircleRect(rect, { fill: Styles.Tab.hover, stroke: "none" })
            }

            if (targetIdx == this._parent.targetPersona.responses.length) {
                ADrawTextFit(rect, GetText("TriggerInfo::AddNew"), { color: Styles.Text.Lesser });
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
                    this._parent.targetPersona.responses.push({ name: GetText("Default::NewResponseName"), enabled: false, trigger: { mode: "activity", allow_activities: [] }, messages: [] });
                    this._parent.targetItem = this._parent.targetPersona.responses[targetIdx];
                } else if (targetIdx < this._parent.targetPersona.responses.length) {
                    this._parent.targetItem = this._parent.targetPersona.responses[targetIdx];
                }
            }
        });
    }
}
