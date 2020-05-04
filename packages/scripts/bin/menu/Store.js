module.exports = class Store {
  constructor(initialState = {}, pure = false) {
    this.state = initialState;
    this.pure = pure;
    this.handlers = [];
  }

  setState(nextState) {
    const changed = this.pure || nextState !== this.data;

    this.state = nextState;
    if (changed) {
      for (let i = 0; i < this.handlers.length; i++) {
        this.handlers(nextState);
      }
    }
  }

  subscribe(handler) {
    this.handlers.push(handler);

    return () => {
      this.handlers = this.handlers.filter(item => item !== handler);
    };
  }
};
