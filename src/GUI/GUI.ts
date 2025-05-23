import { DebugMode, HTMLIDPrefix, ModName } from '../Definition';
import { Icons } from './Icons';
import { i18n } from '../i18n';
import { HookManager } from '@sugarch/bc-mod-hook-manager';

export function HTMLID (id: string): string {
    return `${HTMLIDPrefix}${id}`;
}

export abstract class IGUIScreen {
    Run () {}
    Click () {}
    MouseWheel (event: WheelEvent) {}
    Exit () {
        GUISetting.setScreen(null);
    }
    Unload () {}
}

export function hasFocus (subscreen: IGUIScreen): boolean {
    return GUISetting.instance.Current === subscreen;
}

function drawTooltip () {
    if (DebugMode) {
        MainCanvas.textAlign = 'center';
        if (MouseX > 0 || MouseY > 0) {
            MainCanvas.save();
            MainCanvas.lineWidth = 1;
            MainCanvas.strokeStyle = 'red';
            MainCanvas.beginPath();
            MainCanvas.moveTo(0, MouseY);
            MainCanvas.lineTo(2000, MouseY);
            MainCanvas.moveTo(MouseX, 0);
            MainCanvas.lineTo(MouseX, 1000);
            MainCanvas.stroke();
            MainCanvas.fillStyle = 'black';
            MainCanvas.strokeStyle = 'white';
            MainCanvas.fillRect(0, 950, 250, 50);
            MainCanvas.strokeRect(0, 950, 250, 50);
            DrawText(`X: ${MouseX} Y: ${MouseY}`, 125, 975, 'white');
            MainCanvas.restore();
        }
    }
}

declare global {
    var PreferenceMouseWheel: ((event: WheelEvent) => void) | undefined;
}

export class GUISetting {
    private static _instance: GUISetting | null = null;
    static get instance () {
        return this._instance as GUISetting;
    }

    private _currentScreen: IGUIScreen | null = null;

    private _mainScreenProvider: (() => IGUIScreen) | null = null;

    get Current (): IGUIScreen | null {
        return this._currentScreen;
    }

    private _setScreen (screen: IGUIScreen | null) {
        if (this._currentScreen) {
            this._currentScreen.Unload();
        }

        this._currentScreen = screen;

        if (!this._currentScreen) {
            if (typeof PreferenceSubscreenExtensionsClear === 'function') PreferenceSubscreenExtensionsClear();
            else PreferenceSubscreen = null;
        }
    }

    static setScreen (screen: IGUIScreen | null) {
        this._instance?._setScreen(screen);
    }

    static init (mainProvider: () => IGUIScreen) {
        GUISetting._instance = new GUISetting(mainProvider);
    }

    constructor (func: () => IGUIScreen) {
        this._mainScreenProvider = func;
        this.registerGUI();

        const wheelEvent = (event: WheelEvent) => {
            if (this._currentScreen) {
                this._currentScreen.MouseWheel(event);
                return;
            }
        };

        if (typeof window['PreferenceMouseWheel' as any] !== 'function') {
            (window['PreferenceMouseWheel' as any] as any) = wheelEvent;
        } else {
            HookManager.hookFunction('PreferenceMouseWheel', 1, (args, next) => {
                wheelEvent(args[0]);
                return next(args);
            });
        }
    }

    registerGUI () {
        PreferenceRegisterExtensionSetting({
            Identifier: ModName,
            Image: Icons.responsive_main,
            ButtonText: () => i18n('setting_button_text'),
            load: () => {
                if (this._mainScreenProvider) this._setScreen(this._mainScreenProvider());
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
            exit: () => this._currentScreen?.Exit(),
        });
    }
}
