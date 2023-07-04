import { getToken } from "./auth";
export default function socket(userId){
  var socket;
  console.log('window.WebSocket',window.WebSocket)
      if (!window.WebSocket){
        window.WebSocket = window.MozWebSocket;
      }
      if (window.WebSocket) {

        // socket = new WebSocket(`ws:${window.location.host}/websocket/`+getToken());
        socket = new WebSocket(`http://192.168.7.10:9020/publicServer`);
        socket.onmessage = function(event) {
           console.log("收到消息!!!",event.data,new Date().toString());
        };
        socket.onopen = function(event) {
          console.log("WebSocket连接连接开始!   ",new Date().toString());
          setInterval(()=>{
            send('webSocket发送消息   '+new Date().toString())
         },1000*60*10)
        };
        socket.onclose = function(event) {
          console.log('event',event)
          console.log("WebSocket连接连接断开!   ",new Date().toString());
        };
      } else {
        console.log("抱歉，您的浏览器不支持WebSocket协议!   ",new Date().toString());
      }

      function send(message) {
        if (!window.WebSocket) { return; }
        // console.log('socket',socket.readyState == WebSocket.OPEN)
        if (socket.readyState == WebSocket.OPEN) {
          console.log('message',message)
          socket.send(message);
        }else{
          console.log("WebSocket连接没有建立成功!",new Date().toString());
        }
      }


}
