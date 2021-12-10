/*
 * @Date         : 2021-12-10 14:14:40
 * @LastEditors  : HaoJie
 * @LastEditTime : 2021-12-10 14:26:23
 * @FilePath     : \src\components\init.js
 */
const files = require.context("./", false, /\.vue$/);

const components = files.keys().map((key) => {
  return files(key).default;
});

export default components;
