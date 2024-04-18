export const hdleEvent = (event, element, func) => {
    element.addEventListener(event, (e) => {
      func(e);
    });
  },
  removeEvent = (event, element, func) => {
    element.removeEventListener(event, (e) => {
      func(e);
    });
  };
