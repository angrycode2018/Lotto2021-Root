import Table from "../../script/Table/Table.js";
import {node} from "../../script/dom.js"
import {dragAndDrop, closeButton} from "../tables/services.js"
import {playGroundConfig as config} from "../../script/config/config.global.js"

function setTable({numbers, suggested, win}, {Caption, TBody, TFoot, Node}) {
    if(!config.Date?.upcoming) throw new Error('Date.upcoming is not set');
    const {y:presentYear} = config.Date.upcoming;
    Caption.setTitle({title: "DB Report Year "+presentYear});
    // debugger
    Object.keys(numbers).map(key => {
        if(key == 'all') return;
        let list1 = numbers[key].sort((a,b) => a[0]-b[0] == 0 ? a[1]-b[1] : a[0]-b[0], []);
        let list2 = win[key].sort((a,b) => a[0]-b[0] == 0 ? a[1]-b[1] : a[0]-b[0], []);
        list1 = list1.map(num => num.toString().replace(/,/g, ''));//แปลงอาเรย์ตัวเลขเป็นสตริง
        list2 = list2.map(num => num.toString().replace(/,/g, ''));//แปลงอาเรย์ตัวเลขเป็นสตริง

        TBody.tr({
            id: `db-${key}`, 
            key, 
            data: list1, 
            style: {tr: "justify-content: flex-start;"}, 
            classList: {tr: "flex-row-wrap"},
        });
        // TBody.tr({
        //     id: `db-win-${key}`, 
        //     key: `win-${key}`, 
        //     data: list2, 
        //     style: {tr: "justify-content: flex-start;"}, 
        //     classList: {tr: "flex-row-wrap"},
        // });
        for(let [i, tr] of Node.tbody.childNodes.entries()) {
            // if(i % 2 !== 0) continue;
            tr.childNodes.forEach(td => {
                list2.some(v => v == td.textContent) && td.setAttribute('style', "background-color:#7BF1A8;");
            })
        }
    });
    // suggested.sort((a,b) => a[0]-b[0] == 0 ? a[1]-b[1] : a[0]-b[0], []);
    const list3 = suggested.map(num => num.toString().replace(/,/g, ''))
    TBody.tr({id: 'db-suggested' ,key: 'suggested', data: list3, style: {tr: "justify-content: flex-start;"}, classList: {tr: "flex-row-wrap"},})

    TFoot.CSS.style({tfoot: "border: 1px solid", tr: "display: flex; gap: 10px;"});
    TFoot.tr({key: 'suggested', data: ['ตัวเลขที่ทำนายว่าจะออกรางวัล']});
    TFoot.tr({key: 'Dead', data: ['ตัวเลขที่ไม่ออกรางวัลมาเป็นเวลานาน']});
    TFoot.tr({key: 'Green Text', data: ['ตัวเลขที่ออกรางวัลในปีนี้']});
    TFoot.tr({key: 'AllNumbers', data: ['สามารถดูได้จาก console.log']});

}



export function dbTable({numbers, suggested, win}) {
    const tableBox = node({type: 'div', classList: "table-box"});//table wrap
    const {Caption, TBody, TFoot, Node} = new Table({id: 'db'});

    setTable({numbers, suggested, win}, {Caption, TBody, TFoot, Node})
    dragAndDrop(Node);
    closeButton(tableBox)

    tableBox.appendChild(Node.table)
    return tableBox
}