import { DateTime } from "../../../../class/utils/DateTime/DateTime.js";
import { exit, findMinMaxInArray, uniqueArray } from "../../../../function/common.js";

class Text {
    static H = { a: [6,7,8,9], b: [7,8,9] };
    static M = { a: [4,5],     b: [3,4,5,6] };
    static L = { a: [0,1,2,3], b: [0,1,2] };

    static use = (key ="a") => {
        return { H: this.H[key], M: this.M[key], L: this.L[key] }
    }
}

const {H, M, L} = Text.use('b');
let historyYear = [];//year like [60], [60, 67], [60, 65, 67]


class Global {
    options = {
        mode: {test: true},//เมื่อต้องการใช้งานจริง ให้ set ค่า mode.test = false
        compactIndex: 1,//default:0 เลือกเฉพาะ index ที่ออกมากกว่า 1 ครั้ง วิธีการนี้จะทำให้จำนวนตัวเลขลดลง
        reduceByEO: 1,//default:0 คุณอาจไม่ใช้ฟังค์ชั่นนี้ เนื่องจากผลลัพธ์อาจไม่น่าพอใจ
        textFormat: {
            minimizeTextFormat: 1,//default: 1 = เลือกเฉพาะ textFormat ที่ออกบ่อยที่สุด, 0 รวม textFormat ที่ออกรองลงมาด้วย
            syncFavorite: 0,
            syncFiveStars: 0,
        }
    }
    constructor() {
        this.HML = {H, M, L};
        this.historyYear = this.#setHistoryYear();
        this.#verifyOptions()
    }
    #verifyOptions = () => {
        const {mode, compactIndex, reduceByEO, textFormat} = this.options;
        if(mode.test == true)
            confirm('คุณกำลังเปิดใช้งาน test mode คุณแน่ใจว่าต้องการใช้งาน test mode') || exit('เมื่อต้องการใช้งานจริง ให้ set ค่า mode.test = false');
        const count = Object.values(textFormat).filter(v => v == 1);
        if(count.length > 1) throw new Error('ตัวเลือก [minimize, favorite, fivestars] เลือกใช้ได้เพียงตัวใดตัวหนึ่งเท่านั้น');
        if(count.length == 0) throw new Error('ตัวเลือก [minimize, favorite, fivestars] คุณต้องเลือกใช้ตัวใดตัวหนึ่ง');
        // debugger
    }

    #setHistoryYear = () => {
        const now = new DateTime().now({});
        historyYear = uniqueArray(historyYear.map(y => y === (now.y*1) ? y-1 : y));
        const years = (historyYear.length === 0) ? [44, (now.y*1)-1] : historyYear.sort((a, b=0) => a - b);
        return years
    }

    setEO = (num) => num % 2 === 0 ? 'E' : 'O';

    setHML = (num) => H.some(n => num === n) ? 'H' : M.some(n => num === n) ? 'M' : L.some(n => num === n) ? 'L' : exit('expect 0-9 only.');

    setFP = (firstprize = [5,5,7,9,9,0]) => {
        if(typeof firstprize === 'string') 
            firstprize = firstprize.split('').map(n => n*1);
        if(!firstprize || firstprize.length !== 6 || !firstprize.every(n => n > -1)) throw new Error('invalid firstprize');

        const split = (mix, part = 2) => {
            if(![2,3].some(v => v === part)) throw new Error('invalid part');
            const a = [], b = [], c = [];
            mix.map((v, i) => {
                part === 3 ? (i < 2 ? a.push(v) : i < 4 ? b.push(v) : c.push(v)) :
                part === 2 ? (i < 3 ? a.push(v) : b.push(v)) : null;
            });
            return [a, b, c].filter(v => v.length > 0)
        }

        const eo = firstprize.map(nb => this.setEO(nb))
        const hml = firstprize.map(nb => this.setHML(nb))
        const mix = firstprize.map((nb, i) => [nb, this.setHML(nb) , this.setEO(nb), i])
        const sum = {
            front: firstprize.filter((n,i) => i >= 0 && i <= 2).reduce((a,b) => a+b), 
            back: firstprize.filter((n,i) => i >= 3 && i <= 5).reduce((a,b) => a+b), 
            total: firstprize.reduce((a,b) => a+b)
        }
        const part = {d2: split(mix, 3), d3: split(mix, 2)};//'592 465' or '59 24 65'
        const unique = uniqueArray(firstprize);
        const [min, max] = findMinMaxInArray(firstprize)
        return {
            number: firstprize, 
            eo, hml, mix, sum, 
            range: {min, max}, 
            unique, part,
        };
        // debugger
    }
}

const Settings = new Global();

export default Settings; 
