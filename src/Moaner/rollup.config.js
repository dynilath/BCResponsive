import typescript from "@rollup/plugin-typescript";
import progress from "rollup-plugin-progress";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { obfuscator } from 'rollup-obfuscator';
import { babel } from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import copy from 'rollup-plugin-copy';

const config = {
    input: "src/Moaner/Moaner.ts",
    output: {
        file: "public/Moaner.js",
        format: "iife",
        sourcemap: false,
        banner: ``,
    },
    treeshake: true,
    plugins: [
        copy({
            targets: [
                { src: "src/Moaner/moanerLoader.user.js", dest: "public" }
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