import { node } from "../../../../script/dom.js";
import Table from "../../../../script/Table/Table.js";
// import {isTod} from "../../../../script/array.js"
import {closeButton, dragAndDrop} from "../../../tables/services.js"
import { postData } from "../../../../script/api.js";
import LocalStorage from "../../../../script/LocalStorage.js"

const local = new LocalStorage();

const {Caption, ColGroup, THead, TBody, TFoot, Node} = new Table({id: 'square-yearly-area'});
Caption.setTitle({title: "Square Yearly Area"});

export async function areaTable(history, Number) {
    const areas = Number.area.filter(v => v > 0);//ตัด area 0 ออกไป
    const row1 = ['Year', ...Array.from(areas, (v,i) => v>0&&v<10 && 'Gold Area' || v>9&&v<20 && 'Silver Area' || 'Bronze Area')];
    const row2 = [...areas];
    // debugger
    ColGroup.set({span:1});
    ColGroup.set({span:9, style:'background-color:#FFD700;'});
    ColGroup.set({span:6, style:'background-color:#C0C0C0;'});
    ColGroup.set({span:6, style:'background-color:#CD7F32;'});
    THead.useTemplate(row1, row2);

    const sumArea = Array.from({length: areas.length}, v => 0);

    const x = [history.thisYear, ...history.yearly].map(({year, win}) => {
        const {gold, silver, bronze} = win.areas;
        const data = Array.from(areas, v => gold.filter(n => n==v).length || silver.filter(n => n==v).length || bronze.filter(n => n==v).length);
        TBody.tr({key: year, data,});
        data.map((v,i) => sumArea[i] += v)
        // debugger
    });

    let result = await postData('/func/devide-array/6', sumArea);
    let [best, good, ok, bad] = [[...result[0], ...result[1]], result[2], result[3], result[4]];
    // [best, good, ok, bad] = [best, good, ok, bad].map(ar => ar.reduce((a,b) => a.some(v => v==b)?a:[...a,b], []));//unique value
    const [bestIndexs, goodIndexs, okIndexs, badIndexs] = [best, good, ok, bad].map(group => {
        return (group && sumArea.map((n,i) => group.some(v => v==n) ? i : null).filter(v => v!==null)) || []
    })
    // debugger;
    
    const bestAreas = areas.filter((n,i) => bestIndexs.some(x => x==i));
    const goodAreas = areas.filter((n,i) => goodIndexs.some(x => x==i));
    const okAreas = areas.filter((n,i) => okIndexs.some(x => x==i));
    const badAreas = areas.filter((n,i) => badIndexs.some(x => x==i));
    // debugger
    try {
        //ข้อมูลต้องมีการอัปเดตใหม่ทุกครั้งที่ function ถูกเรียกใช้งาน
        const saved = await postData('/output/square', {
            area: {
                    best: bestAreas, 
                    good: goodAreas, 
                    ok: okAreas, 
                    bad: badAreas
                }
        })
        // debugger;
    } catch(e) {
        console.error(e)
        throw new Error('something wrong')
    }

    //NOTE - local.update อาจถูกยกเลิกใช้งาน
    console.error('Fix Storage')
    local.update( 'square', 
        {   ...local.get('square'), 
            area: {
                best: bestAreas, 
                good: goodAreas, 
                ok: okAreas, 
                bad: badAreas
            },
        }
    );

    TFoot.tr({key: 'sum', style: {tr:'display:table-row;', th: 'padding-top:20px;', td: 'padding-top:20px;'}, data: sumArea});
    TFoot.tr({key: 'best', data: ['area:', ...bestAreas]});
    TFoot.tr({key: 'good', data: ['area:', ...goodAreas]});
    TFoot.tr({key: 'ok', data: ['area:', ...okAreas]});
    TFoot.tr({key: 'bad', data: ['area:', ...badAreas]});
    
    // debugger
    const tableBox = node({type: 'div', classList: "table-box"});//table wrap
    tableBox.appendChild(Node.table)
    closeButton(tableBox)
    dragAndDrop(Node)
    return tableBox
} 