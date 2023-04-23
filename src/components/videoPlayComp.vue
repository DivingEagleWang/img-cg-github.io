<template>
    <!--  视频播放组件  -->
    <div class="playArea">
        <video-player
                ref="videoPlayer"
                :options='playerOptions'
                @pause="onPlayerPause($event)"
                @play="onPlayerPlay($event)"
                @ended="onPlayerEnded($event)"
                @ready="playerIsReady">
        </video-player>
        <div class="overPlayDiv" @click="onPlayerClick"></div>
    </div>
</template>

<script>
    import 'videojs-flash'
    import 'videojs-hotkeys'
    export default {
        name: 'videoPlayComp',
        props: {
            path: {
                type: String,
                default: () => {
                    return ''
                }
            },
            cover: {
                type: String,
                default: () => {
                    return ''
                }
            },
            isCol:{
                type: Boolean,
                default: () => {
                    return false
                }
            },
            isLoop:{
                type: Boolean,
                default: () => {
                    return false
                }
            }
        },
        data () {
            return {
                clickStatus: 0,
                playerOptions: {
                    playbackRates: [0.1, 0.2, 0.3, 0.5, 0.7, 1.0, 1.5, 2.0], // 播放速度
                    autoplay: true, // 如果true,浏览器准备好时开始回放。
                    controls: true, // 控制条
                    preload: 'auto', // 视频预加载
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: !!this.isLoop, // 导致视频一结束就重新开始。
                    language: 'zh-CN',
                    aspectRatio: this.isCol ? '9:16' : '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如'16:9'或'4:3'）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [{
                        type: 'video/mp4',
                        src: ''
                    }],
                    poster: '', // 你的封面地址
                    width: document.documentElement.clientWidth,
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    controlBar: {
                        timeDivider: true, // 当前时间与持续时间的分隔符
                        durationDisplay: true, // 显示持续时间
                        remainingTimeDisplay: false, // 是否显示剩余时间
                        fullscreenToggle: true // 全屏按钮
                    }
                }
            }
        },
        computed: {
            player() {
                return this.$refs.videoPlayer.player;
            },
        },
        mounted () {
            setTimeout(() => {
                console.log('videoPath:', this.path)
                let path = this.path
                let backImg = this.cover
                // this.$message.info(path, backImg)
                this.playSourceExchange(path, backImg)
            }, 0)
        },
        methods: {
            onPlayerPause() {
                this.isPlay = false;
            },
            onPlayerPlay() {
                this.isPlay = true;
            },
            onPlayerClick() {
                if (this.isPlay) {
                    this.player.pause();
                } else {
                    this.player.play();
                }            },
            // 视频的快进快退
            playerIsReady (player) {
                player.hotkeys({
                    volumeStep: 0.1,
                    seekStep: 5,
                    enableModifiersForNumbers: false,
                    fullscreenKey: function (event) {
                        // override fullscreen to trigger when pressing the F key or Ctrl+Enter
                        return ((event.which === 70) || (event.ctrlKey && event.which === 13))
                    }
                })
            },
            // 播放视频源切换
            playSourceExchange (path, backImg) {
                // let allPath = 'http://47.94.6.131:8081/videos/happyVideos/' + path // 自行切换
                // 听说video.js只支持mp4,ogg,webm
                // flv-application/octet-stream
                // .substr(-3)
                // console.log('视频源切换',path, backImg)
                // if(path.substr(-3) === 'flv') {
                //     this.playerOptions.sources[0].type = 'video/x-flv';
                //     console.log('添加flv 视频类型')
                // }
                // if(path.substr(-3) === 'mp4') {
                //     this.playerOptions.sources[0].type = 'video/mp4';
                //     console.log('添加mp4 视频类型')
                // }
                this.playerOptions.sources[0].src = path; // 因为是数组，所以第一个对象是sources[0]
                this.playerOptions.poster = backImg
            },
            onPlayerEnded() {
                // console.log('播放结束自动触发事件', e)
                this.$emit('next')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .playArea {
        position: relative;
        width: 70vw;
        /deep/ .video-js .vjs-big-play-button{
            opacity: 0; /* 透明度直接改为0，暂停后 不想看到 播放按钮 */
        }
        /deep/ #vjs_video_3 {
            border-radius: 8px;
            /* 重写原来按钮样式 */
            .vjs-big-play-button {

                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%);
                background-size: cover;
                border: none;
                width: 32px;
                height: 32px;
            }
            .vjs-poster {
                border-radius: 8px;
            }
        }
        /deep/.vjs-big-play-button .vjs-icon-placeholder:before {
            display: none !important;
        }
        .overPlayDiv {
            /*核心，用这层覆盖源视频播放层，由于是透明的视频可见，但是可以弄点击事件。*/
            width: 100%;
            height: 95%; /* 底部播放按钮层不能遮住 */
            opacity: 1;
            /*background-color: #cce7f8;*/
            position: absolute;
            top: 0;
            left: 0;
            z-index: 99999;
        }
    }

</style>
