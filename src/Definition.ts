function buildVersion(v1: number, v2: number, v3: number) {
    return `${v1}.${v2}.${v3}`;
}

export enum MoanType {
    Orgasm,
    Pain,
    Tickle
}

export const ModVersion = buildVersion(1, 0, 1);
export const ModName = 'BondageClub Responsive'
export const HTMLIDPrefix = "BCR_";

export const DebugMode = false;

export const SettingName = "BCResponsiveSetting";

export const CUSTOM_ACTION_TAG = "BCR_CustomAction";

export const Styles = {
    Active: "#CCC",
    Hover: "#80FFFF",
    strokeWidth: 2,
    Screen: {
        center_x: 1000,
        center_y: 500,
    },
    Dialog: {
        roundRadius: 15,
        padding: 35,
        control_button_width: 200,
        control_button_height: 50,
    },
    Text: {
        Base: "Black",
        Lesser: "#808080",
        padding: 5
    },
    Button: {
        text: "Black",
        hover: "rgba(128, 255, 255, 1)",
        idle: "rgba(255, 255, 255, 1)",
        disabled: "rgba(128, 128, 128, 1)",
    },
    Input: {
        height: 60,
    },
    Chips: {
        active: "rgba(128, 255, 255, 1)",
        hover: "rgba(204, 204, 204, 0.5)",
        border: 5,
    },
    SegmentButton: {
        active: "rgba(160, 255, 255, 1)",
        hover: "rgba(204, 204, 204, 0.5)",
        border: 5,
    },
    Tab: {
        active: "rgba(160, 255, 255, 1)",
        hover: "rgba(204, 204, 204, 0.5)",
        border: 5,
    },
    Switch: {
        on: "#80FFFF",
        off: "#9A9A9A"
    }
}

export const DefaultPersonaName = "Default";
export const DefaultPersonaIndex = 0;
export const MaxPersonalities = 5;

export const MaxNameLength = 20;

export const Repository = "https://github.com/dynilath/BCResponsive"

export const DataKeyName = "BCResponsiveData";