import { node } from "../../script/dom.js"
import Table from "../../script/Table/Table.js";
import {closeButton, dragAndDrop} from "../tables/services.js"
import {playGroundConfig as config} from "../../script/config/config.global.js"

export function circleResultTable(result) {
    const {Caption, TBody, TFoot, Node} = new Table({id: 'circle-result', useTailwind: false});

    Caption.setTitle({title: "Circle Results"});

    Object.entries(result).forEach(([key, value]) => {
        if(key == 'previous3') key = 'present3';//เปลี่ยนชื่อ key
        if(key == 'numbers') 
            value = value.map(num => num.toString().replace(/,/g, ''));//แปลงอาเรย์ตัวเลขเป็นสตริง
        if(key == 'matchWatch') {
            value = !result.watch || result.watch.length == 0 ? "" : value;
        }
        const title = key == 'numbers' ? ` ตัวเลขที่คาดว่าจะออกรางวัล จำนวน:${value.length} ตัว` : '';
        TBody.tr({key: (key+title), data: null});//แสดงหัวข้อ
        TBody.tr({id: `row-${key}`, data: value, classList: {tr:  "flex-row-wrap"}});
    });

    // TFoot.CSS.style({tr: "display: flex; gap: 10px;"});
    TFoot.tr({key: 'numbers', data: ['ตัวเลขที่คาดว่าจะออกรางวัล']})
    .tr({key: 'present 3', data: ['ผลหวยงวดปัจุบัน (หรืองวดล่าสุด)']})
    .tr({key: 'watch', data: 'ตัวเลขที่ออกรางวัล'})
    .tr({key: 'match watch', data: ['-1: การคำนวณผิดพลาด ตัวเลข(numbers)ที่ทำนายไม่ถูกรางวัล'],})
    .tr({key: 'match watch', data: ['มากกว่า -1 (ถูกรางวัล) บอก index ของตัวเลขที่ถูกรางวัล']})
    .tr({key: 'error', data: ['ระบุส่วนที่คำนวณผิดพลาด']})
    
    const tableBox = node({type: 'div', classList: "table-box"});
    //drag and drop table
    dragAndDrop(Node)
    closeButton(tableBox)

    tableBox.appendChild(Node.table)
    return tableBox
}

export function circleReportTable(thisYear) {
    const {Caption, ColGroup, THead, TBody, TFoot, Node} = new Table({id: 'circle-thisyear', useTailwind: false});
    if(!config.Date.upcoming) throw new Error('config.Date.upcoming is missing value.');
    const {y:presentYear} = config.Date.upcoming;
    Caption.setTitle({title: "Circle Report Year "+presentYear});
    ColGroup.set({span: 3}).set({span: 3, style: "background-color: #eee;"});

    //CSS สำหรับ THead และ TBody
    // THead.CSS.style({
    //     thead: "background-color: yellow;", 
    //     th: "color: blue; font-style: italic;",
    // }).class({ 
    //     thead: "class1 class2 class3", 
    //     th: "class1 class2 class3" 
    // });
    // TBody.CSS.style({
    //     tbody: "background-color: pink;",
    //     td: "color: green;"
    // }).class({
    //     tr: "class1",
    //     th: "class2",
    //     td: "class3",
    // });
    
    THead.useTemplate(
        ["previous 3", "watch", "match", "error", "error", "error"], //row1
        ["", "", "", "stars", "wing", "dub"], //row2
    )

    for(let i = 0; i < thisYear.error.length; i++) {
        const previous3 = thisYear.previous3[i].toString().replace(/,/g, '');
        const watch = thisYear.watch[i].toString().replace(/,/g, '');
        const match = thisYear.matchWatch[i];
        const error = ['stars', 'wing', 'dub'].map(v => thisYear.error[i].find(e => e == v) ? v : '-');

        TBody.tr({data: [previous3, watch, match, error]})
    }

    TFoot.tr({key: 'numbers', data: 'numbers จะไม่ถูกแสดงในตารางนี้ คุณสามารถดู numbers ได้จาก console.log'})
    
    const tableBox = node({type: 'div', classList: "table-box"});
    //drag and drop table
    dragAndDrop(Node)
    closeButton(tableBox)

    tableBox.appendChild(Node.table)
    return tableBox

}