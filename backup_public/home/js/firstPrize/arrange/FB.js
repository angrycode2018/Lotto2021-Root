import { isTod } from "../../../../../function/lottery.js";
import PastTime from "../history/history.js";
import { removeSameArray } from "../../../../../function/common.js";


const past = PastTime.inspect();

//front.sum และ back.sum ของรางวัลที่1 ตรงกับ past.month.sum
export default class FB {
    constructor() {}

    test = (six=[1,2,3,4,5,6]) => {
        this.digit3 = this.buildDigit3(six)
        const [front, back] = [six.filter((v,i) => i <= 2), six.filter((v,i) => i > 2)];
        const pass1 = this.digit3.front.some(d3 => isTod(d3, front)) && this.digit3.back.some(d3 => isTod(d3, back));
        const pass2 = this.digit3.front.some(d3 => isTod(d3, back)) && this.digit3.back.some(d3 => isTod(d3, front));
        // if(!pass1 && !pass2) debugger;
        return pass1 || pass2
    }

    //เมื่อ test ไม่ผ่านให้เรียก repair ทำงาน เพื่อสร้างตัวเลือกใหม่
    repair = (six) => {
        const digit3 = this.digit3 || this.buildDigit3(six)
        const group = six.reduce((a,b) => a + b);
            
        const pair = digit3.front.map((d3, i) => {
            const sum = d3.reduce((a,b) => a + b)
            const num3 = digit3.back.find((n3, k) => {
                const sum2 = n3.reduce((a,b) => a + b)
                return ((sum + sum2) == group) && isTod(six, [...d3, ...n3]);
            })
            return num3 ? [d3, num3] : null
        }).filter(v => v);
        // debugger
        return pair
    }

    //ตัวเลข 3ตัว ที่ผลรวม(sum) เท่ากับ front.sum หรือ back.sum
    buildDigit3 = (six = [1,2,3,4,5,6]) => {
        const group = six.reduce((a,b) => a + b);
        const pick = past.month.sum.sum.filter(arr => arr[2] == group);//เลือก group เดียวกัน
        let posibility = pick.map(([f,b]) => [ [f-1, b+1], [f, b], [f+1, b-1] ]).flat();//-1 +1 match ตัวใกล้เคียงด้วย
        posibility = removeSameArray(posibility)
        // let digit3 = [];
        const front = [], back = [];

        six.map((n1, x1) => {
            const activeIndex = x1;
            six.map((n2, x2) => {
                if(x2 == x1) return;
                six.filter((n3, x3) => x3 !== x2 && x3 !== x1).map((n3) => {
                    const sum = n1 + n2 + n3;
                    let f,b;
                    posibility.some(([front, back]) => {
                        [f,b] =[ front === sum,  back === sum ];
                        if(f && b) debugger;//expect only one is true
                        return f || b
                    })
                    return f ? !front.some(fr => isTod(fr, [n1,n2,n3])) && front.push([n1, n2, n3]) : 
                    b ? !back.some(bk => isTod(bk, [n1,n2,n3])) && back.push([n1, n2, n3]) : null;
                });
            })
        });
        // debugger
        return {front, back}
    }
}