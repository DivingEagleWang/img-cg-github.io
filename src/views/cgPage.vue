<template>
    <div class="outFrame" v-loading="!switchGetConfigFile">
        <el-divider>
            <span class="topTitle">CG小汪整理</span>
        </el-divider>
        <div class="search-style mb10">
            <span class="fs20" style="width:80px;">搜索：</span>
            <el-input size="mini" v-model="keyWords" @change="searchModel"></el-input>
        </div>
        <!--  S 类别  -->
        <div class="type-style mb10">
            <el-divider content-position="left"><span>类别</span></el-divider>
            <div class="display-flex">
                <div v-for="(item, index) in typeList" :key="item" class="mr10 mb10">
                    <el-tag @click="typeClick(item, index)" style="cursor: pointer"
                            :effect="index === typeIndex ? 'dark' : 'plain'">
                        <span>{{ item }}</span>
                    </el-tag>
                </div>
            </div>

        </div>
        <!--  E 类别  -->
        <!--  S 标签  -->
        <div class="tag-style mb10">
            <el-divider content-position="left"><span>标签</span></el-divider>
            <div class="display-flex" style="max-height: 300px; overflow-y: scroll">
                <div v-for="(item, index) in btnObjList" :key="index">
                    <el-tag @click="tagClick(item.title, index)" style="cursor: pointer;" class="mb10 mr10"
                            v-show="typeIndex === 0 || index === 0 || (filterSelect.currentType === item.type)"
                            :effect="(filterSelect.tags.indexOf(item.title) !== -1) ? 'dark' : 'plain'">
                        <span>{{ item.title }}</span>
                    </el-tag>
                </div>
            </div>
        </div>
        <!--  E 标签  -->
        <!--  S order  -->
        <div class="order-style">
            <el-button size="mini" @click="orderList">乱序</el-button>
        </div>
        <!--  E order  -->
        <!--  S 图片列表  -->
        <div class="img-list-wrapper">
            <template v-for="(p2, index) in imgList" :key="index">
                <div style="background-color: #E9E9EB; margin:2px 5px 2px 5px; position: relative">
                    <div style="position: absolute; left: 5px;font-size: 12px; overflow: hidden;">
                        <span v-if="p2.type[0] === '道具'" style="background-color: green; color: white;">{{p2.type[0] }}</span>
                        <span v-else-if="p2.type[0] === '材质实例'" style="background-color: orangered; color: white">{{ p2.type[0] }}</span>
                        <span v-else style="background-color: orangered; color: white">{{ p2.type[0] }}</span>
                    </div>
                    <div class="imgContainerTitle">{{ p2.title }}</div>
                    <span class="imgContainerPack">{{ p2.pack }}</span>
                    <!-- 图片下方的tags -->
                    <div class="img-bottom-tags">
                        <el-tag size="mini" v-for="tagName in p2.tag">{{ tagName }}</el-tag>
                    </div>
                    <!-- S pc还是手机端 -->
                    <div>
                        <img v-if="!isPc" class="img-style" @click="imgViewOnly(p2.path)" v-lazy="p2.path"/>
                        <viewer v-if="isPc" :images="imgList.map(item => {return item.path})">
                            <img :src="p2.path" class="img-style" v-lazy="p2.path">
                        </viewer>
                    </div>
                    <!-- 图片下方有视频就显示视频 -->
                    <el-button size="mini" type="danger" style="position: absolute; bottom: 70px; left:5px;"
                               @click="popupVideo(p2.videoPath)" v-if="p2.videoPath !== ''">视频
                    </el-button>
                    <!-- 图片下方多图片就显示多图片 -->
                    <el-button v-show="p2.imgList.length > 0" type="primary" size="small"
                               style="position: absolute; bottom: 70px; right:5px;"
                               @click="OpenManyImg(p2.imgList)">
                        多图
                    </el-button>
                    <!-- E pc还是手机端 -->
                </div>
            </template>
        </div>
        <!--  E 图片列表  -->
        <div v-if="imgList.length === 0">无图片</div>
    </div>
    <el-divider>
        <span class="topTitle">{{ updateTime }}</span>
    </el-divider>
    <!-- S 弹框：视频播放器 -->
    <van-popup v-model:show="popupVisible" style="background-color: transparent" v-if="popupVisible">
        <video-play-comp v-if="isPc" ref="videoRef" style="width: 90vw;" :path="current.path" :isLoop="true"
                         :isCol="false"></video-play-comp>
        <video-play-comp v-else ref="videoRef" style="width: 80vw;" :path="current.path" :isLoop="true"
                         :isCol="false"></video-play-comp>
    </van-popup>
    <!-- E 弹框：视频播放器 -->
    <!-- S 弹框：多图预览 -->
    <van-popup v-model:show="showManyImg" closeable position="bottom" round :style="{ padding: '10px' }">
        <div style="height: 70vh; overflow-y:scroll;">
            <viewer :images="ManyImgList">
                <img :src="img" v-for="img in ManyImgList" :key="img" style="width: 150px; border-radius: 10px;margin:5px;">
            </viewer>
        </div>
    </van-popup>
    <!-- E 弹框：多图预览 -->
