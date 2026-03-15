import { getData } from "../api.js";
import {arrayIncludes, isTod} from "../array.js"
import Reject, { Log, props } from "./Reject.js";

//คำนวนหาเลข 2ตัว จากสถิติ
async function cal2(lastDraw, year) {
    function avg(two) {
        return Number((two.reduce((a,b) => a += (b[0]+b[1]), 0) / two.length).toFixed(1));
    }
    let stat = lastDraw && await getData(`/db/find-next?position=${'up'}&number=${lastDraw.join('')}`);
    stat = stat.filter(arr => {
        return arr.some(({date}) => Number(date.split(/ /g)[2]) < Number(year));//ตัดปีนี้ออกไป
    });
    const n2 = stat.map(([a]) => Array.from(a.digit2Up, Number));
    const sum = avg(n2);//จากสถิติ
    const forecast2 = [];//เลข 2ตัว ที่คาดว่าจะออก
    for(let s = 0; s < 10; s++) {
        for(let n = 0; n < 10; n++) {
            if(n < s) continue;
            const test = avg([[s,n], ...n2]);
            const increment = 0.1;// 0.1 | 0.2
            for(let i = sum; i <= (sum+0.8); i = Number((i + increment).toFixed(1)) ){
                test == i && forecast2.push([s,n])
                // debugger;
            }
            // test >= sum && test <= (sum+0.8) && forecast2.push([s,n])
        }
    }
    // debugger;
    props.set('forecast2', forecast2)
    return forecast2
}

export class Base {
    base = {up3: null, up2: null}
    constructor({y=68, reports={}}) {
        this.y = y;
        this.reports = reports;//allYear, yearly, thisYear
        // debugger;
        return (async() => {
            await this.fetchData();
            await this.predict2();
            await this.reduceBase(y)
            return this;
        })()
    }
    async fetchData() {
        const {data: base3} = await getData(`/output/base?digit=${3}&place=up`);
        const cf = await getData('/system/config');
        const {bestOfMonth, bestOfAllTime} = await getData(`/formula/opposite-number?m=${cf.Date.upcoming.m}`);
        props.set('config', cf);
        props.set('oppositeNumber', {bestOfMonth, bestOfAllTime})
        this.base3 = base3;
        this.config = cf;
    }
    async predict2() {
        const cf = this.config;
        const upcoming = cf.Date.upcoming;
        if(this.y !== upcoming.y) throw new Error('expect same year');
        const lastDraw = cf.Numbers.lastDraw.filter((n,i) => i > 0);//2ตัว
        this.forecast2 = await cal2(lastDraw, upcoming.y);
        if(cf.Numbers.watch.length == 3) {
            !this.forecast2.some(two => arrayIncludes(two, cf.Numbers.watch)) && console.error('forecast2 not match watch.');
        }
        // props.set('forecast2', this.forecast2);
        return this.forecast2;
    }

    //NOTE ลดจำนวนตัวที่อยู่ใน base ลง โดยการ reject ตัวที่ไม่ผ่านเงื่อนไข
    async reduceBase(y=68) {
        let reduced = this.base3.numbers.filter(three => {
            const reject = new Reject(...three).deny();
            return !reject;
        });
        
        this.base.up3 = reduced;
        Log.rejected;//NOTE ตรวจสอบความถูกต้องของตัวที่ถูก reject
        debugger;
    }

    matchUp3(three = []) {
        if(!Array.isArray(three) || three.some(ar => 3 !== ar.length)) throw new Error('invalid array');
        const resolved = [];
        const rejected = [];
        for(let [i, num] of three.entries()) {
            const x = this.base.up3.some(n => isTod(n, num)) ? resolved.push(three[i]) && true : rejected.push(three[i]) && false;
            // if(!x) debugger
        }
        // debugger
        return {resolved, rejected}
    }
}
