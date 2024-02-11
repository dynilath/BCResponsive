const typescript = require("@rollup/plugin-typescript");
const progress = require("rollup-plugin-progress");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const cleanup = require("rollup-plugin-cleanup");
const copy = require('rollup-plugin-copy');
const path = require('path');
const terser = require("@rollup/plugin-terser");

const config_d = {
    folder: "Responsive",
    input: "Responsive.ts",
    output: "main.js",
    loader: "loader.user.js",
}

const relative_dir = path.relative(".", __dirname).replace(/\\/g, "/");

const config_default = {
    input: `${relative_dir}/${config_d.input}`,
    output: {
        file: `public/${config_d.folder}/${config_d.output}`,
        format: "iife",
        sourcemap: false,
        banner: ``,
    },
    treeshake: true,
}

const plugins_debug = deploy => [
    copy({
        targets: [
            {
                src: `${relative_dir}/${config_d.loader}`,
                dest: `public/${config_d.folder}`,
                transform: (contents, filename) =>
                    contents.toString().replace("__DEPLOY_SITE__", `${deploy}/${config_d.folder}/${config_d.output}`)
            }
        ]
    }),
    progress({ clearLine: true }),
    resolve({ browser: true }),
    typescript({ exclude: ["**/__tests__", "**/*.test.ts"], tsconfig: `${relative_dir}/tsconfig.json`, inlineSources: true }),
    commonjs(),
    cleanup({ sourcemap: false })
]

const plugins = deploy => [...plugins_debug(deploy), terser()]

module.exports = cliArgs => {
    const deploy = cliArgs.configDeploy;
    const debug = !!cliArgs.configDebug;
    if (!deploy) throw new Error("No deploy site specified");
    console.log(`${debug ? "dev" : "release"} is set deployed to ${deploy}`);
    if (debug) return { ...config_default, plugins: plugins_debug(deploy) };
    return { ...config_default, plugins: plugins(deploy) };
};