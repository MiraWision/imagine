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
  core: './src/core/index.ts',
};

const sharedConfig = {
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
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
