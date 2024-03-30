export class HdleState {
  constructor(initialState = {}) {
    this.state = { ...initialState }; // initial state
    this.renderer = new Set(); // set of renderer functions
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
   * @param {object} newState
   * it updates  the state by merging the provided newState with the current state
   * and notifies all registered renderers about the update
   */
  apply(newState) {
    this.state = { ...this.state, ...newState };
    this.callRenderers();
  }

  /**
   *it adds a renderer func to the set collection
   */
  addRenderer(listener) {
    this.renderer.add(listener);
  }

  /**
   * @method
   * @param {Function} fn - The function that will be removed from the set collection
   * @returns {null}
   * it removes a renderer in the set collection
   */
  removeRenderer(fn) {
    this.renderer.delete(fn);
  }

  /**
   * @method
   * @returns {null}
   * it informs all renderers of new state added
   */
  callRenderers() {
    for (const renderer of this.renderer) {
      renderer(this.get()); // executing each renderer func
    }
  }
}
