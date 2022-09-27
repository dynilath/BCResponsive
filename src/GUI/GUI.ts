import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DataManager } from "../Data";
import { DebugMode, ModVersion } from "../Definition";
import { Localization } from "../Lang";

export abstract class GUISettingScreen {
    Load() { }
    Run() { }
    Click() { }
    Exit() { setSubscreen(null); }
    Unload() { }
}

export class GUIMainMenu extends GUISettingScreen {
    private static keys: (keyof MoanSetting)[] = ['low', 'light', 'medium', 'hot', 'orgasm', 'pain', 'tickle'];

    private static ElementID = (k: keyof MoanerSolidSetting) => `BCMoaner_Input${k}`;
    private static StringListShow = (p: string[]) => {
        if (p.length === 0) return "";
        let result = JSON.stringify(p);
        return result.substring(1, result.length - 1);
    }

    private static ValidateInput = (input: string) => {
        let raw = `[${input}]`;

        const ValidateStringList = (input: any) => {
            if (!Array.isArray(input)) return undefined;
            if (!(input as any[]).every(_ => typeof _ === 'string')) return undefined;
            return input as string[];
        }

        try {
            let d = JSON.parse(raw);
            return ValidateStringList(d);
        } catch {
            return undefined;
        }
    }

    Run(): void {
        const data = DataManager.instance.data;
        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
        const titleBaseX = 400;
        const titleBaseY = 280
        DrawText(Localization.GetText("moaner_setting_title"), titleBaseX, 125, "Black", "Gray");
        DrawText(`v${ModVersion}`, titleBaseX + 400, 125, "Black", "Gray");
        DrawCheckbox(titleBaseX, 160, 64, 64, Localization.GetText("setting_enable"), data.settings.enable);

        const inputBaseX = titleBaseX + 700;

        for (let i = 0; i < GUIMainMenu.keys.length; i++) {
            const k = GUIMainMenu.keys[i];
            const tY = titleBaseY + 90 * i;
            DrawText(Localization.GetText(`setting_title_${k}`), titleBaseX, tY, "Black", "Gray");
            let input = document.getElementById(GUIMainMenu.ElementID(k)) as HTMLInputElement | undefined;
            if (!input) {
                input = ElementCreateInput(GUIMainMenu.ElementID(k), "text", GUIMainMenu.StringListShow(data[k]), "256");
            }
            if (input) {
                ElementPosition(GUIMainMenu.ElementID(k), inputBaseX, tY, 1000, 64);
                if (!GUIMainMenu.ValidateInput(input.value)) {
                    DrawText(Localization.GetText(`setting_input_invalid`), inputBaseX + 520, tY, "Red", "Gray");
                }
            }
        }

    }

    Click(): void {
        const data = DataManager.instance.data;
        if (MouseIn(1815, 75, 90, 90)) {
            for (let i = 0; i < GUIMainMenu.keys.length; i++) {
                const k = GUIMainMenu.keys[i];
                let input = document.getElementById(GUIMainMenu.ElementID(k)) as HTMLInputElement | undefined;
                if (input) {
                    let newL = GUIMainMenu.ValidateInput(input.value);
                    if (newL)
                        DataManager.instance.data[k] = newL;
                }
            }
            DataManager.instance.ServerStoreData();
            this.Exit();
        }
        else if (MouseIn(400, 160, 64, 64)) {
            data.settings.enable = !data.settings.enable;
        }
    }

    Unload(): void {
        GUIMainMenu.keys.forEach(_ => ElementRemove(GUIMainMenu.ElementID(_)));
    }
}

export function getCurrentSubscreen(): GUISettingScreen | null {
    return GUISetting.instance && GUISetting.instance.currentScreen;
}

export function setSubscreen(subscreen: GUISettingScreen | null): void {
    if (GUISetting.instance) {
        GUISetting.instance.currentScreen = subscreen;
    }
}

export class GUISetting {
    static instance: GUISetting | null = null;

    private _currentScreen: GUISettingScreen | null = null;

    get currentScreen(): GUISettingScreen | null {
        return this._currentScreen;
    }

    set currentScreen(subscreen: GUISettingScreen | null) {
        if (this._currentScreen) {
            this._currentScreen.Unload();
        }
        this._currentScreen = subscreen;
        if (this._currentScreen) {
            this._currentScreen.Load();
        }
    }

    constructor() {
        GUISetting.instance = this;
    }

    load(mod: ModSDKModAPI<any>) {
        mod.hookFunction("PreferenceRun", 10, (args, next) => {
            if (this._currentScreen) {
                MainCanvas.textAlign = "left";
                this._currentScreen.Run();
                MainCanvas.textAlign = "center";

                if (DebugMode) {
                    if (MouseX > 0 || MouseY > 0) {
                        MainCanvas.save();
                        MainCanvas.lineWidth = 1;
                        MainCanvas.strokeStyle = "red";
                        MainCanvas.beginPath();
                        MainCanvas.moveTo(0, MouseY);
                        MainCanvas.lineTo(2000, MouseY);
                        MainCanvas.moveTo(MouseX, 0);
                        MainCanvas.lineTo(MouseX, 1000);
                        MainCanvas.stroke();
                        MainCanvas.fillStyle = "black";
                        MainCanvas.strokeStyle = "white";
                        MainCanvas.fillRect(0, 950, 250, 50);
                        MainCanvas.strokeRect(0, 950, 250, 50);
                        DrawText(`X: ${MouseX} Y: ${MouseY}`, 125, 975, "white");
                        MainCanvas.restore();
                    }
                }

                return;
            }

            next(args);
            DrawButton(1815, 820, 90, 90, "", "White", "Icons/Arousal.png", Localization.GetText("setting_button_popup"));
        });

        mod.hookFunction("PreferenceClick", 10, (args, next) => {
            if (this._currentScreen) {
                this._currentScreen.Click();
                return;
            }

            if (MouseIn(1815, 820, 90, 90)) {
                this.currentScreen = new GUIMainMenu();
            } else {
                return next(args);
            }
        });

        mod.hookFunction("InformationSheetExit", 10, (args, next) => {
            if (this._currentScreen) {
                this._currentScreen.Exit();
                return;
            }

            return next(args);
        });
    }
}