<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Page from "@/components/Page.vue";
import {useRouter,useRoute} from "vue-router";
import {onMounted, ref, watch} from "vue";
import axios from "axios";
import {showMessageOptions} from "@/utils/message.js";

const route=useRoute()
const params=new URLSearchParams()

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

// 页面加载时请求接口
onMounted(()=>{
  console.log("MyCollect页面加载时请求接口")
  get_movie_data()
})

watch(route,()=>{
  console.log("监听MyCollect页面路由的变化")
  get_movie_data()
  window.location.reload()
})

const info=ref({})
const token=localStorage.getItem("token")

function get_movie_data(){
  //字母会返回Nan,空值会返回0,所以为了方便设个默认值,Nan和0都会赋值默认值
  const page=Number(route.query.page) || null
  const movie_name=route.query.movie_name || ""
  const category=route.query.category || null
  const region=route.query.region || null
  if(page){
    params.append("page",page)
  }
  if(movie_name){
    params.append("movie_name",movie_name)
  }
  if(category){
    params.append("category",category)
  }
  if(region){
    params.append("region",region)
  }
  //当你把URLSearchParams对象直接和字符串拼接时，JavaScript 会自动隐式调用该对象的toString()方法
  //也可以显式调用toString() params.toString()
  let url="/api/collect/"+"?"+params
  axios
      // .get(url,{
      //   "headers":{
      //     "Authorization":"JWT "+token
      //   }
      // })
      .get(url)
      .then(response=>{info.value=response.data})
      .catch(error=>{
        if(error.response){
          const errors=Object.values(error.response.data)?.flat()
          console.log(errors)
          for(let i=0;i<errors.length;i++){
            showMessageOptions(errors[i])
            console.log(errors)
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
            我的收藏
          </div>
        </div>
        <div class="flex flex-col rounded bg-white text-black w-[90%] mt-5">
          <div class="p-4 flex flex-wrap gap-9 justify-left">
            <div v-for="movie in info.results" :key="movie.id" class="relative w-[200px] h-[300px]">
              <a :href="'/movie/'+movie.id">
                <div v-if="movie.is_top" class="absolute top-0 left-0 bg-purple-500 text-white text-xs py-0.5 px-1 z-10 rounded-sm">置顶</div>
                <img :src="getProxyImageUrl(movie.image_url)" alt="" @error="handleImageError" class="w-full h-[240px] rounded">
                <div v-if="movie.quality==1" class="absolute bottom-[60px] right-0 bg-blue-500 text-white text-xs py-0.5 px-1 z-10 rounded-sm">720P</div>
                <div v-else-if="movie.quality==2" class="absolute bottom-[60px] right-0 bg-blue-500 text-white text-xs py-0.5 px-1 z-10 rounded-sm">1080P</div>
                <div v-else class="absolute bottom-[60px] right-0 bg-blue-500 text-white text-xs py-0.5 px-1 z-10 rounded-sm">4K</div>
                <div class="text-md font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis">({{movie.release_year}}){{ movie.movie_name }}</div>
                <div class="text-xs opacity-90 mt-1 text-gray-800">{{ movie.language }}</div>
              </a>
            </div>
          </div>
          <div v-if="info.count===0" class="text-4xl font-bold text-[#B6543C] ml-10">暂无收藏电影</div>
          <Page :info="info" :page_size="14" name="MyCollect"/>
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
