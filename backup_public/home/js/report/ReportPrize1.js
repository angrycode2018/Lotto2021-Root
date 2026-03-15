import { genArr, isNaN, isTrue } from "../../../../function/common.js";
import { DateTime } from "../../../../class/utils/DateTime.js";

const dt = new DateTime();

export default class ReportPrize1 {
    constructor() {
        debugger;
    }

    //* NEW *
    getDataUp = () => {
        return this.numbers.map(num => num.scope.UP);
    }

    //* ดูสถิติการถูกรางวัล(winTotal) ของตัวเลขในแต่ละหลัก(roi,sib,nui) 
    //* นำผลสลาก เลขท้าย 3 ตัวบน ปี 65 ออกมาเปรียบเทียบกับ ข้อมูลของปีก่อนๆ
    getReportPrize1 = () => {
        typeof this.m === 'string' && this.m.split('-').length > 1 ? isTrue(false, `Only single month.`) : false;
        const month =  isNaN(Number(this.m)) === false ? dt.splitMonthText(this.m) : this.m;//*NOTE: ต้องใช้ month & day เดือนและวันที่ อันเดียวกันกับ App
        const day = this.d;
        // let fullYear = (new Date().getFullYear() + 543).toString()
        // fullYear = fullYear.split('')[2] + fullYear.split('')[3]
        // let presentYear = fullYear
        const presentYear = Number(this.y) ? Number(this.y) +1 : this.y.split('-').length ===2 ? Number(this.y.split('-')[1]) +1 : false ;
        const term = typeof day === 'string' && day.split('-').length === 2 ? day.split('-') : '';//* term = งวดวันที่
        // debugger

        //* นำผลการออกรางวัล เลขท้าย 3ตัวบน ปีล่าสุด ออกมาใช้ โดยให้ third: หลักร้อย , second: หลักสิบ , first: หลักหน่วย //* ถ้าเดือนที่เลือกยังมาไม่ถึง จะได้อาเรย์ว่าง
        const getPresentResult = (thisYear) => {
            // console.log({thisYear, month, day})
            const presentResult = this.getHistory({ year: thisYear, month, day }) 
            return !Array.isArray(presentResult) || presentResult.length === 0 ? console.error('Cant get history of '+day+month+thisYear) : presentResult;
        }
          
        const presentResult = getPresentResult(presentYear)
        // console.log('presentResult ', presentResult)
        let report
        if(Array.isArray(presentResult)){
        const summary = presentResult.map( (history) => {
            const [ sixth, fifth, fourth, third, second, first ] = history.prize1.split('');
            const newResult = { front: [sixth, fifth, fourth], back: [third, second, first] };
            
            //* นำเฉพาะตัวเลข หลักหน่วย หลักสิบ หลักร้อย ที่ตรงกับ ผลการออกรางวัล ออกมา
            const san = this.getDataUp().find(prize1 => prize1.sixth.number === Number(sixth)).sixth;
            const muen = this.getDataUp().find(prize1 => prize1.fifth.number === Number(fifth)).fifth;
            const pan = this.getDataUp().find(prize1 => prize1.fourth.number === Number(fourth)).fourth;
            const roi = this.getDataUp().find(prize1 => prize1.third.number === Number(third)).third;
            const sib = this.getDataUp().find(prize1 => prize1.second.number === Number(second)).second;
            const nui = this.getDataUp().find(prize1 => prize1.first.number === Number(first)).first;
            const record = { front: { san, muen, pan }, back: { roi, sib, nui } };

            return { [`${presentYear}`]: newResult, [this.y]: record };
        })
        report = summary.length === 2 
        ? { [term[0]+month]: summary[1], [term[1]+month]: summary[0] } 
        : summary.length === 1 ? { [day+month]: summary[0] } : false;
        }
    
    
        console.log('DataUp' ,this.getDataUp())
        /* Remove comments below to view complete data ข้อมูลฉบับเต็ม */
            // console.log('หลักแสน', this.getDataUp().map(prize1 => prize1.sixth).sort((a, b) => b.winTotal - a.winTotal) )
            // console.log('หลักหมื่น', this.getDataUp().map(prize1 => prize1.fifth).sort((a, b) => b.winTotal - a.winTotal) )
            // console.log('หลักพัน', this.getDataUp().map(prize1 => prize1.fourth).sort((a, b) => b.winTotal - a.winTotal) )
            const roi =  this.getDataUp().map(prize1 => prize1.third).sort((a, b) => b.winTotal - a.winTotal) 
            const sib = this.getDataUp().map(prize1 => prize1.second).sort((a, b) => b.winTotal - a.winTotal) 
            const nui =  this.getDataUp().map(prize1 => prize1.first).sort((a, b) => b.winTotal - a.winTotal) 
            console.log('UP', this.getDataUp().map(prize1 => (
            { third: prize1.third, 
                second: prize1.second, 
                first: prize1.first, 
                winTotal: prize1.third.winTotal + prize1.second.winTotal + prize1.first.winTotal 
            })).sort((a,b) => b.winTotal - a.winTotal))
        
        return new Promise((resolve, reject) => {
        const reports = { report1: report, report2: this.arr, report3: {roi, sib, nui} }
        resolve( reports )
        });
    }

