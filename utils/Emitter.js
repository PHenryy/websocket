class Emitter {
  constructor() {
    this.handlers = {};
  }

  on(evt, handler) {
    this.handlers[evt] = this.handlers[evt] || [];
    let hdl = this.handlers[evt];
    hdl.push(handler);
    return this;
  }

  removeListener(evt, handler) {
    this.handlers[evt] = this.handlers[evt] || [];
    let hdl = this.handlers[evt];
    let index = hdl.indexOf(handler);
    if (index >= 0) {
      hdl.splice(index, 1);
    }
    return this;
  }

  once(evt, handler) {
    this.handlers[evt] = this.handlers[evt] || [];
    let hdl = this.handlers[evt];
    hdl.push(function f(...args) {
      handler.apply(this, args);
      this.removeListener(evt, f);
    });
    return this;
  }

  emit(evt, ...args) {
    this.handlers[evt] = this.handlers[evt] || [];
    let hdl = this.handlers[evt];
    hdl.forEach(it => {
      it.apply(this, args);
    });
  }

  listeners(evt) {
    return this.handlers[evt] || [];
  }

  listenerCount(evt) {
    return this.handlers[evt].length;
  }

  eventNames() {
    return Object.keys(this.handlers).reduce((arr, evt) => {
      if (this.listenerCount(evt)) {
        arr.push(evt);
      }
      return arr;
    }, []);
  }
}

export default Emitter;
