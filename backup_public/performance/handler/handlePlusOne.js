import { getMonthIndex } from "../../script/date.js";
import plusOneTable from "../table/plusOneTable.js";
import { isTod } from "../../script/array.js";
import { getData, } from "../../script/api.js";
import { performanceConfig as config } from "../../script/config/config.global.js";
config.checkId('performance');

const getResult = (d, m, presentResults) => {
    if(d !== 1 && d !== 16) throw new Error('invalid day='+d);
    
    const draw = presentResults.find(({date}) => {
        const [day, month, year] = date.split(/ /g).map(v => Number(v) > 0 ? Number(v) : getMonthIndex(v));
        if([30,31].some(v => v == day)){
            const nextM = month+1 < 12 ? month+1 : 0;
            return nextM == m && [1,2].some(v => v == d)
        }else{
            return [day, d].every(_d => [1,2].some(v => v == _d) && month == m)
            || [day, d].every(_d => [15,16,17].some(v => v == _d) && month == m)
        }
    });
    // if(d==1 && m ==1) debugger;
    // debugger;
    return draw
}

export default async function handlePlusOne() {
    const {y: presentYear} = config.Date.upcoming;
    try {
        let presentResults = await getData(`/playground/db/present?presentYear=${presentYear}`);
        // debugger;
        let year = [];
        for(let m = 0; m <= 11; m++) {
            let d1 = {d:1, m:m, y:presentYear, draw: null, result1: null, result2: null};
            let d16 = {d:16, m:m, y:presentYear, draw: null, result1: null, result2: null};
            for(let d of [1,16]) {
                const draw = getResult(d, m, presentResults);
                if(!draw) continue;//ปีที่เกิดโควิด บางงวดจะไม่ออกรางวัล
                const d3 = draw.digit3Up.split('').map(v => Number(v));
                const {result1, result2} = await getData(`/performance/plusOne?presentYear=${presentYear}&month=${m}&day=${d}`);
                const s1 = result1.findIndex(ar => isTod(ar, d3))
                const s2 = result2.findIndex(ar => isTod(ar, d3))
                // if(s1 > -1 || s2 > -1) debugger;
                if(d == 1) {
                    d1 = {...d1, draw: d3, result1: s1, result2: s2}
                }else{
                    d16 = {...d16, draw: d3, result1: s1, result2: s2}
                }
                // debugger;
            }
            year = [...year, d1, d16]
        }
        console.log('year', year)
        // debugger;
        const node = plusOneTable(year)
        return node
    }catch(error){
        debugger;
        throw new Error(error)
    }

}