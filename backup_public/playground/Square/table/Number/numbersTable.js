import { node } from "../../../../script/dom.js";
import Table from "../../../../script/Table/Table.js";
import {isTod} from "../../../../script/array.js"
import {closeButton, dragAndDrop} from "../../../tables/services.js"
import LocalStorage from "../../../../script/LocalStorage.js";

const local = new LocalStorage();

const {Caption, ColGroup, THead, TBody, TFoot, Node} = new Table({id: 'square-area-diff',});//style: 'position:relative; table-layout:auto;'
Caption.setTitle({title: "Square (พื้นที่สี่เหลี่ยม)"});

//แสดง area และ diff ของแต่ละ number
export function numbersTable(Number, format='area'||'diff') {
    if(format == 'diff') {
        const goldTable = diffTable(Number, 'gold')
        const silverTable = diffTable(Number, 'silver')
        const bronzeTable = diffTable(Number, 'bronze')
        return [goldTable, silverTable, bronzeTable]
        // return formatDiff(Number)
    }
        
    if(format == 'area')
        return [ formatArea(Number) ]
    throw new Error('invalid format');
}

function diffTable(Number, name = 'gold') {
    const {Caption, ColGroup, THead, TBody, TFoot, Node} = new Table({id: 'square-diff-'+name,});
    // Caption.setTitle({title: "Square "+name});
    const [span, color] = name == 'gold' ? [9, '#FFD700'] : name == 'silver' ? [6, '#C0C0C0'] : [6, '#CD7F32'];
    ColGroup.set({span:1})
    ColGroup.set({span, style:'background-color:'+color+';'});
    const areas = Number.area.filter((v,i) => name=='gold' ? i>0&&i<10 : name =='silver' ? i>9&&i<16 : i>15)
    const row1 = ['Diff', ...Array.from({length: areas.length}, v => name+' area')];
    const row2 = areas.map(v => v.toString());
    
    THead.useTemplate(row1, row2);
    [...Node.thead.childNodes[1].childNodes].forEach((th, i) => {
        th.setAttribute('style', 'position: sticky; top: 0;');//make sticky thead
    });
    // debugger
    const storage = local.get('square');//
    console.error('Fix Stroage')
    const diffs = storage ? Number.diff.filter(df => !storage.diff.bad.some(ar => isTod(df, ar))) : Number.diff;// คัดตัว diff.bad ออกไป
    // debugger
    diffs.forEach(diff => {
        diff = diff.toString().replace(',', '');
        let {diff: df, area, number} = Number.sortByDiff.find(({diff:df}) => isTod(df, diff));
        if(!areas.some(v => v*1 == area*1)) return;
        const cells = [...Node.thead.childNodes[1].childNodes];
        const cell = cells.find(cell => cell.textContent == area);
        // if(!cell) debugger;// throw new Error('value must not be empty.');
        const index = !cell ? 0 : cell.cellIndex;
        const numbers = number.map(n => node({type: 'span', style:'padding:5px;', text: n.toString().replace(/,/g, '')}));
        const data = Array.from({length: cells.length}, v => null);
        // debugger
        TBody.tr({id: `diff-${diff}`, key: diff, data: [...data]});
        const tds = [...Node.tbody.querySelector('#diff-'+diff).childNodes];
        tds.some((td, i) => {
            if(i-1 !== index) return false
            td.setAttribute('style', 'display:flex; flex-flow:row wrap; width:fit-content;')
            numbers.map(span => td.appendChild(span))
            return true
        })
        // debugger
    });

    const high6 = name == 'gold' ? ' h-6' : '';//สำหรับกล่องที่มีขนาดสูงมาก
    const tableBox = node({type: 'div', classList: "table-box"+high6});//table wrap
    tableBox.appendChild(Node.table)
    closeButton(tableBox)
    dragAndDrop(Node)
    return tableBox
}

function formatArea(Number) {
    const storage = local.get('square');
    console.error('Fix Stroage')
    // THead.CSS.style({th: 'position: sticky; top: 0;'});
    const diffs = storage ? Number.diff.filter(df => !storage.diff.bad.some(v => isTod(df, v))) : Number.diff;//remove diff.bad

    const setRow1 = () => {
        return Array.from({length: diffs.length+1}, (v,i) => i==0 ? 'Area' : 'Diff')
    };
    const row1 = setRow1()
    const row2 = diffs.filter((v,i) => i > 0).map(v => v.toString().replace(/,/g, ''));
    // debugger
    THead.useTemplate(
        [...row1],
        [ ...row2]
    );

    [...Node.thead.childNodes[1].childNodes].forEach((th, i) => {
        th.setAttribute('style', 'position: sticky; top: 0;');//make sticky thead
    });
    
    const areas = storage ? Number.area.filter(n => !storage.area.bad.some(v => n==v)) : Number.area;//remove area.bad
    // debugger
        areas.forEach(area => {
            if(area == 0) return;
            const cells = [...Node.thead.childNodes[1].childNodes];
            const select = Number.sortByDiff.filter(v => v.area == area);
            // debugger
            const tr = node({type: 'tr', id: 'area-'+area, })
            const tds = Array.from({length: cells.length}, v => node({type: 'td'}));
            select.forEach(({diff, number}) => {
                const cell = cells.find(cell => cell.textContent == diff.toString().replace(/,/g,''));
                if(!cell) return;// throw new Error('value must not be empty.');
                const spans = number.map(arr => {
                    const num = arr.toString().replace(/,/g,'');
                    return node({type: 'span', style: 'padding: 5px;', text: num})
                })
                const index = cell.cellIndex;
                spans.forEach(sp => {
                    tds[index].setAttribute('style', 'display:flex; flex-flow:row wrap; ');
                    tds[index].appendChild(sp)
                })
                // tds[index] = 'x';
            })
            // TBody.tr({id: `area-${area}`, data: [area, ...data]})
            tr.appendChild(node({type:'td', text: area}))
            tds.forEach(td => tr.appendChild(td))
            Node.tbody.appendChild(tr)
        });
    
    // debugger
    const tableBox = node({type: 'div', classList: "table-box h-6"});//table wrap
    tableBox.appendChild(Node.table)
    closeButton(tableBox)
    dragAndDrop(Node)
    return tableBox
}