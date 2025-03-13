import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import css from 'rollup-plugin-css-only';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/index.js',
            format: 'umd', // Universal Module Definition (works in browsers and Node.js)
            name: 'TimePicker', // Global variable name for browser usage
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm', // ES Module format for modern bundlers
        }
    ],
    plugins: [
        resolve(), // Resolves node_modules dependencies (if any)
        commonjs(), // Converts CommonJS modules to ES6
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
        }),
        css({ output: 'time-picker.css' }),
    ],
};