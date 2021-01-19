// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  // 将 examples 目录添加为新的页面
  pages: {
    index: {
      // page 的入口
      entry: "examples/main.js",
      // 模板来源
      template: "public/index.html",
      // 输出文件名
      filename: "index.html",
    },
  },
  css: {
    loaderOptions: {
      sass: {
        // eslint-disable-next-line global-require
        implementation: require("sass"), // This line must in sass option
      },
    },
  },
  // 打包大小分析
  // chainWebpack: (config) => {
  //   config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
  //     {
  //       analyzerMode: "static",
  //     },
  //   ]);
  // },
  configureWebpack: (config) => {
    const plugins = [
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: false,
            drop_debugger: false,
            drop_console: true,
          },
        },
        sourceMap: false,
        parallel: true,
      }),
    ];
    if (process.env.NODE_ENV !== "development") {
      config.plugins = [...config.plugins, ...plugins];
    }
  },
};
