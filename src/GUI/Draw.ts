import { ModVersion } from "../Definition";
import { LocalizedText } from "../i18n";

export function DrawSettingButton(X: number, Y: number, Text: string, BackColor: string, Icon: string) {
    let align = MainCanvas.textAlign;
    MainCanvas.textAlign = "center";
    DrawButton(X, Y, 400, 90, "", BackColor, Icon);
    DrawTextFit(Text, X + 245, Y + 45, 310, "Black");
    MainCanvas.textAlign = align;
}

export function DrawTitle() {
    DrawText(LocalizedText("responsive_setting_title") + ` v${ModVersion}`, 200, 125, "Black", "Gray");
}

export function DrawExit() {
    DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
}

export function isClickExit() {
    return MouseIn(1815, 75, 90, 90);
}