    //* NEW *
    handleFirstPrize = ({prize1, time}) => {
        const [sixth, fifth, fourth, third, second, first] =  prize1.split('').every(value => value) ? prize1.split('') : isTrue(false, `Error, All members must have value.`);
        const firstPrize = { sixth, fifth, fourth, third, second, first };

        for(const [ key, value ] of Object.entries(firstPrize)) {
        const Num = this.getNumber(Number(value));
        Num.handleFirstPrize({ base: key, prize1, time });
        }
        
        this.hello({sixth, fifth, fourth}, {third, second, first}, time);
        
    }

    hello = ({...front}, {...back}, time) => {
        const point = classifyNumbers({ minVal: 0, maxVal: 27 });//* 9+9+9 = 27
        const [ low, mid, high ] = Object.entries(point).map(([key, arr]) => point[key] = findMinMaxInArray(arr));
        const frontSum = Object.entries(front).map( ([key, value]) => front[key] = Number(value)).reduce((a, b) => a + b);//* แปลงสตริงเป็นตัวเลข จากนั้นหา ผลรวม
        const backSum = Object.entries(back).map( ([key, value]) => back[key] = Number(value)).reduce((a, b) => a + b);
        const setGroup = (value) => {
          return value >= high[0] && value <=high[1] ? 'High'
          : value >= mid[0] && value <=mid[1] ? 'Mid'
          : value >= low[0] && value <=low[1] ? 'Low' 
          : isTrue(false, `Error.`) ;
        }
        const set_group = (value) => {
          return value >= 0 && value <= 4 ? 'L'
          : value >= 5 && value <= 9 ? 'H'
          : isTrue(false, 'Error');
        }
        const f_group = Object.values(front).map(value => set_group(value)).toString();
        const b_group = Object.values(back).map(value => set_group(value)).toString();
  
        const ft = Object.values(front).map(value => oddEven(value)).toString()
        const bc = Object.values(back).map(value => oddEven(value)).toString()
        // console.log(EO)
        // const result = [...Object.values(front), ...Object.values(back)].toString();
        const result = [...Object.values(front), ...Object.values(back) ].toString();
        const f = { front, sum: frontSum, group: setGroup(frontSum), EO: ft, f_group, result, date: { day:time.d, month: time.m.th, year:time.y } };
        const b = { back, sum: backSum, group: setGroup(backSum) ,EO: bc, b_group, result , date: { day:time.d, month: time.m.th, year:time.y } };
        
        this.arr = this.arr || { front:[], back:[] };
  
        this.arr.front.push(f)
        // this.arr.front = this.arr.front.sort((a, b) => a.sum - b.sum);
  
        this.arr.back.push(b)
        // this.arr.back = this.arr.back.sort((a, b) => a.sum - b.sum);
  
    }
}