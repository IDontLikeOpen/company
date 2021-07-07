const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const __root = path.resolve(__dirname, '../');

module.exports = {
	entry: {
		index: ['@babel/polyfill', './src/scripts/index.js'],
	},
	output: {
		path: path.resolve(__root, 'dist'),
		filename: 'scripts/[name].[chunkhash].js',
		chunkFilename: 'scripts/[name].[chunkhash].js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-syntax-dynamic-import']
					}
				},
				exclude: /node_modules/
			},
			{
				test: /\.(glsl|frag|vert)$/,
				use: ['glslify-import-loader', 'raw-loader', 'glslify-loader']
			},
			{
				test: /three\/examples\/js/,
				use: 'imports-loader?THREE=three'
			},
			/*
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: 'file-loader'
			},
			{
				test: /\.(jpe?g|png|gif)$/i,
				use: 'file-loader'
			}
			*/
		]
	},
	resolve: {
		alias: {
			'three-examples': path.join(__root, './node_modules/three/examples/js'),
		}
	},
	plugins: [
		new CleanWebpackPlugin(
			['dist'],
			{ root: __root },
		),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__root, 'static'),
			}
		]),
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		new HtmlWebpackPlugin({
			filename: 'aboutus.html',
			template: './src/aboutus.html',
		}),
		new HtmlWebpackPlugin({
			filename: 'services.html',
			template: './src/services.html',
		}),
		new HtmlWebpackPlugin({
			filename: 'design.html',
			template: './src/design.html',
		}),
		new HtmlWebpackPlugin({
			filename: 'development.html',
			template: './src/development.html',
		}),
		new HtmlWebpackPlugin({
			filename: 'landing.html',
			template: './src/landing.html',
		}),
		new HtmlWebpackPlugin({
			filename: 'ecomerce.html',
			template: './src/ecomerce.html',
		}),
		new HtmlWebpackPlugin({
			filename: 'business.html',
			template: './src/business.html',
		}),
		new HtmlWebpackPlugin({
			filename: 'marketing.html',
			template: './src/marketing.html',
		}),
		new HtmlWebpackPlugin({
			filename: 'industries.html',
			template: './src/industries.html',
		}),
		new HtmlWebpackPlugin({
			filename: 'portfolio.html',
			template: './src/portfolio.html',
		}),
		new HtmlWebpackPlugin({
			filename: 'careers.html',
			template: './src/careers.html',
		}),
		new HtmlWebpackPlugin({
			filename: 'contact.html',
			template: './src/contact.html',
		}),
		new webpack.ProvidePlugin({
			'THREE': 'three'
		})
	]
};
