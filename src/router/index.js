import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/devManage',
                    component: resolve => require(['../components/page/devManage/index.vue'], resolve),
                    meta: { title: '开发管理' }
                },
                {
                    path: '/testManage',
                    component: resolve => require(['../components/page/testManage/index.vue'], resolve),
                    meta: { title: '测试管理' }
                },
                {
                    path: '/workOvertime',
                    component: resolve => require(['../components/page/workOvertime/index.vue'], resolve),
                    meta: { title: '加班管理' }
                },
                {
                    // 富文本编辑器组件
                    path: '/vacation',
                    component: resolve => require(['../components/page/vacation/index.vue'], resolve),
                    meta: { title: '休假管理' }
                },
                {
                    // markdown组件
                    path: '/weekly',
                    component: resolve => require(['../components/page/weekly/index.vue'], resolve),
                    meta: { title: '周报' }    
                },
                {
                    // 图片上传组件
                    path: '/notebook',
                    component: resolve => require(['../components/page/notebook/index.vue'], resolve),
                    meta: { title: '工作簿' }   
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../components/page/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../components/page/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
