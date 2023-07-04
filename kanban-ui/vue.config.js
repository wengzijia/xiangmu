'use strict'

const path = require('path')
// const merge = require('webpack-merge')
// const tsImportPluginFactory = require('ts-import-plugin')


function resolve(dir) {
  return path.join(__dirname, dir)
}

let timeStamp = new Date().getTime();
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath:process.env.VUE_APP_PUBLIC_PATH,
  outputDir: process.env.outputDir,
  assetsDir: process.env.VUE_APP_ROUTER_BASE_URL,
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true,
  lintOnSave: process.env.NODE_ENV === 'development',

  // https://github.com/youzan/vant/issues/5735
  parallel: process.env.NODE_ENV === 'development',
  devServer: {
    port:8033,
    // open:true,
    overlay: {
      warnings: false,
      errors: true
    },

    proxy: {
      '/api/consumer': {
        target: 'http://192.168.6.23:9030',
        //  target: 'http://192.168.6.45:8030',
        // target: 'http://192.168.1.222:8030',
        // target: 'http://192.168.7.36:9020',
        pathRewrite: {
          '^/api/consumer': '/api/consumer'
        },
        secure: false,
        changeOrigin: true
      },
      '/pushAll/':{
        target: 'http://192.168.7.10:9020',
        pathRewrite: {
          '^/pushAll': '/pushAll'
        },
      },
      '/publicServer/':{
        target: 'http://192.168.7.10:9020',
        pathRewrite: {
          '^/publicServer': '/publicServer'
        },
      },
      '/api/bw/':{
        // target: 'http://192.168.7.10:9020',
        target: 'http://192.168.1.222:8030',
        pathRewrite: {
          '^/api/bw/': '/api/bw/'
        },
      },
      // '/lossPicUrl/':{
      //   target: 'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/',
      //   pathRewrite: {
      //     '^/lossPicUrl/': '/'
      //   },
      // },
      // '/uploadPic/':{
      //   target: 'http://xiaocaiyin.oss-cn-shenzhen.aliyuncs.com/',
      //   pathRewrite: {
      //     '^uploadPic/': '/'
      //   },
      // },

    },
    disableHostCheck : true//禁用host检查，使内外穿透可访问
  },
  configureWebpack: {
    devtool: 'source-map',
    name: '机长看板',
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },

  chainWebpack(config) {
    config.plugin("html").tap((args) => {
      args[0].title = "机长看板";
      return args;
    });
    // set ts-loader
    // config.module
    //   .rule('ts')
    //   .use('ts-loader')
    //   .tap(options => {
    //     options = merge(options, {
    //       transpileOnly: true,
    //       getCustomTransformers: () => ({
    //         before: [
    //           // tsImportPluginFactory({
    //           //   libraryName: 'vant',
    //           //   libraryDirectory: 'es',
    //           //   style: true
    //           // })
    //         ]
    //       }),
    //       compilerOptions: {
    //         module: 'es2015'
    //       }
    //     })
    //     return options
    //   })

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },

  // filenameHashing: false, // 打包的时候不使用hash值.因为我们有时间戳来确定项目的唯一性了.
  // configureWebpack: {    //重点
  //     output: { // 输出重构 打包编译后的js文件名称,添加时间戳.
  //         filename: `js/js[name].${timeStamp}.js`,
  //         chunkFilename: `js/chunk.[id].${timeStamp}.js`,
  //     }
  // },
  // css: { //重点.
  //     extract: { // 打包后css文件名称添加时间戳
  //         filename: `css/[name].${timeStamp}.css`,
  //         chunkFilename: `css/chunk.[id].${timeStamp}.css`,
  //     }
  // }

}
