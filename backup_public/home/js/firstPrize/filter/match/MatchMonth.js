import { removeSameArray } from "../../../../../../function/common.js";
import { isTod } from "../../../../../../function/lottery.js";
import PastTime from "../../history/history.js";
import Settings from "../../settings.js";
import Base from "./Base.js";

const past = PastTime.inspect();
const {setFP, options} = Settings;
// debugger

export default class MatchMonth extends Base{
    constructor(watch) {
        super()
        this.watch = watch;
    }

    match = (firstprize = [5,5,7,9,9,0]) => {
        this.pass = undefined;
        this.fp = setFP(firstprize);
        this.textFormat = this.setTextFormat(this.fp);
        this.matchHML();
        this.matchSumGroup();
        
        if([true, false].every(v => v !== this.pass )) throw new Error('pass value is invalid.');
        return this.pass
    }
    
    matchHML = () => {
        if(this.pass === false) return false;
        const {h,m,l} = past.month.hml.minMax;
        const pass = [h, m, l].every(({min, max}, i) => {
            const txt = i == 0 ? this.textFormat[2] : i == 1 ? this.textFormat[1] : this.textFormat[0];
            return txt >= min && txt <= max
        })
        this.pass = pass
        if(this.break()) debugger;
        // debugger
    }

    matchSumGroup = () => {
        if(this.pass === false) return false;
        const group = this.fp.sum.total;
        const six = this.fp.number;
        const pick = past.month.sum.sum.filter(arr => arr[2] == group);
        let digit3 = [];

        six.map((n1, x1) => {
            const activeIndex = x1;
            six.map((n2, x2) => {
                if(x2 == x1) return;
                let found = six.filter((n3, x3) => x3 !== x2 && x3 !== x1).map((n3) => {
                    const sum = n1 + n2 + n3;
                    const match = pick.some(([front, back]) => {
                        front = [-1, 0, 1].map(v => front + v);
                        back = [-1, 0, 1].map(v => back + v);
                        return front.some(v => v == sum) || back.some(v => v == sum);
                    })
                    // if(match) debugger
                    return match ? [n1, n2, n3] : null
                }).filter(v => v);

                found = removeSameArray(found)
                digit3.push(...found)
            })
        });

        digit3 = removeSameArray(digit3)

        // if(isTod(this.watch, six)) debugger
        if(digit3.length == 0) debugger
        // debugger
    }
}