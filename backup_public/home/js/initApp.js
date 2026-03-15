import { Record } from "../../../src/class/System/Record/Record.js";
import { ReportHistory } from "./report/ReportHistory/reportHistory.js";
import Recipe from "../../../src/class/formula/Recipe.js";
import Print from "../../../src/class/Print.js";
import Instance from "../../../src/class/System/Instance.js";
import main from "./main.js";
import { getData } from "../../script/api.js"
import Converter from "../../../src/class/global/Converter.js";

// debugger
//NOTE - วิธีใช้งาน Run Express Server at http://localhost:3000/ จากนั้น เปิด Live Server at http://127.0.0.1:5500/
//NOTE - ระบุหวยงวดที่ต้องการคำนวณ
const thisDraw = {y:'69', m:'1', d:'16'};//โปรแกรมจะทำการคำณวณหวยงวดนี้
const watchNumber = [];//2,0,9  7,7,9*  7,0,0,  3,7,7,  8,9,4,  5,6,3,  6,8,7*,  2,2,7,  3,8,8,  3,0,9, 3,5,2, 392, 246, 324, 852, 865

const appDate = { y: `${(thisDraw.y*1)-20}-${(thisDraw.y*1)-1}`, m: thisDraw.m, d: thisDraw.d };
const settings = {
        mode: 1, // 0 = ผู้ชม, 1 = คำนวณหวย(ปัจจุบัน), 2 = คำนวณหวย(ย้อนหลัง)
        rules: {
                HML: [ [0,2, 'L'], [3,6, 'M'], [7,9, 'H'] ],
        }
};
// debugger;
settings.mode === 0 && alert('คุณกำลังใช้งานโหมด ผู้ชม ตรวจสอบให้แน่ว่าต้องการใช้งานโหมดนี้');
settings.mode === 2 && alert('คุณกำลังใช้งานโหมด คำนวณหวย(ย้อนหลัง) ตรวจสอบให้แน่ว่าต้องการใช้งานโหมดนี้');
// debugger;

//NOTE - รวม export ทุกตัวไว้ที่ instance
export const instance = settings.mode === 0 ? null : new Instance({appDate, settings, watchNumber});

const cnv = new Converter({HML: settings.rules.HML});
instance.set({cnv})

(async() => {
        const record = new Record();
        const app = await record.app(appDate, { primaryDate: true });
        const report = await new ReportHistory({ record });
        instance.set({record, app, report});

        const {year, month, day} = record.dates.primary;
        const url = `/output/tableOutput?y=${year.min}-${year.max}&m=${thisDraw.m}&d=${thisDraw.d}`;
        let {reports: {allYear, thisYear, yearly}, tableOutput} = await getData(url);
        console.log('reports;', {allYear, thisYear, yearly});
        debugger;
        const reports = {allYearReport: allYear, thisYearReport: thisYear, yearlyReport: yearly}

        
        tableOutput = {...tableOutput, ...reports};
        // debugger;
        // const tableOutput = {
        //         date, digit3, evenOdd, favoriteGroup, groupName, hisText, histories, lottery,
        //         mixIndex, number, pastDigit3, processDigit3, range, rsn, yearlyReport, allYearReport, thisYearReport,
        //         presentDate, presentResult
        // };

        instance.set({tableOutput});
        await instance.setInstances();//NOTE - ต้องเรียกใช้ setInstances() หลังจาก set(record) และ set(tableOutput) เสร็จแล้วเท่านั้น
        // debugger;

        const recipe = await new Recipe({ record, tableOutput });
        instance.set({recipe: () => recipe});

        Print.success('Sucessfully initialized App instance');
        debugger
        await main(instance)
})()

