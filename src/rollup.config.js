import typescript from "@rollup/plugin-typescript";
import progress from "rollup-plugin-progress";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { obfuscator } from 'rollup-obfuscator';
import { babel } from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import copy from 'rollup-plugin-copy';
import path from 'path'


const config_d = {
    folder: "Moaner",
    input: "Moaner.ts",
    output: "main.js",
    loader: "loader.user.js",
}

const relative_dir = path.relative(".", __dirname).replace(/\\/g, "/");

const config = {
    input: `${relative_dir}/${config_d.input}`,
    output: {
        file: `public/${config_d.folder}/${config_d.output}`,
        format: "iife",
        sourcemap: false,
        banner: ``,
    },
    treeshake: true,
    plugins: [
        copy({
            targets: [
                { src: `${relative_dir}/${config_d.loader}`, dest: `public/${config_d.folder}` }
            ]
        }),
        progress({ clearLine: true }),
        resolve({ browser: true }),
        typescript({ tsconfig: "src/tsconfig.json", inlineSources: true }),
        commonjs(),
        babel({ babelHelpers: 'bundled' }),
        cleanup(),
        obfuscator({
            identifierNamesGenerator: 'mangled-shuffled',
            unicodeEscapeSequence: true,
            splitStrings: true,
            splitStringsChunkLength: 5,
        }),
    ],
}

export default config;