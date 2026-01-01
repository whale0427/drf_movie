<script setup>
import Page from "@/components/Page.vue";
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
import {onMounted, ref, watch} from "vue";
import {useUserStore} from "@/stores"
import showMessage, {showMessageOptions} from "@/utils/message.js";
import axios from "axios";
import time_format from "@/utils/time.js";
import {useRouter,useRoute} from "vue-router";
import Swal from "sweetalert2";

const router=useRouter()
const route=useRoute()
const userStore=useUserStore()
const orders=ref({})

onMounted(()=>{
  console.log("Orders页面加载时请求接口")
  order_list()
})

watch(route,()=>{
  console.log("监听Orders页面路由的变化")
  order_list()
  // window.location.reload()
})

function order_list(){
  const params=new URLSearchParams()
  if(!userStore.isLogin){
    showMessage("请先登录")
    return
  }
  const page=Number(route.query.page) || null
  const order_sn=route.query.order_sn || ""
  const trade_no=route.query.trade_no || ""
  const pay_status=route.query.pay_status || ""
  if(page){
    params.append("page",page)
  }
  if(order_sn){
    params.append("order_sn",order_sn)
  }
  if(trade_no){
    params.append("trade_no",trade_no)
  }
  if(pay_status){
    params.append("pay_status",pay_status)
  }
  axios
    .get("/api/orders/?"+params)
    .then(response=>{
      orders.value=response.data
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

function order_info(order_sn){
  router.push({
    name:"Order",
    query:{
      "order_sn":order_sn
    }
  })
}

const search=ref("")
let order_sn=""
let trade_no=""

function search_content(){
  if(search.value){
    if(search.value.includes("pay")){
      order_sn=search.value
    }else{
      trade_no=search.value
    }
    router.push({
      name:"Orders",
      query:{
        "order_sn":order_sn,
        "trade_no":trade_no,
      }
    })
  }else{
    router.push({
      name:"Orders",
    })
  }
}

function pay_status_filter(pay_status){
  if(pay_status){
    router.push({
      name:"Orders",
      query:{
        "pay_status":pay_status,
      },
    })
  }else{
    router.push({
      name:"Orders",
    })
  }
}

function pay(order){
  if(userStore.isLogin){
    axios
      .get("/api/alipay/"+order.card+"/?order_sn="+order.order_sn)
      .then(response=>{
        Swal.fire({
          icon:"question",
          title:"是否跳转支付页面",
          showCancelButton:true,
          confirmButtonText:"是",
          cancelButtonText:"否",
        }).then(result=>{
          if(result.isConfirmed){
            // window.open(response.data.alipay_url,"_blank")
            window.location.href=response.data.alipay_url
          }
        })
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
  }else{
    showMessage("请先登录")
    Swal.fire({
      icon:"question",
      title:"是否跳转登录页面",
      showCancelButton:true,
      confirmButtonText:"是",
      cancelButtonText:"否",
    }).then(result=>{
      if(result.isConfirmed){
        router.push({name:"Login"})
      }
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
      <div class="flex flex-col mb-8 items-center h-full w-300 mx-auto text-black">
        <div class="flex bg-white rounded-xl w-full h-20 mt-5 justify-between shadow-md shadow-[#C69C92]">
          <form class="flex ml-5 items-center justify-center" method="post">
            <label for="search">搜索：</label>
            <input v-model="search" class="flex h-10 w-60 outline-none rounded px-1 mr-5 text-sm bg-gray-100 hover:shadow-md hover:shadow-[#969696] focus:shadow-md focus:shadow-[#969696]" name="search" id="search" placeholder="请输入订单号或交易号">
            <button v-on:click.prevent="search_content" class="flex bg-blue-600 text-white w-13 items-center justify-center rounded cursor-pointer hover:shadow-md hover:shadow-blue-300">查询</button>
          </form>
          <div class="flex mr-5 items-center justify-center space-x-5">
            <button v-on:click="pay_status_filter('')" class="flex bg-blue-600 text-white w-18 items-center justify-center rounded cursor-pointer hover:shadow-md hover:shadow-blue-300">全部</button>
            <button v-on:click="pay_status_filter('PAYING')" class="flex bg-yellow-500 text-white w-18 items-center justify-center rounded cursor-pointer hover:shadow-md hover:shadow-yellow-200">待支付</button>
            <button v-on:click="pay_status_filter('TRADE_SUCCESS')" class="flex bg-green-500 text-white w-18 items-center justify-center rounded cursor-pointer hover:shadow-md hover:shadow-green-200">已支付</button>
            <button v-on:click="pay_status_filter('TRADE_CLOSED')" class="flex bg-red-500 text-white w-18 items-center justify-center rounded cursor-pointer hover:shadow-md hover:shadow-red-200">已关闭</button>
          </div>
        </div>
        <div class="flex flex-col w-full h-250 mt-5 bg-white shadow-md shadow-[#C69C92] rounded-xl items-center">
          <div v-for="order in orders.results" :key="order.id" class="flex relative w-4/5 h-30 mt-7 rounded-xl bg-gray-100">
            <div class="absolute top-2 left-5 font-bold border-b text-[#FFD700] text-xl [text-shadow:0_0_2px_rgba(255,215,0,0.8)] tracking-wider">VIP {{order.card_name}}</div>
            <div :class="order.pay_status==='TRADE_SUCCESS' ? 'text-green-500' : (order.pay_status==='PAYING' ? 'text-yellow-500' : 'text-red-500')" class="absolute top-2 right-5 font-bold">
              {{order.pay_status==='TRADE_SUCCESS' ? '已支付' : (order.pay_status==='PAYING' ? '待支付' : '已关闭')}}
            </div>
            <div class="absolute top-12 right-5 font-bold">{{ order.order_mount }}元</div>
            <div class="absolute top-12 left-5 text-sm text-gray-500">{{ order.order_sn }}</div>
            <div class="absolute top-17 left-5 text-sm text-gray-500">{{ order.trade_no }}</div>
            <div class="absolute bottom-2 left-5 text-sm text-gray-500">{{ !order.pay_time ? "无" : time_format(order.pay_time) }}</div>
            <div v-if="order.pay_status==='PAYING'" v-on:click="pay(order)" class="flex absolute bottom-2 right-5 bg-yellow-500 text-white w-15 items-center justify-center rounded cursor-pointer hover:bg-blue-600">去支付</div>
            <div v-else-if="order.pay_status==='TRADE_CLOSED'" class="flex absolute bottom-2 right-5 bg-gray-700 text-white w-15 items-center justify-center rounded">已关闭</div>
            <div v-else v-on:click="order_info(order.order_sn)" class="absolute bottom-2 right-5 text-sm text-gray-500 hover:text-shadow-md hover:text-shadow-gray-300 cursor-pointer">查看详情&raquo;</div>
            </div>
          <!--    页码-->
          <Page :info="orders" :page_size="6" name="Orders" class="my-5"/>
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
