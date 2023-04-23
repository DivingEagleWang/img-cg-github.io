<template>
<!--  cg 多图片窗口  -->
    <div>
        123
        <div
                v-if="!isPc"
        >
            <img
                    v-for="p in imgList"
                    class="img-style"
                    @click="imgViewOnly(p)"
                    v-lazy="p"
            />
        </div>

        <div>
<!--            <viewer v-if="isPc" :images="imgList.map(item => {return item})" >-->
<!--                <img :src="p"-->
<!--                     class="img-style"-->
<!--                     v-lazy="p"-->
<!--                >-->
<!--            </viewer>-->
        </div>
    </div>
</template>

<script>
    import {ImagePreview} from 'vant';
    export default {
        name: "cgImgDetail",
        data() {
            return {
                isPc: false,
                imgList: []
            }
        },
        created() {
            // console.error('width', document.body.clientWidth)
            // console.error('ip', 'http://' + window.location.host)
            if(document.body.clientWidth > 1200) {
                this.isPc = true
            }
        },
        mounted() {
            this.imgList = this.$route.query.imgList
            console.log(this.imgList)
        },
        methods:{
            // 由于太多图片加载会导致卡顿和其他异常，所以需要控制数量
            imgViewOnly(path, total = 20) {
                let pathList = []
                let find = false
                this.imgList.forEach((item) => {
                    if (path === item.path) {
                        find = true
                    }
                    if(find && total > 0) {
                        pathList.push(item.path)
                        total--
                    }
                })
                ImagePreview({
                    images: pathList,
                    startPosition: 0
                })
            },
        }
    }
</script>

<style scoped>

</style>