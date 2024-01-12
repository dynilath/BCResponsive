import { Styles } from "../../Definition";
import { AGUIItem, IPoint, IRect, WithinRect } from "./AGUI";
import { ADrawCircleRect, ADrawIcon, ADrawTextFit, AFillRect } from "./Common";


const pageDisplayWidth = 200;
const pageButtonWidth = 100;
const pagePanelBorder = 2;

export interface PageDialBinding {
    page: number;
    maxPage: number;
    update: () => void;
}

export class PageDial extends AGUIItem {
    readonly _page_panel: IRect;
    readonly _page_display: IRect;
    readonly _prev_page_button: IRect;
    readonly _prev_page_button_icon: IRect;
    readonly _next_page_button: IRect;
    readonly _next_page_button_icon: IRect;

    private page_binding: PageDialBinding

    constructor(rect: IRect, page_binding: PageDialBinding) {
        super();
        this._page_panel = rect;
        this.page_binding = page_binding;

        this._page_display = {
            x: rect.x + rect.width / 2 - pageDisplayWidth / 2,
            y: rect.y,
            width: pageDisplayWidth,
            height: rect.height
        };
        this._prev_page_button = {
            x: rect.x + pagePanelBorder,
            y: rect.y + pagePanelBorder,
            width: pageButtonWidth - pagePanelBorder * 2,
            height: rect.height - pagePanelBorder * 2
        };

        this._next_page_button = {
            x: rect.x + rect.width - pageButtonWidth + pagePanelBorder,
            y: rect.y + pagePanelBorder,
            width: this._prev_page_button.width,
            height: this._prev_page_button.height
        };

        const iconSize = this._prev_page_button.height;

        this._prev_page_button_icon = {
            x: this._prev_page_button.x + this._prev_page_button.width / 2 - iconSize / 2,
            y: this._prev_page_button.y + this._prev_page_button.height / 2 - iconSize / 2,
            width: iconSize,
            height: iconSize
        }

        this._next_page_button_icon = {
            x: this._next_page_button.x + this._next_page_button.width / 2 - iconSize / 2,
            y: this._next_page_button.y + this._next_page_button.height / 2 - iconSize / 2,
            width: iconSize,
            height: iconSize
        }
    }

    private regulatePage(page: number) {
        return Math.max(Math.min(page, this.page_binding.maxPage - 1), 0);
    }

    Draw(hasFocus: boolean) {
        ADrawCircleRect(this._page_panel);
        const mouse = { x: MouseX, y: MouseY };

        if (this.page_binding.page > 0) {
            if (hasFocus && WithinRect(mouse, this._prev_page_button)) {
                ADrawCircleRect(this._prev_page_button, { fill: Styles.Button.hover, stroke: "none" });
            } else {
                ADrawCircleRect(this._prev_page_button, { fill: Styles.Button.idle, stroke: "none" });
            }
            ADrawIcon(this._prev_page_button_icon, "prev");
        } else {
            ADrawIcon(this._prev_page_button_icon, "prev");
            AFillRect(this._prev_page_button_icon, "#FFFFFF80");
        }

        if (this.page_binding.page < this.page_binding.maxPage - 1) {
            if (hasFocus && WithinRect(mouse, this._next_page_button)) {
                ADrawCircleRect(this._next_page_button, { fill: Styles.Button.hover, stroke: "none" });
            } else {
                ADrawCircleRect(this._next_page_button, { fill: Styles.Button.idle, stroke: "none" });
            }
            ADrawIcon(this._next_page_button_icon, "next");
        } else {
            ADrawIcon(this._next_page_button_icon, "next");
            AFillRect(this._next_page_button_icon, "#FFFFFF80");
        }

        this.page_binding.page = this.regulatePage(this.page_binding.page);

        ADrawTextFit(this._page_display, `${Math.min(this.page_binding.page + 1, this.page_binding.maxPage)}/${this.page_binding.maxPage}`);
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this._prev_page_button)) {
            this.page_binding.page = Math.max(this.page_binding.page - 1, 0);
            this.page_binding.update();
        } else if (WithinRect(mouse, this._next_page_button)) {
            this.page_binding.page = Math.min(this.page_binding.page + 1, this.page_binding.maxPage);
            this.page_binding.update();
        }
    }
}