/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    globals: {
        TranslationLanguage: "EN",
        __mod_name__: "BCResponsive",
        __mod_version__: "0.0.0",
        __repo__: "",
    },
};
