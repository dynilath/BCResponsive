const typescript = require("@rollup/plugin-typescript");
const progress = require("rollup-plugin-progress");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const cleanup = require("rollup-plugin-cleanup");
const copy = require('rollup-plugin-copy');
const path = require('path');

const config_d = {
    folder: "Responsive",
    input: "Responsive.ts",
    output: "main.js",
    loader: "loader.user.js",
}

const relative_dir = path.relative(".", __dirname).replace(/\\/g, "/");

const default_config = {
    input: `${relative_dir}/${config_d.input}`,
    output: {
        file: `public/${config_d.folder}/${config_d.output}`,
        format: "iife",
        sourcemap: false,
        banner: ``,
    },
    treeshake: true,
}

const plugins = deploy => [
    copy({
        targets: [
            { 
                src: `${relative_dir}/${config_d.loader}`, 
                dest: `public/${config_d.folder}`,
                transform: (contents, filename) =>
                    contents.toString().replace("__DEPLOY_SITE__", `${deploy}/${config_d.folder}/${config_d.output}` )
            }
        ]
    }),
    progress({ clearLine: true }),
    resolve({ browser: true }),
    typescript({ exclude: ["**/__tests__", "**/*.test.ts"], tsconfig: `${relative_dir}/tsconfig.json`, inlineSources: true }),
    commonjs(),
    cleanup({ sourcemap: false })
]

module.exports = cliArgs => {
    return {...default_config, plugins: plugins(cliArgs.configDeploy)}
};