import path from "path";

import Externals from "webpack-node-externals";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import NodemonPlugin from "nodemon-webpack-plugin"

export default {
    entry: "./src/index.ts",
    target: "node",
    node: {
        __dirname: false,
        __filename: false,
    },
    externals: [Externals()],
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    mode: "development",
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        plugins: [new TsconfigPathsPlugin()],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    plugins: [
        new NodemonPlugin(),
    ],
}