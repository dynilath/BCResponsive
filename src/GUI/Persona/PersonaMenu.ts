import { DataManager } from "../../Data";
import { MaxPersonalities } from "../../Definition";
import { GUISettingScreen } from "../GUI";
import { AGUIItem, AGUIScreen, IRect } from "../Widgets/AGUI";
import { ExitButton, TitleText } from "../Widgets/Common";
import { PersonaItem } from "./PersonaItem";

export class PersonaSetting extends AGUIScreen {
    constructor(prev: GUISettingScreen | null = null) {
        const personas = DataManager.instance.data.personalities;

        const personaBannerHeight = 600;
        const personaBannerWidth = 300;
        const personaBannerSpacing = 5;

        const personaBannerTotalWidth = (personaBannerWidth + personaBannerSpacing) * MaxPersonalities - personaBannerSpacing;

        const centerX = 1000;
        const centerY = 520;

        const personaStartX = centerX - personaBannerTotalWidth / 2;
        const personaStartY = centerY - personaBannerHeight / 2;

        super(prev);

        this._items = Array.from({ length: MaxPersonalities }, (_, index): number => index).map((index): AGUIItem => {
            const rect: IRect = {
                x: personaStartX + (personaBannerWidth + personaBannerSpacing) * index,
                y: personaStartY, width: personaBannerWidth, height: personaBannerHeight
            };
            return new PersonaItem(this, index, rect);
        }).concat([new ExitButton(() => this.Exit()), new TitleText()])
    }
}