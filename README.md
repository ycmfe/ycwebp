# ycwebp
洋葱学院Png/Jpg转WebP格式化工具
# Installation
```
npm install ycwebp
```
# 支持情况
* Mac
* Linux
# Usage
```
const ycwebp = require('ycwebp');
 
webp({
    path, // 图片路径请参考glob的格式
    fileOption, // glob对应的图片配置，默认为空
    compressOption // cwebp的配置
    processNumber: 100 //配置单词处理的进程数,默认为100
}).then(() => {
    cb();
})
```
## 参数说明
`compressOption` 支持JSON传入,所有的默认值请参考 `cwebp`，`-o` 不需要写，Examples:
```
webp({
    path: '*/*.png',
    compressOption: {
        q: 75,
    }
})
```
[cwebp文档](https://developers.google.com/speed/webp/docs/cwebp)
[简书cwebp基本说明](https://www.jianshu.com/p/61ab330a6de6)