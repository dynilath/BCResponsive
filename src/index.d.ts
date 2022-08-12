interface SolidSetting {
    hot: string[];
    medium: string[];
    light: string[];
    low: string[];
    orgasm: string[];
    pain: string[];
    tickle: string[];
}

type MoanSetting = Partial<SolidSetting>;

enum MoanType {
    Orgasm,
    Pain,
    Tickle
}

interface Window {
    BCMoanerReloaded_Loaded?: boolean;
    BCMoanerReloaded?: (enable: boolean, source: MoanSetting) => void;
}