import { DataKeyName, DebugMode, ModInfo } from '../Definition';
import { isV1Setting } from './V1';
import { pickV2Setting } from './V2';
import { V1SettingToV2Setting } from './V2';
import { getDefaultSettings } from './Default';
import { HookManager } from '@sugarch/bc-mod-hook-manager';

function DeserializeData (str: string | undefined): ResponsiveSettingV2 {
    if (str === undefined) return getDefaultSettings();

    let d = LZString.decompressFromBase64(str);
    let data = {};

    try {
        if (!d) throw new Error();
        let decoded = JSON.parse(d);
        data = decoded;
    } catch {}

    return pickV2Setting(data);
}

export class DataManager {
    private static _instance: DataManager | undefined;
    static init () {
        if (this._instance === undefined) this._instance = new DataManager();

        if (DebugMode) {
            (window as any)['ShowResponsiveData'] = () => {
                return DataManager.instance.modData;
            };
        }

        HookManager.afterPlayerLogin(() => {
            DataManager.instance.ServerTakeData(Player);
            console.log(`${ModInfo.name} v${ModInfo.version} ready.`);
        });
    }

    static get instance () {
        return DataManager._instance as DataManager;
    }

    static save () {
        this.instance.ServerStoreData();
    }

    static get active_personality () {
        const data = this.instance.data;
        if (typeof data.active_personality !== "number" || !data.personalities) return undefined;
        return data.personalities[data.active_personality];
    }

    static set active_personality (newValue: ResponsivePersonality | undefined) {
        this.instance.data.active_personality = newValue?.index ?? null;
    }

    modData: Partial<ResponsiveSolidSetting> = {};

    private EncodeDataStr (): string {
        return LZString.compressToBase64(JSON.stringify(this.modData));
    }

    private DecodeDataStr (str: string | undefined) {
        if (str === undefined) {
            Object.assign(this.modData, getDefaultSettings());
            return;
        }

        Object.assign(this.modData, DeserializeData(str));
    }

    ServerStoreData () {
        if (Player && Player.ExtensionSettings) {
            Player.ExtensionSettings[DataKeyName] = this.EncodeDataStr();
            ServerPlayerExtensionSettingsSync(DataKeyName);
        }
    }

    ServerTakeData (C: Pick<PlayerCharacter, 'OnlineSettings' | 'ExtensionSettings'>) {
        const raw_data = C.ExtensionSettings[DataKeyName] || (C.OnlineSettings as any)[DataKeyName];
        this.DecodeDataStr(raw_data);
    }

    get data () {
        return this.modData as ResponsiveSettingV2;
    }

    set data (d: ResponsiveSettingV2) {
        this.modData = d;
    }
}
