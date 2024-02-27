const typescript = require("@rollup/plugin-typescript");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const replace = require('@rollup/plugin-replace');
const cleanup = require("rollup-plugin-cleanup");
const copy = require('rollup-plugin-copy');
const terser = require("@rollup/plugin-terser");
const path = require('path');
const package = require('../package.json');

const deployFileName = "main.js";

const buildSettings = {
    deployDir: package.buildSettings.deployDir,
    input: package.buildSettings.input,
    scriptId: package.buildSettings.scriptId,
}

const loaderFileInfo = {
    deploy: `${buildSettings.deployDir}/${deployFileName}`,
    description: `${package.description}`,
    name: `${package.displayName} (Loader)`,
    author: `${package.author}`,
}

const modInfo = {
    name: `"${package.displayName}"`,
    version: `"${package.version}"`,
    repo: (() => {
        if (!package.repository || !package.repository.url) return "undefined";
        if (package.repository.url.startsWith("git+")) return `"${package.repository.url.replace("git+", "").replace(".git", "")}"`;
        return `"${package.repository.url.replace(".git", "")}"`;
    })(),
}

const scriptId = `"${buildSettings.scriptId ?? ""}"`;

const loadFlag = `${package.displayName.replace(/ /g, "")}_Loaded`;

const destDir = `${process.env.INIT_CWD}/public/${buildSettings.deployDir}`;

const relativeDir = path.relative(".", __dirname).replace(/\\/g, "/");

const default_config = debug => ({
    input: `${relativeDir}/${buildSettings.input}`,
    output: {
        file: `${destDir}/${deployFileName}`,
        format: "iife",
        sourcemap: debug ? "inline" : true,
        banner: ``,
    },
    treeshake: true,
})

const plugins_debug = deploySite => [
    copy({
        targets: [
            {
                src: `${relativeDir}/loader.user.js`,
                dest: destDir,
                transform: (contents, filename) =>
                    contents.toString().replace("__DEPLOY_SITE__", `${deploySite}/${loaderFileInfo.deploy}`)
                        .replace("__DESCRIPTION__", loaderFileInfo.description)
                        .replace("__NAME__", loaderFileInfo.name)
                        .replace("__AUTHOR__", loaderFileInfo.author)
                        .replace("__LOAD_FLAG__", loadFlag)
                        .replace("__SCRIPT_ID__", scriptId)
            }, {
                src: `${relativeDir}/assets/*`,
                dest: `${destDir}/assets`
            }
        ]
    }),
    replace({
        __mod_name__: modInfo.name,
        __mod_version__: modInfo.version,
        __repo__: modInfo.repo,
        __load_flag__: loadFlag,
        __script_id__: scriptId,
        preventAssignment: false
    }),
    typescript({ exclude: ["**/__tests__", "**/*.test.ts"], tsconfig: `${relativeDir}/tsconfig.json` }),
    commonjs(),
    resolve({ browser: true }),
    cleanup(),
]

const plugins = deploySite => [
    ...plugins_debug(deploySite),
    terser({sourceMap: true})
]

module.exports = cliArgs => {
    const debug = !!cliArgs.configDebug;
    const deploy = cliArgs.configDeploy;
    if (!deploy) throw new Error("No deploy site specified");
    console.log(`${debug ? "dev" : "release"} is set deployed to ${deploy}`);
    if (debug) return { ...default_config(debug), plugins: plugins_debug(deploy) }
    return { ...default_config(debug), plugins: plugins(deploy) }
};