</template>

<script>


import CGUtils from '../service/getConfig'
import videoPlayComp from "../components/videoPlayComp";
import {showImagePreview} from "vant";
import wlArrayUtils from "@/utils/wlArrayUtils";

export default {
    name: "five",
    components: {
        videoPlayComp
    },
    data() {
        return {
            showManyImg: false, // 多图弹框
            ManyImgList: [],
            switchGetConfigFile: false, // 配置文件是否加载成功
            isPc: false,
            popupVisible: false,
            keyWords: '',
            current: {
                path: ''
            }, // 当前视频
            filterSelect: { // 筛选器筛选
                currentType: '全部',
                tags: '全部'
            },
            allTag: [],
            typeList: [], // 类别集合['静态网格体', 'CC3', 'daz']
            typeIndex: 0,
            btnList: [], // 标签按钮集合 ['风景', '海边']
            btnObjList: [], // 标签按钮集合 [{title: '风景', total: 1, selectd: false}, ...]
            tagConfig: {},
            backUpAllImg: [],
            imgList: [], // 当前显示列表
            pathList: [], // 字符串数组，只存放路径
            updateTime: '' // 记录软件更新时间
        }
    },
    created() {
        // console.error('width', document.body.clientWidth)
        // console.error('ip', 'http://' + window.location.host)
        if (document.body.clientWidth > 1200) {
            this.isPc = true
        }
        this.updateTime = window.config.updateTime
    },
    mounted() {
        this.$nextTick(() => {
                this.init()
            }
        )
    },
    methods: {
        async init() {
            let list = await CGUtils.getImgList()
            this.switchGetConfigFile = true
            this.backUpAllImg = JSON.parse(JSON.stringify(list))
            this.imgList = JSON.parse(JSON.stringify(list))
            // 标签
            let types = []
            let tags = []
            list.forEach(item => {
                tags.push(...item.tag)
                types.push(...item.type)
            })
            this.btnList = [...new Set(tags)]
            this.btnList.unshift('全部')
            this.typeList = ['全部', ...new Set(types)]
            this.btnObjList = this.getObj(list, this.btnList)
            this.allTag = JSON.parse(JSON.stringify(this.btnObjList))
        },
        // 多图片的可以弹出来展示
        OpenManyImg(imgList) {
            this.ManyImgList = CGUtils.addPreUrl(imgList); // 默认只有名称，需要添加url前缀
            this.showManyImg = !this.showManyImg
        },
        // 弹出视频播放框
        popupVideo(path) {
            // console.log('进入视频播放', path)
            this.current.path = window.config.pathPre + '/数据CG/CG资源图库/' + path;
            this.popupVisible = true
        },
        async searchModel() {
            if (this.keyWords === '') return
            // 筛选全部还原
            await this.tagClick('全部')
            let list = JSON.parse(JSON.stringify(this.backUpAllImg))
            let result = []
            list.forEach(item => {
                if (item.title.indexOf(this.keyWords.trim()) !== -1) {
                    result.push(item)
                }
            })
            this.imgList = result
        },
        // 图片筛选 》 type
        typeClick(typeName, index) {
            this.tagClick('全部', 0); // 先将标签设置为全部,防止异常
            this.keyWords = '';
            this.typeIndex = index
            this.filterSelect.currentType = typeName
            this.filterAll()
        },
        // 图片筛选 》 tag
        async tagClick(tag, tagIndex) {
            // 1,点击的是全部
            if (tag === '全部') {
                this.filterSelect.tags = '全部'
            } else { // 2,点击的是其他
                // 2.1 点击了其他，首先将全部给取消掉
                if (!Array.isArray(this.filterSelect.tags)) this.filterSelect.tags = []
                // 2.2 点击了其他，btn遍历，按钮状态变化（选中或取消）
                this.btnObjList.forEach((item, index) => {
                    if (index === tagIndex - 1) {
                        // 按钮点击之后，变成未选中状态
                        item.selected = !item.selected
                        // 选中就从数组中加入，false就从数组中去掉
                        if (item.selected) { //
                            this.filterSelect.tags.push(tag)
                        } else {
                            let index = this.filterSelect.tags.indexOf(tag)
                            if (index !== -1) {
                                this.filterSelect.tags.splice(index, 1)
                            }
                        }
                    }
                })
            }
            // 全部按钮都取消时要自动选中全部
            if (Array.isArray(this.filterSelect.tags) && this.filterSelect.tags.length === 0) {
                this.filterSelect.tags = '全部'
            }
            this.filterAll()
        },
        // 获取所有图片，然后按照type，tag进行筛选，最后得到的数据赋予给列表
        filterAll() {
            let res = JSON.parse(JSON.stringify(this.backUpAllImg))
            // 过滤1：类别过滤
            let result1 = []
            if (this.filterSelect.currentType === '全部') {
                result1 = res
            } else {
                res.forEach(item => {
                    if (this.filterSelect.currentType === item.type[0]) {
                        result1.push(item)
                    }
                })
            }
            // console.log('过滤1=', result1)
            // 过滤2：标签过滤
            let result2 = []
            if (this.filterSelect.tags === '全部') {
                result2 = result1
            } else {
                // 剩余视频遍历，视频所含标签有一个在所选中标签里就可以了。
                result1.forEach(item => {
                    for (let i = 0; i < item.tag.length; i++) {
                        if (this.filterSelect.tags.indexOf(item.tag[i]) !== -1) {
                            result2.push(item)
                            break
                        }
                    }
                })
            }
            // console.log('过滤2=', result2)
            this.imgList = result2;
        },
        // 由于太多图片加载会导致卡顿和其他异常，所以需要控制数量
        imgViewOnly(path, total = 20) {
            let pathList = []
            let find = false
            this.imgList.forEach((item) => {
                if (path === item.path) {
                    find = true
                }
                if (find && total > 0) {
                    pathList.push(item.path)
                    total--
                }
            })
            showImagePreview({images: pathList, startPosition: 0})
        },
        // 当前显示列表乱序
        orderList(){
            wlArrayUtils.randomContent(this.imgList);
        },
        // 将tag组装成obj，具有total与selected字段
        getObj(list, tags) {
            let result = []
            let map = new Map()
            tags.forEach(tag => {
                map.set(tag, {title: tag, total: 0, selected: false})
            })
            list.forEach(item => {
                item.tag.forEach(tag => {
                    let b = map.get(tag)
                    b.total++
                    b.type = item.type[0]
                    map.set(tag, b)
                })
            })
            // map转数组
            map.forEach(item => {
                result.push(item)
            })
            result[0].total = list.length
            return result
        },
        twoArray(arr1, arr2) { // 字符串数组，两个数组的交集(同时属于a，b)
            if (!(Array.isArray(arr1) && Array.isArray(arr2))) {
                console.error(`判断交集错误，不是数组`)
                return false
            }
            for (let i = 0; i < arr1.length; i++) {
                if (arr2.indexOf(arr1[i]) !== -1) {
                    return true
                }
            }
            return false
        }
    }
}
</script>

