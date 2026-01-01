<script setup>
import {ref, onMounted, watch} from "vue"
import axios from "axios"
import {useRoute, useRouter} from "vue-router"
import {useUserStore,useCounterStore} from "@/stores"
import showMessage, {showMessageOptions} from "@/utils/message.js"
import Swal from "sweetalert2";

const categorys = ref("")
const search = ref("")
const router=useRouter()
const route=useRoute()
const regions=ref([
    {id:1,name:"中国大陆"},
    {id:2,name:"中国香港"},
    {id:3,name:"中国台湾"},
    {id:4,name:"美国"},
    {id:5,name:"日本"},
    {id:6,name:"韩国"},
    {id:7,name:"法国"},
    {id:8,name:"英国"},
    {id:9,name:"其他"},
])
const userStore=useUserStore()
const counterStore=useCounterStore()
const username=ref("")
const is_upgrade=ref()

onMounted(()=>{
  console.log("Header页面加载时请求接口")
  get_category_data()
  validateLoginState()
})

// 监听当前页面路由的变化
watch(route,()=>{
  console.log("监听Header页面路由的变化")
  get_category_data()
  validateLoginState()
  // window.location.reload()
})

function get_category_data(){
  axios.get("/api/category")
      .then(response=>{categorys.value=response.data})
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
function validateLoginState(){
  const exp=localStorage.getItem("exp")
  const refresh=localStorage.getItem("refresh")
  const date_now=Date.now()

  username.value=localStorage.getItem("username")
  is_upgrade.value=localStorage.getItem("is_upgrade")
  is_upgrade.value=is_upgrade.value==="1" ? "VIP" : ""

  if(date_now<exp){
    userStore.isLogin=true
  }else if(refresh){
    axios
        .post("/api/jwt/refresh/",{"refresh":refresh})
        .then(response=>{
          localStorage.setItem("token",response.data.access)
          localStorage.setItem("exp",Date.now()+counterStore.token_exp_count)
          userStore.isLogin=true
        })
        .catch(error=>{
          if(error.response){
            console.log(error.response)
            const errors=Object.values(error.response.data)?.flat()
            for(let i=0;i<errors.length;i++){
              showMessageOptions(errors[i])
            }
            console.log(errors)
          }else{
            showMessageOptions(error)
          }
          userStore.isLogin=false
          localStorage.clear()
        })
  } else{
    userStore.isLogin=false
    localStorage.clear()
  }
}
function searchContent(){
  const params={...route.query}
  params.page="1"
  params.movie_name=search.value
  router.push({
    name:"home",
    query:params,
    // query: {
    //   "page":1,
    //   "movie_name":search.value
    // },
  })
}
// function jumpContent(id){
//   router.push({
//     name:"home",
//     query:{"category":id},
//   })
// }
function toggleCategory(category){
  category.hidden=!category.hidden
}
const meHidden=ref(false)
function toggleMe(){
  meHidden.value=!meHidden.value
}
function logout(){
  userStore.isLogin=false
  localStorage.clear()
  window.location.reload()
}
function so_good(){
  Swal.fire({
    icon:"info",
    title:"你真棒！",
    confirmButtonText:"你说的没错~",
  })
}
</script>

<template>
  <div class="bg-[#B6543C] px-4 py-3 sticky top-0 left-0 w-full flex items-center justify-between z-50 h-12">
    <div class="flex space-x-4">
      <a href="/">
        <svg class="icon my-auto items-center justify-center w-[100px] h-[50px]" t="1766218045623" viewBox="0 0 3834 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3762">
          <path d="M1151.80722088 91.75826065l-38.14763637 198.5944064s-16.14239046 61.9899091-60.77825148 77.70235821c-46.66831732-0.85988585-501.74304102 1.7197701-638.19119601 0Q445.05972154 229.92618575 475.4683901 91.75826065z m265.78271296 0h516.86920335l-151.96517467 742.62816752s-12.19473618 120.813877-83.68246881 129.49090027c-136.09638321 0.70354195-349.50426574 0-349.50426574 0s47.21551696-223.25747781 159.54779863-733.95114269h159.54779859q-11.45210865 64.72590734-22.78695901 129.49090027h75.98258654l30.40867011-172.68059023-333.47913201-4.26034204s-176.98001785 48.27083069-274.18613717 73.4029322q7.62170953-47.48911757 15.20433505-94.97823359z m1071.33884341 811.65350092s96.26806233-469.02831557 144.38255071-699.39939041l-53.19562912 8.63793769q7.62170953-47.48911757 15.20433506-94.97823359c88.60726564-5.7846827 258.31734418-17.27587692 258.31734572-17.27587536l-182.33475919 863.48112854H2071.25906235l159.50871304-733.95114269h-304.12577719l15.20433504-86.37938147h303.8912622l15.20433502-42.99426208h205.08263104v42.99426208h15.20433506l-15.20433506 86.37938147h-22.66970225l-144.34346357 673.48557582z m805.16527627-673.48557582q34.39540997 366.85831385 68.55630487 733.95114269h-235.53038512q-37.99129407-367.09282886-75.9825881-733.95114269h-197.50000555l15.16524792-86.37938147h174.75213366V91.75826065h235.45221398v51.63220132h45.57391803s31.26855437 6.21462562 30.40867009-51.78854362h197.53909109s-2.22788418 114.16930848-83.60429607 138.1679251c-10.24045105 0.31268618-45.57391803 0-45.573918 0s-87.90372368 2.69691267-129.06095894 0.1563423zM954.26812979 169.46061887h-311.51297326l-7.58262554 34.55175229h265.78271297l-15.20433506 51.7885436h-265.78271137l-7.58262554 51.74945649s197.53909266 2.89234055 303.89126375 0c20.24638863-14.30536364 37.99129407-138.08975394 37.99129405-138.08975238zM1881.1462529 963.87732844c20.24638863-210.08559905 60.77825305-630.33496987 60.7782515-630.33496987h151.96517468s-45.61300358 420.24937083-68.39996262 630.33496987z m-1230.76938686-578.46825667h197.5000071l-7.58262396 25.9138146h250.73472023l-22.82604458 77.70235822h-676.18248853l15.16524792-77.70235822h235.53038674c0.03908556-8.71610882 7.6607951-25.99198574 7.66079508-25.99198575z m706.55207148 34.55175384l-15.2043335 103.61617127-265.78271294 60.42648128 22.78695898-94.97823357z m265.78271294 34.55175228l-90.83515142 431.50605002h30.36958453l45.573918-25.874729q45.61300358-202.93291801 91.18692162-405.82675048zM331.28126884 773.92085973c17.70581827-89.23263645 53.15654196-259.05997326 53.15654196-259.05997169h676.18248849s-24.42855796 230.13655981-91.18692158 259.05997169c-71.17504642-0.42994292-137.54255428-1.09439931-205.12171665 0-13.28913548 184.44538506-83.56521206 189.95646716-83.56521205 189.95646871H285.66826524l68.39996259-146.80586276 121.55650457 8.63793768-30.33049738 86.34029591h98.7695471l22.78695902-138.12883954z m296.26955264-233.14615709c-51.55402858 6.05828175-95.75994826 138.36335298-53.15654197 198.59440482 56.94785395 5.35473977 255.22957571-57.88591092 258.31734416-103.61617125-4.37759722-34.59083786-163.22185385-94.939148-205.16080219-94.97823357z m205.16080219 259.02088611h136.79992518v77.74144379l311.51297328-77.74144379-22.74787345 103.61617282-288.72601426 42.99426206-144.34346356 17.27587692z" fill="#D1C4B4" p-id="3763"></path>
        </svg>
      </a>
      <div class="flex">
        <ul class="flex space-x-4 h-full">
          <li @mouseenter="toggleCategory(category)" @mouseleave="toggleCategory(category)" v-for="category in categorys.results" :key="category.id" class="relative flex flex-col items-center justify-center h-full">
            <div class="flex items-center justify-between space-x-1 cursor-pointer">
              <button class="cursor-pointer">{{ category.category_name }}</button>
              <svg class="icon w-3 h-3" t="1766321421318" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2444">
                <path d="M52.335 261.072c-31.269 30.397-31.269 79.722 0 110.194l403.212 391.718c31.325 30.382 82.114 30.382 113.377 0l403.197-391.718c31.325-30.466 31.325-79.793 0-110.194-31.28-30.449-82.058-30.449-113.39 0l-346.497 336.64-346.457-336.64c-31.325-30.448-82.105-30.448-113.446 0l0 0z" fill="#ffffff" p-id="2445"></path>
              </svg>
            </div>
            <div :class="{hidden:!category.hidden}" class="absolute flex flex-col bg-[#B6543C] left-0 w-22 top-9 pl-2 space-y-2 rounded-bl-[5px] rounded-br-[5px]">
              <a :href="'/?category='+category.id" class="mt-5 transition-all duration-200 hover:text-shadow-md hover:text-shadow-[#707070]">全部</a>
              <a v-for="region in regions" :key="region.id" :href="'/?category='+category.id+'&region='+region.id" class="mb-3 transition-all duration-200 hover:text-shadow-md hover:text-shadow-[#707070]">{{ region.name }}</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
    @ zhh ❤ hll
    <div class="flex items-center ml-8">
      <div class="relative w-[220px] bg-[#DC9685] px-2 py-1 rounded">
        <input v-model="search" @keyup.enter="searchContent" class="w-full bg-transparent text-sm text-white outline-none pr-4" placeholder="请输入关键词">
        <a v-on:click.prevent="searchContent">
          <svg class="icon absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"  t="1766217747407" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1707" width="200" height="200">
            <path d="M450.540923 835.421849C238.095329 835.421849 65.258028 662.585911 65.258028 450.14713 65.258028 237.711074 238.095329 64.873772 450.540923 64.873772 662.986518 64.873772 835.830632 237.711074 835.830632 450.14713 835.830632 662.584548 662.986518 835.421849 450.540923 835.421849L450.540923 835.421849ZM450.540923 159.705847C290.384053 159.705847 160.09419 289.998435 160.09419 450.14713 160.09419 610.297187 290.384053 740.591138 450.540923 740.591138 610.696431 740.591138 740.99447 610.297187 740.99447 450.14713 740.99447 289.998435 610.696431 159.705847 450.540923 159.705847L450.540923 159.705847Z" fill="#B6543C" p-id="1708"></path>
            <path d="M900.538167 958.477626C885.598531 958.477626 870.668434 952.777836 859.268854 941.387795L657.978933 740.112862C635.189312 717.323242 635.189312 680.372035 657.978933 657.576963 680.77673 634.794156 717.722486 634.794156 740.518919 657.576963L941.807478 858.851896C964.598462 881.641517 964.598462 918.592724 941.807478 941.386432 930.407899 952.777836 915.477801 958.477626 900.538167 958.477626" fill="#B6543C" p-id="1709"></path>
          </svg>
        </a>
      </div>
      <span v-on:click="so_good" class="flex ml-4 font-bold text-[#FFD700] text-xl [text-shadow:0_0_5px_rgba(255,215,0,0.8)] tracking-wider cursor-pointer">
        {{is_upgrade}}
      </span>
      <div class="flex h-full">
        <div v-if="userStore.isLogin" class="flex flex-col items-center relative h-full">
          <div v-on:click="toggleMe()" class="flex items-center justify-center cursor-pointer">
            <a class="ml-1 mr-2">{{username}}</a>
            <div>
              <svg class="icon w-4 h-4" t="1766489758994" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2477">
                <path d="M52.335 261.072c-31.269 30.397-31.269 79.722 0 110.194l403.212 391.718c31.325 30.382 82.114 30.382 113.377 0l403.197-391.718c31.325-30.466 31.325-79.793 0-110.194-31.28-30.449-82.058-30.449-113.39 0l-346.497 336.64-346.457-336.64c-31.325-30.448-82.105-30.448-113.446 0l0 0z" fill="#cdcdcd" p-id="2478"></path>
              </svg>
            </div>
          </div>
          <div :class="{hidden:!meHidden}" class="flex flex-col items-center absolute top-9 w-22 space-y-2 bg-[#B6543C] rounded-bl-[5px] rounded-br-[5px] cursor-pointer">
            <router-link :to="{name:'Personal'}" class="flex w-full justify-center hover:shadow-lg hover:shadow-[#9B331A] hover:bg-[#9B331A] hover:rounded">个人中心</router-link>
            <router-link :to="{name:'MyCollect'}" class="flex w-full justify-center hover:shadow-lg hover:shadow-[#9B331A] hover:bg-[#9B331A] hover:rounded">我的收藏</router-link>
            <router-link :to="{name:'Orders'}" class="flex w-full justify-center hover:shadow-lg hover:shadow-[#9B331A] hover:bg-[#9B331A] hover:rounded">我的订单</router-link>
            <router-link :to="{name:'MemberCenter'}" class="flex w-full justify-center hover:shadow-lg hover:shadow-[#9B331A] hover:bg-[#9B331A] hover:rounded">会员中心</router-link>
            <router-link :to="{name:'home'}" v-on:click="logout()" class="flex w-full justify-center hover:shadow-lg hover:shadow-[#9B331A] hover:bg-[#9B331A] hover:rounded">退出</router-link>
          </div>
        </div>
        <div v-else>
          <router-link :to="{name:'Login'}" class="ml-4 mr-2">登录</router-link>/<router-link :to="{name:'Register'}" class="mx-2">注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
