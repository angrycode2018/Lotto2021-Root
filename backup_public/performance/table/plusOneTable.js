import { node } from "../../script/dom.js";
import Table from "../../script/Table/Table.js";
import {getMonthName} from "../../script/date.js"
// import {isTod} from "../../script/array.js"

const tableBox = node({type: 'div', classList: "table-box"});//table wrap
const {Caption, THead, TBody, TFoot, Node} = new Table({id: 'plusOne-results'});

export default function plusOneTable(year=[]) {
    Caption.setTitle({title: 'PlusOne Performance Year '+year[0].y});
    THead.useColumnNames(['date', 'digit 3', 'result1', 'result2'])
    
    for(let {y, m, d, draw, result1, result2} of year) {
        // debugger
        TBody.tr({data: [`${d} ${getMonthName(m).short} ${y}`, draw?.join(''), result1, result2]})
    }

    tableBox.appendChild(Node.table)
    return tableBox
}