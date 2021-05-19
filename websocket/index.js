import { isFunction } from "@/utils/index";
import Emitter from "@/utils/Emitter";
import Logger from "@/utils/Logger";

class EnhancementWebSocket extends Emitter {
  constructor(url, enhancementOptions) {
    super();
    this.defaultOptions = {
      stringifyMessage: false,
      autoConnect: true,
      reconnectInterval: 1000,
      pingEnabled: false,
      pingInterval: 5000,
      pongTimeout: 5000,
      pingMessage: "ping",
      pongMessage: "pong",
      reconnectOnError: true,
      maxReconnectAttempts: 5,
      debug: false
    };

    this.options = { ...this.defaultOptions, ...enhancementOptions };
    Logger.debug = this.options.debug;
    this.url = url;
    this.pingTimeout = null;
    this.pongTimeout = null;
    this.socket = null;
    this.reconnectAttempts = 0;

    if (this.options.autoConnect) {
      this.socket = this.connect();
    }
  }

  connect() {
    const socket = new WebSocket(this.url);

    socket.onopen = this.onopen.bind(this);
    socket.onmessage = this.onmessage.bind(this);
    socket.onclose = this.onclose.bind(this);
    socket.onerror = this.onerror.bind(this);

    return socket;
  }

  onopen() {
    Logger.info("onopen...");
    if (this.options.pingEnabled) {
      this.sendPing();
    }
  }

  onmessage(messageEvent) {
    Logger.info("onmessage...");

    if (this.options.pingEnabled) {
      if (isFunction(this.options.pongMessage)) {
        const pongReceived = this.options.pongMessage.call(
          null,
          messageEvent.data
        );
        if (pongReceived) {
          return this.pongReceived();
        }
      } else {
        if (messageEvent.data === this.options.pongMessage) {
          return this.pongReceived();
        }
      }
    }

    const data = this.options.stringifyMessage
      ? JSON.parse(messageEvent.data)
      : messageEvent.data;

    this.emit("message", data);
  }

  onclose() {
    Logger.info("onclose...");
    this.cleanup();

    this.reconnectAttempts += 1;
    Logger.info("reconnectAttempts", this.reconnectAttempts);
    Logger.info("maxReconnectAttempts", this.options.maxReconnectAttempts);

    if (this.reconnectAttempts < this.options.maxReconnectAttempts) {
      setTimeout(() => {
        this.socket = this.connect();
      }, this.options.reconnectInterval);
    }
  }

  onerror() {
    Logger.error("onerror...");
    if (this.options.reconnectOnError) {
      this.onclose();
    }
  }

  send(data) {
    Logger.info("sending data...", data);
    this.socket.send(
      this.options.stringifyMessage ? JSON.stringify(data) : data
    );
  }

  sendPing() {
    this.pingTimeout = setTimeout(() => {
      this.send(this.options.pingMessage);
      this.pongTimeout = setTimeout(() => {
        this.pongTimedOut();
      }, this.options.pongTimeout);
    }, this.options.pingInterval);
  }

  pongTimedOut() {
    Logger.info("pong timedout...");
    this.socket.close();
  }

  pongReceived() {
    clearTimeout(this.pongTimeout);
    this.sendPing();
  }

  cleanup() {
    Logger.info("cleanup...");

    clearTimeout(this.pongTimeout);
    clearTimeout(this.pingTimeout);
    this.socket.onopen = this.dumb;
    this.socket.onmessage = this.dumb;
    this.socket.onclose = this.dumb;
    this.socket.onerror = this.dumb;
  }

  dumb() {}
}

export default EnhancementWebSocket;
