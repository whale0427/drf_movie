import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {

    let isLogin=ref(false)

    function setLoginState(){
        isLogin.value=!!localStorage.getItem("token")
    }

    //Pinia 仓库中暴露的ref（会自动解包，在其他地方导入之后，不需要.value就能获取值）
    return { isLogin,setLoginState, }
})