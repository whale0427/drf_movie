import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MovieDetail from "@/views/MovieDetail.vue"
import Register from "@/views/Register.vue"
import ActivateEmail from "@/views/ActivateEmail.vue"
import Login from "@/views/Login.vue"
import Forget from "@/views/Forget.vue"
import ResetPassword from "@/views/ResetPassword.vue"
import Personal from "@/views/Personal.vue";
import MyCollect from "@/views/MyCollect.vue";
import MemberCenter from "@/views/MemberCenter.vue";
import Orders from "@/views/Orders.vue";
import Order from "@/views/Order.vue";

import {useUserStore} from "@/stores"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/movie/:id',
      name: 'MovieDetail',
      component: MovieDetail,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/forget',
      name: 'Forget',
      component: Forget,
    },
    {
      path: '/personal',
      name: 'Personal',
      component: Personal,
      meta:{
        requiredLogin:true,
      },
    },
    {
      path: '/activate/:uid/:token',
      name: 'ActivateEmail',
      component: ActivateEmail,
      meta:{
        requiredLogin:true,
      },
    },
    {
      path: '/reset_password/:uid/:token',
      name: 'ResetPassword',
      component: ResetPassword,
    },
    {
      path: '/my_collect',
      name: 'MyCollect',
      component: MyCollect,
      meta:{
        requiredLogin:true,
      },
    },
    {
      path: '/member_center',
      name: 'MemberCenter',
      component: MemberCenter,
      meta:{
        requiredLogin:true,
      },
    },
    {
      path: '/order',
      name: 'Order',
      component: Order,
      meta:{
        requiredLogin:true,
      },
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders,
      meta:{
        requiredLogin:true,
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})


//路由导航守卫
router.beforeEach((to,from,next)=>{
    const userStore=useUserStore()
    if(userStore.isLogin&&(to.name==="Login"||to.name==="Register")){
        next({name:"home"})
    }else if(to.matched.some(record=>record.meta.requiredLogin)&&!userStore.isLogin){
        next({name:"Login",query:{jump:to.path}})
    }else{
        next()
    }
    console.log("isLogin:"+userStore.isLogin)
})

export default router
