const path = require('path');

const {
  BabelPlugin,
  CSSResourcePlugin,
  FuseBox,
  EnvPlugin,
  SVGPlugin,
  CSSPlugin,
  JSONPlugin,
  SassPlugin,
  QuantumPlugin,
  WebIndexPlugin,
  Sparky
} = require('fuse-box');

const isProduction = false;

let fuse, app, vendor;

Sparky.task('config', () => {
  fuse = new FuseBox({
    homeDir: './',
  sourceMap: true,
  output: 'dist/$name.js',
  target: 'browser',
  experimentalFeatures: true,
  plugins: [
    BabelPlugin({
      config: {
        sourceMaps: true,
        presets: ["es2015"],
        plugins: [
          ["transform-react-jsx"],
        ],
      },
    }),
      EnvPlugin({ 'process.env.NODE_ENV': isProduction ? 'production' : 'development' }),
      JSONPlugin(),
      SVGPlugin(),
      WebIndexPlugin({
        template: `./index.html`,
        bundles: ['vendor', 'app']
      }),
      isProduction &&
        QuantumPlugin({
        bakeApiIntoBundle : 'vendor',
        treeshake: true,
        uglify: true,
      })
  ],
  });
});

Sparky.task('default', ['clean', 'config'], () => {

  // fuse.register()
  fuse.dev({
    port: 4444,
  })

  fuse
  .bundle('vendor')
  .instructions('~ index.js');

  fuse
  .bundle('app')
  .sourceMaps({inline: false})
  .instructions('> [index.js]')
  .hmr({reload: true})
  .watch('index.js');

  fuse
  .bundle('test')
  .instructions('> [test/test.js]')
  .hmr({reload: true})
  .watch('test/**')

  return fuse.run();
});

Sparky.task('clean', () => Sparky.src('dist/').clean('dist/'));

Sparky.task('prod-env', ['clean'], () => {
  isProduction = true;
});

Sparky.task('dist', ['prod-env', 'config'], () => {
  // comment out to prevent dev server from running (left for the demo)
  // fuse.dev();
  return fuse.run();
});



