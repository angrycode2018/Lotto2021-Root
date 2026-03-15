import { node } from "../../script/dom.js";
import Table from "../../script/Table/Table.js";
import {isTod} from "../../script/array.js"
import {closeButton, dragAndDrop} from "../tables/services.js"

export function digit2Table(digit2 = {gold:[], silver:[], bronze:[]}, presentResults) {
    const {Caption, TBody, TFoot, Node} = new Table({id: 'avg-d2'});
    Caption.setTitle({title: "AVG Digit2"});

    const present = presentResults.map(str => Array.from(str, (v) => v*1));
    const x = ['gold', 'silver', 'bronze', 'ignore'].forEach(k => {
        const d2 = digit2[k].map(n => n.toString().replace(/,/g, ''))
        TBody.tr({key: `${k} ${d2.length} ตัว`, data: null});
        TBody.tr({
            // key: k, 
            data: d2, 
            style: {tr: "justify-content: flex-start;",}, 
            classList: {tr: "flex-row-wrap"},
        });
    });

    for(let [i, tr] of Node.tbody.childNodes.entries()) {
        tr.childNodes.length > 0 && tr.childNodes.forEach(td => {
            const n2 = Array.from(td.textContent, (v) => v*1);
            const tod = present.some(d2 => isTod(d2, n2))
            tod && td.setAttribute('style', "background-color:#7BF1A8;");
        })
    }

    TFoot.tr({key: "Gold: avg", data: "3,4,5",});
    TFoot.tr({key: "Silver: avg", data: "2,6",});
    TFoot.tr({key: "Bronze: avg", data: "1,7",});

    const tableBox = node({type: 'div', classList: "table-box"});//table wrap
    
    //drag and drop table
    dragAndDrop(Node)
    closeButton(tableBox)

    tableBox.appendChild(Node.table)

    return tableBox
}

export function digit3Table(digit3 = {gold:[], silver:[], bronze:[]}, presentResults) {
    const {Caption, TBody, TFoot, Node} = new Table({id: 'avg-d3'});
    Caption.setTitle({title: "AVG Digit3"});

    const present = presentResults.map(str => Array.from(str, (v) => v*1));
    const x = ['gold', 'silver', 'bronze', 'ignore'].forEach(k => {
        const d3 = digit3[k].map(n => n.toString().replace(/,/g, ''))
        TBody.tr({key: `${k} ${d3.length} ตัว`, data: null});
        TBody.tr({
            // key: k, 
            data: d3,
            style: {tr: "justify-content: flex-start;"}, 
            classList: {tr: "flex-row-wrap"},
        });
    });

    for(let [i, tr] of Node.tbody.childNodes.entries()) {
            tr.childNodes.length > 0 && tr.childNodes.forEach(td => {
                const n3 = Array.from(td.textContent, (v) => v*1);
                const tod = present.some(d3 => isTod(d3, n3))
                tod && td.setAttribute('style', "background-color:#7BF1A8;");
            })
    }
    // debugger
    TFoot.tr({key: "Gold: avg", data: "3,4,5",});
    TFoot.tr({key: "Silver: avg", data: "2,6",});
    TFoot.tr({key: "Bronze: avg", data: "1,7",});

    const tableBox = node({type: 'div', classList: "table-box"});
    
    //drag and drop table
    dragAndDrop(Node)
    closeButton(tableBox)

    tableBox.appendChild(Node.table)
    return tableBox
}