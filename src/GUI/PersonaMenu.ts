import { DataManager } from "../Data";
import { GUISettingScreen } from "./GUI";
import { AGUIItem, AGUIScreen, IPoint, IRect, WithinRect } from "./Widgets/AGUI";
import { ADrawButton, ADrawText, ADrawTextButton, BasicText, ExitButton, TitleText } from "./Widgets/Common";

class PersonaItem extends AGUIItem {
    private _persona: ResponsivePersonality;
    private _rect: IRect;

    private _import_rect: IRect;
    private _export_rect: IRect;
    private _activate_rect: IRect;
    private _name_point: IPoint;

    constructor(persona: ResponsivePersonality, rect: IRect) {
        super();
        this._persona = persona;
        this._rect = rect;

        const centerX = this._rect.x + this._rect.width / 2;
        const centerY = this._rect.y + this._rect.height / 2;

        const verticalSpacing = Math.min(this._rect.height * 0.1, 10);
        const buttonWidth = Math.max(this._rect.width * 0.8, 120);
        const buttonHeight = Math.max(this._rect.height * 0.1, 60);

        const baseButtonX = centerX - buttonWidth / 2;
        const baseButtonY = centerY - buttonHeight;

        this._import_rect = {
            x: baseButtonX,
            y: baseButtonY,
            width: buttonWidth,
            height: buttonHeight
        };

        this._export_rect = {
            x: baseButtonX,
            y: baseButtonY + buttonHeight + verticalSpacing,
            width: buttonWidth,
            height: buttonHeight
        };

        this._activate_rect = {
            x: baseButtonX,
            y: baseButtonY + (buttonHeight + verticalSpacing) * 2,
            width: buttonWidth,
            height: buttonHeight
        };

        this._name_point = {
            x: centerX,
            y: centerY - buttonHeight - verticalSpacing - 36 / 2
        };
    }

    Draw() {
        const align = MainCanvas.textAlign;
        MainCanvas.textAlign = "center";

        MainCanvas.beginPath();
        MainCanvas.rect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);
        MainCanvas.fillStyle = 'White';
        MainCanvas.fillRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);
        MainCanvas.lineWidth = 2;
        MainCanvas.strokeStyle = 'black';
        MainCanvas.stroke();
        MainCanvas.closePath();

        ADrawText(this._name_point, this._persona.name);

        ADrawButton(this._import_rect, "Import", "White", "");
        ADrawButton(this._export_rect, "Export", "White", "");

        if (this._persona.name !== DataManager.instance.data.active_personality)
            ADrawButton(this._activate_rect, "Activate", "White", "");

        MainCanvas.textAlign = align;
    }

    Click(mouse: IPoint): void {
        if (WithinRect(mouse, this._import_rect)) {
            console.log(`Import ${this._persona.name}`);
        } else if (WithinRect(mouse, this._export_rect)) {
            console.log(`Export ${this._persona.name}`);
        } else if (WithinRect(mouse, this._activate_rect)) {
            if (this._persona.name !== DataManager.instance.data.active_personality)
                DataManager.instance.data.active_personality = this._persona.name;
        }
    }
}


class PersonaNewItem extends AGUIItem {
    private _rect: IRect;
    constructor(rect: IRect) {
        super();
        this._rect = rect;
    }

    Draw() {
        const align = MainCanvas.textAlign;
        MainCanvas.textAlign = "center";

        MainCanvas.beginPath();
        MainCanvas.rect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);

        if (WithinRect({ x: MouseX, y: MouseY }, this._rect))
            MainCanvas.fillStyle = 'Cyan';
        else MainCanvas.fillStyle = 'White';

        MainCanvas.fillRect(this._rect.x, this._rect.y, this._rect.width, this._rect.height);
        MainCanvas.lineWidth = 2;
        MainCanvas.strokeStyle = 'black';
        MainCanvas.stroke();
        MainCanvas.closePath();

        const centerX = this._rect.x + this._rect.width / 2;
        const centerY = this._rect.y + this._rect.height / 2;

        DrawText("Create", centerX, centerY, "Black");

        MainCanvas.textAlign = align;
    }
}

export class PersonaSetting extends AGUIScreen {
    constructor(prev: GUISettingScreen | null = null) {
        const personas = DataManager.instance.data.personalities;

        const personaBannerHeight = 600;
        const personaBannerWidth = 300;
        const personaBannerSpacing = 10;

        const personaBannerTotalWidth = personaBannerWidth * 5 + personaBannerSpacing * 4;

        const centerX = 1000;
        const centerY = 550;

        const personaStartX = centerX - personaBannerTotalWidth / 2;
        const personaStartY = centerY - personaBannerHeight / 2;

        super(prev, [0, 1, 2, 3, 4].map((index): AGUIItem => {
            const rect: IRect = {
                x: personaStartX + (personaBannerWidth + personaBannerSpacing) * index,
                y: personaStartY, width: personaBannerWidth, height: personaBannerHeight
            };
            if (index < personas.length) return new PersonaItem(personas[index], rect);
            else return new PersonaNewItem(rect);
        }).concat([new ExitButton(() => this.Exit()), new TitleText(), new BasicText({ x: 200, y: 200 }, "Personality Setting")]));
    }
}