<style lang="scss" scoped>
.outFrame {
    padding: 8px;
    overflow-x: hidden;
    // 图片列表图片框大小 手机端
    @media screen and (max-width: 700px) {
        .img-style {
            background-color: gainsboro;
            /*width:3, height:4*/
            width: 43vw;
            height: 43vw;
            border-radius: 5px;
            overflow: hidden;
        }
    }
    // 图片列表图片框大小 PC端
    @media screen and (min-width: 700px) {
        margin-left:100px;
        margin-right:100px;
        .img-style {
            background-color: gainsboro;
            /*width:3, height:4*/
            width: 16.8vw;
            height: 16.8vw;;
            overflow: hidden;
            border-radius: 5px;
        }
    }
    .search-style {
        display: flex;
        flex-wrap: nowrap;
        border-radius: 10px;
        padding: 10px;
        background-color: white;
    }

    .type-style {
        padding: 10px;
        background-color: white;
        border-radius: 10px;
    }

    .order-style{
        padding: 10px;
        background-color: white;
        border-radius: 10px;
        margin-bottom: 5px;
    }

    .tag-style {
        padding: 10px;
        border-radius: 10px;
        background-color: white;
    }

    .imgContainerTitle {
        position: absolute;
        right: 5px;
        color: white;
        font-size: 12px;
        overflow: hidden;
        background-color: lightcoral;
        padding: 3px;
        opacity: 0.7;
    }

    .imgContainerPack {
        position: absolute;
        bottom: 25px;
        border-radius: 3px;
        font-size: 12px;
        transform: scale(.7);
        background-color: white;
        padding: 5px;
        opacity: 0.5;
    }


    .topTitle {
        color: #2074D4;
        font-size: 18px;
        font-weight: bold;
    }

    .flex-style {
        display: flex;
        flex-wrap: nowrap;
    }

    .fs20 {
        font-size: 20px;
    }

    .mt10 {
        margin-top: 10px;
    }

    .mr10 {
        margin-right: 10px;
    }

    .mb10 {
        margin-bottom: 10px;
    }

    // 图片列表
    .img-list-wrapper {
        display: flex;
        flex-wrap: wrap;
        border-radius: 10px;
        padding: 5px;
        background-color: white;

        .img-bottom-tags {
            position: absolute;
            color: white;
            font-size: 12px;
            overflow: hidden;
            bottom: 5px;
            right: 5px;
            opacity: 0.8;
            transform: scale(.8);
        }
    }

    .display-flex {
        display: flex;
        flex-wrap: wrap;
    }

    /*/deep/.van-popup{*/
    /*    width: 100vw;*/
    /*    height: 100vh;*/
    /*}*/
}

</style>
