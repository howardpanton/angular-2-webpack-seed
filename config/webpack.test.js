var helpers = require('./helpers');
var path = require('path');

module.exports = {
  devtool: 'inline-source-map',

  verbose: true,

  resolve: {
    extensions: ['', '.ts', '.js', '.scss', '.html'],
    modulesDirectories: ['node_modules', 'src']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        loader: 'html'

      },
      { 
          test: /\.json$/, loader: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'null'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: 'null'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ['raw-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw'
      }
    ],
    postLoaders: [
      { //delays coverage til after tests are run, fixing transpiled source coverage error
        test: /\.(js|ts)$/,
        exclude: /\.(e2e|spec)\.ts$/,
        include: path.resolve('src/app/'),
        loader: 'sourcemap-istanbul-instrumenter?force-sourcemap'
      }
    ]
  }
}
