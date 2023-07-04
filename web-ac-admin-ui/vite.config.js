import { defineConfig, loadEnv } from "vite";
import path from "path";
import createVitePlugins from "./vite/plugins";

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  const { VITE_APP_ROUTER_BASE_URL, VITE_APP_ASSETS_DIR } = env;
  console.log("VITE_APP_ROUTER_BASE_URL", VITE_APP_ROUTER_BASE_URL);
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: command === "build" ? "/" : VITE_APP_ROUTER_BASE_URL,
    plugins: createVitePlugins(env, command === "build"),
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置别名
        "@": path.resolve(__dirname, "./src"),
        // 设置路径
        "~": path.resolve(__dirname, "./"),
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },
    // vite 相关配置
    server: {
      port: 8870,
      host: true,
      open: false,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        "/dev-api": {
          target: "http://192.168.7.16:8080",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, ""),
        },
        "/api/consumer/prepressFile": {
          target: "http://192.168.1.215:8080",
          changeOrigin: true,
          rewrite: (p) => p.replace("/api/consumer/prepressFile", "/pdf"),
        },
        "/backend-api": {
          // target: 'http://192.168.7.35:8080',
          // target: 'http://192.168.7.35:20000',
          target: 'http://192.168.1.222',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, ""),
        },
        // '/backend-api': {
        //   target: 'http://192.168.1.222:20000',
        //   changeOrigin: true,
        //   rewrite: (p) => p.replace(/^\/dev-api/, '')
        // },
        "/api/consumer": {
          target: "http://192.168.1.222:9001",
          // target: 'http://192.168.6.45:9030',
          // target: 'http://192.168.8.8:9005',
   
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, ""),
        },
        "/ac-inner": {
          // target: 'http://192.168.7.21:8080',
          // target: 'http://192.168.7.51:8080',
          // target: 'http://192.168.8.41:9420',
          target: 'http://192.168.1.209:9040',
          // target: 'http://192.168.1.222',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, ""),
        },
        // '/code': {
        //   target: 'http://192.168.7.21:8080',
        //   // target: 'http://192.168.1.222',
        //   changeOrigin: true,
        //   rewrite: (p) => p.replace(/^\/dev-api/, '')
        // },
      },
    },
    //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/global.scss";'
        }
      }
    },
    build: {
      assetsDir: VITE_APP_ASSETS_DIR,
      chunkSizeWarningLimit: 10000,
      rollupOptions: {
        output: {
          // 分包
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
    },
  };
});
