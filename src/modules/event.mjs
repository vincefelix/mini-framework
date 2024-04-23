/**
 * Attaches an event listener to the specified HTML element.
 * 
 * @param {string} event - The type of event to listen for (e.g., "click", "mouseover").
 * @param {HTMLElement} element - The HTML element to attach the event listener to.
 * @param {Function} func - The function to call when the event is triggered.
 */
export const hdleEvent = (event, element, func) => {
  element.addEventListener(event, (e) => {
    func(e);
  });
};
