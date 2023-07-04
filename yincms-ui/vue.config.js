require('events').EventEmitter.defaultMaxListeners = 0;
module.exports = {
  devServer: {
    port: 8000,
    disableHostCheck: true,
    proxy: {
      '/api/v1/': {
        // 将/api映射到http://192.168.1.222:9001/api上面
        // target: 'http://192.168.2.28:9001', // 接口域名
        // target: 'http://oycx.vaiwan.com/', // 接口域名
        // target: 'http://zy.vaiwan.com/', // 接口域名
        target: 'https://www.aocai.cn/',
        // target: 'http://127.0.0.1:9001/',
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/api/v1/': '/api/v1/' //需要rewrite的,
        }
      },
      '/api/consumer': {
        // 将/api映射到http://192.168.1.222:9001/api上面
        // target: 'https://www.aocai.cn/',
        // target: 'http://192.168.2.5:9003', // 接口域名
        // target: 'http://oycx.vaiwan.com/', // 接口域名
        // target: 'http://zy.vaiwan.com/', // 接口域名
        // target: 'http://192.168.7.16:9001/',
        // target: 'http://192.168.7.19:9001/',
        // target: 'http://192.168.8.8:9005/',
        // target: 'http://192.168.8.8:9001/',
        target: 'http://192.168.1.222:9001/',
        // target: 'http://127.0.0.1:9001/',
        // target: 'https://www.aocai.cn/',
        // target: 'http://192.168.6.45:9030/', // 接口域名
        // target: 'http://192.168.1.222:8000/', // 接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/api': '/api' //需要rewrite的,
        }
      },
      '/ac-inner/order-change': {
        // target: 'http://192.168.8.3:9422/',
        target: 'http://192.168.1.209:9040',
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/api': '/api' //需要rewrite的,
        }
      },
      '/alifile': {
        // 将/api映射到http://192.168.1.222:9001/api上面
        // target: 'https://www.aocai.cn/',
        // target: 'http://192.168.2.5:9003', // 接口域名
        // target: 'http://oycx.vaiwan.com/', // 接口域名
        // target: 'http://zy.vaiwan.com/', // 接口域名
        // target: 'http://192.168.7.16:9001/',
        // target: 'http://192.168.7.19:9001/',
        // target: 'http://192.168.7.41:9001/',
        target: 'http://alifile.xiaocaiyin.com/',
        // target: 'http://127.0.0.1:9001/',
        // target: 'https://www.aocai.cn/',
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/alifile': '/alifile' //需要rewrite的,
        }
      },
      '/ac-inner': {
        // target: 'http://192.168.7.21:8080',
        // target: 'http://192.168.7.51:8080',
        // target: 'http://192.168.8.41:8080',
        target: 'http://192.168.1.209:9040',
        // target: 'http://192.168.1.222',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/dev-api/, '')
      },
      '/knife/': {
        //将/api映射到http://192.168.1.222:9001/api上面
        //target: 'http://zy.vaiwan.com', // 接口域名
        target: 'http://test.xiaocaiyin.com', // 接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/knife': '/knife' //需要rewrite的,
        }
      },
      '/integrate/': {
        target: 'http://test.xiaocaiyin.com', // 接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/integrate': '/scm/integrate' //需要rewrite的,
        }
      },
      '/uploads/': {
        target: 'http://192.168.1.222:8000', // 接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/uploads': '/uploads' //需要rewrite的,
        }
      },
      '/previewpdf/pdf/': {
        //将/api映射到http://192.168.1.222:9001/api上面
        //target: 'http://zy.vaiwan.com', // 接口域名
        target: 'http://pf.xiaocaiyin.com:10002', // 接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/previewpdf/': '/' //需要rewrite的,
        }
      },
      '/file/': {
        //将/api映射到http://192.168.1.222:9001/api上面
        //target: 'http://zy.vaiwan.com', // 接口域名
        target: 'http://pf.xiaocaiyin.com:10002/', // 接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/file': '/file' //需要rewrite的,
        }
      },
      '/pf/': {
        //将/api映射到http://192.168.1.222:9001/api上面
        //target: 'http://zy.vaiwan.com', // 接口域名
        //target: 'http://www.gdb.com/', // 接口域名
        target: 'http://pf.xiaocaiyin.com:10002/', // 接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/pf': '/api' //需要rewrite的,
        }
      },
      '/preflightcover/': {
        //将/api映射到http://192.168.1.222:9001/api上面
        //target: 'http://zy.vaiwan.com', // 接口域名
        //target: 'http://www.gdb.com/', // 接口域名
        target: 'http://pf.xiaocaiyin.com:10002/', // 接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/preflightcover': '/preflightcover' //需要rewrite的,
        }
      },
      '/api/lt/': {
        target: 'https://www.liaotu.com/', // 接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/': '/' //需要rewrite的,
        }
      },
      '/api/reported/system/': {
        target: 'http://192.168.1.215:8080/', // 接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/api/reported/system/': '/system/' //需要rewrite的,
        }
      }

    }
  },
  chainWebpack: config => { },
  configureWebpack: {
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          reactBase: {
            name: 'braceBase',
            test: module => {
              return /brace/.test(module.context);
            },
            chunks: 'initial',
            priority: 10
          },
          common: {
            name: 'vendor',
            chunks: 'initial',
            priority: 2,
            minChunks: 2
          }
        }
      }
    }
  },
  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: [],
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  // 生产环境是否生成 sourceMap 文件
  // 生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)
  integrity: false,
  // css相关配置
  css: {
    // 是否分离css（插件ExtractTextPlugin）Default：生产环境下是 true，开发环境下是 false；开发环境模式下是默认不开启的，因为它和 CSS 热重载不兼容。
    // extract: true, //
    // 是否开启 CSS source maps
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 是否启用 CSS modules for all css / pre-processor files.
    // modules: false//已被弃用，改为requireModuleExtension,这个选项requireModuleExtension含义与相反
    requireModuleExtension: true
  }
};
