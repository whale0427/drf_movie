<script setup>
import {onMounted,ref,computed,watch} from "vue"
import {useRoute,useRouter} from "vue-router"

const props = defineProps({
  info:{
    type:Object,
    // 表示这个 Prop必须由父组件传递给子组件，如果父组件没有传递，Vue 会在控制台抛出警告（开发环境下）
    // 避免出现undefined
    required:true,
  },
  page_size:{
    type:Number,
    required:true,
  },
  name:{
    type:String,
    required:true,
  }
})
const route=useRoute()
const router=useRouter()
const current=ref(1)

onMounted(()=>{
  console.log("Page页面加载时请求接口")
  get_current()
})

watch(route,()=>{
  console.log("监听Page页面路由的变化")
  get_current()
  // window.location.reload()
})

function get_current(){
  current.value = Number(route.query.page) || 1
}
function goToPage(page){
  current.value=page
  const params={...route.query}
  params.page=page
  params.movie_name=route.query.movie_name
  const name=props.name
  router.push({
    name:name,
    query:params,
    // query:{
    //   "page":page,
    //   "movie_name":movie_name,
    // },
  })
}
const prePage = computed(()=>{
  if(current.value>1){
    return current.value-1
  }
  return 1
})
const lastPage = computed(()=>{
  return Math.ceil(props.info.count/props.page_size)
})
const nextPage = computed(()=>{
  if(current.value<lastPage.value){
    return current.value+1
  }
  return current.value
})
const pages = computed(()=>{
  const pages=[]
  for(let i=1;i<=lastPage.value;i++){
    if(i===1||i===lastPage.value||i===current.value||(i>=current.value-1&&i<=current.value+1)){
      pages.push(i)
    }else if(pages[pages.length-1]!=="..."){
      pages.push("...")
    }
  }
  return pages
})
</script>

<template>
  <div class="flex space-x-2 w-full h-12 items-center justify-center">
    <a v-if="info.previous" @click="goToPage(prePage)" class="w-8 h-8 rounded flex items-center justify-center transition-all duration-200 hover:shadow-md hover:shadow-[#B64529] cursor-pointer">
      <svg class="icon w-3 h-3" t="1766219141489" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2444">
        <path d="M747.245 81.064c-28.497-29.315-74.739-29.315-103.307 0l-367.236 378.011c-28.483 29.367-28.483 76.982 0 106.291l367.236 377.997c28.562 29.367 74.806 29.367 103.307 0 28.546-29.325 28.546-76.929 0-106.304l-315.6-324.841 315.599-324.803c28.545-29.367 28.544-76.973 0-106.356l0 0z" fill="#B6543C" p-id="2445"></path>
      </svg>
    </a>
    <a v-for="page in pages" :key="page" class="w-8 h-8 rounded flex items-center justify-center text-[#B6543C] transition-all duration-200 hover:shadow-md hover:shadow-[#B64529]">
      <button v-if="page==='...'">{{ page }}</button>
      <button v-else-if="page===current" class="bg-[#B6543C] text-white w-full h-full rounded cursor-pointer">{{ page }}</button>
      <button v-else @click="goToPage(page)" class="w-full h-full rounded cursor-pointer">{{ page }}</button>
    </a>
    <a v-if="info.next" @click="goToPage(nextPage)" class="w-8 h-8 rounded flex items-center justify-center transition-all duration-200 hover:shadow-md hover:shadow-[#B64529] cursor-pointer">
      <svg class="icon w-3 h-3" t="1766219379614" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2633">
        <path d="M276.755 942.936c28.497 29.315 74.739 29.315 103.307 0l367.236-378.011c28.483-29.367 28.483-76.982 0-106.291l-367.236-377.997c-28.562-29.367-74.806-29.367-103.307 0-28.546 29.325-28.546 76.929 0 106.304l315.6 324.841-315.599 324.803c-28.545 29.367-28.544 76.973 0 106.356l0 0z" fill="#B6543C" p-id="2634"></path>
      </svg>
    </a>
  </div>
</template>

<style scoped>

</style>
