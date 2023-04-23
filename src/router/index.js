import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/home',
        name: 'Home',
        component: () => import('../views/cgPage')
    },
    {
        path: '/cgImgList',
        name: 'cgImgList',
        component: () => import('../views/cgImgDetail')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
// 全局路由守卫
router.beforeEach((to, from) => {
    // ...
    // 返回 false 以取消导航
    console.log('to', to);
    console.log('from', from);
    return true
})

export default router
