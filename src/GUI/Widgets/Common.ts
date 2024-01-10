import { Colors } from "../../Definition";
import { AGUIItem, IPoint, IRect, WithinRect as WithinRect } from "./AGUI";

export function ADrawText(rect: IPoint, Text: string, option?: { color?: string, align?: CanvasTextAlign }) {
    if (!option) option = {};
    const color = option.color || "Black";
    const align = option.align || "left";

    MainCanvas.fillStyle = color;
    MainCanvas.textAlign = align;
    MainCanvas.fillText(Text, rect.x, rect.y);
}

export function ADrawTextFit(rect: IRect, Text: string, args?: { color?: string, padding?: number }) {
    if (!args) args = {};
    const color = args.color || "Black";
    const padding = args.padding || 5;

    const actualWidth = rect.width - padding * 2;

    MainCanvas.textAlign = "center";
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    const measure = MainCanvas.measureText(Text);
    MainCanvas.fillStyle = color;
    if (actualWidth < measure.width) {
        const ratio = actualWidth / measure.width;
        MainCanvas.scale(ratio, ratio);
        MainCanvas.fillText(Text, centerX / ratio, centerY / ratio);
        MainCanvas.scale(1 / ratio, 1 / ratio);
    } else {
        MainCanvas.fillText(Text, centerX, centerY);
    }
}

export function ADrawIconTextButton(rect: IRect, Text: string, Icon: string, active: boolean = true) {
    MainCanvas.textAlign = "center";
    ADrawIconButton(rect, Icon, active);
    ADrawTextFit(rect, Text);
}

export function AStrokeRect(rect: IRect, line: string = 'black', lineWidth: number = 2) {
    MainCanvas.lineWidth = lineWidth;
    MainCanvas.strokeStyle = line;
    MainCanvas.strokeRect(rect.x, rect.y, rect.width, rect.height);
}

export function AFillRect(rect: IRect, fill: string) {
    MainCanvas.fillStyle = fill;
    MainCanvas.fillRect(rect.x, rect.y, rect.width, rect.height);
}

export function ADrawFramedRect(rect: IRect, fill: string, line: string = 'black', lineWidth: number = 2) {
    AFillRect(rect, fill);
    AStrokeRect(rect, line, lineWidth);
}

export function ADrawTextButton(rect: IRect, Text: string, active: boolean = true, background?: { idle?: string, hover?: string, stroke?: string, strokeWidth?: number }) {
    if (!background) background = {};
    const idle = background.idle || "White";
    const hover = background.hover || Colors.Hover;
    const stroke = background.stroke || "Black";
    const strokeWidth = background.strokeWidth || 2;

    MainCanvas.textAlign = "center";
    ADrawFramedRect(rect, active && WithinRect({ x: MouseX, y: MouseY }, rect) ? hover : idle, stroke, strokeWidth)
    ADrawTextFit(rect, Text);
}

export function ADrawIconButton(rect: IRect, Icon: string, active: boolean = true, background?: { idle?: string, hover?: string, stroke?: string, strokeWidth?: number }) {
    if (!background) background = {};
    const idle = background.idle || "White";
    const hover = background.hover || Colors.Hover;
    const stroke = background.stroke || "Black";
    const strokeWidth = background.strokeWidth || 2;
    ADrawFramedRect(rect, active && WithinRect({ x: MouseX, y: MouseY }, rect) ? hover : idle, stroke, strokeWidth);
    DrawImage(Icon, rect.x + 2, rect.y + 2);
}

export function ADrawCircleRect(rect: IRect, style?: { fill?: string, stroke?: string, strokeWidth?: number }) {
    if (!style) style = {};
    const radius = rect.height / 2;
    const xLeft = rect.x + radius;
    const xRight = rect.x + rect.width - radius;
    MainCanvas.strokeStyle = style.stroke || "Black";
    MainCanvas.lineWidth = style.strokeWidth || 2;
    if (style.fill) MainCanvas.fillStyle = style.fill;
    MainCanvas.beginPath();
    MainCanvas.moveTo(xLeft, rect.y);
    MainCanvas.lineTo(xRight, rect.y);
    MainCanvas.arc(xRight, rect.y + radius, radius, -Math.PI * 0.5, Math.PI * 0.5);
    MainCanvas.lineTo(xLeft, rect.y + rect.height);
    MainCanvas.arc(xLeft, rect.y + radius, radius, Math.PI * 0.5, -Math.PI * 0.5);
    MainCanvas.closePath();
    if (style.fill) MainCanvas.fill();
    MainCanvas.stroke();
}

export function ADrawRoundRect(rect: IRect, radius: number, style?: { fill?: string, stroke?: string, strokeWidth?: number }) {
    if (!style) style = {};
    MainCanvas.strokeStyle = style.stroke || "Black";
    MainCanvas.lineWidth = style.strokeWidth || 2;
    if (style.fill) MainCanvas.fillStyle = style.fill;

    const xLeft = rect.x + radius;
    const xRight = rect.x + rect.width - radius;
    const yTop = rect.y + radius;
    const yBottom = rect.y + rect.height - radius;

    MainCanvas.beginPath();
    MainCanvas.moveTo(xLeft, rect.y);
    MainCanvas.lineTo(xRight, rect.y);
    MainCanvas.arc(xRight, yTop, radius, -Math.PI * 0.5, 0);
    MainCanvas.lineTo(rect.x + rect.width, yBottom);
    MainCanvas.arc(xRight, yBottom, radius, 0, Math.PI * 0.5);
    MainCanvas.lineTo(xLeft, rect.y + rect.height);
    MainCanvas.arc(xLeft, yBottom, radius, Math.PI * 0.5, Math.PI);
    MainCanvas.lineTo(rect.x, yTop);
    MainCanvas.arc(xLeft, yTop, radius, Math.PI, Math.PI * 1.5);
    MainCanvas.closePath();

    if (style.fill) MainCanvas.fill();
    MainCanvas.stroke();
}

export class FramedRect extends AGUIItem {
    private _rect: IRect;
    private _color: string;

    constructor(rect: IRect, color: string) {
        super();
        this._rect = rect;
        this._color = color;
    }

    Draw() {
        ADrawFramedRect(this._rect, this._color);
    }
}


