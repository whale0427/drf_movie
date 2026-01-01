<script setup>
import Swal from "sweetalert2"
import {ref} from "vue"
import showMessage, {showMessageOptions} from "@/utils/message.js"
import axios from "axios";

const email=ref()

function validatePassword(){
  if(!email.value){
    showMessage("请输入邮箱")
    return
  }
  const emailRegex=/^[0-9a-zA-Z]+([-._][0-9a-zA-Z]+)*@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*\.[a-zA-Z]{2,}$/
  if(!emailRegex.test(email.value)){
    showMessage("邮箱格式不正确")
    return
  }
  axios
      .post("/api/users/reset_password/",{"email":email.value})
      .then(response=>{
        showMessage("提交成功，请到邮箱进行验证","success",back,1500)
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
function back(){
  window.parent.forgetSwal.close()
}
</script>

<template>
  <div class="flex items-center justify-center tracking-wider bg-white">
    <div class="flex flex-col w-[300px] h-[310px]">
      <div class="flex font-bold text-2xl my-10 justify-center">邮箱验证</div>
      <div class="text-gray-500 mb-3 text-sm">（请输入注册用的邮箱进行验证）</div>
      <form method="post" class="space-y-10">
        <div class="flex items-center">
          <input v-model="email" class="absolute border border-gray-400 h-10 w-80 pl-10 outline-none rounded focus:shadow-xs focus:shadow-[#B64529]" type="text" placeholder="请输入邮箱">
          <svg class="icon relative w-6 h-6 ml-3" t="1766404164709" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2446">
            <path d="M651.296021 545.977859c63.557548-42.814108 105.358583-115.235534 105.358583-197.532889 0-133.333728-110.364597-241.9761-245.813498-241.9761-135.451972 0-244.160859 108.642372-244.160859 240.322437 0 82.297354 41.821501 154.739247 105.35756 197.530842-143.80522 55.979966-244.135276 191.069687-244.135276 350.748433l0 0 68.561515 0 0 0c0-158.026106 122.06815-288.197818 277.581016-306.303174 1.674129 0 43.476187-3.284813 78.595033 0l3.350304 0 0 0C708.17445 610.18009 825.215096 738.574319 825.215096 894.946762l0 0 70.239737 0 0 0C893.779681 736.921679 793.447579 600.303138 651.296021 545.977859L651.296021 545.977859zM510.841106 527.85613c-102.008278 0-183.930079-80.644715-183.930079-181.063799 0-100.419084 81.921801-181.062775 183.930079-181.062775 102.007255 0 183.929056 80.643692 183.929056 181.062775C694.770162 447.211415 612.848361 527.85613 510.841106 527.85613L510.841106 527.85613zM510.841106 527.85613" p-id="2447" fill="#cdcdcd"></path>
          </svg>
        </div>
        <div class="flex items-center justify-center space-x-10">
          <button v-on:click.prevent="validatePassword" class="h-10 w-20 bg-[#B64529] rounded text-white transition-all duration-200 hover:shadow-sm hover:shadow-gray-400">
            验证
          </button>
          <button v-on:click="back" class="h-10 w-20 bg-red-500 rounded text-white transition-all duration-200 hover:shadow-sm hover:shadow-gray-400" type="button">
            取消
          </button>
        </div>
      </form>
    </div>
  </div>

</template>

<style scoped>
html,body{
  background-color: white;
}
</style>
