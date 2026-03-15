import { getRandomInt, uniqueArray  } from "../../../../src/function/common.js";
// import { generateDigit3 } from "../../../../function/lottery.js";
// import {N2} from "../build/N2.js"
import {N3} from "../../../../src/class/Number/N23/N3.js"
import { instance } from "../initApp.js";


export class RandomByHistory {
    ranDomResult;

    constructor() {
        const {tableOutput} = instance;
        const { evenOdd: resultEvenOdd, number: numbers, digit3, } = tableOutput;
        this.numbers = numbers;
        this.resultEvenOdd = resultEvenOdd;
        this.digit3 = digit3;
    }

    //group of numbers แบ่งออกเป็น 3กลุ่ม ได้แก่ low: 0, 1, 2  mid: 3, 4, 5, 6  high: 7, 8, 9
    //เลือก group ที่ต้องการใช้งาน l = true enable group low  m = true enable group mid  h = true enable group high
    //NOTE - หากต้องการผลลัพธ์ที่แม่นยำขึ้น ให้กำหนด enable group ให้เหลือเพียง 2 group เช่น { M: true, H: true }
    // คะแนนความแม่นยำ 3.5/5
    recipe1 = (enable = { L: false, M: false, H: false }) => {
        const isInValid = Object.values(enable).every(v => v === false || !v) || Object.values(enable).filter(v => v).length < 2;
        if(isInValid) throw new Error('At least 2 group of L M H must be enabled.');

        //แนะนำ group low, mid, high ที่ควรจะต้องมี โดยพิจารณาจาก สถิติการออกรางวัล
        const suggestGroup = () => {
            const countText = {l:0, m:0, h:0};
            const getText = (val) => val >= 0 && val <= 2 ? 'L' : val >= 3 && val <= 6 ? 'M' : val >= 7 && val <= 9 ? 'H' : '';

             const HML = [...this.digit3].map(three => {
                const text = three.map(num => getText(num));
                text.find(txt => txt === 'H' ) && countText.h++;
                text.find(txt => txt === 'M' ) && countText.m++;
                text.find(txt => txt === 'L' ) && countText.l++;
                return text;
            });

            const recommended = [];
            countText.l >= 9 && recommended.push('L');
            countText.m >= 9 && recommended.push('M');
            countText.h >= 9 && recommended.push('H');

            recommended.map(group => {
                if(!enable[group]) {
                    console.error('เราแนะนำให้ใช้ group '+group+  ' ซึ่งคุณไม่ได้ระบุ group นี้เข้ามาในฟังค์ชั่น คุณแน่ใจว่าคุณไม่ต้องการใช้งาน group '+group);
                }
            });
            // console.log('countText=', countText)
            return recommended;
        }

        const recommended = suggestGroup();
        // console.log('recommended group=', recommended)

        //เลือกตัวเลข 1ตัว จากทั้งหมด 3ตัว
        let picked = [];
        const map = this.digit3.map(three => {
            let temp = [];
            const random = (three) => {
                if(temp.length === 3) return;
                const index = getRandomInt(2);
                if(temp.some(v => v===index)) return random(three);
                temp.push(index);
                // console.log('three=',{three, rand:three[index]})
                return three[index];
            };
            const getNum = (three) => {
                const num = random(three);
                if(!num && num !== 0) return;
                const same = picked.some(n => n === num);
                if(same) return getNum(three);
                picked.push(num);
                // console.log('num=',num)
                return num;
            }
            return getNum(three)
        });

        picked = [...uniqueArray(picked)].sort((a,b) => a - b);
        // console.log('map=',map.filter(v => v || v === 0).sort((a,b) => a - b))
        console.log('picked=',picked)

        //จัดกลุ่มตัวเลข
        let low = picked.filter(val => val >= 0 && val <= 2);//low: 0,1,2,
        let mid = picked.filter(val => val >= 3 && val <= 6);//mid: 3,4,5,6
        let high = picked.filter(val => val >= 7 && val <= 9);//high: 7,8,9

        //สุ่มลบ
        const remove = (array=[], limit=2) => {
            if(array.length <= limit) return array;
            const index = getRandomInt(limit);
            return remove(array.filter((num, i) => i !== index), limit)
        };
        
        //optional group: {low,mid,high} | {low, mid} | {mid, high} คุณสามารถตัด group ออกไปได้ 1 group ถ้าคิดว่า group นั้นจะไม่ออกรางวัล
        const reducer = (group = {low, mid, high}) => {
            if(Object.keys(group).length < 2) throw new Error('group.length must be greater than 1.');
            const total = 6; //ผลรวม low + mid + high = 6
            const limit = (total / Object.keys(group).length);
            const result = {};
            //ถ้ามีสมาชิกมากกว่า limit จะทำการสุ่มลบตัวที่เกิน limit ออกไป
            for(let [key, gr] of Object.entries(group))  {
                const rest = remove(gr, limit);//0,1,2 เอา 2ตัว  3,4,5,6 เอา 2ตัว   7,8,9 เอา 2ตัว
                result[key] = rest;
            };

            return result
        }

        const setParams = () => {
            const params = {};
            const { L, M, H } = enable;
            [L, M, H].map((val, idx) => {
                const [name, value] = idx === 0 ? ['low', low] : idx === 1 ? ['mid', mid] : idx === 2 ? ['high', high] : [];
                val === true ? params[name] = value : false;
            });
            return params;
        }

        const params = setParams();
        const {low: newLow = [], mid: newMid = [], high: newHigh = []} = reducer({ ...params });
        console.log({newLow, newMid, newHigh})

        this.ranDomResult = { l: newLow, m: newMid, h: newHigh };

        return this
    }


