import { DataManager } from "../../Data";
import { Styles } from "../../Definition";
import { i18n } from "../../i18n";
import { AGUIItem, IPoint, IRect, WithinRect } from "../Widgets/AGUI";
import { Binding } from "../Widgets/Binding";
import { ADrawCircleRect, ADrawCricleIconButton, ADrawRoundRect, ADrawTextFit } from "../Widgets/Common";
import { Scrollbar } from "../Widgets/Scrollbar";
import { ResponseMenuState } from "./ResponseMenuState";

const ITEM_HEIGHT = 60;
const ITEM_SPACING = 5;
const ITEM_BORDER = 5;

const REMOVE_BUTTON_DIAMETER = 40;

export class ResponsiveItemDeleteSwitchState extends Binding<boolean> {
    value: boolean = false;
}

export class TriggerTab extends AGUIItem {

    readonly _layout_items: IRect[];

    readonly _delete_buttons: IRect[];

    readonly _upper_rect: IRect;

    readonly scroll: Scrollbar;

    readonly binding: ResponsiveItemDeleteSwitchState;

    constructor(readonly parent: ResponseMenuState, rect: IRect) {
        super();

        this.binding = new ResponsiveItemDeleteSwitchState();

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

        this._delete_buttons = this._layout_items.map((rect) => ({
            x: rect.x - ITEM_SPACING * 2 - REMOVE_BUTTON_DIAMETER,
            y: rect.y + rect.height / 2 - REMOVE_BUTTON_DIAMETER / 2,
            width: REMOVE_BUTTON_DIAMETER,
            height: REMOVE_BUTTON_DIAMETER
        }));

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
            container_rows: this.parent.targetPersona.responses.length + 1,
            content_rows: this._layout_items.length
        }, scrollbar_rect);
    }

    Draw(hasFocus: boolean): void {
        const mouse = { x: MouseX, y: MouseY };
        ADrawRoundRect(this._upper_rect, ITEM_HEIGHT / 2 + ITEM_BORDER, { fill: "White", stroke: "Black" });

        this.scroll.update(this.parent.targetPersona.responses.length + 1, this._layout_items.length);


        let focusing = -1;
        if (hasFocus) {
            this._layout_items.forEach((rect, index) => {
                if (WithinRect(mouse, rect)) focusing = index;
            });
        }

        if (this.binding.value) {
            this._delete_buttons.forEach((rect, index) => {
                const targetIdx = index + this.scroll.offset;
                if (targetIdx < this.parent.targetPersona.responses.length) {
                    ADrawCricleIconButton(rect, "trashbin", hasFocus, { hover: "#FF4040" });
                }
            });
        }

        this._layout_items.forEach((rect, index) => {
            const targetIdx = index + this.scroll.offset;

            if (this.parent.targetItem && this.parent.targetPersona.responses[targetIdx] == this.parent.targetItem) {
                ADrawCircleRect(rect, { fill: Styles.Tab.active })
            }

            if (focusing === index && targetIdx <= this.parent.targetPersona.responses.length) {
                ADrawCircleRect(rect, { fill: Styles.Tab.hover, stroke: "none" })
            }

            if (targetIdx == this.parent.targetPersona.responses.length) {
                ADrawTextFit(rect, i18n("TriggerInfo::AddNew"), { color: Styles.Text.Lesser });
            } else if (targetIdx < this.parent.targetPersona.responses.length) {
                ADrawTextFit(rect, this.parent.targetPersona.responses[targetIdx].name);
            }
        });

        this.scroll.Draw(hasFocus);
    }

    Click(mouse: IPoint): void {
        if (this.binding.value) {
            this._delete_buttons.forEach((rect, index) => {
                const targetIdx = index + this.scroll.offset;
                if (targetIdx < this.parent.targetPersona.responses.length && WithinRect(mouse, rect)) {
                    this.parent.targetPersona.responses.splice(targetIdx, 1);
                    DataManager.save();
                }
            });
        }

        this._layout_items.forEach((rect, index) => {
            const targetIdx = index + this.scroll.offset;
            if (WithinRect(mouse, rect)) {
                if (targetIdx == this.parent.targetPersona.responses.length) {
                    this.parent.targetPersona.responses.push({ name: i18n("Default::NewResponseName"), enabled: false, trigger: { mode: "activity", allow_activities: [] }, messages: [] });
                    this.parent.targetItem = this.parent.targetPersona.responses[targetIdx];
                    DataManager.save();
                } else if (targetIdx < this.parent.targetPersona.responses.length) {
                    this.parent.targetItem = this.parent.targetPersona.responses[targetIdx];
                }
            }
        });

        this.scroll.Click(mouse);
    }

    MouseWheel(event: WheelEvent): void {
        if (WithinRect({ x: MouseX, y: MouseY }, this._upper_rect)) this.scroll.RawMouseWheel(event);
    }
}
