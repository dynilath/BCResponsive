interface ResponsiveSetting {
    hot: string[];
    medium: string[];
    light: string[];
    low: string[];
    orgasm: string[];
    pain: string[];
    tickle: string[];
}

interface ResponsiveSolidSetting extends ResponsiveSetting {
    settings: { enable: boolean };
}

type ResponsivePartialSetting = Partial<ResponsiveSolidSetting>;

type ModSetting = { BCResponsive?: string };

interface Window {
    BCResponsive_Loaded?: boolean;
}