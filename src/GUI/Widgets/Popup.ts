import { IGUIScreen, hasFocus } from "../GUI";
import { AGUIItem, AGUIScreen } from "./AGUI";

export class Popup extends AGUIScreen {
    constructor(readonly prev: IGUIScreen | null, items: AGUIItem[] = []) {
        super(prev, items);
    }

    Run(): void {
        if (this.prev)
            this.prev.Run();

        // draws the background
        MainCanvas.fillStyle = "rgba(0, 0, 0, 0.5)";
        MainCanvas.fillRect(0, 0, 2000, 1000);

        this.items.forEach(item => item.Draw(hasFocus(this)));
    }
}