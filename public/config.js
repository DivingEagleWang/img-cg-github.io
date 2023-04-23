var setConfigData = (function () {
    window.config = {
        // pathPre: 'http://192.168.1.3:8081',
        pathPre: 'http://' + window.location.host,
        publicPre: '../../public/CG资源图库/',
        filePath: '/数据CG/CG资源图库',
        updateTime: '2023.4.22更新'
    }
    Object.freeze(window.config)
    return true
})()
