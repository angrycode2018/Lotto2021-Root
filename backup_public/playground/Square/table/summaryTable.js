import { node } from "../../../script/dom.js";
import Table from "../../../script/Table/Table.js";
import {isTod} from "../../../script/array.js"
import {closeButton, dragAndDrop} from "../../tables/services.js"
// import LocalStorage from "../../../script/LocalStorage.js";
// import { postData } from "../../../script/api.js";

// const local = new LocalStorage();

const tableBox = node({type: 'div', classList: "table-box"});//table wrap
const {Caption, ColGroup, THead, TBody, TFoot, Node} = new Table({id: 'square-summary',});//style: 'position:relative; table-layout:auto;'
Caption.setTitle({title: "Square Query"});

//data = {area: {best:[], good:[]}, diff: {best:[], good:[]}}
//areas = [1,2,3,4,...], diffs = [[0,1],[1,2],...]
export function summaryTable(result, data={}) {
    const allAreas = result.map(n => n.area).reduce((a,b) => a.includes(b) ? a : [...a, b]  ,[])
    // console.log('result from POST\n', result)
    // debugger
    if(allAreas.length === 0) {
        tableBox.appendChild(Node.table);
        return tableBox;
    }
    //area=1, diff=[0,1] ส่งกลับ best, good, ok, bad
    const getKey = ({area, diff}) => {
        const keys = [...Object.keys(data.area), ...Object.keys(data.diff)].reduce((a,b) => a.includes(b) ? a : [...a, b]  ,[]);
        if(area) 
            return keys.find(k => data.area[k]?.includes(area))
        if(diff) 
            return keys.find(k => data.diff[k]?.some(d => isTod(d, diff)))
        throw new Error('No area or diff provided');
    }

    allAreas.forEach((area) => {
        const arr = result.filter(n => n.area === area);
        const mainTr = node({type: 'tr'});
        const tb = new Table({id: `area-${area}`, style: 'margin-bottom:20px;'});
        // tb.THead.useColumnNames(['Area '+area+` (${getKey({area})})`]);
        // tb.Node.thead.childNodes[0].childNodes[0].setAttribute('colspan', '18');

        const diffs = arr.map(({diff}) => diff);
        const uniqueDiffs = diffs.reduce((a,b) => a.some(x => isTod(x, b)) ? a : [...a,b], []);
        uniqueDiffs.forEach(diff => {
            const numbers = arr.filter(n => isTod(n.diff, diff)).map(n => n.number);
            const strNumbers = numbers.map(n => n.join(''));
            const tr = tb.TBody.tr({
                key: ['Area'+area+` (${getKey({area})})`], 
                data: 'Diff '+diff.join('')+` (${getKey({diff})})`,
                style: {
                    th: `font-weight: bold; color: ${getKey({area}) === 'best' ? 'green' : getKey({area}) === 'good' ? 'blue' : 'black'};`,
                    td: `font-weight: bold; color: ${getKey({diff}) === 'best' ? 'green' : getKey({diff}) === 'good' ? 'blue' : 'black'};`
                }
            });
            tr.childNodes[0].setAttribute('rowspan', '2');
            tr.childNodes[0].setAttribute('colspan', '2');
            tr.childNodes[1].setAttribute('colspan', '18');
            tb.TBody.tr({ data: [ ...strNumbers]});
            // tb.TBody.tr({key: 'รวม:',data: numbers.length})
        });
        mainTr.appendChild(tb.Node.table);
        Node.tbody.appendChild(mainTr)
    })

    TFoot.tr({key: 'รวมทั้งหมด:', data: result.length, style: {th: 'font-weight: bold;', td: 'font-weight: bold;'} });
    tableBox.appendChild(Node.table)
    closeButton(tableBox)
    dragAndDrop(Node)
    return tableBox
}