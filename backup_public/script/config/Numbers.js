// import {getMonthIndex} from '../date.js'
import { getData } from "../api.js";

class Advance extends EventTarget{
    constructor() {
        super()
        this.addEventListener('upcomingDraw', async (e) => {
            const {d,m,y} = e.detail;
            // debugger;
            await this.fetchData(y, m, d)
        });
        // this.addEventListener('Done', e => {
        //     debugger;
        // })
    }
    isReady() {
        if(this._position && this._digit && this.upcoming && this.draw) {
            this._isReady = true;
            // debugger;
            this.onReady()
            // this.event.fire('ready')
        }
    }
    fire = (name = 'onComplete', data = 'hello world') => {
        this.dispatchEvent(new CustomEvent( name, { detail: data }))
    }
    async fetchData(y, m, d) {
        if(!Number.isFinite(y*1)) throw new Error('y ='+y);
        // const url = `/playground/db/present?presentYear=${y}`;
        // this.data = await getData(url);
        // debugger
        const lastDraw = await getData(`/db/query/previous?y=${y}&m=${m}&d=${d}`);//หวยงวดที่แล้ว
        const [upcomingDraw] = await getData(`/db/query?y=${y}&m=${m}&d=${d}`);//งวดที่จะทำการคำนวณ ถ้ายังไม่มีผลการออกรางวัล จะได้ค่าเป็น  undefined
        this.draw = {lastDraw, upcomingDraw};
        // debugger;
        this.isReady()
    }

    onReady() {
        if(!this._isReady) throw new Error('ต้องเรียกใช้หลังจาก this.digit, this.position, และ this.upcoming มีข้อมูลครบแล้ว');
        const {lastDraw, upcomingDraw} = this.draw;
        if(this.digit == 2) {
            const watch = upcomingDraw ?  Array.from(upcomingDraw.digit2Up, (v) => v*1) : [];
            this.setWatch(watch)
            this.setLastDraw(Array.from(lastDraw.digit2Up, (v) => v*1));
        }else if(this.digit == 3) {
            const watch = upcomingDraw ?  Array.from(upcomingDraw.digit3Up, (v) => v*1) : [];
            this.setWatch(watch)
            this.setLastDraw(Array.from(lastDraw.digit3Up, (v) => v*1));
        }else {
            throw new Error('invalid digit='+this.digit);
        }
        // debugger;
        this.fire('Done', true)
    }
}

export default class Numbers  extends Advance{
    constructor() {
        super()
    }
    
    //ส่งไปให้ class Date
    setUpcomingDraw({d, m, y}) {
        if(this.upcoming) throw new Error('Config upcoming draw is already set.')
        this.upcoming = {d, m, y}
        this.fire('upcomingDraw', {d,m,y})
    }

    setPosition(p='up'){
        if(this._position) throw new Error('Config position is already set.')
        if(p !== 'up' && p !== 'down') throw new Error('invalid position='+p);
        this._position = p;
        // debugger;
        this.isReady();
    }
    setDigit(n=2) {
        if(this._digit) throw new Error('Config digit is already set.')
        if(n !== 2 && n !== 3) throw new Error('invalid digit='+n);
        this._digit = n;
        // debugger;
        this.isReady();
    }
    //หวยงวดล่าสุด | งวดที่แล้ว
    setLastDraw(n=[]) {
        if(this._lastDraw) throw new Error('Config last draw is already set.')
        if(!Array.isArray(n) || ![2,3].some(v => n.length == v)) throw new Error('ต้องการอาเรย์ตัวเลข 3ตัว หรือ 2ตัว');
        this._lastDraw = n;
    }
    //ต้องการอาเรย์ตัวเลข 3ตัว หรือ 2ตัว เช่น [3,4,9] หรือ [4,9]
    setWatch(n=[3,9,5]) {
        if(this._watch) throw new Error('Config watch is already set.')
        if(!Array.isArray(n) || ![0,2,3].some(v => n.length == v)) throw new Error('ต้องการอาเรย์ตัวเลข 3ตัว หรือ 2ตัว');
        this._watch = n;
    }
    
    get position() {
        if(!this._position) throw new Error('Config position is not set.')
        return this._position
    }
    get digit() {
        if(!this._digit) throw new Error('Config digit is not set.')
        return this._digit
    }
    get lastDraw() {
        if(!this._lastDraw) throw new Error('Config lastDraw is not set.')
        return this._lastDraw
    }
    get watch() {
        if(!this._watch) throw new Error('Config watch is not set.')
        return this._watch
    }
}