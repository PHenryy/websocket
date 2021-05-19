import EnhancementWebSocket from "@/websocket/index";
import mixin from "./mixin";

export default class VueWebSocket {
  // eslint-disable-next-line no-unused-vars
  constructor({ url, options, store }) {
    this.ew = new EnhancementWebSocket(url, options);
    this.ew.on("message", message => {
      if (message.status === 0 && "SOCKET_DATA" in store._mutations) {
        store.commit("SOCKET_DATA", message.content);
      }
    });
  }

  install(Vue) {
    Vue.prototype.$socket = this.ew;
    Vue.mixin(mixin);
  }
}
