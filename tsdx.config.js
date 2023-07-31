const multiInput = require('rollup-plugin-multi-input').default;
const addShebang = require('rollup-plugin-add-shebang');

module.exports = {
  rollup(config, options) {
    config.input = [
      'src/index.ts',
      'src/cli.ts',
    ];
    config.output.dir = 'dist';  // 添加这行
    delete config.output.file;   // 删除这行

    // 添加 multi-input 插件
    config.plugins = [
      multiInput(),
      addShebang({ include: 'dist/cli.js' }),  // 添加 shebang 插件
      ...config.plugins,
    ];

    return config;
  },
};