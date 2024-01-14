import { Styles } from "../../Definition";
import { AGUIItem, IRect, WithinRect, IPoint } from "./AGUI";
import { ADrawCircleRect, ADrawIcon, ADrawRoundRect, ADrawTextFit, ADrawVerticalCircleRect } from "./Common";

const CHIPS_HEIGHT = 50;
const CHIPS_SPACING = 10;

const SCROLLBAR_WIDTH = 50;
const SCROLLBAR_SPACING = 5;
const SCROLLBAR_BUTTON_HEIGHT = 100;

interface ChipsValue {
    text: string;
    value: string;
}

export class ChipsPark extends AGUIItem {
    private readonly source: Set<string>;
    private readonly _chips_park: IRect;

    private _chips: (ChipsValue & { rect: IRect })[];

    private readonly _callback: (v: string) => void;

    private row_count: number = 0;
    private display_row_count: number = 0;

    CalculateChips(values: ChipsValue[], rect: IRect) {
        let cummulativeWidth = 0;
        this.display_row_count = (rect.height - CHIPS_SPACING) / (CHIPS_HEIGHT + CHIPS_SPACING);
        this.row_count = 0;
        return values.map((v, i) => {
            const width = Math.max(CHIPS_HEIGHT, MainCanvas.measureText(v.text).width + Styles.Text.padding * 2) + CHIPS_SPACING * 2;
            if (cummulativeWidth + CHIPS_SPACING + width > rect.width) {
                cummulativeWidth = width + CHIPS_SPACING;
                this.row_count++;
            } else {
                cummulativeWidth += width + CHIPS_SPACING;
            }
            return {
                ...v,
                rect: {
                    x: rect.x + cummulativeWidth - width,
                    y: rect.y + CHIPS_SPACING + this.row_count * (CHIPS_HEIGHT + CHIPS_SPACING),
                    width: width,
                    height: CHIPS_HEIGHT
                }
            };
        });
    }

    private scrollbar: {
        rect: IRect,
        up: IRect,
        down: IRect,
        scroll: IRect,
        bar_height: number,
        bar_offset: number,
        bar_max_offset: number
    } | undefined;

    constructor(source: Set<string>, values: ChipsValue[], rect: IRect, callback: (v: string) => void) {
        super();
        this.source = source;
        this._callback = callback;

        this._chips_park = { ...rect };

        this._chips = this.CalculateChips(values, this._chips_park);

        const last_chip = this._chips[this._chips.length - 1];

        if (last_chip.rect.y + last_chip.rect.height + CHIPS_SPACING > rect.y + rect.height) {
            this._chips_park.width -= SCROLLBAR_WIDTH + SCROLLBAR_SPACING;
            this._chips = this.CalculateChips(values, this._chips_park);

            const n_last_chip = this._chips[this._chips.length - 1];
            const n_first_chip = this._chips[0];

            // all chips height with an extra line of chips
            const content_height = n_last_chip.rect.y + n_last_chip.rect.height - n_first_chip.rect.y + CHIPS_HEIGHT + CHIPS_SPACING;

            const scrollbar_rect = {
                x: rect.x + rect.width - SCROLLBAR_WIDTH,
                y: rect.y,
                width: SCROLLBAR_WIDTH,
                height: rect.height
            };

            const scrollbar_up = {
                x: scrollbar_rect.x,
                y: scrollbar_rect.y,
                width: SCROLLBAR_WIDTH,
                height: SCROLLBAR_BUTTON_HEIGHT
            };

            const scrollbar_down = {
                x: scrollbar_up.x,
                y: scrollbar_rect.y + scrollbar_rect.height - SCROLLBAR_BUTTON_HEIGHT,
                width: scrollbar_up.width,
                height: scrollbar_up.height
            };

            const scroll_area = {
                x: scrollbar_up.x,
                y: scrollbar_rect.y + SCROLLBAR_BUTTON_HEIGHT + SCROLLBAR_SPACING,
                width: scrollbar_up.width,
                height: rect.height - SCROLLBAR_BUTTON_HEIGHT * 2 - SCROLLBAR_SPACING * 2
            };

            const available_height = scroll_area.height - SCROLLBAR_SPACING * 2;

            const scrollbar_bar_height = available_height * this._chips_park.height / content_height;

            const scrollbar_bar_max_offset = available_height - scrollbar_bar_height;

            this.scrollbar = {
                rect: scrollbar_rect,
                up: scrollbar_up,
                down: scrollbar_down,
                scroll: scroll_area,
                bar_height: scrollbar_bar_height,
                bar_offset: 0,
                bar_max_offset: scrollbar_bar_max_offset
            };
        }
    }

