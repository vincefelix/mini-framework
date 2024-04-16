export class Router {
  constructor(props = {}) {
    this.routes = props;
  }
  /**
   * @method
   * it renders  the component associated with the current route, or a default one if no match is found
   */
  loadCurrentView() {
    const currentRoute = window.location.href.split("#")[1];
    const viewName = this.routes[currentRoute];
    if (viewName) {
      this.routes[currentRoute]();
      console.log(` view: ${currentRoute} loaded`);
    } else {
      console.error("endpoint not found:", currentRoute);
    }
  }
}
