import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import license from 'rollup-plugin-license';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
    readFileSync(resolve(__dirname, 'package.json'), 'utf8')
);

const NAME = (() => {
    const ucFirst = (input = '') => input.charAt(0).toUpperCase() + input.slice(1);
    return pkg.name.split('-').reduce((acc, item, index) => {
        if (index) {
            return acc + ucFirst(item);
        }
        return item;
    }, '');
})();

const BANNER = [
    '/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %> : https://github.com/nico3333fr/van11y-accessible-hide-show-aria/blob/master/LICENSE',
    ' */',
    ''
].join('\n');

const BABEL_ES5_CONFIG = {
    babelHelpers: 'bundled',
    presets: [
        ['@babel/preset-env', {
            modules: false,
            targets: {
                browsers: ['last 2 versions']
            }
        }]
    ]
};

const input = `src/${pkg.name}.es6.js`;

const baseOutput = {
    format: 'iife',
    name: NAME
};

const licensePlugin = license({ banner: BANNER });

export default [
    // ES6/ES2015 untranspiled bundle
    {
        input,
        output: {
            ...baseOutput,
            file: `dist/${pkg.name}.es6.js`,
            generatedCode: { constBindings: true }
        },
        plugins: [licensePlugin]
    },
    // ES5 transpiled bundle (un-minified)
    {
        input,
        output: {
            ...baseOutput,
            file: `dist/${pkg.name}.js`,
            generatedCode: { constBindings: false }
        },
        plugins: [babel(BABEL_ES5_CONFIG), licensePlugin]
    },
    // ES5 transpiled bundle (minified)
    {
        input,
        output: {
            ...baseOutput,
            file: `dist/${pkg.name}.min.js`,
            generatedCode: { constBindings: false }
        },
        plugins: [babel(BABEL_ES5_CONFIG), terser({ maxWorkers: 1 }), licensePlugin]
    }
];
