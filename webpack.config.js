const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs')

function generateHtmlPlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map(item => {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      inject: false,
    })
  })
}

const htmlPlugins = generateHtmlPlugins('./src/html/views')

module.exports = {
  entry: {
    'js/index.min.js': './src/js/index.js' 
    ,'js/world.min.js': './src/js/world.js' 
    ,'js/diagram.min.js': './src/js/diagram.js' 
    ,'js/addImageInPage.min.js': './src/js/addImageInPage.js' 
    ,'js/flagCircleInMap.min.js': './src/js/flagCircleInMap.js' 
    ,'js/addComboBoxFromJson.min.js': './src/js/addComboBoxFromJson.js' 
    ,'js/addCountries.min.js': './src/js/addCountries.js' 
    ,'js/addSlider.min.js': './src/js/addSlider.js' 
    ,'css/style.css': './src/scss/style.scss'
    ,'css/diagram.css': './src/scss/diagram.scss'
    ,'css/world.css': './src/scss/world.scss'
  }
  ,
  output: {
    //filename: path.resolve(__dirname, './public/assets/[name]')
    filename: './[name]'
  },
  devtool: "source-map",
  module: {
    rules: [{
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: 'es2015-ie'
          }
        }
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src/scss'),
        use: ExtractTextPlugin.extract({
          use: [
              {
              loader: "css-loader",
              options: {
                sourceMap: true,
                minimize: true,
                url: false
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/html/includes'),
        use: ['raw-loader']
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './[name]',
      allChunks: true,
    }),
    // new ExtractTextPlugin({
    //   filename: './css/world.css',
    //   allChunks: true,
    // }),
    // new ExtractTextPlugin({
    //   filename: './css/diagram.css',
    //   allChunks: true,
    // }),        
    new CopyWebpackPlugin([{
      from: './src/fonts',
      to: './fonts'
    },
    {
      from: './src/favicon',
      to: './favicon'
    },
    {
      from: './src/img',
      to: './img'
    },
    {
      from: './src/uploads',
      to: './uploads'
    },
    {
      from: './src/data',
      to: './data'
    },
    {
      from: './src/css',
      to: './css'
    },
    {
      from: './src/video',
      to: './video'
    }
  ]),
  ].concat(htmlPlugins)
};