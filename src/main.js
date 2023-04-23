import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// S video-play
import VideoPlayer from 'vue-video-player/src'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
// E video-play
// S element-ui
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
// E element-ui

// S 引入电脑图片预览
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
// E 引入电脑图片预览

// S Vant
import { Image as VanImage, ImagePreview,Field, Tabbar, TabbarItem, Tab, Tabs, Popup, Lazyload, Sidebar, SidebarItem, Grid, GridItem, Badge, Switch } from 'vant'
import 'vant/lib/index.css';
// E Vant

const app = createApp(App)

// S Vant组件 按需引入
app.use(ImagePreview);
app.use(Popup);
// E Vant组件 按需引入

// S 引入vue-video-play组件
app.use(VideoPlayer)
// E 引入vue-video-play组件

app.use(VueViewer) // 电脑图片预览组件
// Vant
app.use(Tabbar)
app.use(TabbarItem)
app.use(Tab)
app.use(Tabs)
app.use(Lazyload)
app.use(Sidebar);
app.use(SidebarItem);
app.use(Grid);
app.use(GridItem);
app.use(VanImage);
app.use(Field);
app.use(Popup);
app.use(Badge);
app.use(Switch);
import Vue3TouchEvents from "vue3-touch-events";
app.use(Vue3TouchEvents)
// Element
app.use(ElementPlus)
app.use(router).mount('#app')
