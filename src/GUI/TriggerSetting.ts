import { DataManager } from "../Data";
import { LocalizedText } from "../i18n";
import { DrawExit, DrawTitle, isClickExit } from "./Draw";
import { GUISettingScreen, setSubscreen } from "./GUI";


export function DrawTriggerItemButton(Left: number, Top: number, Trigger: ResponsiveTrigger) {
    const itemWidth = 300;
    const itemHeight = 60;
    const iconSize = 50;

    let icon = (() => {
        if (Trigger.condition.mode === "activity") {
            return "Icons/Activity.png";
        }
        if (Trigger.condition.mode === "orgasm") {
            return "Icons/Small/Lover.png";
        }
        return "Icons/Small/Chat.png"
    })();

    MainCanvas.beginPath();
    MainCanvas.rect(Left, Top, itemWidth, itemHeight);
    if (MouseIn(Left, Top, itemWidth, itemHeight)) {
        MainCanvas.fillStyle = "Cyan";
    } else {
        MainCanvas.fillStyle = "White";
    }
    MainCanvas.fillRect(Left, Top, itemWidth, itemHeight);
    MainCanvas.fill();
    MainCanvas.lineWidth = 2;
    MainCanvas.strokeStyle = 'black';
    MainCanvas.stroke();
    MainCanvas.closePath();

    const sPading = (itemHeight - iconSize) / 2;
    MainCanvas.drawImage(DrawGetImage(icon), Left + sPading, Top + sPading, iconSize, iconSize);

    let align = MainCanvas.textAlign;
    MainCanvas.textAlign = "center";
    DrawTextFit(Trigger.name, Left + (itemWidth + itemHeight) / 2, Top + itemHeight / 2, itemWidth - iconSize, "Black");
    MainCanvas.textAlign = align;
}

export class TriggerSetting extends GUISettingScreen {
    prev: GUISettingScreen | null = null;

    constructor(prev: GUISettingScreen | null) {
        super();
        this.prev = prev;
    }

    Run(): void {
        DrawExit();
        DrawTitle();

        const baseX = 200;
        const baseY = 180;

        const data = DataManager.instance.data;
        for (let i = 0; i < data.triggers.length && i < 10; i++) {
            DrawTriggerItemButton(baseX, baseY + i * 75, data.triggers[i]);
        }
    }

    Click(): void {
        if (isClickExit()) {
            this.Exit();
            return;
        }
    }

    Exit(): void {
        setSubscreen(this.prev);
    }
}