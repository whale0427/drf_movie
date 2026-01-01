<script setup>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import {onMounted,ref} from "vue"
import axios from "axios"
import {useRoute,useRouter} from "vue-router"
import showMessage, {showMessageOptions} from "@/utils/message.js"
import {useMovieStore, useUserStore} from "@/stores/index.js";
import Swal from "sweetalert2"

const router=useRouter()
const route=useRoute()
const detail=ref({})
const userStore=useUserStore()
const movieStore=useMovieStore()

// 修改：处理所有豆瓣图片域名（img1、img2、img9等），并添加失败兜底
const getProxyImageUrl = (imageUrl) => {
  if (!imageUrl) {
    // 空URL时返回默认占位图（可选，你可以替换为自己的占位图地址）
    return '@/assets/images/图片1.png';
  }
  // 匹配所有豆瓣图片域名：img*.doubanio.com
  const doubanImageRegex = /https?:\/\/img\d+\.doubanio\.com(.*)/;
  const match = imageUrl.match(doubanImageRegex);
  if (match) {
    // 开发环境：使用Vite代理
    if (import.meta.env.DEV) {
      return `/douban-image${match[1]}`;
    } else {
      // 生产环境：替换为后端代理接口
      return `http://localhost/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    }
  } else {
    // 非豆瓣图片，直接返回原URL
    return imageUrl;
  }
}
// 新增：图片加载失败的处理函数（兜底）
const handleImageError = (e) => {
  // 加载失败时替换为占位图
  e.target.src = '@/assets/images/图片1.png';
}

onMounted(()=>{
  console.log("MovieDetail页面加载时请求接口")
  get_detail_data()
  is_collected()
})

function get_detail_data(){
  let url="/api/movie/"+route.params.id
  axios.get(url)
      .then(response=>{
        detail.value=response.data
      })
      .catch(error=>{
        if(error.response){
          const errors=Object.values(error.response.data)?.flat()
          for(let i=0;i<errors.length;i++){
            showMessageOptions(errors[i],{position:"right"})
          }
        }else{
          showMessageOptions(error)
        }
      })
}

const collectLove=ref(false)
function is_collected(){
  const movie_id=route.params.id
  const token=localStorage.getItem("token")
  const isLogin=userStore.isLogin
  if(!isLogin) return
  axios
      .get("/api/collect/"+movie_id+"/is_collected/")
      .then(response=>{
        collectLove.value=response.data.is_collected
      })
}

function collect(toggleCollect){
  const movie_id=route.params.id
  const token=localStorage.getItem("token")

  if(!token){
    showMessage("请先登录")
    return
  }
  if(toggleCollect){
    axios
        .post("/api/collect/",{"movie_id":movie_id})
        .then(response=>{
          collectLove.value=true
          movieStore.addMovieId(movie_id)
          showMessage(response.data.message,"success")
        })
        .catch(error=>{
          console.log(error)
          if(error.response){
            const errors=Object.values(error.response.data).flat()
            console.log(errors)
            for(let i=0;i<errors.length;i++){
              showMessage(errors[i])
            }
          }else{
            showMessage(error)
          }
        })
  }else{
    axios
        .delete("/api/collect/"+movie_id+"/")
        .then(response=>{
          collectLove.value=false
          movieStore.removeMovieId(movie_id)
          showMessage(response.data.message,"success")
        })
        .catch(error=>{
          if(error.response){
            const errors=Object.values(error.response.data).flat()
            for(let i=0;i<errors.length;i++){
              showMessage(errors[i])
            }
          }else{
            showMessage(error)
          }
        })
  }
}

let isMember=ref()
function viewContent(){
  const isLogin=userStore.isLogin

  if(!isLogin){
    showMessage("请先登录")
    return
  }
  axios
    .get("/api/users/me/")
    .then(response=>{
      const is_upgrade=response.data.profile.is_upgrade
      if(is_upgrade===1){
        isMember.value=true
      }else{
        showMessage("该功能只对会员开放，请前往会员中心进行充值")
        Swal.fire({
          icon:"warning",
          title:"是否前往会员中心",
          showCancelButton:true,
          confirmButtonText:"是",
          cancelButtonText:"否",
        }).then(result=>{
          if(result.isConfirmed){
            showMessage("即将跳转到会员中心","success",()=>{
              router.push({name:"MemberCenter"})
            },1000)
          }
        })
      }
    })
}
function back(){
  // 获取上一页的完整URL
  const referrer = document.referrer
  if (referrer) {
    // 解析URL中的查询参数
    const url = new URL(referrer)
    const path=url.pathname
    const query=ref({})
    const page = Number(url.searchParams.get('page')) || null
    const movie_name=url.searchParams.get('movie_name') || ""
    const category=url.searchParams.get('category') || null
    const region=url.searchParams.get('region') || null
    if(page){
      query.value.page=page
    }
    if(movie_name){
      query.value.movie_name=movie_name
    }
    if(category){
      query.value.category=category
    }
    if(region){
      query.value.region=region
    }
    router.push({
      path:path,
      query:query.value,
    })
  }
}
</script>

<template>
  <div class="text-white flex flex-col m-0 p-0 min-h-screen w-full">
    <div class="flex-1 min-w-[1890px]">
    <!--  导航栏-->
      <Header/>
    <!--  内容-->
      <div class="flex flex-col mb-8 items-center">
        <div v-on:click="back" class="flex absolute left-2 top-17 w-15 justify-center bg-[#B6543C] rounded hover:shadow-md hover:shadow-gray-400 cursor-pointer">返回</div>
        <div class="flex rounded bg-white text-black w-[90%] h-85 mt-5 p-6">
          <div class="flex flex-col mr-10">
            <img :src="getProxyImageUrl(detail.image_url)" alt="" @error="handleImageError" class="w-[200px] h-[240px]">
            <button v-on:click="collect(true)" :class="{hidden:collectLove}" class="flex items-center justify-center rounded bg-[#B6543C] mt-5 h-8 text-white transition-all duration-200 hover:shadow-md hover:shadow-gray-400 cursor-pointer">
              <svg class="icon w-7 h-7 mr-2" t="1766593515551" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3227">
                <path fill="#D1C4B4" d="M667.786667 117.333333C832.864 117.333333 938.666667 249.706667 938.666667 427.861333c0 138.250667-125.098667 290.506667-371.573334 461.589334a96.768 96.768 0 0 1-110.186666 0C210.432 718.368 85.333333 566.112 85.333333 427.861333 85.333333 249.706667 191.136 117.333333 356.213333 117.333333c59.616 0 100.053333 20.832 155.786667 68.096C567.744 138.176 608.170667 117.333333 667.786667 117.333333z m0 63.146667c-41.44 0-70.261333 15.189333-116.96 55.04-2.165333 1.845333-14.4 12.373333-17.941334 15.381333a32.32 32.32 0 0 1-41.770666 0c-3.541333-3.018667-15.776-13.536-17.941334-15.381333-46.698667-39.850667-75.52-55.04-116.96-55.04C230.186667 180.48 149.333333 281.258667 149.333333 426.698667 149.333333 537.6 262.858667 675.242667 493.632 834.826667a32.352 32.352 0 0 0 36.736 0C761.141333 675.253333 874.666667 537.6 874.666667 426.698667c0-145.44-80.853333-246.218667-206.88-246.218667z" p-id="3228"></path>
              </svg>
              添加收藏
            </button>
            <button v-on:click="collect(false)" :class="{hidden:!collectLove}" class="flex items-center justify-center rounded bg-[#B6543C] mt-5 h-8 text-white transition-all duration-200 hover:shadow-md hover:shadow-gray-400 cursor-pointer">
              <svg class="icon w-7 h-7 mr-2" t="1766593680056" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3392">
                <path fill="#FF3100" d="M667.786667 117.333333C832.864 117.333333 938.666667 249.706667 938.666667 427.861333c0 138.250667-125.098667 290.506667-371.573334 461.589334a96.768 96.768 0 0 1-110.186666 0C210.432 718.368 85.333333 566.112 85.333333 427.861333 85.333333 249.706667 191.136 117.333333 356.213333 117.333333c59.616 0 100.053333 20.832 155.786667 68.096C567.744 138.176 608.170667 117.333333 667.786667 117.333333z" p-id="3393"></path>
              </svg>
              取消收藏
            </button>
          </div>
          <div class="flex flex-col tracking-wider">
            <div class="flex font-bold text-xl mb-1">{{detail.movie_name}} ({{detail.release_year}})</div>
            <div>导演:{{detail.director}}</div>
            <div>编剧:{{detail.scriptwriter}}</div>
            <div>主演:{{detail.actors}}</div>
            <div>语言:{{detail.language}}</div>
            <div>首播:{{detail.release_date}}</div>
            <div>时长:{{detail.duration}}</div>
            <div>类型:{{detail.type}}</div>
            <div v-if="detail.region===1">制片国家/地区:中国大陆</div>
            <div v-else-if="detail.region===2">制片国家/地区:中国香港</div>
            <div v-else-if="detail.region===3">制片国家/地区:中国台湾</div>
            <div v-else-if="detail.region===4">制片国家/地区:美国</div>
            <div v-else-if="detail.region===5">制片国家/地区:日本</div>
            <div v-else-if="detail.region===6">制片国家/地区:韩国</div>
            <div v-else-if="detail.region===7">制片国家/地区:法国</div>
            <div v-else-if="detail.region===8">制片国家/地区:英国</div>
            <div v-else>制片国家/地区:其他</div>
            <div>英文名:{{detail.alternate_name}}</div>
            <div>豆瓣评分:{{detail.rate}}分</div>
          </div>
        </div>
        <div class="flex flex-col rounded bg-white text-black w-[90%] h-50 mt-5 p-6">
          <div class="flex font-bold text-xl mb-5">简介</div>
          <div class="flex overflow-hidden text-ellipsis">{{detail.review}}</div>
        </div>
        <div class="flex flex-col rounded bg-white text-black w-[90%] h-50 mt-5 p-6">
          <div class="flex font-bold text-xl mb-5">网盘地址</div>
          <div :class="isMember ? 'bg-white' : 'bg-gray-600'" class="flex h-25 w-full bg-gray-600 border rounded items-center justify-center shadow-sm shadow-[#373737]">
            <button v-on:click="viewContent" :class="{hidden:isMember}" class="flex text-white text-xl h-13 w-60 bg-[#B6543C] rounded items-center justify-center hover:shadow-md hover:shadow-[#373737] cursor-pointer">点击查看</button>
            <div :class="{hidden:!isMember}" class="flex overflow-hidden text-ellipsis">{{ detail.download_info||"无" }}</div>
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
