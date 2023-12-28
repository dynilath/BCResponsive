import { DataManager } from "../../Data";
import { GUISettingScreen, hasFocus } from "../GUI";
import { IPoint, IRect } from "../Widgets/AGUI";
import { ADrawFramedRect, ADrawText, BasicText, DynamicText, FramedRect, TextButton } from "../Widgets/Common";
import { InputTextArea } from "../Widgets/InputText";
import { Popup } from "../Widgets/Popup";
import { LZStringToPersona, PersonaToLZString } from "./PersonaCompress";


export class PersonaImportScreen extends Popup {
    readonly _bind: { text: string };
    _lastInputInvalid: boolean = false;

    constructor(prev: GUISettingScreen | null = null, index: number) {
        const centerX = 1000;
        const centerY = 500;

        const FontSize = 36;

        const inputWidth = 800;
        const inputHeight = 500;

        const padding = 35;

        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonSpacing = 50;
        const buttonTotalWidth = buttonWidth * 2 + buttonSpacing;

        const totalHeight = FontSize + padding + inputHeight + padding + buttonHeight;
        const totalWidth = Math.max(inputWidth, buttonTotalWidth);

        super(prev);

        this._bind = {
            text: (() => {
                const persona = DataManager.instance.data.personalities[index];
                if (persona)
                    return PersonaToLZString(persona);
                return "";
            })()
        }

        this._items = [
            new FramedRect({ x: centerX - totalWidth / 2 - padding, y: centerY - totalHeight / 2 - padding, width: totalWidth + padding * 2, height: totalHeight + padding * 2 }, "White"),
            new DynamicText(() => {
                if (this._lastInputInvalid) {
                    return {
                        where: { x: centerX, y: centerY - totalHeight / 2 + FontSize / 2 },
                        text: "Invalid Persona Data",
                        align: "center",
                        color: "Red"
                    }
                }
                return {
                    where: { x: centerX, y: centerY - totalHeight / 2 + FontSize / 2 },
                    text: "Import/Export Persona",
                    align: "center",
                    color: "Black"
                }
            }),
            new InputTextArea({ x: centerX - inputWidth / 2, y: centerY - totalHeight / 2 + FontSize + padding, width: inputWidth, height: inputHeight }, "InputPersonaData", this._bind),
            new TextButton({
                x: centerX - buttonTotalWidth / 2,
                y: centerY + totalHeight / 2 - buttonHeight,
                width: buttonWidth,
                height: buttonHeight
            }, "Save", () => {
                console.log("saving");
                const newPersonsa = LZStringToPersona(this._bind.text);
                if (newPersonsa) {
                    newPersonsa.index = index;
                    DataManager.instance.data.personalities[index] = newPersonsa;
                    this.Exit();
                } else {
                    this._lastInputInvalid = true;
                }
            }), new TextButton({
                x: centerX + buttonTotalWidth / 2 - buttonWidth,
                y: centerY + totalHeight / 2 - buttonHeight,
                width: buttonWidth,
                height: buttonHeight
            }, "Cancel", () => this.Exit())
        ]
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
