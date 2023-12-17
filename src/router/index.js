import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let OriginPush = VueRouter.prototype.push;
let OriginReplace = VueRouter.prototype.replace;
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        OriginPush.call(this, location, resolve, reject);
    }
    else {
        OriginPush.call(this, location, () => { }, () => { });
    }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        OriginReplace.call(this, location, resolve, reject);
    }
    else {
        OriginReplace.call(this, location, () => { }, () => { });
    }
}

const routes = [
    {
        path: '/',
        name: 'Main',
        component: () => import('@/views/Main.vue'),
        redirect: '/FirstStep',
        children: [
            {
                path: '/FirstStep',
                name: 'FirstStep',
                meta: {
                    title: '第一步'
                },
                component: () => import('@/views/FirstStep')
            },
            {
                path: '/SecondStep',
                name: 'SecondStep',
                meta: {
                    title: '第二步'
                },
                component: () => import('@/views/SecondStep')
            },
            {
                path: '/ThirdStep',
                name: 'ThirdStep',
                meta: {
                    title: '第三步'
                },
                component: () => import('@/views/ThirdStep')
            },
            {
                path: '/FourthStep',
                name: 'FourthStep',
                meta: {
                    title: '第四步'
                },
                component: () => import('@/views/FourthStep')
            },
            {
                path: '/FifthStep',
                name: 'FifthStep',
                meta: {
                    title: '第五步'
                },
                component: () => import('@/views/FifthStep')
            }
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    routes
})

export default router