// 默认是没有的，需要自己手动建
// 加载path模块
const path = require('path');
//定义resolve方法，把相对路径转换成绝对路径
// (1) Node.js 中，__dirname 总是指向被执行 js 文件的绝对路径
// (2) path.join() 用于连接路径。该方法的主要用途在于，会正确使用当前系统的路径分隔符，Unix系统是"/"，Windows系统是"\"
const resolve = dir => path.join(__dirname, dir);

module.exports = {
    configureWebpack: {
        module:{
            rules:[{
                test:/\.mjs$/,
                include: /node_modules/,
                type: "javascript/auto"
            }]
        },
    },
    chainWebpack: config => {
        // 添加别名
        config.resolve.alias // 添加别名
            .set('@', resolve('src'))
            .set('~@', resolve('src'))
            .set('@assets', resolve('src/assets'))
            .set('@components', resolve('src/components'))
            .set('@views', resolve('src/views'))
            .set('@store', resolve('src/store'));
    },
    // 1, 公共路径(必须有的)
    publicPath: "./",
    // 2, 输出文件目录
    outputDir: "dist",
    // 3, 静态资源存放的文件夹(相对于ouputDir)
    assetsDir: "assets",
    // 4, eslint-loader 是否在保存的时候检查(果断不用，这玩意儿我都没装)
    lintOnSave: false,
    // 5, ???
    runtimeCompiler: true,
    productionSourceMap: false, // 不需要生产环境的设置false可以减小dist文件大小，加速构建
    // 6, css相关配置(我暂时没用到)
    css: {
        extract: false, // 是否使用css分离插件 ExtractTextPlugin
        sourceMap: false, //开启 CSS source maps?
        loaderOptions: {}, //css预设器配置项
        modules: false //启用 CSS modules for all css / pre-processor files.
    },
    // 7, webpack-dev-server 相关配置
    devServer: {
        open: true,  // npm run serve后自动打开页面
        host: '0.0.0.0',  // 匹配本机IP地址(默认是0.0.0.0)
        port: 8080, // 开发服务器运行端口号
        proxy: null,
        // 注：目前本项目暂时没有写后台接口，没有跨域问题，暂时不配置proxy
    }
};
