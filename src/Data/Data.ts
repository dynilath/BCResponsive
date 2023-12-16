import { DebugMode } from "../Definition";
import { isV1Setting } from "./V1";
import { pickV2Setting } from "./V2";
import { V1SettingToV2Setting } from "./V2";
import { getDefaultSettings } from "./Default";

function DeserializeData(str: string | undefined): ResponsiveSettingV2 {
    if (str === undefined) return getDefaultSettings();

    let d = LZString.decompressFromBase64(str);
    let data = {};

    try {
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

    static init() {
        if (this._instance === undefined)
            this._instance = new DataManager;
        if (DebugMode) {
            (window as any)["ShowResponsiveData"] = () => {
                return this._instance?.modData;
            }
        }
    }

    static get instance() {
        this.init();
        return DataManager._instance as DataManager;
    }

    static load() {
        this.instance.ServerTakeData();
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

    modData: ResponsivePartialSetting = {};

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
        if (Player && Player.OnlineSettings) {
            ((Player.OnlineSettings as any) as ModSetting).BCResponsive = this.EncodeDataStr();
            if (ServerAccountUpdate) {
                ServerAccountUpdate.QueueData({ OnlineSettings: Player.OnlineSettings });
            }
        }
    }

    ServerTakeData() {
        if (Player && Player.OnlineSettings) {
            let rawData = (Player.OnlineSettings as ModSetting).BCResponsive;
            if (rawData === undefined) {
                let oldData = (Player.OnlineSettings as any) as { BCMoanerReloaded?: string };
                rawData = oldData.BCMoanerReloaded;
                if (rawData !== undefined) delete oldData.BCMoanerReloaded;
            }
            this.DecodeDataStr(rawData);
        }
    }

    get data() {
        return this.modData as ResponsiveSettingV2;
    }

    set data(d: ResponsiveSettingV2) {
        this.modData = d;
    }
}

