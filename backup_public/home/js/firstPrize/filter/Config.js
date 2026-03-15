import { removeSameArray } from "../../../../../function/common.js";
import { isTod } from "../../../../../function/lottery.js";
import PastTime from "../history/history.js"
import { Constant } from "../FirstPrize.js";
import Settings from "../settings.js";

const {setHML} = Settings;
const {Group, Month, Year, history} = PastTime;
// debugger

class Config {
    hml = {h: [], m: [], l: []};// [min, max] จำนวนตัวอักษร H M L
    eo = {e: [], o: []};
    range = [];//ช่วงตัวเลข [ min, max ] เช่น [8,1,8,8,9,4] จะได้ [1, 9]
    couple = null;//คู่ตัวเลข เช่น [8,1,8,8,9,4] sorted=> [1,4,8,8,8,9] จะได้ low:[1,4], mid:[8,8], high:[8,9]
    enable = {hml: true, sum: true, range: true, couple: true};

    constructor() {}

    matchSum = (sum) => {
        if(this.sum !== sum) throw new Error('ต้องเป็น group เดียวกัน');
        return true
    }

    //จำนวนตัวอักษร H M L
    matchHML = (h = [], m = [], l = []) => {
        if(Object.values(this.hml).every(arr => arr.length === 0) || this.enable.hml !== true) return true;
        const hml = (text = 'h') => {
            text = text.toLowerCase();
            const [min, max] = this.hml[text];
            const char = text === 'h' ? h : text === 'm' ? m : text === 'l' ? l : null;
            return char.length >= min && char.length <= max
        }
        const match1 = hml('h') && hml('m') && hml('l');
        // const match2 = !match1 && this.review.hml.text.origin.some(arr => isTod(arr, [...h, ...m, ...l]));//จะทำให้มีตัวเลขเพิ่มมากขึ้น

        return match1
    }

    matchEO = (even = 0, odd = 0) => {
        const {e, o} = this.eo;
        const match = [e, o].every(([min, max], i) => {
            const quantity = i == 0 ? even : odd;
            return quantity >= min && quantity <= max
        })
        // debugger
        return match
    }

    //ช่วงตัวเลข [ min, max ] เช่น [8,1,8,8,9,4] จะได้ [1, 9]
    matchRange = ([min, max]) => {
        debugger;//NOTE - matchRange อาจถูกยกเลิกใช้งาน
        if(this.range.length === 0 || this.enable.range !== true) return true;
        return this.range.some(r => r[0] === min && r[1] === max)
    }

    //คู่ตัวเลข เช่น [8,1,8,8,9,4] sorted=> [1,4,8,8,8,9] จะได้ low:[1,4], mid:[8,8], high:[8,9]
    matchCouple = (firstPrize = []) => {
        debugger;//NOTE - matchCouple อาจถูกยกเลิกใช้งาน
        if(!this.couple || this.enable.couple !== true) return true;
        // const text = firstPrize.sort((a,b) => a - b).map(n => [0,1,2,3].some(nb => nb == n) ? 'L' : [4,5].some(nb => nb == n) ? 'M' : 'H')
        const text = firstPrize.sort((a,b) => a - b).map(n => setHML(n))
        const [low, mid, high] = [ [text[0], text[1]], [text[2], text[3]], [text[4], text[5]] ];

        const matchLow = this.couple.l.some(c => isTod(low, c.text));
        const matchMid = this.couple.m.some(c => isTod(mid, c.text));
        const matchHigh = this.couple.h.some(c => isTod(high, c.text));
        // debugger
        return [matchLow, matchMid, matchHigh].filter(v => v === true).length >= 2;//NOTE - ทุกตัวต้องเป็น true เท่านั้น
    }
}



//group 29 เป็น group ที่ออกรางวัลเกือบทุกปี
class GroupModel extends Config{
    sum = null;
    constructor(group = 29) {
        if(typeof group !== 'number') throw new Error('require type of Number');
        super();
        this.sum = group;
        this.#main()
    }
    #main = () => {
        const {results, getGroup, reviewGroup} = Group;
        // const {history, members, win} = getGroup(this.sum)
        this.review = {...reviewGroup(this.sum)};
        // debugger
        this.#setHML()
        this.#setEO()
        this.#setRange()
        this.#setCouple()
        // debugger
    }

    #setHML = () => {
        const {hml} = this.review;
        const {high, mid, low} = hml.limit;
        this.hml.h = [high.min, high.max];
        this.hml.m = [mid.min, mid.max];
        this.hml.l = [low.min, low.max];
        // debugger
    }

    #setEO = () => {
        const {eo} = this.review;
        const {even, odd} = eo.limit;
        this.eo.e = [even.min, even.max];
        this.eo.o = [odd.min, odd.max];
        // debugger
    }

    #setRange = () => {
        const {range} = this.review;
        const unique = removeSameArray(range);
        this.range = unique;
        // debugger
    }

    #setCouple = () => {
        const {mix: {couple: {priority}}} = this.review;
        this.couple = priority;
        // debugger
    }
}

//group ที่เคยออกรางวัล
const everWinGroups = Group.results.groups.filter(({history}) => history.length > 0);
//group ที่ไม่เคยออกรางวัล
const neverWinGroups = Group.results.groups.filter(({history}) => history.length === 0);


export default class Prototype { 
    constructor(group = 29) {
        this.#validateGroup(group);
        this.Model = new GroupModel(group);
        // debugger
    }

    #validateGroup = (group = 29) => {
        const ever = everWinGroups.map(({group: g}) => g).sort((a,b) => a - b);
        const never = neverWinGroups.map(({group: g}) => g).sort((a,b) => a - b);
        
        const invalid = !ever.some(g => g === group) && !never.some(g => g === group);
        if(invalid) throw new Error('ไม่มี group='+group);
        if(!ever.some(g => g === group))
            throw new Error(`group=${group} ไม่เคยออกรางวัล`);
        this.group = group;
    }

}

// const config = new Match();
// export default config;