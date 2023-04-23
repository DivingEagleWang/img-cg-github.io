import axios from 'axios';

let CGUtils = {}

CGUtils.getImgList = () => {
    return new Promise((resolve, reject) => {
        axios.get(window.config.pathPre + `/数据CG/cg_resource.json?v=${new Date().getTime()}`).then(res => {
            console.log('res=', res)
            if(typeof res.data === "string") {
                res.data = JSON.parse(res.data)
            }
            res.data.forEach(item => {
                item.path = window.config.pathPre + '/数据CG/CG资源图库/' + item.fileName
            })
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}
CGUtils.addPreUrl = (imgList) => {
    let result = []
    imgList.forEach(item => {
        let temp = window.config.pathPre + '/数据CG/CG资源图库/' + item
        result.push(temp)
    })
    return result
}

export default CGUtils
