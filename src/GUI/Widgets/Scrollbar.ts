import { Styles } from '../../Definition';
import { AGUIItem, IPoint, IRect, WithinRect } from './AGUI';
import { ADrawVerticalCircleRect, ADrawIcon } from './Common';

export class Scrollbar extends AGUIItem {
    private readonly scrollbar_rect: IRect;
    private readonly scrollbar_up: IRect;
    private readonly scrollbar_down: IRect;
    private readonly scroll_area: IRect;

    constructor (readonly init: { content_rows: number; container_rows: number }, readonly rect: IRect) {
        super();

        this.scrollbar_rect = {
            x: rect.x + rect.width - Styles.Scrollbar.width,
            y: rect.y,
            width: Styles.Scrollbar.width,
            height: rect.height,
        };

        this.scrollbar_up = {
            x: this.scrollbar_rect.x,
            y: this.scrollbar_rect.y,
            width: Styles.Scrollbar.width,
            height: Styles.Scrollbar.button_height,
        };

        this.scrollbar_down = {
            x: this.scrollbar_up.x,
            y: this.scrollbar_rect.y + this.scrollbar_rect.height - Styles.Scrollbar.button_height,
            width: this.scrollbar_up.width,
            height: this.scrollbar_up.height,
        };

        this.scroll_area = {
            x: this.scrollbar_up.x,
            y: this.scrollbar_rect.y + Styles.Scrollbar.button_height + Styles.Scrollbar.spacing,
            width: this.scrollbar_up.width,
            height: rect.height - Styles.Scrollbar.button_height * 2 - Styles.Scrollbar.spacing * 2,
        };

        this.update(init.content_rows, init.container_rows);
    }

    private item_offset = 0;
    private max_offset = 0;

    private step = 0;
    private scrollbar_bar_height = 0;
    private scrollbar_bar_offset = 0;
    private scrollbar_bar_max_offset = 0;

    update (content_rows: number, container_rows: number) {
        const effective_content_rows = Math.max(content_rows, container_rows);
        const available_height = this.scroll_area.height - Styles.Scrollbar.spacing * 2;
        this.scrollbar_bar_height = (available_height * container_rows) / effective_content_rows;
        this.scrollbar_bar_max_offset = available_height - this.scrollbar_bar_height;
        this.scrollbar_bar_offset = Math.min(this.scrollbar_bar_offset, this.scrollbar_bar_max_offset);

        if (effective_content_rows === container_rows) this.step = 0;
        else this.step = this.scrollbar_bar_max_offset / (effective_content_rows - container_rows);
        this.max_offset = Math.max(0, effective_content_rows - container_rows);
    }

    get offset () {
        return this.item_offset;
    }

    Draw (hasFocus: boolean): void {
        const mouse = { x: MouseX, y: MouseY };

        if (hasFocus && WithinRect(mouse, this.scrollbar_up))
            ADrawVerticalCircleRect(this.scrollbar_up, { fill: Styles.Button.hover });
        else ADrawVerticalCircleRect(this.scrollbar_up);

        ADrawIcon(
            {
                x: this.scrollbar_up.x,
                y: this.scrollbar_up.y + this.scrollbar_up.height / 2 - this.scrollbar_up.width / 2,
                width: this.scrollbar_up.width,
                height: this.scrollbar_up.width,
            },
            'arrow_up'
        );

        if (hasFocus && WithinRect(mouse, this.scrollbar_down))
            ADrawVerticalCircleRect(this.scrollbar_down, { fill: Styles.Button.hover });
        else ADrawVerticalCircleRect(this.scrollbar_down);

        ADrawIcon(
            {
                x: this.scrollbar_down.x,
                y: this.scrollbar_down.y + this.scrollbar_down.height / 2 - this.scrollbar_down.width / 2,
                width: this.scrollbar_down.width,
                height: this.scrollbar_down.width,
            },
            'arrow_down'
        );

        ADrawVerticalCircleRect(this.scroll_area);

        const bar_y = this.scroll_area.y + Styles.Scrollbar.spacing + this.scrollbar_bar_offset;
        const bar_rect = {
            x: this.scroll_area.x + Styles.Scrollbar.spacing,
            y: bar_y,
            width: this.scroll_area.width - Styles.Scrollbar.spacing * 2,
            height: this.scrollbar_bar_height,
        };

        if (hasFocus && WithinRect(mouse, this.scroll_area))
            ADrawVerticalCircleRect(bar_rect, { fill: Styles.Button.hover });
        else ADrawVerticalCircleRect(bar_rect);
    }

    scroll_up () {
        this.item_offset = Math.max(0, this.item_offset - 1);
        this.scrollbar_bar_offset = this.item_offset * this.step;
    }

    scroll_down () {
        this.item_offset = Math.min(this.max_offset, this.item_offset + 1);
        this.scrollbar_bar_offset = this.item_offset * this.step;
    }

    Click (mouse: IPoint): void {
        if (WithinRect(mouse, this.scrollbar_up)) this.scroll_up();
        else if (WithinRect(mouse, this.scrollbar_down)) this.scroll_down();
        else if (WithinRect(mouse, this.scroll_area)) {
            const expected_offset = mouse.y - this.scroll_area.y - this.scrollbar_bar_height / 2;
            if (this.step) {
                this.item_offset = Math.floor(expected_offset / this.step);
                this.item_offset = Math.max(0, Math.min(this.max_offset, this.item_offset));
                this.scrollbar_bar_offset = this.item_offset * this.step;
            }
        }
    }

    RawMouseWheel (event: WheelEvent) {
        if (event.deltaY < 0) this.scroll_up();
        else if (event.deltaY > 0) this.scroll_down();
    }

    MouseWheel (event: WheelEvent): void {
        if (WithinRect({ x: MouseX, y: MouseY }, this.scroll_area)) this.RawMouseWheel(event);
    }
}
