<script setup>
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import axios from "axios";
import {showMessageOptions} from "@/utils/message.js";
import time_format from "@/utils/time.js";

const route=useRoute()
const order_data=ref([])

onMounted(()=>{
  console.log("Order页面加载时请求接口")
  order_info()
})

function order_info(){
  const order_sn=route.query.order_sn
  if(!order_sn) return
  axios
    .get("/api/orders/?order_sn="+order_sn)
    .then(response=>{
      order_data.value=response.data.results[0]
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
  localStorage.setItem("order_back",true)
  window.history.back()
}
function order_print(){
  // 临时添加打印样式
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      .no-print { display: none !important; }
      .print-content {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        height: auto !important;
        margin: 0 !important;
        padding: 20px !important;
        box-shadow: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  window.print();

  // 打印后移除样式
  setTimeout(() => {
    document.head.removeChild(style);
  }, 100);
}
</script>

<template>
  <div class="text-white flex flex-col m-0 p-0 min-h-screen w-full">
    <div class="flex-1 min-w-[1890px]">
    <!--  导航栏-->
      <Header class="no-print"/>
    <!--  内容-->
      <div class="print-content flex w-full h-full items-center justify-center tracking-wider">
        <div class="flex flex-col relative shadow-md shadow-[#C69C92] bg-white rounded mt-10 w-[450px] h-[500px]">
          <router-link :to="{name:'Orders'}" class="flex absolute right-2 my-2 text-gray-500 text-sm hover:text-shadow-xs hover:font-bold hover:text-shadow-gray-300 no-print">我的订单</router-link>
          <div v-on:click="back" class="flex absolute left-2 my-2 text-gray-500 text-sm hover:text-shadow-xs hover:font-bold hover:text-shadow-gray-300 cursor-pointer no-print">返回</div>
          <div class="flex flex-col mt-10 text-black font-bold text-xl items-center">
            订单详情
          </div>
          <div class="flex flex-col mt-10 mx-10 text-black">
            <div v-if="order_data.length!==0" class="space-y-5 break-words">
              <div>当前状态：{{order_data.pay_status_display}}</div>
              <div>支付时间：{{ !order_data.pay_time ? "无" : time_format(order_data.pay_time) }}</div>
              <div>商品名称：
                <span class="text-[#FFD700] [text-shadow:0_0_2px_rgba(255,215,0,0.8)] tracking-wider">
                  {{order_data.card_info}} {{order_data.card_name}}
                </span>
              </div>
              <div>支付金额：{{order_data.order_mount}}</div>
              <div>支付方式：{{order_data.pay_type_display}}</div>
              <div>订单编号：{{order_data.order_sn}}</div>
              <div>交易单号：{{ !order_data.trade_no  ? "无" : order_data.trade_no }}</div>
            </div>
            <div v-else class="font-bold text-md">
              无
            </div>
          </div>
          <div v-on:click="order_print" class="flex mt-10 mx-auto bg-blue-600 text-white w-13 items-center justify-center rounded cursor-pointer hover:shadow-md hover:shadow-blue-300 no-print">打印</div>
        </div>
      </div>
    </div>
  <!--  底部信息栏-->
    <div class="min-w-[1890px] no-print">
      <Footer/>
    </div>
  </div>
</template>

<style scoped>

</style>
