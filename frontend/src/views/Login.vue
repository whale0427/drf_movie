<script setup>
import axios from "axios"
import {ref} from "vue"
import showMessage, {showMessageOptions} from "@/utils/message.js"
import {useCounterStore,useUserStore} from "@/stores"
import {useRouter,useRoute} from "vue-router"

//const router=useRouter()一定要放在顶层，不能放在函数内部
const router=useRouter()
const route=useRoute()
const username=ref("")
const password=ref("")
const counterStore=useCounterStore()
const userStore=useUserStore()

function login(){
  if(!username.value){
    showMessage("请输入用户名")
    return
  }
  if(!password.value){
    showMessage("请输入密码")
    return
  }
  let url="/api/jwt/create/"
  const datas={
    "username":username.value,
    "password":password.value,
  }
  const jump=route.query.jump || "/"
  axios
      .post(url,datas)
      .then(response=>{
        localStorage.setItem("token",response.data.access)
        localStorage.setItem("refresh",response.data.refresh)
        localStorage.setItem("username",username.value)
        localStorage.setItem("ial",Date.now())
        localStorage.setItem("exp",Date.now()+counterStore.token_exp_count)
        userStore.isLogin=true
        const token=localStorage.getItem("token")
        if(token){
          axios.defaults.headers.common["Authorization"]="JWT "+token
        }else{
          axios.defaults.headers.common["Authorization"]=""
        }
        axios
            .get("/api/users/me/")
            .then(response=>{
              localStorage.setItem("email",response.data.email)
              localStorage.setItem("phone",response.data.profile.phone)
              localStorage.setItem("is_upgrade",response.data.profile.is_upgrade)
              localStorage.setItem("expire_time",response.data.profile.expire_time)
            })
            .catch(error=>{
              if(error.response){
                const errors=Object.values(error.response.data)?.flat()
                for(let i=0;i<errors.length;i++){
                  showMessageOptions(errors[i])
                }
              }else{
                showMessageOptions(error)
              }
            })
        // showMessage("登录成功","success",()=>{window.location.href="/"},1000)
        showMessage("登录成功","success",()=>{
          router.push({
            path:jump,
          })
          // window.location.href="/"
        },1000)
      })
      .catch(error=>{
        if(error.response){
          const errors=Object.values(error.response.data)?.flat()
          for(let i=0;i<errors.length;i++){
            showMessageOptions(errors[i])
          }
        }else{
          showMessageOptions(error)
        }
      })
}
import Swal from "sweetalert2"
function forget(){
  window.forgetSwal=Swal.fire({
    showConfirmButton:false,
    html:`<iframe src="Forget" style="width:100%;height:310px;" frameborder="0"></iframe>`,
    allowOutsideClick:false,
    allowEscapeKey:false,
  })
}
</script>

<template>
  <div class="flex w-full h-full items-center justify-center tracking-wider">
    <div class="flex flex-col shadow-md shadow-[#B64529] bg-white rounded mt-35 w-[320px] h-[310px]">
      <router-link :to="{name:'home'}" class="flex justify-end pr-3 my-2 text-gray-500 text-sm hover:text-shadow-xs hover:font-bold hover:text-shadow-gray-300">首页</router-link>
      <div class="flex font-bold text-2xl mb-10 justify-center">登录</div>
      <form method="post">
        <div class="flex items-center mb-8">
          <input v-model="username" class="absolute border border-gray-400 h-10 w-60 ml-10 pl-10 outline-none rounded focus:shadow-xs focus:shadow-[#B64529]" type="text" placeholder="请输入用户名">
          <svg class="icon relative w-6 h-6 ml-12" t="1766404164709" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2446">
            <path d="M651.296021 545.977859c63.557548-42.814108 105.358583-115.235534 105.358583-197.532889 0-133.333728-110.364597-241.9761-245.813498-241.9761-135.451972 0-244.160859 108.642372-244.160859 240.322437 0 82.297354 41.821501 154.739247 105.35756 197.530842-143.80522 55.979966-244.135276 191.069687-244.135276 350.748433l0 0 68.561515 0 0 0c0-158.026106 122.06815-288.197818 277.581016-306.303174 1.674129 0 43.476187-3.284813 78.595033 0l3.350304 0 0 0C708.17445 610.18009 825.215096 738.574319 825.215096 894.946762l0 0 70.239737 0 0 0C893.779681 736.921679 793.447579 600.303138 651.296021 545.977859L651.296021 545.977859zM510.841106 527.85613c-102.008278 0-183.930079-80.644715-183.930079-181.063799 0-100.419084 81.921801-181.062775 183.930079-181.062775 102.007255 0 183.929056 80.643692 183.929056 181.062775C694.770162 447.211415 612.848361 527.85613 510.841106 527.85613L510.841106 527.85613zM510.841106 527.85613" p-id="2447" fill="#cdcdcd"></path>
          </svg>
        </div>
        <div class="flex items-center mb-8">
          <input v-model="password" class="absolute border border-gray-400 h-10 w-60 ml-10 pl-10 outline-none rounded focus:shadow-xs focus:shadow-[#B64529]" type="password" placeholder="请输入密码">
          <svg class="icon relative w-6 h-6 ml-12" t="1766405507822" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1637">
            <path d="M848 472c8.82 0 16 7.18 16 16v361c0 8.82-7.18 16-16 16H178c-8.82 0-16-7.18-16-16V488c0-8.82 7.18-16 16-16h670m0-64H178c-44.18 0-80 35.82-80 80v361c0 44.18 35.82 80 80 80h670c44.18 0 80-35.82 80-80V488c0-44.18-35.82-80-80-80z" p-id="1638" fill="#cdcdcd"></path>
            <path d="M513 128c50.75 0 98.46 19.76 134.35 55.65S703 267.25 703 318v90H323v-90c0-50.75 19.76-98.46 55.65-134.35S462.25 128 513 128m0-64c-140.28 0-254 113.72-254 254v154h508V318c0-140.28-113.72-254-254-254zM513 573.5c-17.67 0-32 14.33-32 32v126c0 17.67 14.33 32 32 32s32-14.33 32-32v-126c0-17.67-14.33-32-32-32z" p-id="1639" fill="#cdcdcd"></path>
          </svg>
        </div>
        <div class="flex items-center justify-center mb-1">
          <button v-on:click.prevent="login" class="h-10 w-60 bg-[#B64529] rounded text-white transition-all duration-200 hover:shadow-md hover:shadow-gray-400 cursor-pointer">
            登录
          </button>
        </div>
        <div class="flex items-center justify-center text-sm">
          <a v-on:click="forget" class="mr-20 text-blue-700 hover:text-shadow-xs hover:text-shadow-gray-300 cursor-pointer">忘记密码</a>
          <div>没有账号?<router-link :to="{name:'Register'}" class="text-blue-700 hover:text-shadow-xs hover:text-shadow-gray-300">去注册</router-link></div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>
