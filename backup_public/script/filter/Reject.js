import { arrayIncludes, isTod } from '../array.js';
import Std from '../global/standard.js';

const eo = (num) => num % 2 === 0 ? 'E' : 'O';

class Arr extends Array {
    constructor(...args) {
        if (args.length === 1) {
            super(); // 1. เรียก super เปล่าๆ เพื่อให้ได้ instance มาก่อน
            this.push(args[0]);// 2. ค่อยใส่ค่าที่ต้องการลงไป
        } else {
            // กรณีอื่นๆ (ไม่มีค่า หรือมีหลายค่า) ให้ใช้ super ปกติ
            super(...args);
        }
    }

    // Smart feature: ensures map/filter return a standard Array
    static get [Symbol.species]() {
        return Array; 
    }
    toEO() {
        return this.map(num => eo(num));
    }
    toHML() {
        return this.map(num => Std.toHML(num));
    }

    plus(value) {
        return this.map(v => v + value);
    }
}

//เก็บข้อมูล ตัวที่ถูก reject
class Log {
    static rejected = [];
    static save({num=[], func=''}) {
        this.rejected.push({num, func});
    }
}
class RejectProps {
    constructor() {}
    set(key='', value=null) {
        this[key] = value;
    }
    get(key='') {
        if(!this[key]) throw new Error('no property='+key);
        return this[key]
    }
}
export const props = new RejectProps();

//NOTE class Reject this จะเท่ากับ []
export default class Reject extends Arr {
    constructor(...args) {
        super(...args); // Standard way to pass values to the parent Array
    }

    deny() {
        const config = props.get('config');
        const forecast2 = props.get('forecast2');
        const oppositeNumber = props.get('oppositeNumber');
        if(!config.Base) throw new Error('ต้องการใช้ config.Base');

        if(this.fc2(config.Policy, forecast2)) {
            Log.save({num: this.join(''), func: 'forecast2'});//เก็บข้อมูล ตัวที่ถูก reject
            return true;//true = reject
        }

        const keys = Object.entries(config.Base).filter(([k, v]) => k !== 'enable' && v == 1).map(([k,v]) => k);
        const fail = keys.find(name => {
            if(typeof this[name] !== 'function') throw new Error('expect function');
            if(name == 'oppositeNumber') 
                return this[name](config.Policy, oppositeNumber);
            return this[name]();
        });
        // const fail = this.eeeooo() ? 'eeeooo' : this.m03() ? 'm03' : this.triple() ? 'triple' : this.group() ? 'group' : false;
        // debugger;
        fail && Log.save({num: this.join(''), func: fail});//เก็บข้อมูล ตัวที่ถูก reject
        return fail ? true : false;
    }

    oppositeNumber(policy = 'safe', {bestOfMonth, bestOfAllTime}) {
        const {Numbers: {watch}} = props.get('config');
        //bestOfMonth: ดีที่สุดของเดือนนี้, bestOfAllTime: ดีที่สุดตลอดกาล
        const sixs = bestOfAllTime.map(({numbers}) => numbers);
        const bom = bestOfMonth.map(({numbers}) => numbers).filter(n6 => {//คัดตัวที่ไม่ตรงกับ bestOfAllTime ออกไป
            return sixs.some(six => isTod(six, n6))
        })
        const sixArray = policy == 'risk' ? (bom.length > 0 ? bom : sixs): policy == 'safe' ? sixs :  null;//safe ตัวเลขเยอะ, risk ตัวเลขน้อย
        const found = sixArray.find(six => this.every(n => six.includes(n)));
        if(watch.length == 3 && isTod(this, watch) && !found) console.error('Base->oppositeNumber not match watch='+watch.join(''));
        // debugger;
        return !found;//true = reject, 
    }

    //NOTE ทำงานเมื่อ policy = risk เท่านั้น
    fc2(policy = '', forecast2 = []) {
        if(policy == 'safe' || forecast2.length == 0) return false;
        const {Numbers: {watch}} = props.get('config');
        const match = forecast2.some(two => arrayIncludes(two, this));
        if(watch.length == 3 && isTod(this, watch) && !match) console.error('Base-forecast2 not match watch='+watch.join(''));
        // debugger;
        return !match
    }
    //reject sum not in range 9-18
    group() {
        const sum = this.reduce((acc, val) => acc + val, 0);
        if(sum < 8 || sum > 18) {
            return true; //reject
        }
        return false; //accept
    }
    //reject 333, 444, 555, ...
    triple() {
        if(this.every(v => v === this[0])) {
            return true; //reject
        }
        return false; //accept
    }
    //reject EEE or OOO
    eeeooo() {
        const eoArr = this.toEO();
        if(eoArr.every(v => v === 'E') || eoArr.every(v => v === 'O')) {
            return true; //reject
        }
        return false; //accept
    }
    //reject M = 0 || 3 ตัว หรือ หมายความว่า ต้องมี [3,4,5,6] จำนวน 1-2 ตัว
    m03() {
        const hmlArr = this.toHML();
        const mCount = hmlArr.filter(v => v == 'M').length;
        if([0,3].some(v => v == mCount)) {
            return true; //reject
        }
        return false; //accept
    }
}

export { Log }