    // ไม่แนะนำให้ใช้งาน ฟังค์ชั่นนี้ เนื่องจาก ไม่แม่นยำ (คะแนนความแม่น 1/5)
    recipe2 = () => {
        const low = [], mid = [], high = [];//mid = ['X', 'X', 'X', 4, 'X', 4, 'X', 'X', 'X', 4, 'X', 5, 5, 'X', 5, 'X', 5, 'X', 5, 'X']
        for(let [key, value] of Object.entries(this.numbers)){
           key >= 0 && key <=3 ? low.push(...value) : key >= 4 && key <= 5 ? mid.push(...value) : high.push(...value);
        }
        // console.log({low, mid, high})
        
        const { lMax, mMax, hMax } = this.setMaximum();// hMax: 1 lMax: 1 mMax: 1
        // console.log({ lMax, mMax, hMax });
        const result = {l:[], m:[], h:[]};
        do{ // ทำการ random ตัวเลข
            const l = result.l.length < lMax ? low[getRandomInt(low.length -1)] : false;
            typeof l === 'number' && !result.l.some(v => v === l) ? result.l.push(l) : false;

            const m = result.m.length < mMax ? mid[getRandomInt(mid.length -1)] : false;
            typeof m === 'number' && !result.m.some(v => v === m) ? result.m.push(m) : false;

            const h = result.h.length < hMax ? high[getRandomInt(high.length -1)] : false;
            typeof h === 'number' && !result.h.some(v => v === h) ? result.h.push(h) : false;
        
        }while (result.l.length < lMax || result.m.length < mMax || result.h.length < hMax)
        // console.log('result',result)
        this.ranDomResult = result;
        return result;
    }

    //สร้างตัวเลข 3 ตัว จากผลการ random
    compound = () => {
        if(!this.ranDomResult) throw new Error('Require recipe() method to run first.');
        const result = this.ranDomResult;
        const combinedResult = [...result.l, ...result.m, ...result.h];
        // debugger;

        // const {result: threes} = generateDigit3({ arrayNum: combinedResult, ignoreDouble: false, ignoreTod: true });
        const {three, double} = new N3().buildDigit3({init: [...combinedResult], tod: true});
        // debugger;
        
        //TODO - ตัวแปร double
        this.finalResult = [...three];
        // console.log('finalResult=',threes)
        return [...three];
    }


    sumResult = ({l = [], m = [], h = []}) => {
        return l.length + m.length + h.length
    }


    setMaximum = (strict = true) => {
        let lMax = 0, mMax = 0, hMax = 0;
        const low = [], mid = [], high = [];//จำนวนตัวเลข high:[2 ,1, 1, 2, 0 ,2, 1 ,0, 1, 1]
        this.LMH.map(({back}) => {
            const l = back.filter(n => n === 'L')
            const m = back.filter(n => n === 'M')
            const h = back.filter(n => n === 'H')
            lMax = l.length > lMax ? l.length : lMax;
            mMax = m.length > mMax ? m.length : mMax;
            hMax = h.length > hMax ? h.length : hMax;
            low.push(l.length)
            mid.push(m.length)
            high.push(h.length)
        });
        // console.log({LMH: this.LMH})
        // console.log({low, mid, high})
        let num1 = 0, num2 = 0, num3 = 0;
        const sumNum = () => num1 + num2 + num3;
        do{
            num1 = num1 === 0 ? low[getRandomInt(low.length -1)] : num1;
            num2 = num2 === 0 ? mid[getRandomInt(mid.length -1)] : num2;
            num3 = num3 === 0 ? high[getRandomInt(high.length -1)] : num3;
        }while(sumNum() < 3)

        // console.log({num1, num2, num3})
        return strict ? {lMax: num1, mMax: num2, hMax: num3} : {lMax: 2, mMax: 1, hMax: 2}
    }


    // recipe3 = () => {
    //     const a = [0,1], b = [2,3], c = [4,5], d = [6,7], e = [8,9];
    //     const f = [0,2], g = [1,3], h = [4,6,8], i = [5,7,9];
    //     const result = [f,g,h,i].map(arr => arr.filter(num => Math.round(Math.random()) && num )).flat();

    // }

}