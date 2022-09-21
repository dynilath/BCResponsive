interface MoanSetting {
    hot: string[];
    medium: string[];
    light: string[];
    low: string[];
    orgasm: string[];
    pain: string[];
    tickle: string[];
}

interface SolidSetting extends MoanSetting {
    settings: { enable: boolean };
}

type PartialSetting = Partial<SolidSetting>;

type ModSetting = { BCMoanerReloaded?: string };

interface Window {
    BCMoanerReloaded_Loaded?: boolean;
    BCMoanerReloaded?: (enable: boolean, source: PartialSetting) => void;
}