export default {
  mounted() {
    if (this.$options.socket) {
      Object.keys(this.$options.socket).forEach(event => {
        this.$socket.on(event, this.$options.socket[event]);
      });
    }
  },

  beforeDestroy() {
    if (this.$options.socket) {
      Object.keys(this.$options.socket).forEach(event => {
        this.$socket.removeListener(event, this.$options.socket[event]);
      });
    }
  }
};
