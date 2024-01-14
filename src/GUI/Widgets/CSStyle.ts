import { IRect } from "./AGUI";

export function StylesRect(rect: IRect, stylable: { readonly style: CSSStyleDeclaration }) {
    const Ratio = MainCanvas.canvas.clientWidth / 2000;
    const Font = Math.min(MainCanvas.canvas.clientWidth / 50, MainCanvas.canvas.clientHeight / 25);

    const BaseBorder = Math.ceil(2 * Ratio);
    const BasePadding = 2 * Ratio;
    const Height = rect.height * Ratio - (BaseBorder + BasePadding) * 2;
    const Width = rect.width * Ratio - (BaseBorder + BasePadding) * 2;
    const Top = MainCanvas.canvas.offsetTop + rect.y * Ratio;
    const Left = MainCanvas.canvas.offsetLeft + rect.x * Ratio;

    Object.assign(stylable.style, {
        fontSize: Font + "px",
        fontFamily: CommonGetFontName(),
        position: "fixed",
        left: Left + "px",
        top: Top + "px",
        width: Width + "px",
        height: Height + "px",
        display: "inline",
        padding: BasePadding + "px",
        borderWidth: BaseBorder + "px"
    });
}