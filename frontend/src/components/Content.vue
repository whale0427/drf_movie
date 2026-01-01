<script setup>
import Page from "@/components/Page.vue"
//选项式 API（无<script setup>）：用mounted()选项
//组合式 API（<script setup>）：用onMounted()函数
// 导入Vue3的响应式API---ref
import {ref, onMounted, watch} from "vue"
import axios from "axios"
//导入useRoute钩子
import {useRoute, useRouter} from "vue-router"
import {showMessageOptions} from "@/utils/message.js";
import {useMovieStore} from "@/stores/index.js";
// 用ref包裹初始值，创建响应式变量（意思就是内容会随着响应的内容而变化，而不是固定了）
// 后续可以直接修改：info.value = "新内容"（注意需要.value）模板中直接用info，不需要.value
const route = useRoute()
const info = ref({})

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
  console.log("Content页面加载时请求接口")
  get_movie_data()
  is_collecteds()
})

// 监听当前页面路由的变化
watch(route,()=>{
  console.log("监听Content页面路由的变化")
  get_movie_data()
  is_collecteds()
  //刷新页面是为了翻页会刷新到头部,但是会白屏。所以就用了下下面的window.scrollTo方式实现滚动定位到顶部
  //window.location.reload()
  window.scrollTo({
    top: 0, // 滚动到顶部
    behavior: "smooth" // 平滑滚动（可选，去掉则瞬间回到顶部）
  })
})

function get_movie_data(){
  const params=new URLSearchParams()
  let url="/api/movie"
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
  url=url+"?"+params
  axios
      .get(url)
      .then(response=>{info.value=response.data})
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

const movie_ids=ref([])
const movieStore=useMovieStore()
function is_collecteds(){
  const token=localStorage.getItem("token")
  if(!token) return
  axios
      .get("/api/collect/is_collecteds/")
      .then(response=>{
        // movie_ids.value=response.data.movie_ids
        movieStore.setMovieIds(response.data.movie_ids)
        movie_ids.value=movieStore.movie_collected
      })
}
</script>

<template>
  <div class="p-4 flex flex-wrap gap-9 justify-left">
    <div v-for="movie in info.results" :key="movie.id" class="relative w-[200px] h-[300px]">
      <a :href="'/movie/'+movie.id">
        <div v-if="movie.is_top" class="absolute top-0 left-0 bg-purple-500 text-white text-xs py-0.5 px-1 z-10 rounded-sm">置顶</div>
        <svg v-if="movie_ids.includes(movie.id)" class="icon w-7 h-7 absolute top-0 right-0 z-10" t="1766593680056" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3392">
          <path fill="#FF3100" d="M667.786667 117.333333C832.864 117.333333 938.666667 249.706667 938.666667 427.861333c0 138.250667-125.098667 290.506667-371.573334 461.589334a96.768 96.768 0 0 1-110.186666 0C210.432 718.368 85.333333 566.112 85.333333 427.861333 85.333333 249.706667 191.136 117.333333 356.213333 117.333333c59.616 0 100.053333 20.832 155.786667 68.096C567.744 138.176 608.170667 117.333333 667.786667 117.333333z" p-id="3393"></path>
        </svg>
        <img :src="getProxyImageUrl(movie.image_url)" alt="" @error="handleImageError" class="w-full h-[240px] rounded">
        <div v-if="movie.quality==1" class="absolute bottom-[60px] right-0 bg-blue-500 text-white text-xs py-0.5 px-1 z-10 rounded-sm">720P</div>
        <div v-else-if="movie.quality==2" class="absolute bottom-[60px] right-0 bg-blue-500 text-white text-xs py-0.5 px-1 z-10 rounded-sm">1080P</div>
        <div v-else class="absolute bottom-[60px] right-0 bg-blue-500 text-white text-xs py-0.5 px-1 z-10 rounded-sm">4K</div>
        <div class="text-md font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis">({{movie.release_year}}){{ movie.movie_name }}</div>
        <div class="text-xs opacity-90 mt-1 text-gray-800">{{ movie.language }}</div>
      </a>
    </div>
  </div>
  <div v-if="info.count===0" class="text-4xl font-bold text-[#B6543C] ml-10">内容未更新</div>
  <!--    页码-->
  <Page :info="info" :page_size="32" name="home"/>
</template>

<style scoped>

</style>