    Draw(hasFocus: boolean): void {
        const mouse = { x: MouseX, y: MouseY };
        ADrawRoundRect(this._chips_park, CHIPS_HEIGHT / 2 + CHIPS_SPACING);
        let step_yOffset = 0;
        if (this.scrollbar) {
            const step = this.scrollbar.bar_max_offset / (this.row_count + 1 - this.display_row_count);
            step_yOffset = Math.floor(this.scrollbar.bar_offset / step);
        }

        this._chips.forEach(v => {
            const expect_rect = {
                x: v.rect.x,
                y: v.rect.y - step_yOffset * (CHIPS_HEIGHT + CHIPS_SPACING),
                width: v.rect.width,
                height: v.rect.height
            };

            if (expect_rect.y < this._chips_park.y) return;
            if (expect_rect.y + expect_rect.height > this._chips_park.y + this._chips_park.height) return;

            const isActive = this.source.has(v.value);
            const isHover = hasFocus && WithinRect(mouse, expect_rect);
            ADrawCircleRect(expect_rect, { fill: isActive ? Styles.SegmentButton.active : "White" });
            if (isHover) ADrawCircleRect(expect_rect, { fill: Styles.SegmentButton.hover, stroke: "none" });
            ADrawTextFit({
                x: expect_rect.x + CHIPS_SPACING,
                y: expect_rect.y,
                width: expect_rect.width - CHIPS_SPACING * 2,
                height: expect_rect.height
            }, v.text);
        });

        if (this.scrollbar) {
            if (hasFocus && WithinRect(mouse, this.scrollbar.up))
                ADrawVerticalCircleRect(this.scrollbar.up, { fill: Styles.Button.hover });
            else ADrawVerticalCircleRect(this.scrollbar.up);

            ADrawIcon({
                x: this.scrollbar.up.x,
                y: this.scrollbar.up.y + this.scrollbar.up.height / 2 - this.scrollbar.up.width / 2,
                width: this.scrollbar.up.width,
                height: this.scrollbar.up.width
            }, "arrow_up");

            if (hasFocus && WithinRect(mouse, this.scrollbar.down))
                ADrawVerticalCircleRect(this.scrollbar.down, { fill: Styles.Button.hover });
            else ADrawVerticalCircleRect(this.scrollbar.down);

            ADrawIcon({
                x: this.scrollbar.down.x,
                y: this.scrollbar.down.y + this.scrollbar.down.height / 2 - this.scrollbar.down.width / 2,
                width: this.scrollbar.down.width,
                height: this.scrollbar.down.width
            }, "arrow_down");

            ADrawVerticalCircleRect(this.scrollbar.scroll);

            const bar_y = this.scrollbar.scroll.y + SCROLLBAR_SPACING + this.scrollbar.bar_offset;
            const bar_rect = {
                x: this.scrollbar.scroll.x + SCROLLBAR_SPACING,
                y: bar_y,
                width: this.scrollbar.scroll.width - SCROLLBAR_SPACING * 2,
                height: this.scrollbar.bar_height
            };

            if (hasFocus && WithinRect(mouse, this.scrollbar.scroll))
                ADrawVerticalCircleRect(bar_rect, { fill: Styles.Button.hover });
            else ADrawVerticalCircleRect(bar_rect);
        }
    }

    Click(mouse: IPoint): void {
        let step_yOffset = 0;
        if (this.scrollbar) {
            const step = this.scrollbar.bar_max_offset / (this.row_count + 1 - this.display_row_count);
            step_yOffset = Math.floor(this.scrollbar.bar_offset / step);
        }
        if (WithinRect(mouse, this._chips_park)) {
            this._chips.forEach(v => {
                const expect_rect = {
                    x: v.rect.x,
                    y: v.rect.y - step_yOffset * (CHIPS_HEIGHT + CHIPS_SPACING),
                    width: v.rect.width,
                    height: v.rect.height
                };
                if (expect_rect.y < this._chips_park.y) return;
                if (expect_rect.y + expect_rect.height > this._chips_park.y + this._chips_park.height) return;
                if (WithinRect(mouse, expect_rect)) this._callback(v.value);
            });
        }

        if (this.scrollbar) {
            const step = this.scrollbar.bar_max_offset / (this.row_count + 1 - this.display_row_count);
            if (WithinRect(mouse, this.scrollbar.up)) {
                this.scrollbar.bar_offset = Math.max(0, this.scrollbar.bar_offset - step);
            } else if (WithinRect(mouse, this.scrollbar.down)) {
                this.scrollbar.bar_offset = Math.min(this.scrollbar.bar_max_offset, this.scrollbar.bar_offset + step);
            } else if (WithinRect(mouse, this.scrollbar.scroll)) {
                // try to center bar on mouse
                const expected_offset = mouse.y - this.scrollbar.scroll.y - this.scrollbar.bar_height / 2;
                this.scrollbar.bar_offset = Math.max(0, Math.min(this.scrollbar.bar_max_offset, expected_offset));
            }
        }
    }
}