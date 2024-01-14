import { getDefaultSettings } from "./Default";
import { pickV2Setting } from "./V2";

describe("getDefaultSettings", () => {
    let data = getDefaultSettings();

    it("should return a default settings object", () => {
        expect(data).toBeDefined();
        expect(data.settings).toBeDefined();
        expect(data.active_personality).toBeDefined();
        expect(data.personalities).toBeDefined();
    });

    it("should pass PickV2Settings", () => {
        let data = getDefaultSettings();
        expect(data.personalities[0]).toBeDefined();
        (data.personalities[0] as ResponsivePersonality).name = "test";
        let json = JSON.stringify(data);

        let data_picked = pickV2Setting(JSON.parse(json));
        expect(data_picked).toBeDefined();
        expect(data_picked).toEqual(data);
    });
});