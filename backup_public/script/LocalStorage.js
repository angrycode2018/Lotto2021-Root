
//การใช้ new LocalStorage จะดีกว่าการใช้งานโดยตรงจาก window.localStorage 
// เพราะใน class จะมี JSON.stringify และ .parse อยู่ด้วย ทำให้สามารถเก็บ key ที่เป็น object หรือ array ได้
export default class LocalStorage {
    constructor() {
    }
    get = (key ='') => {
        const value = localStorage.getItem(key);
        const result = JSON.parse(value);
        return result || null;
    }

    //ต้องใช้ JSON.stringify และ .parse เนื่องจาก Window.localStorange ไม่รองรับการเก็บข้อมูลที่มีความซับซ้อน เช่น array or object
    set = ( key ='', value ='' ) => {
        const jsonVal = JSON.stringify(value);
        const found = this.get(key);//ถ้ามีอยู่แล้ว ห้ามทำการ add
        if(found) throw new Error( 'storage key='+key+' is exist.');
        localStorage.setItem(key, jsonVal);
    }

    //ถ้าต้องการให้ข้อมูลมีการ update ใหม่เสมอ ให้ใช้ .update แทน .set
    update = ( key, value ) => {
        const jsonVal = JSON.stringify(value);
        localStorage.setItem(key, jsonVal)
    }

    delete = (key) => {
      localStorage.removeItem(key);
    }

    clear = () => {
      localStorage.clear();
    }
}