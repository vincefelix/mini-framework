import { hdleEvent } from "./event.mjs";

/**
 *
 * @param {object} VirtualDom -  DOM representation into an object
 * @param {string} appendTo  - the id of the element to which we want to append our new node
 * @returns {Node}
 * This function creates a new HTML element
 * with the given tag name, attributes, and children within the virtualDom passed as argument.
 * if no node's id to append the newly created node is given, the node is attached to the body
 */
export const newElement = (virtualDom = {}, appendTo = null, type = "") => {
    const element = document.createElement(virtualDom.tag); // Create a new element using the given tag name

    // Add attrs to the element
    if (virtualDom.attrs) {
      for (const [key, value] of Object.entries(virtualDom.attrs)) {
        element.setAttribute(key, value);
      }
    }

    if (virtualDom.event) {
      hdleEvent(virtualDom.event.type, element, virtualDom.event.script);
    }

    // Add children to the element
    if (virtualDom.children) {
      virtualDom.children.forEach((child) => {
        if (typeof child === "string") {
          // If the child is a simple text, create a text node
          element.appendChild(document.createTextNode(child));
        } else {
          // If the child is an object, recursively create an element
          element.appendChild(newElement(child));
        }
      });
    }

    if (appendTo !== null) {
      switch (type) {
        case "id":
          document.getElementById(appendTo).appendChild(element);
          break;
        case "class":
          document.getElementsByClassName(appendTo)[0].appendChild(element);
          break;
      }
    } else {
      document.body.appendChild(element);
    }
    return element;
  },
  prependElement = (virtualDom = {}, prependTo = null, type = "") => {
    const element = document.createElement(virtualDom.tag); // Create a new element using the given tag name

    // Add attrs to the element
    if (virtualDom.attrs) {
      for (const [key, value] of Object.entries(virtualDom.attrs)) {
        element.setAttribute(key, value);
      }
    }

    if (virtualDom.event) {
      hdleEvent(virtualDom.event.type, element, virtualDom.event.script);
    }

    // Add children to the element
    if (virtualDom.children) {
      virtualDom.children.forEach((child) => {
        if (typeof child === "string") {
          // If the child is a simple text, create a text node
          element.appendChild(document.createTextNode(child));
        } else {
          // If the child is an object, recursively create an element
          element.appendChild(newElement(child));
        }
      });
    }

    if (prependTo !== null) {
      switch (type) {
        case "id":
          document.getElementById(prependTo).prepend(element);
          break;
        case "class":
          document.getElementsByClassName(prependTo)[0].prepend(element);
          break;
      }
    } else {
      document.body.prepend(element);
    }
    return element;
  };
