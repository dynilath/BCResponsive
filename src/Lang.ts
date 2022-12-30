export class Localization {
    private static CNTextMap = new Map<string, string>([
        ["responsive_setting_title", "- BC Responsive 设置 -"],
        ["setting_button_popup", "BC Responsive 设置"],
        ["setting_enable", "启用 Responsive"],
        ["setting_title_low", "低性奋"],
        ["setting_title_light", "微弱性奋"],
        ["setting_title_medium", "中等性奋"],
        ["setting_title_hot", "热烈性奋"],
        ["setting_title_orgasm", "高潮"],
        ["setting_title_pain", "痛苦"],
        ["setting_title_tickle", "瘙痒"],
        ["setting_input_invalid", "格式错误"],
    ]);

    private static ENTextMap = new Map<string, string>([
        ["responsive_setting_title", "- BC Responsive Setting -"],
        ["setting_button_popup", "BC Responsive Setting"],
        ["setting_enable", "Enable Responsive"],
        ["setting_title_low", "Low"],
        ["setting_title_light", "Light"],
        ["setting_title_medium", "Medium"],
        ["setting_title_hot", "Hot"],
        ["setting_title_orgasm", "Orgasm"],
        ["setting_title_pain", "Pain"],
        ["setting_title_tickle", "Tickle"],
        ["setting_input_invalid", "Syntax Error"],
    ]);

    static GetText(srcTag: string) {
        if (TranslationLanguage === 'CN') {
            return this.CNTextMap.get(srcTag) || "";
        }
        return this.ENTextMap.get(srcTag) || "";
    }
}