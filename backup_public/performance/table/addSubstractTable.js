import { node } from "../../script/dom.js";
import Table from "../../script/Table/Table.js";
import { performanceConfig as config } from "../../script/config/config.global.js";

const tableBox = node({type: 'div', classList: "table-box"});//table wrap
const {Caption, THead, TBody, TFoot, Node} = new Table({id: 'addSubstract-results'});

export default function addSubstractTable(benchmark = []) {
    const {d, m, y: presentYear} = config.Date.upcoming;
    Caption.setTitle({title: 'AddSubstract Performance Year '+presentYear});
    THead.useColumnNames(['date', 'digit3', 'watch', 'asBefore', 'notSame']);

    for(let data of benchmark) {
        const {past, present, message} = data;
        if(message) {
            TBody.tr({data: ['date', message]});
            continue;
        }
        TBody.tr({data: [past.date, past.up3, present.up3, present.asBefore, present.notSame]})
    }
    
    tableBox.appendChild(Node.table)
    return tableBox
}