import { DataManager } from "../../Data";
import { Styles } from "../../Definition";
import { GetText } from "../../i18n";
import { AGUIItem, IPoint, IRect, ISize, WithinRect } from "../Widgets/AGUI";
import { ADrawCircleRect, ADrawIcon, ADrawRoundRect, ADrawTextFit, ADrawVerticalCircleRect } from "../Widgets/Common";
import { PageDial, PageDialBinding } from "../Widgets/PageDial";
import { Scrollbar } from "../Widgets/Scrollbar";
import { ResponseMenuState } from "./ResponseMenuState";

const ITEM_HEIGHT = 60;
const ITEM_SPACING = 5;
const ITEM_BORDER = 5;

export class TriggerTab extends AGUIItem {
    private _parent: ResponseMenuState;

    readonly _layout_items: IRect[];

    readonly _upper_rect: IRect;


    readonly scroll: Scrollbar;

    constructor(parent: ResponseMenuState, rect: IRect) {
        super();
        this._parent = parent;

        const items_rect_width = rect.width - Styles.Scrollbar.width - Styles.Scrollbar.spacing;

        const item_width = items_rect_width - ITEM_BORDER * 2;
        const item_count = Math.max(1, Math.floor((rect.height - ITEM_BORDER * 2 + ITEM_SPACING) / (ITEM_HEIGHT + ITEM_SPACING)));

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
            width: items_rect_width,
            height: rect.height
        };

        const scrollbar_rect = {
            x: rect.x + rect.width - Styles.Scrollbar.width,
            y: rect.y,
            width: Styles.Scrollbar.width,
            height: rect.height
        };

        this.scroll = new Scrollbar({
            container_rows: this._parent.targetPersona.responses.length + 1,
            content_rows: this._layout_items.length
        }, scrollbar_rect);
    }

    Draw(hasFocus: boolean): void {
        const mouse = { x: MouseX, y: MouseY };
        ADrawRoundRect(this._upper_rect, ITEM_HEIGHT / 2 + ITEM_BORDER, { fill: "White", stroke: "Black" });

        this.scroll.update(this._parent.targetPersona.responses.length + 1, this._layout_items.length);


        let focusing = -1;
        if (hasFocus) {
            this._layout_items.forEach((rect, index) => {
                if (WithinRect(mouse, rect)) focusing = index;
            });
        }

        this._layout_items.forEach((rect, index) => {
            const targetIdx = index + this.scroll.offset;

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

        this.scroll.Draw(hasFocus);
    }

    Click(mouse: IPoint): void {
        this._layout_items.forEach((rect, index) => {
            const targetIdx = index + this.scroll.offset;
            if (WithinRect(mouse, rect)) {
                if (targetIdx == this._parent.targetPersona.responses.length) {
                    this._parent.targetPersona.responses.push({ name: GetText("Default::NewResponseName"), enabled: false, trigger: { mode: "activity", allow_activities: [] }, messages: [] });
                    this._parent.targetItem = this._parent.targetPersona.responses[targetIdx];
                    DataManager.save();
                } else if (targetIdx < this._parent.targetPersona.responses.length) {
                    this._parent.targetItem = this._parent.targetPersona.responses[targetIdx];
                }
            }
        });

        this.scroll.Click(mouse);
    }

    MouseWheel(event: WheelEvent): void {
        if (WithinRect({ x: MouseX, y: MouseY }, this._upper_rect)) this.scroll.RawMouseWheel(event);
    }
}
