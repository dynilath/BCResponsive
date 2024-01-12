import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DebugMode, HTMLIDPrefix, SettingName } from "../Definition";
import { Localization } from "../Lang";
import { Icons } from "./Icons";
import { GetText } from "../i18n";

export function HTMLID(id: string): string {
    return `${HTMLIDPrefix}${id}`;
}

export abstract class GUISettingScreen {
    Load() { }
    Run() { }
    Click() { }
    Exit() { setSubscreen(null); }
    Unload() { }
}

export function getCurrentSubscreen(): GUISettingScreen | null {
    return GUISetting.instance && GUISetting.instance.currentScreen;
}

export function hasFocus(subscreen: GUISettingScreen): boolean {
    return getCurrentSubscreen() === subscreen;
}

export function setSubscreen(subscreen: GUISettingScreen | null): void {
    if (GUISetting.instance) {
        GUISetting.instance.currentScreen = subscreen;
    }
    if (subscreen === null) {
        PreferenceSubscreen = "";
        PreferencePageCurrent = 1;
        PreferenceMessage = "";
    }
}

function drawTooltip() {
    if (DebugMode) {
        MainCanvas.textAlign = "center";
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
}

export class GUISetting {
    static instance: GUISetting | null = null;

    private _currentScreen: GUISettingScreen | null = null;

    private _mainScreenProvider: (() => GUISettingScreen) | null = null;

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

    static init(mod: ModSDKModAPI, func: () => GUISettingScreen) {
        GUISetting.instance = new GUISetting(mod, func);
    }

    constructor(mod: ModSDKModAPI, func: () => GUISettingScreen) {
        this.hook(mod);
        this._mainScreenProvider = func;
    }

    private hook(mod: ModSDKModAPI<any>) {
        mod.hookFunction("PreferenceRun", 10, (args, next) => {
            if (this._currentScreen) {
                const origAlign = MainCanvas.textAlign;
                this._currentScreen.Run();
                drawTooltip();
                MainCanvas.textAlign = origAlign;
                return;
            }

            next(args);
        });

        mod.hookFunction("PreferenceClick", 10, (args, next) => {
            if (this._currentScreen) {
                this._currentScreen.Click();
                return;
            }
            return next(args);
        });

        mod.hookFunction("InformationSheetExit", 10, (args, next) => {
            if (this._currentScreen) {
                this._currentScreen.Exit();
                return;
            }

            return next(args);
        });

        if (!PreferenceSubscreenList.includes(SettingName))
            PreferenceSubscreenList.push(SettingName);

        mod.hookFunction("TextGet", 2, (args: string[], next: (arg0: any) => any) => {
            if (args[0] == `Homepage${SettingName}`) return GetText("setting_button_text");
            return next(args);
        });

        (window as any)[`PreferenceSubscreen${SettingName}Load`] = () => {
            if (this._mainScreenProvider) {
                this.currentScreen = this._mainScreenProvider();
            }
        }

        mod.hookFunction("DrawButton", 2, (args: string[], next: (arg0: any) => any) => {
            if (args[6] == `Icons/${SettingName}.png`) args[6] = Icons.responsive_main;
            return next(args);
        });
    }
}