export class Router {
  constructor(props = {}) {
    this.routes = props;
  }
  /**
   * @method
   * it renders  the component associated with the current route, or a default one if no match is found
   */
  loadCurrentView() {
    const currentRoute = window.location.pathname.slice(window.location.pathname.lastIndexOf("/")) || "/";
    console.log("ddde => ", currentRoute);
    const viewName = this.routes[currentRoute];
    if (viewName) {
      this.routes[viewName]();
      console.log(` view: ${viewName} loaded`);
    } else {
      console.error("endpoint not found:", currentRoute);
    }
  }
}
