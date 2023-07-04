/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-prettier",
    ...'./.eslintrc-auto-import.json',
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  // overrides: [
  //   {
  //     files: ["src/views/**/*.vue"], // 匹配views和二级目录中的index.vue
  //     rules: {
  //       "vue/multi-word-component-names": "off",
  //     }, //给上面匹配的文件指定规则
  //   },
  // ],
  rules: {
    //关闭组件命名规则
    "vue/multi-word-component-names": "off",
  },
};
