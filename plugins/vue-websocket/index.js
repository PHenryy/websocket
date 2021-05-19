import Vue from "vue";
import store from "@/store/index";

import VueWebSocket from "./vue-websocket";

const socketUrl = "ws://xxxx:xxxx/webSocket";
const pingMessage = {
  cmd: 1000
};

Vue.use(
  new VueWebSocket({
    url: socketUrl,
    options: {
      debug: false,
      stringifyMessage: true,
      pingEnabled: true,
      pingInterval: 10000,
      pingMessage: pingMessage,
      pongMessage: data => {
        try {
          return JSON.parse(data).status == 1;
        } catch (error) {
          console.error(error.message);
          return false;
        }
      }
    },
    store
  })
);
