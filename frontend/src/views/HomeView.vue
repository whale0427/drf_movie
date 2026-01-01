<script setup>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import Content from "@/components/Content.vue"

</script>

<template>
  <div class="text-white flex flex-col m-0 p-0 min-h-screen w-full">
    <div class="flex-1 min-w-[1890px]">
    <!--  导航栏-->
      <Header/>
    <!--  内容-->
      <Content/>
    </div>
  <!--  底部信息栏-->
    <div class="min-w-[1890px]">
      <Footer/>
    </div>
  </div>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
  background-color: #D1C4B4;
}
</style>
