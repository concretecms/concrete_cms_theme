/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

let mix = require('laravel-mix');

mix.webpackConfig({
    resolve: {
        symlinks: false
    },
    externals: {
        jquery: 'jQuery',
        bootstrap: true,
        vue: 'Vue',
        moment: 'moment'
    },
    module: {
        rules: [
            { test: /\.html$/, loader: "underscore-template-loader" },
            {
                test: /\.jsx?$/,
                exclude: /(bower_components|node_modules\/v-calendar)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: Config.babel()
                    }
                ]
            },
        ]
    }
});

mix.setResourceRoot('../');
mix.setPublicPath('../themes/concrete_cms/');
mix.copy('node_modules/bootstrap/js/dist/util.js', '../themes/concrete_cms/js/bootstrap4/util.js');
mix.copy('node_modules/bootstrap/js/dist/alert.js', '../themes/concrete_cms/js/bootstrap4/alert.js');

mix
    .sass('assets/themes/concrete_cms/scss/main.scss', '../themes/concrete_cms/css')
    .js('assets/themes/concrete_cms/js/main.js', '../themes/concrete_cms/js');
