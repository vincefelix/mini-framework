export const hdleEvent = (event, element, func) => {
  element.addEventListener(event, (e) => {
    func(e);
  });
};
