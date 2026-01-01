<script setup>
import {ref} from "vue"
import showMessage from "@/utils/message.js"
import axios from "axios"
import {useRouter} from "vue-router";

const router=useRouter()
const username=ref("")
const email=ref("")
const password=ref("")
const re_password=ref("")

function register(){
  if(!username.value){
    showMessage("用户名未输入")
    return
  }
  if(!email.value){
    showMessage("邮箱未输入")
    return
  }
  const emailRegex=/^[0-9a-zA-Z]+([-._][0-9a-zA-Z]+)*@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*\.[a-zA-Z]{2,}$/
  if(!emailRegex.test(email.value)){
    showMessage("邮箱格式不正确")
    return
  }
  if(!password.value){
    showMessage("密码未输入")
    return
  }
  if(!re_password.value){
    showMessage("确认密码未输入")
    return
  }
  if(password.value!==re_password.value){
    showMessage("两次输入密码不一致，请重新输入")
    return
  }
  const url="/api/users/"
  const datas={
    "username":username.value,
    "email":email.value,
    "password":password.value,
    "re_password":re_password.value,
  }
  axios
      .post(url,datas)
      .then(response=>{
        showMessage("注册成功，请到邮箱进行激活用户","success",()=>{
          // location.reload()
          router.push({name:"Login"})
        },1000)
      })
      .catch(error=>{
        //flat 二维拍成一维  比如 [[1],[2]]->[1,2]
        const errors=Object.values(error.response.data).flat()
        for(let i=0;i<errors.length;i++){
          showMessage(errors[i])
        }
      })
}


</script>

