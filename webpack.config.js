const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const plugins = [
	new webpack.optimize.UglifyJsPlugin(),
	new webpack.ProvidePlugin({
		THREE: 'three',
	}),
	new HtmlWebpackPlugin({ template: 'src/index.html' }),
];
module.exports = {
	entry: './src/main.js',
	devtool: 'eval-source-map',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{ test: /\.css$/, use: ['style-loader', 'css-loader'] },
			{ test: /\.otf$/, use: ['file-loader'] },
			{ test: /\.(obj|mtl)$/, use: ['file-loader'] },
			{ test: /\.(jpg|png|svg)$/, use: ['file-loader'] },
		],
	},
	plugins,
	devServer: {
		host: '0.0.0.0',
		contentBase: path.join(__dirname, 'dist'),
		open: true,
	},
};
