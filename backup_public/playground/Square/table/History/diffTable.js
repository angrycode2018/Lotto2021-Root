import { node } from "../../../../script/dom.js";
import Table from "../../../../script/Table/Table.js";
import {isTod} from "../../../../script/array.js"
import {closeButton, dragAndDrop} from "../../../tables/services.js"
import {postData} from "../../../../script/api.js"
import LocalStorage from "../../../../script/LocalStorage.js";

const local = new LocalStorage();

//ตัวอย่างเรียกใช้ List.groupArray() จาก Server
// postData('/func/group-array', [1,2,3,4,5])
// .then(result => {
//     debugger
// })

const {Caption, ColGroup, THead, TBody, TFoot, Node} = new Table({id: 'square-yearly-diff'});
Caption.setTitle({title: "Square Yearly Diff"});


export async function diffTable(history, Number) {
    const diffs = Number.diff.filter((v,i) => i > 0); //ไม่เอา diff 0,0
    const sumDiffs = Array.from({length: diffs.length}, v => 0);

    [history.thisYear, ...history.yearly].map(({year, win}) => {
        const data = diffs.map(diff => win.diffs.filter(df => isTod(df, diff)).length)
        // TBody.tr({ key: year, data });
        data.map((v,i) => sumDiffs[i] += v)
    });

    let [best, good, bad] = await postData('/func/devide-array', sumDiffs);
    best = best.reduce((a,b) => a.some(n => n==b) ? a : [...a, b], []);
    good = good.reduce((a,b) => a.some(n => n==b) ? a : [...a, b], []);
    bad = bad.reduce((a,b) => a.some(n => n==b) ? a : [...a, b], []);

    function findDiffs(group) {
        const indexs = sumDiffs.map((sum, i) => group.some(v => v == sum) ? i : null).filter(v => v !== null);
        return diffs.filter((df,i) => indexs.some(x => x == i))
    }
    // const bestDiffs = findDiffs(best), goodDiffs = findDiffs(good), badDiffs = findDiffs(bad);
    const [bestDiffs, goodDiffs, badDiffs] = [best, good, bad].map(group => findDiffs(group));
    const reduceDiffs = diffs.filter((df,i) => !badDiffs.some(ar => isTod(ar, df)));
    const badIndexs = diffs.map((df,i) => badDiffs.some(ar => isTod(ar, df)) ? i : null).filter(v => v !== null);
    // debugger

    const row1 = ['Yr', ...Array.from({length: reduceDiffs.length}, (v,i) => 'Diff')];
    const row2 = reduceDiffs.map(ar => ar.toString().replace(/,/g,''));
    THead.useTemplate(row1, row2);
    // debugger

    [history.thisYear, ...history.yearly].map(({year, win}) => {
        const data = reduceDiffs.map(diff => win.diffs.filter(df => isTod(df, diff)).length)
        TBody.tr({ key: year, data });
    });
 

    try {
        //ข้อมูลต้องมีการอัปเดตใหม่ทุกครั้งที่ function ถูกเรียกใช้งาน
        const saved = await postData('/output/square', {
            diff: {best: bestDiffs, good: goodDiffs, bad: badDiffs},
        });

    }catch(e) {
        console.error(e)
        throw new Error('something wrong')
    }

    //NOTE - local.update อาจถูกยกเลิกใช้งาน
    console.error('Fix Storage')
    local.update('square', {
        ...local.get('square'),
        diff: {best: bestDiffs, good: goodDiffs, bad: badDiffs},
    });
    // debugger
    const sum = sumDiffs.filter((v,i) => !badIndexs.some(bi => bi == i));
    TFoot.tr({key:'Sum', style: {tr: "display: table-row;", th: 'padding-top:20px;', td: 'padding-top:20px;'}, data: sum});
    TFoot.tr({key:'best', data: ['diff ที่แนะนำ: ', ...bestDiffs.map(ar => ar.toString().replace(/,/g, ''))]});
    TFoot.tr({key:'good', data: ['diff ที่แนะนำ: ', ...goodDiffs.map(ar => ar.toString().replace(/,/g, ''))]});
    TFoot.tr({key:'bad', data: ['diff ที่ไม่แนะนำ: ', ...badDiffs.map(ar => ar.toString().replace(/,/g, ''))]});
    TFoot.tr({key:'*', data: ['bad diff columns ถูกตัดออกจากตาราง']});

    const tableBox = node({type: 'div', classList: "table-box"});//table wrap
    tableBox.appendChild(Node.table)
    closeButton(tableBox)
    dragAndDrop(Node)
    // debugger
    return tableBox
}