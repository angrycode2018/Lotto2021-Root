import { numbersTable } from "./table/Number/numbersTable.js";
import { areaTable } from "./table/History/areaTable.js";
import { diffTable } from "./table/History/diffTable.js";
import { summaryTable } from "./table/summaryTable.js";
import {getData, postData} from "../../script/api.js";

export default async function handleSquare(content2=null) {
    if(!content2) throw new Error('content2 not specified');
    // let data = JSON.parse(localStorage.getItem('square'));
    const {Number, history, pickedAreas, thisMonth, log} = await getData("/playground/square");//เรียกใช้ class Square จาก Server
    let [ data ] = await getData("/output/square");//ใช้ข้อมูลจาก MongoDB แทน localStorage
    console.log({Number, history, pickedAreas, thisMonth, log})
    console.log('Square:\n',data);
    // debugger;

    numbersTable(Number, 'area').map(tb => content2.appendChild(tb));
    for (let fn of [areaTable, diffTable]) {
        const tb = await fn(history, Number)
        content2.appendChild(tb)
    } 
    //ระบุ area ที่ต้องการ เช่น [...area.best, ...area.good]
    //ระบุ diff ที่ต้องการ เช่น [...diff.best, ...diff.good]
    const {area, diff} = data;
    class Gold {//areas 1-9
        static areas = [...area.best, ...area.good, ...[5,6]];
        static all = {areas: this.areas, diffs: [...diff.best, ...diff.good]};
        static best = {areas: this.areas, diffs: [...diff.best]};//NOTE * แนะนำให้ใช้ชุดนี้
        static good = {areas: this.areas, diffs: [...diff.good]};
    }
    const ok = {areas: area.ok, diffs: [...diff.best,...diff.good]};
    const result = await postData("/playground/square/query", Gold.all);//เรียกใช้ method query จาก class Square
    const numbers = result.map(({number}) => number);

    //set Square.query ให้เป็นตัวเลขต้นแบบ ที่จะนำไปใช้สำหรับการ filter
    const res = await postData('/output/base', {digit: 3, place:'up', numbers, name:'square', desc:'gold area:[1-9], diff: [best,good]'})
    // debugger;
    const sumTb = summaryTable(result, {area, diff})
    content2.appendChild(sumTb)
    // const sumTb2 = summaryTable(ok, {area, diff})
    // content2.appendChild(sumTb2)
    // debugger
}