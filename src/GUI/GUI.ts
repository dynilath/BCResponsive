import { ModSDKModAPI } from "bondage-club-mod-sdk";
import { DebugMode, HTMLIDPrefix, ModName, SettingName } from "../Definition";
import { Icons } from "./Icons";
import { GetText } from "../i18n";

export function HTMLID(id: string): string {
    return `${HTMLIDPrefix}${id}`;
}

export abstract class IGUIScreen {
    Run() { }
    Click() { }
    MouseWheel(event: WheelEvent) { }
    Exit() { GUISetting.instance.Current = null; }
    Unload() { }
}

export function hasFocus(subscreen: IGUIScreen): boolean {
    return GUISetting.instance.Current === subscreen;
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
    private static _instance: GUISetting | null = null;
    static get instance() { return this._instance as GUISetting; }

    private _currentScreen: IGUIScreen | null = null;

    private _mainScreenProvider: (() => IGUIScreen) | null = null;

    get Current(): IGUIScreen | null {
        return this._currentScreen;
    }

    set Current(subscreen: IGUIScreen | null) {
        if (this._currentScreen) {
            this._currentScreen.Unload();
        }

        this._currentScreen = subscreen;

        if (!this._currentScreen) {
            if (typeof PreferenceSubscreenExtensionsClear === "function")
                PreferenceSubscreenExtensionsClear();
            else PreferenceSubscreen = "";
        }
    }

    private _setScreen(screen: IGUIScreen | null) { this._currentScreen = screen; }
    static setScreen(screen: IGUIScreen | null) { this._instance?._setScreen(screen); }

    static init(mod: ModSDKModAPI, func: () => IGUIScreen) {
        GUISetting._instance = new GUISetting(mod, func);
    }

    constructor(mod: ModSDKModAPI, func: () => IGUIScreen) {
        this._mainScreenProvider = func;

        if (typeof PreferenceRegisterExtensionSetting === "function") {
            this.registerGUI();
        } else {
            this.hookGUI(mod);
        }
    }

    registerGUI() {
        PreferenceRegisterExtensionSetting(
            {
                Identifier: ModName,
                Image: Icons.responsive_main,
                ButtonText: () => GetText("setting_button_text"),
                load: () => {
                    if (this._mainScreenProvider)
                        this.Current = this._mainScreenProvider();
                },
                run: () => {
                    if (this._currentScreen) {
                        const origAlign = MainCanvas.textAlign;
                        this._currentScreen.Run();
                        drawTooltip();
                        MainCanvas.textAlign = origAlign;
                    }
                },
                click: () => this._currentScreen?.Click(),
                unload: () => this._currentScreen?.Unload(),
                exit: () => this._currentScreen?.Exit()
            }
        )
    }

    private hookGUI(mod: ModSDKModAPI<any>) {
        if (typeof window["PreferenceMouseWheel" as any] !== "function") {
            (window["PreferenceMouseWheel" as any] as any) = (event: WheelEvent) => { };
        }

        mod.hookFunction("PreferenceMouseWheel", 10, (args, next) => {
            if (this._currentScreen) {
                this._currentScreen.MouseWheel(args[0] as WheelEvent);
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

        (window as any)[`PreferenceSubscreen${SettingName}Load`] = () => this.Current = this._mainScreenProvider?.() ?? null;

        (window as any)[`PreferenceSubscreen${SettingName}Run`] = () => {
            if (this._currentScreen) {
                const origAlign = MainCanvas.textAlign;
                this._currentScreen.Run();
                drawTooltip();
                MainCanvas.textAlign = origAlign;
            }
        }

        (window as any)[`PreferenceSubscreen${SettingName}Click`] = () => this._currentScreen?.Click();
        (window as any)[`PreferenceSubscreen${SettingName}Exit`] = () => this._currentScreen?.Exit();

        mod.hookFunction("DrawButton", 2, (args: string[], next: (arg0: any) => any) => {
            if (args[6] == `Icons/${SettingName}.png`) args[6] = Icons.responsive_main;
            return next(args);
        });
    }
}