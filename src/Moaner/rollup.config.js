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
    input: "Moaner.ts",
    output: "Moaner.js",
    loader: "moanerLoader.user.js",
}

const config = {
    input: `${path.relative(".", __dirname)}\\${config_d.input}`.replace(/\\/g, "/"),
    output: {
        file: `public\\${config_d.output}`.replace(/\\/g, "/"),
        format: "iife",
        sourcemap: false,
        banner: ``,
    },
    treeshake: true,
    plugins: [
        copy({
            targets: [
                { src: `${path.relative(".", __dirname)}\\${config_d.loader}`.replace(/\\/g, "/"), dest: "public" }
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