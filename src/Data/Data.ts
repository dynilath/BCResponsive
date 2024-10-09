import { DataKeyName, DebugMode, ModName, ModVersion } from "../Definition";
import { isV1Setting } from "./V1";
import { pickV2Setting } from "./V2";
import { V1SettingToV2Setting } from "./V2";
import { getDefaultSettings } from "./Default";
import { ModSDKModAPI } from "bondage-club-mod-sdk";

function DeserializeData(str: string | undefined): ResponsiveSettingV2 {
    if (str === undefined) return getDefaultSettings();

    let d = LZString.decompressFromBase64(str);
    let data = {};

    try {
        if (!d) throw new Error();
        let decoded = JSON.parse(d);
        data = decoded;
    } catch { }

    if (isV1Setting(data)) {
        return V1SettingToV2Setting(data);
    }

    return pickV2Setting(data);
}

export class DataManager {
    private static _instance: DataManager | undefined;
    static init(mod: ModSDKModAPI) {
        if (this._instance === undefined)
            this._instance = new DataManager;

        function LoadAndMessage(C: Pick<PlayerCharacter, 'OnlineSettings' | 'ExtensionSettings'> | null | undefined) {
            if (C) DataManager.instance.ServerTakeData(C);
            console.log(`${ModName} v${ModVersion} ready.`);
        }

        if (DebugMode) {
            (window as any)["ShowResponsiveData"] = () => {
                return DataManager.instance.modData;
            }
        }

        mod.hookFunction('LoginResponse', 0, (args, next) => {
            next(args);
            if (!Player || !Player.ExtensionSettings) return;
            LoadAndMessage(Player as Pick<PlayerCharacter, 'OnlineSettings' | 'ExtensionSettings'>);
        });

        if (Player && Player.ExtensionSettings) {
            LoadAndMessage(Player);
        }
    }

    static get instance() {
        return DataManager._instance as DataManager;
    }

    static save() {
        this.instance.ServerStoreData();
    }

    static get active_personality() {
        const data = this.instance.data;
        if (data.active_personality === null) return undefined;
        return data.personalities[data.active_personality];
    }

    static set active_personality(newValue: ResponsivePersonality | undefined) {
        this.instance.data.active_personality = newValue?.index ?? null;
    }

    modData: Partial<ResponsiveSolidSetting> = {};

    private EncodeDataStr(): string {
        return LZString.compressToBase64(JSON.stringify(this.modData));
    }

    private DecodeDataStr(str: string | undefined) {
        if (str === undefined) {
            Object.assign(this.modData, getDefaultSettings());
            return;
        }

        Object.assign(this.modData, DeserializeData(str));
    }

    ServerStoreData() {
        if (Player && Player.ExtensionSettings) {
            Player.ExtensionSettings[DataKeyName] = this.EncodeDataStr();
            ServerPlayerExtensionSettingsSync(DataKeyName);
        }
    }

    ServerTakeData(C: Pick<PlayerCharacter, 'OnlineSettings' | 'ExtensionSettings'>) {
        const raw_data = C.ExtensionSettings[DataKeyName]
            || (C.OnlineSettings as any)[DataKeyName]
        this.DecodeDataStr(raw_data);
    }

    get data() {
        return this.modData as ResponsiveSettingV2;
    }

    set data(d: ResponsiveSettingV2) {
        this.modData = d;
    }
}

