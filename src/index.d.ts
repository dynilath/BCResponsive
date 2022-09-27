interface MoanSetting {
    hot: string[];
    medium: string[];
    light: string[];
    low: string[];
    orgasm: string[];
    pain: string[];
    tickle: string[];
}

interface MoanerSolidSetting extends MoanSetting {
    settings: { enable: boolean };
}

type MoanerPartialSetting = Partial<MoanerSolidSetting>;

type ModSetting = { BCMoanerReloaded?: string };

interface Window {
    BCMoanerReloaded_Loaded?: boolean;
    BCMoanerReloaded?: (enable: boolean, source: MoanerPartialSetting) => void;
}