<template>
  <div class="flex w-full h-full items-center justify-center tracking-wider">
    <div class="flex flex-col shadow-md shadow-[#B64529] bg-white rounded mt-35 w-[320px] h-[500px]">
      <div class="flex font-bold text-2xl my-10 justify-center">用户注册</div>
      <form method="post">
        <div class="flex items-center mb-8">
          <input v-model="username" class="absolute border border-gray-400 h-10 w-60 ml-10 pl-10 outline-none rounded focus:shadow-xs focus:shadow-[#B64529]" type="text" placeholder="请输入用户名">
          <svg class="icon relative w-6 h-6 ml-12" t="1766404164709" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2446">
            <path d="M651.296021 545.977859c63.557548-42.814108 105.358583-115.235534 105.358583-197.532889 0-133.333728-110.364597-241.9761-245.813498-241.9761-135.451972 0-244.160859 108.642372-244.160859 240.322437 0 82.297354 41.821501 154.739247 105.35756 197.530842-143.80522 55.979966-244.135276 191.069687-244.135276 350.748433l0 0 68.561515 0 0 0c0-158.026106 122.06815-288.197818 277.581016-306.303174 1.674129 0 43.476187-3.284813 78.595033 0l3.350304 0 0 0C708.17445 610.18009 825.215096 738.574319 825.215096 894.946762l0 0 70.239737 0 0 0C893.779681 736.921679 793.447579 600.303138 651.296021 545.977859L651.296021 545.977859zM510.841106 527.85613c-102.008278 0-183.930079-80.644715-183.930079-181.063799 0-100.419084 81.921801-181.062775 183.930079-181.062775 102.007255 0 183.929056 80.643692 183.929056 181.062775C694.770162 447.211415 612.848361 527.85613 510.841106 527.85613L510.841106 527.85613zM510.841106 527.85613" p-id="2447" fill="#cdcdcd"></path>
          </svg>
        </div>
        <div class="flex items-center mb-8">
          <input v-model="email" class="absolute border border-gray-400 h-10 w-60 ml-10 pl-10 outline-none rounded focus:shadow-xs focus:shadow-[#B64529]" type="email" placeholder="请输入邮箱">
          <svg class="icon relative w-6 h-6 ml-12" t="1766405324305" viewBox="0 0 1040 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3141">
            <path d="M818.97651 64.224744 204.713428 64.224744c-113.073288 0-204.714452 93.713358-204.714452 209.238488l0 413.642878c0 115.52513 91.641163 208.357422 204.714452 208.357422l614.262058 0c113.134687 0 204.771757-92.833315 204.771757-208.357422L1023.747243 273.463232C1023.748267 157.939125 932.110173 64.224744 818.97651 64.224744zM709.783599 482.420311l249.786996-150.083204 0 296.587905L709.783599 482.420311zM204.713428 128.026862l614.262058 0c72.988338 0 133.375683 58.618049 139.984195 132.059712L511.875157 528.771989 64.50206 259.912611C71.221088 186.55179 131.840724 128.026862 204.713428 128.026862zM63.87375 332.154959l250.091942 150.266375L63.87375 629.103068 63.87375 332.154959zM818.97651 831.417867 204.713428 831.417867c-72.79391 0-133.36238-57.398268-140.190903-130.530892l309.642223-181.605128c0.189312-0.11461 0.370437-0.23843 0.555655-0.356111l121.31295 72.890101c4.840238 2.889817 10.308787 4.397147 15.84078 4.397147 5.529947 0 10.997472-1.50733 15.838733-4.397147l121.314996-72.891124c0.186242 0.118704 0.367367 0.242524 0.557702 0.357134l309.352627 181.435259C952.219163 773.930571 891.884007 831.417867 818.97651 831.417867z" p-id="3142" fill="#cdcdcd"></path>
          </svg>
        </div>
        <div class="flex items-center mb-8">
          <input v-model="password" class="absolute border border-gray-400 h-10 w-60 ml-10 pl-10 outline-none rounded focus:shadow-xs focus:shadow-[#B64529]" type="password" placeholder="请输入密码">
          <svg class="icon relative w-6 h-6 ml-12" t="1766405507822" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1637">
            <path d="M848 472c8.82 0 16 7.18 16 16v361c0 8.82-7.18 16-16 16H178c-8.82 0-16-7.18-16-16V488c0-8.82 7.18-16 16-16h670m0-64H178c-44.18 0-80 35.82-80 80v361c0 44.18 35.82 80 80 80h670c44.18 0 80-35.82 80-80V488c0-44.18-35.82-80-80-80z" p-id="1638" fill="#cdcdcd"></path>
            <path d="M513 128c50.75 0 98.46 19.76 134.35 55.65S703 267.25 703 318v90H323v-90c0-50.75 19.76-98.46 55.65-134.35S462.25 128 513 128m0-64c-140.28 0-254 113.72-254 254v154h508V318c0-140.28-113.72-254-254-254zM513 573.5c-17.67 0-32 14.33-32 32v126c0 17.67 14.33 32 32 32s32-14.33 32-32v-126c0-17.67-14.33-32-32-32z" p-id="1639" fill="#cdcdcd"></path>
          </svg>
        </div>
        <div class="flex items-center mb-8">
          <input v-model="re_password" class="absolute border border-gray-400 h-10 w-60 ml-10 pl-10 outline-none rounded focus:shadow-xs focus:shadow-[#B64529]" type="password" placeholder="请输入确认密码">
          <svg class="icon relative w-6 h-6 ml-12" t="1766405507822" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1637">
            <path d="M848 472c8.82 0 16 7.18 16 16v361c0 8.82-7.18 16-16 16H178c-8.82 0-16-7.18-16-16V488c0-8.82 7.18-16 16-16h670m0-64H178c-44.18 0-80 35.82-80 80v361c0 44.18 35.82 80 80 80h670c44.18 0 80-35.82 80-80V488c0-44.18-35.82-80-80-80z" p-id="1638" fill="#cdcdcd"></path>
            <path d="M513 128c50.75 0 98.46 19.76 134.35 55.65S703 267.25 703 318v90H323v-90c0-50.75 19.76-98.46 55.65-134.35S462.25 128 513 128m0-64c-140.28 0-254 113.72-254 254v154h508V318c0-140.28-113.72-254-254-254zM513 573.5c-17.67 0-32 14.33-32 32v126c0 17.67 14.33 32 32 32s32-14.33 32-32v-126c0-17.67-14.33-32-32-32z" p-id="1639" fill="#cdcdcd"></path>
          </svg>
        </div>
        <div class="flex items-center justify-center mb-1">
          <button v-on:click.prevent="register" tabindex="0"  class="h-10 w-60 bg-[#B64529] rounded text-white transition-all duration-200 hover:shadow-md hover:shadow-gray-400">
            注册
          </button>
        </div>
        <div class="flex items-center justify-center text-sm">
          已有账号？
          <router-link :to="{name:'Login'}" class="text-blue-700 hover:text-shadow-xs hover:text-shadow-gray-300">去登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>
