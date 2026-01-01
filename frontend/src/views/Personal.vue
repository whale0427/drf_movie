<script setup>
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
import {onMounted, ref} from "vue"
import showMessage, {showMessageOptions} from "@/utils/message.js";
import axios from "axios"
import {useUserStore} from "@/stores"
import {useRouter} from "vue-router";
import time_format from "@/utils/time.js";

const router=useRouter()
const info=ref(true)
const modify_password=ref(false)
const modify_phone=ref(false)
const username=ref("")
const email=ref("")
const phone=ref("")
const is_upgrade=ref()
const expire_time=ref("")

onMounted(()=>{
  profile_info()
})

function profile_info(){
  username.value=localStorage.getItem("username")
  email.value=localStorage.getItem("email")
  phone.value=localStorage.getItem("phone")
  is_upgrade.value=localStorage.getItem("is_upgrade")
  expire_time.value=localStorage.getItem("expire_time")
  username.value=username.value!=="null" ? username.value : "无"
  email.value=email.value!=="null" ? email.value : "无"
  phone.value=phone.value!=="null" ? phone.value : "无"
  console.log(is_upgrade.value)
  is_upgrade.value=is_upgrade.value==="1" ? "会员用户" : "普通用户"
  console.log(is_upgrade.value)
  if(expire_time.value!=="null"){
    const expireTime = new Date(expire_time.value)
    const now = new Date()
    if(expireTime<now){
      expire_time.value ="已过期"
    }else{
      expire_time.value =time_format(expire_time.value)
    }
  }else{
    expire_time.value="无"
  }
}

function toggles(toggle){
  if(toggle==="info"){
    if(info.value) return
    info.value=!info.value
    modify_password.value=false
    modify_phone.value=false
  }else if(toggle==="modify_password"){
    if(modify_password.value) return
    modify_password.value=!modify_password.value
    info.value=false
    modify_phone.value=false
  }else{
    if(modify_phone.value) return
    modify_phone.value=!modify_phone.value
    info.value=false
    modify_password.value=false
  }
}

const current_password=ref()
const new_password=ref()
const re_new_password=ref()

function setPassword(){
  if(!current_password.value){
    showMessageOptions("请输入当前密码")
    return
  }
  if(!new_password.value){
    showMessageOptions("请输入新密码")
    return
  }
  if(!re_new_password.value){
    showMessageOptions("请再次输入新密码")
    return
  }
  if(new_password.value !== re_new_password.value){
    showMessageOptions("两次密码输入不一致，请重新输入")
    return
  }
  const datas={
    current_password:current_password.value,
    new_password:new_password.value,
    re_new_password:re_new_password.value,
  }
  const token=localStorage.getItem("token")
  const userStore=useUserStore()

  axios
      .post("/api/users/set_password/",datas)
      .then(response=>{
        // showMessageOptions("修改成功，即将跳转登录页面",{
        //   status:"success",
        //   callback_func:()=>{window.location.href="/login"},
        //   duration:1500,
        // })
        showMessageOptions("修改成功，即将跳转登录页面",{
          status:"success",
          callback_func:()=>{router.push({name:"Login"})},
          duration:1500,
        })
        userStore.isLogin=false
        localStorage.clear()
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


</script>

<template>
  <div class="text-white flex flex-col m-0 p-0 min-h-screen w-full">
    <div class="flex-1 min-w-[1890px]">
    <!--  导航栏-->
      <Header/>
    <!--  内容-->
      <div class="flex flex-col mb-8 items-center">
        <div class="flex rounded bg-white text-lg text-black font-bold w-[90%] h-15 mt-5 items-center">
          <div class="flex flex-col ml-5">
            个人中心
          </div>
        </div>
        <div class="flex flex-col rounded bg-white text-black w-[90%] h-110 mt-5">
          <div class="flex my-5 text-gray-800 bg-gray-200 w-full h-10 space-x-10 items-center">
            <button v-on:click="toggles('info')" class="ml-5 focus:border-b-2 cursor-pointer">账号信息</button>
            <button v-on:click="toggles('modify_password')" class="focus:border-b-2 cursor-pointer">修改密码</button>
            <button v-on:click="toggles('modify_phone')" class="focus:border-b-2 cursor-pointer">修改手机</button>
          </div>
          <div :class="{hidden:!info}" class="flex flex-col ml-5 space-y-4">
            <div>用户名：{{username}}</div>
            <div>邮箱：{{email}}</div>
            <div>手机号：{{phone}}</div>
            <div>会员状态：{{is_upgrade}}</div>
            <div>到期时间：{{expire_time}}</div>
          </div>
          <div :class="{hidden:!modify_password}">
            <form class="flex flex-col ml-5">
              <label for="current_password" class="text-sm my-3">请输入当前密码:</label>
              <input v-model="current_password" id="current_password" class="border border-gray-400 pl-1 h-10 w-60 outline-none rounded focus:shadow-xs focus:shadow-[#B64529]" type="password" placeholder="请输入当前密码" autocomplete="current-password">
              <label for="new_password" class="text-sm my-3">请输入新密码:</label>
              <input v-model="new_password" id="new_password" class="border border-gray-400 pl-1 h-10 w-60 outline-none rounded focus:shadow-xs focus:shadow-[#B64529]" type="password" placeholder="请输入新密码" autocomplete="new-password">
              <label for="re_new_password" class="text-sm my-3">请再次输入新密码:</label>
              <input v-model="re_new_password" id="re_new_password" class="border border-gray-400 pl-1 h-10 w-60 outline-none rounded focus:shadow-xs focus:shadow-[#B64529]" type="password" placeholder="请再次输入新密码" autocomplete="new-password">
              <button v-on:click.prevent="setPassword" class="h-10 w-60 mt-5 bg-[#B64529] rounded text-white transition-all duration-200 hover:shadow-md hover:shadow-[#B64529]">修改</button>
            </form>
          </div>
          <div :class="{hidden:!modify_phone}" class="flex flex-col ml-5">
            修改手机
          </div>
        </div>
      </div>
    </div>
  <!--  底部信息栏-->
    <div class="min-w-[1890px]">
      <Footer/>
    </div>
  </div>
</template>

<style scoped>

</style>
