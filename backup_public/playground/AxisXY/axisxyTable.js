import Table from "../../script/Table/Table.js"
import {node} from "../../script/dom.js"
import {closeButton, dragAndDrop} from "../tables/services.js"
import {playGroundConfig as config} from "../../script/config/config.global.js"

export function axisXYReportTable(reports) {
    if(!config.Date?.upcoming) throw new Error('config.Date.upcoming is not set');
    const {y:presentYear} = config.Date.upcoming;
    const {Caption, THead, TBody, TFoot, Node} = new Table({id: 'axis-reports'});

    Caption.setTitle({title: 'AxisXY Report Year '+presentYear});
    THead.useTemplate(
        ['present', 'watch', 'exe', 'd2', 'd3', 'd31', 'd31'],
        ["", "", "", "", "", 'pair', 'two']
    );
    
    const check = node({type: 'span', text: '✔', style: "color: green;"});
    const cross = node({type: 'span', text: '✘',  style: "color: red;"});
    for(let {exe, d2, d3, d31, input} of reports) {
        const [watch, present] = Object.values(input).map(ar => ar.reduce((a,b) => a.concat(b), ''));
        const {pair, two} = d31;
        
        const array = ["", "", exe, d2, d3, pair, two].map(v => v ? true : false);
        TBody.tr({data: Array.from({length: array.length}, (v) => "") });//สร้าง tr และ td ว่างๆ
        
        //loop td ทุกตัว
        for(let i = 0; i < Node.tbody.lastChild.cells.length; i++) {
            const td = Node.tbody.lastChild.cells[i];
            if(i < 2) {
                td.innerText = i == 0 ? present : watch;
                continue;
            }
            td.innerHTML = array[i] ? '<span style="color: green;">✔</span>' : '<span style="color: red;">✘</span>';
        }
        
    }

    TFoot.tr({key: 'จุดสังเกตุ', data: 'exe เปรียบเทียบกับ pair และ d2 เปรียบเทียบกับ two'})

    const tableBox = node({type: 'div', classList: "table-box"});
    
    //drag and drop table
    dragAndDrop(Node)
    closeButton(tableBox)

    tableBox.appendChild(Node.table)
    // debugger
    return tableBox
}

export function axisXYForecastTable(forecast) {
    const {Caption, THead, TBody, TFoot, Node} = new Table({id: 'axis-forecast'});
    
    Caption.setTitle({title: 'AxisXY Forecast'});

    const keys = ['present3', 'd2', 'd31', 'd3'];
    keys.forEach(key => {
        let value = forecast[key];
        if(key == 'present3') {
            TBody.tr({key: (key), data: null});//แสดงหัวข้อ
            TBody.tr({data: value.toString().replace(/,/g, '')});//แสดงหัวข้อ
        
        }else if(key == 'd2' || key == 'd3') {
            value = value.map(num => num.toString().replace(/,/g, ''));//แปลงอาเรย์ตัวเลขเป็นสตริง
            const title = ['d2', 'd3'].some(v => v==key) ? ` ตัวเลขที่คาดว่าจะออกรางวัล จำนวน: ${value.length} ตัว` : '';
            TBody.tr({key: (key+title), data: null});//แสดงหัวข้อ
            TBody.tr({id: `row-${key}`, data: value, classList: {tr:  "flex-row-wrap"}});
        
        }else if(key == 'd31') {
            let {pair, two} = value;
            two = two.map(num => num.toString().replace(/,/g, ''));
            TBody.tr({key: (key+' : two'+ ` จำนวน: ${two.length} ตัว`), data: null});//แสดงหัวข้อ
            TBody.tr({id: `row-${key}-two`, data: two, classList: {tr:  "flex-row-wrap"}});
        }
    });

    TFoot.tr({key: 'd31:pair', data: 'ไม่ถูกแสดงในตารางนี้ แต่สามารถดูได้จาก console.log'})
    TFoot.tr({key: 'exe', data: 'ไม่ถูกแสดงในตารางนี้ แต่สามารถดูได้จาก console.log'})

    const tableBox = node({type: 'div', classList: "table-box"});

    //drag and drop table
    dragAndDrop(Node)
    closeButton(tableBox)

    tableBox.appendChild(Node.table)
    return tableBox
}