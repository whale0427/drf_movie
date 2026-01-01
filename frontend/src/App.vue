<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import {  RouterView } from 'vue-router'
import {onBeforeMount} from "vue"
import {useUserStore} from "@/stores"
import axios from "axios"

const token=localStorage.getItem("token")
if(token){
  axios.defaults.headers.common["Authorization"]="JWT "+token
}else{
  axios.defaults.headers.common["Authorization"]=""
}

const  userStore=useUserStore()
//组件模板编译完成，但未挂载到DOM前执行
// onBeforeMount(userStore.setLoginState("true"))
onBeforeMount(()=>{
  userStore.setLoginState()
})
</script>

<template>
  <RouterView />
</template>

