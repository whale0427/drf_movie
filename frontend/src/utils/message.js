import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

//定义默认导出函数  或者可以直接定义一个函数 export function
export default function showMessage(message,status="error",callback_func,duration=2500,position="center"){
    let background=""
    if(status==="error"){
        background="linear-gradient(to right, #ff5f6d, #ffc371)"
    }else{
        background="linear-gradient(to right, #00b09b, #96c93d)"
    }

    Toastify({
      text: message,
      duration: duration,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: position, // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: background,
      },
      callback:callback_func,
      // callback:function(){
      //     if(!callback_func) return;
      //     callback_func()
      // },
      onClick: function(){}, // Callback after click
    }).showToast();
}

export function showMessageOptions(message,options={}){
    const{
        status = "error",
        callback_func,
        duration = 2500,
        position = "center"
    }=options
    let background=""
    if(status==="error"){
        background="linear-gradient(to right, #ff5f6d, #ffc371)"
    }else{
        background="linear-gradient(to right, #00b09b, #96c93d)"
    }

    Toastify({
      text: message,
      duration: duration,
      close: true,
      gravity: "top",
      position: position,
      stopOnFocus: true,
      style: {
        background: background,
      },
      callback:callback_func,
      onClick: function(){},
    }).showToast();
}