const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');
const license = require('rollup-plugin-license');
const replace = require('rollup-plugin-replace');

const pkg = require('./package.json');
const CONFIG = {
    IS_ES5: process.env.IS_ES5 === 'true',
    IS_MINIFY: process.env.IS_MINIFY === 'true'
};

CONFIG.NAME = (() => {
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
    presets: [
        ['@babel/preset-env', {
            'modules': false,
            'targets': {
                'browsers': [ 'last 2 versions' ]
            }
        }]
    ]
};

const getFileName = () => {
    let scope = '';
    !CONFIG.IS_ES5 && (scope = 'es6');
    CONFIG.IS_MINIFY && (scope = 'min');
    return [pkg.name, scope, 'js'].filter(Boolean).join('.');
}

const getPlugins = (isMin = false, es5 = true) => {
  const list = CONFIG.IS_ES5 ? [ babel(BABEL_ES5_CONFIG) ] : [];
  CONFIG.IS_MINIFY && list.push(terser());
  list.push(license({ banner: BANNER }));
  return list;
};

const getConfig = () => ({
    fileName: getFileName(),
    preferConst: !CONFIG.IS_ES5,
    plugins: getPlugins()
});

const { fileName, preferConst, plugins } = getConfig();

export default {
  input: `src/${pkg.name}.es6.js`,
  output: {
    file: `dist/${fileName}`,
    format: "iife",
    name: CONFIG.NAME,
    preferConst
  },
  plugins,
};
