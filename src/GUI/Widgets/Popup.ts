import { GUISettingScreen, hasFocus } from "../GUI";
import { AGUIItem, AGUIScreen } from "./AGUI";

export class Popup extends AGUIScreen {
    constructor(prev: GUISettingScreen | null, items: AGUIItem[] = []) {
        super(prev, items);
    }

    Run(): void {
        if (this._prev)
            this._prev.Run();

        // draws the background
        MainCanvas.fillStyle = "rgba(0, 0, 0, 0.5)";
        MainCanvas.fillRect(0, 0, 2000, 1000);

        this._items.forEach(item => item.Draw(hasFocus(this)));
    }
}