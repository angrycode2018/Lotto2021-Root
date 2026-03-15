// import { DateTime } from "../../../../../src/class/utils/DateTime/DateTime.js";
// import { findMinMaxInArray, isObject, uniqueArray } from "../../../../../src/function/common.js";
import LocalStorage from "../../../../../src/class/utils/LocalStorage.js";
import countPrimary from "./countPrimary.js"
import countWinNumber from "./countWinNumber.js"
import forecast from "./forecast.js"
import saveStorage from "./saveStorage.js"
import setPrimaryWinNumber from "./setPrimaryWinNumber.js"
import sumarizeWinNumber from "./sumarizeWinNumber.js"
// import { record } from "../initApp.js";//NOTE - ห้าม import record แต่ให้ส่ง record เข้ามาทาง constructor ได้

// const dt = new DateTime();
// const today = dt.today({ year: '2-digit', month: 'numeric', day: 'numeric', weekday: 'short', hour: '2-digit', minute:'2-digit', second: '2-digit'})
const local = new LocalStorage();

function setDate() {
    if(this.date) return;
    let {day, month, year} = this.record.dates.primary;
    day = day.min === day.max ? day.min : `${day.min}-${day.max}`;
    month = month.min === month.max ? (month.min) : `${(month.min)}-${(month.max)}`;
    year = year.min === year.max ? year.min : `${year.min}-${year.max}`;
    this.date = {day, month, year};
    // debugger
}

//report แบบรายปี นับตัวเลขแต่ละตัวว่าออกรางวัลกี่ครั้งในปีนั้น
export class ReportHistory {
    date = null;
    storage;//สถิติการออกรางวัลของตัวเลขแต่ละตัว ตั้งแต่ ปี 55-65
    currentWinNumber;//ข้อมูลการออกรางวัลของปีปัจจุบัน
    upgradeData;
    potentialNumbers; //ตัวเลขที่ยังสามารถออกรางวัลได้อีก (ยังไม่เกินโควต้า)

    constructor({ record = null }) {
        if(!record) throw new Error('record is required.');
        if(!local.get('countWinNumber')) 
            local.set('countWinNumber', []);

        Object.assign(ReportHistory.prototype, {record});//record จะไม่แสดงใน chrome dev tools
        // this.record = record;
        this.storage = local.get('countWinNumber');
        this.setDate();
        this.sumarizeWinNumber();
        return (async() => {
            await this.setPrimaryWinNumber();
            await this.countWinNumber({year: '68'})
            return this;
        })()
    }

}

//ใช้แบบที่ 1.
//methods ที่เพิ่มใน prototype จะไม่แสดงใน chrome dev tools
//methods ที่เพิ่มใน prototype จะไม่สามารถถูกเรียกใช้ใน super() class ได้
Object.assign(
    ReportHistory.prototype, 
    {setDate, countPrimary, countWinNumber, forecast, saveStorage, setPrimaryWinNumber, sumarizeWinNumber}
);

//หรือใช้แบบที่ 2.
// for(let fc of [setDate, countPrimary, countWinNumber, forecast, saveStorage, setPrimaryWinNumber, sumarizeWinNumber]){
//     ReportHistory.prototype[fc.name] = fc;
// }
// debugger

// const report = new ReportHistory()
// report.countWinNumber({year: '66'})
// report.findPotentialNumbers()

