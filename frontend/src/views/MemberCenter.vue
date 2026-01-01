<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import {onMounted, ref, watch} from "vue";
import axios from "axios";
import showMessage, {showMessageOptions} from "@/utils/message.js";
import {useUserStore} from "@/stores";
import Swal from "sweetalert2"
import {useRouter,useRoute} from "vue-router";

const router=useRouter()
const route=useRoute()

onMounted(()=>{
  console.log("MemberCenter页面加载时请求接口")
  card_info()
  // order_jump()
})

const cards=ref("")

function card_info(){
  axios
    .get("/api/card/")
    .then(response=>{
      cards.value=response.data
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

const userStore=useUserStore()

function recharge(card_id){
  if(userStore.isLogin){
    axios
      .get("/api/alipay/"+card_id)
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
          }else{
            axios
              .delete("/api/alipay/?order_sn="+response.data.order_sn)
              .catch(error=>{
                showMessage(error)
              })
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

// function order_jump(){
//   const out_trade_no=route.query.out_trade_no || ""
//   if(!out_trade_no) return
//   Swal.fire({
//     icon:"success",
//     title:"支付成功",
//     text:"是否查看当前订单",
//     showCancelButton:true,
//     confirmButtonText:"是",
//     cancelButtonText:"否",
//     allowOutsideClick:false,
//     allowEscapeKey:false,
//   }).then(result=>{
//     if(result.isConfirmed){
//       router.push({
//         name:"Order",
//         query:{
//           "order_sn":out_trade_no
//         }
//       })
//     }else{
//       router.push({name:"MemberCenter"})
//     }
//   })
// }
</script>

<template>
  <div class="text-white flex flex-col m-0 p-0 min-h-screen w-full">
    <div class="flex-1 min-w-[1890px]">
    <!--  导航栏-->
      <Header/>
    <!--  内容-->
      <div class="flex item-center justify-center mt-10">
        <div class="flex flex-col mb-8 items-center w-200 bg-[#FFFCF3] text-black rounded shadow-sm shadow-[#9B331A]">
          <div class="flex my-10 text-2xl font-bold">会员中心</div>
          <div class="flex flex-wrap gap-10 mb-10">
            <div v-for="card in cards.results" :key="card.id" class="flex flex-col space-y-3 w-40 h-45 bg-[#FFF9E9] items-center rounded shadow-sm shadow-[#F8D06A]">
              <div class="flex mt-4 font-bold border-b text-[#FFD700] text-xl [text-shadow:0_0_2px_rgba(255,215,0,0.8)] tracking-wider">{{card.info}} {{card.card_name}}</div>
              <div class="space-y-1">
                <div class="flex">价格：{{card.card_price}}元</div>
                <div class="flex">有效期：{{card.duration}}天</div>
              </div>
              <div v-on:click="recharge(card.id)" class="flex w-4/5 h-8 bg-[#B64529] rounded text-white transition-all duration-200 hover:shadow-md hover:shadow-gray-400 items-center justify-center cursor-pointer">
                充值
              </div>
            </div>
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
