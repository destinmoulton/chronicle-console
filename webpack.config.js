var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        chronicleconsole: "./src/index.ts"
    },
    output: {
        path: path.join(__dirname, "dist/"),
        filename: "[name].js"
    },
    devtool: "source-map",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ]
    }
};
