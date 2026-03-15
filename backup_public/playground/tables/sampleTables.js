// import { node,} from "../../script/dom.js"
import Table from "../../script/Table/Table.js";

//ตัวอย่าง Table
export function showSampleTable(total = 3) {
    const nodes = [];
    for(let i = 1; i <= total; i++) {
        const {Caption, ColGroup, THead, TBody, Node} = new Table({id: 'test'+i});
        Caption.setTitle({title: 'ตัวอย่าง table'+i});
        ColGroup.set({span:1, style: "background-color:red;"}).set({span: 2, style: "background-color: blue;"});
        THead.useColumnNames(['Name', 'Age', 'Country']);
        TBody.tr({data: ['Tim', 30, 'Thailand']}).tr({data: ['Smith', 49, 'Japan']});
        nodes.push(Node.table)
    }
    // content.appendChild(Node.table);
    return nodes
}