import axios from 'axios';
import cg_resource from '/public/cg_resource.json'
let CGUtils = {}

CGUtils.getImgList = () => {
    return new Promise((resolve, reject) => {
        let list = cg_resource
        list.forEach(item => {
            item.path = '/数据CG/CG资源图库/' + item.fileName
        })
        resolve(list)
    })
}
CGUtils.addPreUrl = (imgList) => {
    let result = []
    imgList.forEach(item => {
        let temp = window.config.pathPre + '/public/数据CG/CG资源图库/' + item
        result.push(temp)
    })
    return result
}

export default CGUtils
