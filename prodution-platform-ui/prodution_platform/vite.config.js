import { dirname, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Inspect from "vite-plugin-inspect";
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: ["vue"],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: "Icon",
        }),
      ],
    }),
    Components({
      resolvers: [
        IconsResolver({
          enabledCollections: ["ep"],
        }),
        ElementPlusResolver(),
      ],
    }),
    Icons({ compiler: "vue3", autoInstall: true }),
    Inspect(),
    createSvgIconsPlugin({
      //  指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svgs/')],
      // 指定symbolId格式
      symbolId: 'icon-[name]',
    }),
  ],
  server: {
    // port: 8040,
    // open: true, //自动打开
    // base: "./ ",
    // cors: true,

    // disableHostCheck: true ,
    // https: false,
    // host:'192.168.6.37', 
    host: "",
    proxy: {
      "/request": {

        target: "http://192.168.1.212:30808",//测试环境

        // target: "http://mes.aocai.cn",//测试环境
        // target: "http://192.168.8.19:9000",//刘劲强地址
        
        // target: "http://192.168.8.4:9000",//振宇地址
        // target: "http://192.168.8.7:9000",//王佳地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/request/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 两种方式都可以
        // additionalData: '@import "@/assets/scss/global.scss";',
        // additionalData: '@use "@/assets/main.scss" as *;',
      },
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 将pinia的全局库实例打包进vendor，避免和页面一起打包造成资源重复引入
          if (
            id.includes(
              resolve(
                dirname(fileURLToPath(import.meta.url)),
                "/src/store/index.js"
              )
            )
          ) {
            return "vendor";
          }
        },
      },
    },
  },

});
