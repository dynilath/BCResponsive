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
        (data.personalities[0] as ResponsivePersonality).responses[0].enabled = false;
        (data.personalities[0] as ResponsivePersonality).responses.push({
            name: "test",
            enabled: true,
            trigger: { mode: "orgasm", type: "Orgasmed" },
            messages: [{ type: "action", content: "test" }]
        });
        (data.personalities[0] as ResponsivePersonality).responses.push({
            name: "test",
            enabled: false,
            trigger: {
                mode: "spicer",
                min_arousal: 10,
                max_arousal: 92,
                allow_ids: undefined,
                forbid_ids: [4, 5, 6]
            },
            messages: [{ type: "message", content: "test" }]
        });
        (data.personalities[0] as ResponsivePersonality).responses.push({
            name: "test",
            enabled: false,
            trigger: {
                mode: "activity",
                allow_bodyparts: ["test"],
                allow_activities: ["test"],
                allow_ids: undefined,
                forbid_ids: [4, 5, 6]
            },
            messages: [{ type: "action", content: "test" }]
        });
        let json = JSON.stringify(data);

        let data_picked = pickV2Setting(JSON.parse(json));
        expect(data_picked).toBeDefined();
        expect(data_picked).toEqual(data);
    });
});