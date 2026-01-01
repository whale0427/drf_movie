<script setup>
import {ref} from "vue"
import {useRoute,useRouter} from "vue-router"
import axios from "axios"
import showMessage, {showMessageOptions} from "@/utils/message.js";

const router=useRouter()
const route=useRoute()
const uid=ref("")
const token=ref("")

function activateEmail(){
  uid.value=route.params.uid || ""
  token.value=route.params.token || ""
  const url="/api/users/activation/"
  const datas={
    "uid":uid.value,
    "token":token.value,
  }
  console.log(datas)
  axios
      .post(url,datas)
      .then(response=>{
        // showMessage("激活成功，即将跳转登录页面，请稍等片刻","success",()=>{window.location.href="/login"},1000)
        showMessage("激活成功，即将跳转登录页面，请稍等片刻","success",()=>{
          router.push({name:"Login"})
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
</script>

<template>
  <div class="flex w-full h-full items-center justify-center tracking-wider">
    <div class="flex justify-center bg-white rounded mt-35 w-[320px] h-[200px] shadow-md shadow-[#B64529]">
        <div class="flex flex-col">
          <div class="flex justify-center my-10 font-bold text-black">点击激活按钮进行用户激活</div>
          <button v-on:click="activateEmail" class="flex justify-center items-center h-10 w-60 bg-[#B64529] rounded text-white transition-all duration-200 hover:shadow-md hover:shadow-[#B64529]">激活</button>
        </div>
    </div>
  </div>
</template>

<style scoped>

</style>