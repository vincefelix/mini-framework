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
    console.log("getting with...", this.state);
    //localStorage.setItem("data", JSON.stringify(this.state));
    return { ...this.state };
  }

  /**
   * @method
   * @returns {Function} {
    
   }}
   */
  set(fn) {
    console.log("setting with...", fn);
    console.log("current state: ", this.state);
   // localStorage.setItem("data", JSON.stringify(this.state));
    this.state = fn(this.state);
  }
}
