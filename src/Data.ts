export class DataManager {
    private static _instance: DataManager | undefined;
    private initFromNoData: boolean = false;

    static init() {
        if (this._instance === undefined)
            this._instance = new DataManager;
    }

    static get instance() {
        this.init();
        return DataManager._instance as DataManager;
    }

    modData: ResponsivePartialSetting = {};
    mergeData: ResponsiveSolidSetting | undefined;

    static DefaultValue: ResponsiveSolidSetting = {
        settings: { enable: true },
        hot: ["n... Nyah♥", "Oooh", "mmmmmh!", "NYyaaA♥"],
        medium: ["mm", "aaaah", "nyAh♥"],
        light: ["nyah♥", "Aah!", "mh", "oh!♥", "mh♥"],
        low: ["", "", "mh", "♥oh♥", "ah", "...♥"],
        orgasm: ["Nya...Ny...NyaaAAaah!", "Mmmmh... MMmh... Hhhmmmm...", "Oooooh... Mmmmh... OooOOOOh!", "Mmmhnn... Nyhmm... Nyah!"],
        pain: ["Aie!", "Aoouch!", "Aaaaie!", "Ouch", "Aow"],
        tickle: ["Hahaha!", "Mmmmhahaha!", "Muhahah...", "Ha!Ha!"],
    };

    private static ValidateStringList(object: any, key: string) {
        if (object === undefined || !Array.isArray(object[key])) return [];
        return (object[key] as any[]).filter(_ => typeof _ === 'string');
    }

    private static ValidatorItem(key: keyof ResponsiveSolidSetting): [keyof ResponsiveSolidSetting, (d: ResponsivePartialSetting) => any] {
        return [key, (d: ResponsivePartialSetting): string[] => DataManager.ValidateStringList(d, key)]
    }

    private static Validator = new Map<keyof ResponsiveSolidSetting, (d: ResponsivePartialSetting) => any>([
        ["settings", (d: ResponsivePartialSetting): ResponsiveSolidSetting['settings'] => {
            if (d.settings === undefined || typeof d.settings.enable !== "boolean") return { enable: true };
            return d.settings;
        }],
        DataManager.ValidatorItem('low'),
        DataManager.ValidatorItem('light'),
        DataManager.ValidatorItem('medium'),
        DataManager.ValidatorItem('hot'),
        DataManager.ValidatorItem('pain'),
        DataManager.ValidatorItem('orgasm'),
        DataManager.ValidatorItem('tickle'),
    ])

    private EncodeDataStr() {
        let data: { [k: string]: any } = {}
        for (const k in this.modData) {
            data[k] = this.modData[k as keyof ResponsiveSolidSetting];
        }
        return LZString.compressToBase64(JSON.stringify(data));
    }

    private DecodeDataStr(str: string | undefined) {
        if (str === undefined) {
            Object.assign(this.modData, DataManager.DefaultValue);
            return;
        }

        let d = LZString.decompressFromBase64(str);
        let data = {};

        try {
            let decoded = JSON.parse(d);
            data = decoded;
        } catch { }

        DataManager.Validator.forEach((v, k) => {
            this.modData[k as keyof ResponsiveSolidSetting] = v(data);
        })
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
        if (this.mergeData !== undefined) {
            this.modData.settings = { enable: this.mergeData.settings.enable };
            if (this.initFromNoData) {
                const rkeys: (keyof ResponsiveSetting)[] = ['low', 'light', 'medium', 'hot', 'orgasm', 'pain', 'tickle'];
                for (const t of rkeys) {
                    this.modData[t] = this.mergeData[t];
                }
                this.initFromNoData = false;
            }
            this.ServerStoreData();
        }
    }

    get data() {
        return this.modData as ResponsiveSolidSetting;
    }

    set data(d: ResponsiveSolidSetting) {
        this.modData = d;
    }

    PushMergeData(data: ResponsiveSolidSetting) {
        this.mergeData = data;
        if (Player && Player.OnlineSettings) this.ServerTakeData();
    }
}
