const path = require('path');
const webpack = require('webpack');

// Define all entry points
const entryPoints = {
  index: './src/index.ts',
  number: './src/number/index.ts',
  boolean: './src/boolean/index.ts',
  id: './src/id/index.ts',
  string: './src/string/index.ts',
  util: './src/util/index.ts',
  images: './src/images/index.ts',
  person: './src/person/index.ts',
  location: './src/location/index.ts',
  date: './src/date/index.ts',
  internet: './src/internet/index.ts',
  color: './src/color/index.ts',
  game: './src/game/index.ts',
};

const sharedConfig = {
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      // Handle .js extensions in imports to resolve to .ts files
      // Root level imports
      './core/seed.js': path.resolve(__dirname, 'src/core/seed.ts'),
      './core/prng.js': path.resolve(__dirname, 'src/core/prng.ts'),
      './core/utils.js': path.resolve(__dirname, 'src/core/utils.ts'),
      './number/index.js': path.resolve(__dirname, 'src/number/index.ts'),
      './boolean/index.js': path.resolve(__dirname, 'src/boolean/index.ts'),
      './id/index.js': path.resolve(__dirname, 'src/id/index.ts'),
      './string/index.js': path.resolve(__dirname, 'src/string/index.ts'),
      './util/index.js': path.resolve(__dirname, 'src/util/index.ts'),
      './images/index.js': path.resolve(__dirname, 'src/images/index.ts'),
      './person/index.js': path.resolve(__dirname, 'src/person/index.ts'),
      './location/index.js': path.resolve(__dirname, 'src/location/index.ts'),
      './date/index.js': path.resolve(__dirname, 'src/date/index.ts'),
      './internet/index.js': path.resolve(__dirname, 'src/internet/index.ts'),
      './color/index.js': path.resolve(__dirname, 'src/color/index.ts'),
      './game/index.js': path.resolve(__dirname, 'src/game/index.ts'),
      './svg.js': path.resolve(__dirname, 'src/images/svg.ts'),
      // Relative imports from subdirectories
      '../core/seed.js': path.resolve(__dirname, 'src/core/seed.ts'),
      '../core/prng.js': path.resolve(__dirname, 'src/core/prng.ts'),
      '../core/utils.js': path.resolve(__dirname, 'src/core/utils.ts'),
      '../number/index.js': path.resolve(__dirname, 'src/number/index.ts'),
      '../boolean/index.js': path.resolve(__dirname, 'src/boolean/index.ts'),
      '../id/index.js': path.resolve(__dirname, 'src/id/index.ts'),
      '../string/index.js': path.resolve(__dirname, 'src/string/index.ts'),
      '../util/index.js': path.resolve(__dirname, 'src/util/index.ts'),
      '../images/index.js': path.resolve(__dirname, 'src/images/index.ts'),
      '../person/index.js': path.resolve(__dirname, 'src/person/index.ts'),
      '../location/index.js': path.resolve(__dirname, 'src/location/index.ts'),
      '../date/index.js': path.resolve(__dirname, 'src/date/index.ts'),
      '../internet/index.js': path.resolve(__dirname, 'src/internet/index.ts'),
      '../color/index.js': path.resolve(__dirname, 'src/color/index.ts'),
      '../game/index.js': path.resolve(__dirname, 'src/game/index.ts'),
      '../images/svg.js': path.resolve(__dirname, 'src/images/svg.ts'),
      // Core directory relative imports
      './prng.js': path.resolve(__dirname, 'src/core/prng.ts'),
      './utils.js': path.resolve(__dirname, 'src/core/utils.ts'),
      './seed.js': path.resolve(__dirname, 'src/core/seed.ts'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'self': 'typeof self !== "undefined" ? self : this',
    }),
  ],
};

// Generate CJS configs for all entry points
const cjsConfigs = Object.entries(entryPoints).map(([name, entry]) => ({
  ...sharedConfig,
  entry,
  output: {
    filename: `${name === 'index' ? 'index' : name}/index.js`,
    path: path.resolve(__dirname, 'dist/cjs'),
    library: {
      name: name === 'index' ? 'Imagine' : `Imagine_${name.charAt(0).toUpperCase() + name.slice(1)}`,
      type: 'commonjs2',
    },
    globalObject: 'this',
  },
  externals: {
    '@mirawision/infopedia': {
      commonjs: '@mirawision/infopedia',
      commonjs2: '@mirawision/infopedia',
      amd: '@mirawision/infopedia',
      root: 'Infopedia',
    },
  },
}));

// Generate ESM configs for all entry points
const esmConfigs = Object.entries(entryPoints).map(([name, entry]) => ({
  ...sharedConfig,
  entry,
  output: {
    filename: `${name === 'index' ? 'index' : name}/index.js`,
    path: path.resolve(__dirname, 'dist/esm'),
    library: {
      type: 'module',
    },
    globalObject: 'this',
  },
  experiments: {
    outputModule: true,
  },
  externals: {
    '@mirawision/infopedia': '@mirawision/infopedia',
  },
}));

module.exports = [...cjsConfigs, ...esmConfigs];
