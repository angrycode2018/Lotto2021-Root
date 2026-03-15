import {getData} from "../../script/api.js"
import { performanceConfig as config } from "../../script/config/config.global.js";
import { getMonthName } from "../../script/date.js";
import addSubstractTable from "../table/addSubstractTable.js";
config.checkId('performance');

export default async function handleAddSubstract() {
    const {d, m, y:presentYear} = config.Date.upcoming;
    const benchmark = [];
    try {
        for(let m = 0; m <= 11; m++) {
            for(let d of [1,16]) {
                //NOTE - ถ้า d=1 m='ม.ค.' จะคำนวณหวยงวดวันที่ 16 ม.ค.
                const {data, message} = await getData(`/performance/addSubstract?presentYear=${presentYear}&month=${m}&day=${d}`)
                
                if(message != 'Success') {
                    benchmark.push({message});//ปีที่เกิด covid
                    continue;
                }
                
                const {past, present, asBefore, notSame} = data;
                
                //สำหรับงวดที่มีการออกรางวัลไปแล้ว
                past && present && benchmark.push({past, present});

                //สำหรับงวดที่ยังไม่ออกรางวัล
                if(asBefore && notSame) {
                    const nextD = d == 1 ? 16 : d == 16 ? 1 : null;
                    const nextM = d == 16 ? (m+1 > 11 ? 'ม.ค.' : getMonthName(m+1)) : m;
                    const date = `${nextD} ${nextM} ${nextM == 'ม.ค.' ? presentYear+1 : presentYear}`
                    console.log('คาดการณ์ตัวเลข สำหรับหวยงวดวันที่ '+date+'\n', {asBefore, notSame})
                }
                // debugger;
            }
        }
        // debugger;
    }catch(error) {
        throw new Error(error)
    }

    const node = addSubstractTable(benchmark)
    return node
}