function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

class Obj {
    static isObject = isObject
}

export default Obj;

// window.Obj = Obj