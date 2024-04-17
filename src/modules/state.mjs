export class HdleState {
  constructor(initialState = {}) {
    this.state = { ...initialState }; // initial state
  }

  /**
   * @method
   * @returns {object}
   * it returns  a copy of the current state and not reference to it,
   * so it can be safely modified without mutating the state directly
   */
  get() {
    return { ...this.state };
  }

  /**
   * @method
   * @returns {Function} {
    
   }}
   */
  set(fn) {
    this.state = fn(this.state);
  }
}
