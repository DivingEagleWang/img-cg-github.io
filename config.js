var setConfigData = (function () {
    window.config = {
        // pathPre: '',
        pathPre: 'http://' + window.location.host,
        publicPre: '/数据CG/CG资源图库/',
        filePath: '/数据CG/CG资源图库',
        updateTime: '2023.4.22更新'
    }
    Object.freeze(window.config)
    return true
})()
