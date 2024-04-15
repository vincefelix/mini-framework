export const hdleEvent = (event, element, func) => {
  element.addEventListener(event, () => {
    func();
  });
};
