import { Styles } from '../../Definition';
import { AGUIItem, IRect, WithinRect, IPoint } from './AGUI';
import { ADrawCircleRect, ADrawRoundRect, ADrawTextFit } from './Common';
import { Scrollbar } from './Scrollbar';

const CHIPS_HEIGHT = 50;
const CHIPS_SPACING = 10;

interface ChipsValue {
    text: string;
    value: string;
}

export class ChipsPark extends AGUIItem {
    private readonly source: Set<string>;
    private _chips_park: IRect;

    private _chips: (ChipsValue & { rect: IRect })[];

    private readonly _callback: (v: string) => void;

    private row_count: number = 0;
    private display_row_count: number = 0;

    CalculateChips (values: ChipsValue[], rect: IRect) {
        let cummulativeWidth = 0;
        this.display_row_count = (rect.height - CHIPS_SPACING) / (CHIPS_HEIGHT + CHIPS_SPACING);
        this.row_count = 0;
        return values.map((v, i) => {
            const width =
                Math.max(CHIPS_HEIGHT, MainCanvas.measureText(v.text).width + Styles.Text.padding * 2) +
                CHIPS_SPACING * 2;
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
                    height: CHIPS_HEIGHT,
                },
            };
        });
    }

    private scrollbar: Scrollbar | undefined;

    constructor (source: Set<string>, values: ChipsValue[], readonly rect: IRect, callback: (v: string) => void) {
        super();
        this.source = source;
        this._callback = callback;

        this._chips_park = { ...rect };
        this._chips = this.CalculateChips(values, this._chips_park);
        this.refreshScrollbar(values);
    }

    private refreshScrollbar (values: ChipsValue[]): void {
        const last_chip = this._chips[this._chips.length - 1];

        if (last_chip.rect.y + last_chip.rect.height + CHIPS_SPACING > this.rect.y + this.rect.height) {
            this._chips_park.width -= Styles.Scrollbar.width + Styles.Scrollbar.spacing;
            this._chips = this.CalculateChips(values, this._chips_park);

            const n_last_chip = this._chips[this._chips.length - 1];
            const n_first_chip = this._chips[0];

            const content_rows =
                Math.round(
                    (n_last_chip.rect.y + n_last_chip.rect.height - n_first_chip.rect.y + CHIPS_SPACING) /
                        (CHIPS_HEIGHT + CHIPS_SPACING)
                ) + 1;
            const container_rows = Math.floor((this.rect.height + CHIPS_SPACING) / CHIPS_HEIGHT);

            const scrollbar_rect = {
                x: this.rect.x + this.rect.width - Styles.Scrollbar.width,
                y: this.rect.y,
                width: Styles.Scrollbar.width,
                height: this.rect.height,
            };

            this.scrollbar = new Scrollbar(
                { content_rows: content_rows, container_rows: container_rows },
                scrollbar_rect
            );
        }
    }

    recalculateChips(values: ChipsValue[]): void {
        this._chips_park = { ...this.rect };
        this._chips = this.CalculateChips(values, this._chips_park);
        this.refreshScrollbar(values);
    }

    Draw (hasFocus: boolean): void {
        const mouse = { x: MouseX, y: MouseY };
        ADrawRoundRect(this._chips_park, CHIPS_HEIGHT / 2 + CHIPS_SPACING);
        const step_yOffset = this.scrollbar?.offset ?? 0;

        this._chips.forEach(v => {
            const expect_rect = {
                x: v.rect.x,
                y: v.rect.y - step_yOffset * (CHIPS_HEIGHT + CHIPS_SPACING),
                width: v.rect.width,
                height: v.rect.height,
            };

            if (expect_rect.y < this._chips_park.y) return;
            if (expect_rect.y + expect_rect.height > this._chips_park.y + this._chips_park.height) return;

            const isActive = this.source.has(v.value);
            const isHover = hasFocus && WithinRect(mouse, expect_rect);
            ADrawCircleRect(expect_rect, { fill: isActive ? Styles.SegmentButton.active : 'White' });
            if (isHover) ADrawCircleRect(expect_rect, { fill: Styles.SegmentButton.hover, stroke: 'none' });
            ADrawTextFit(
                {
                    x: expect_rect.x + CHIPS_SPACING,
                    y: expect_rect.y,
                    width: expect_rect.width - CHIPS_SPACING * 2,
                    height: expect_rect.height,
                },
                v.text
            );
        });

        this.scrollbar?.Draw(hasFocus);
    }

    Click (mouse: IPoint): void {
        const step_yOffset = this.scrollbar?.offset ?? 0;
        if (WithinRect(mouse, this._chips_park)) {
            this._chips.forEach(v => {
                const expect_rect = {
                    x: v.rect.x,
                    y: v.rect.y - step_yOffset * (CHIPS_HEIGHT + CHIPS_SPACING),
                    width: v.rect.width,
                    height: v.rect.height,
                };
                if (expect_rect.y < this._chips_park.y) return;
                if (expect_rect.y + expect_rect.height > this._chips_park.y + this._chips_park.height) return;
                if (WithinRect(mouse, expect_rect)) this._callback(v.value);
            });
        }

        this.scrollbar?.Click(mouse);
    }

    MouseWheel (event: WheelEvent): void {
        this.scrollbar?.MouseWheel(event);
        if (this.scrollbar && WithinRect({ x: MouseX, y: MouseY }, this._chips_park)) {
            this.scrollbar.RawMouseWheel(event);
        }
    }
}
