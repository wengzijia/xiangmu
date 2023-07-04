module.exports = {
//   root: true,
//   env: {
//     node: true
//   },
//   extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
//   parserOptions: {
//     parser: 'babel-eslint'
//   },
    parser: "babel-eslint",
    parser: "vue-eslint-parser",
    parserOptions: {
      parser: "babel-eslint",
      sourceType: "module"
    }
//   rules: {
//     "prettier/prettier": "warn",
//     'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//     'no-mixed-spaces-and-tabs': 'warn',
//     'indent': ['error', 2], // 强制使用一致的缩进
//     'use-isnan': 2,//禁止比较时使用NaN，只能用isNaN()
//     // 'quotes': [1, 'single'], //引号类型 `` "" ''
//     'no-unused-vars': 'off',
//     'eqeqeq': "off",
//     'consistent-this': [2, '_this']//this别名
//   }
};
