export const hdleEvent =(event, element, func) => {
    document.getElementById(element).addEventListener(event, ()=>{func()});
}