
import { getData } from "../../script/api.js";
import { playGroundConfig as config } from "../../script/config/config.global.js";
import setTable from "./setTable.js";


export async function drawTable() {
  if (!config.Date.upcoming) throw new Error("Date.upcoming is not set");
  const { d, m, y: presentYear } = config.Date.upcoming;
  if (!presentYear) throw new Error("presentYear is not set");
  // debugger;
  const results = await getData(
    `/playground/db/present?presentYear=${presentYear}`
  );
  return await setTable(results, config);
}




// async function dbRows(Node) {
//     const rows = Node.table.querySelectorAll('.db');
//     const rating = [['best', '#A3D78A'], ['veryGood', '#C1E59F'], ['good', '#FF937E'], ['dead', '#FF5555']];
//     const {numbers: {best, veryGood, good, dead}} = await getData('/playground/db');
//     // debugger

//     rows.forEach((tr, idx) => {
//         tr.childNodes.forEach((cell, i) => {
//             if(cell.tagName !== 'TD') return;
//             const [txt, code] = rating[i-1];
//             const btn = node({
//                 type: 'button',
//                 text: txt,
//                 style: `background-color: ${code}; border:0px; padding:5px; cursor:pointer;`,
//                 handler: (e) => {
//                     const [_, numbers] = [['best', best], ['veryGood', veryGood], ['good', good], ['dead', dead]].find(([k, v]) => txt == k);
//                     handleDBRows(numbers, txt, code)
//                 }
//             });
//             cell.appendChild(btn)
//             // debugger
//         })
//     });
//     // debugger
// }

// function handleDBRows(numbers, txt, code) {
//     const tbody = Node.table.querySelector('tbody');
//     const rows = tbody.childNodes;

//     // switch การทำงานจาก mode avg เป็น mode db
//     if(mode == 'avg') {
//         rows.forEach(tr => {
//             tr.childNodes.forEach((cell, i) => {
//                 if(![2,3].some(v => v == i)) return;//column 3ตัว 2ตัว บน
//                 if(cell.style.backgroundColor ) cell.style.backgroundColor = '';
//             })
//         })
//     }

//     mode = 'db';
//     rows.forEach(tr => {
//         tr.childNodes.forEach((cell, i) => {
//             if(i !== 3) return;//column 2ตัว บน
//             if((cell.textContent*1).toString() == 'NaN') return;
//             const value = Array.from(cell.textContent, (v) => v*1);
//             if(value.length !== 2) throw new Error('ต้องเป็นตัวเลข 2ตัวเท่านั้น');
//             const match = numbers.some(num => isTod(num, value))
//             if(match) {
//                 if(cell.style.backgroundColor ) {
//                     cell.style.backgroundColor = '';
//                 } else{
//                     cell.style.backgroundColor = code;
//                 }
//             }
//             // debugger
//         })
//     })
// }
