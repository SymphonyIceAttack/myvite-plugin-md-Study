// rollup.config.js
import babel from "rollup-plugin-babel"
import pluginNodeResolve from "@rollup/plugin-node-resolve"
import pluginCommonjs from "@rollup/plugin-commonjs"
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
import { defineConfig } from 'rollup';

export default defineConfig({
    input: './src/index.ts',//入口文件
    external: ['lodash'], //告诉rollup不要将此lodash打包，而作为外部依赖
    global: {},
    output: [
        {
            file: './dist/index.js',
            format: 'cjs',
            sourcemap: true,
            name: "BundleName"
        },
        {
            file: './dist/index.mjs.js',
            format: 'esm',
            sourcemap: true,
            name: "BundleName"
        },
        {
            file: './dist/index.umd.js',
            format: 'umd',
            sourcemap: true,
            name: "BundleName"
        }

    ],
    plugins: [
        typescript(),
        pluginCommonjs(),
        pluginNodeResolve(),
        babel({
            exclude: 'node_modules/**'
        }),
        postcss(),
        terser(),
        serve({
            open: true,
            contentBase: 'dist'
        })
    ]
})