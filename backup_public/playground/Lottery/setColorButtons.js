import handleClick from './handleClick.js'
import { node } from "../../script/dom.js";


//สร้างปุ่ม gold, silver, bronze
export default function setColorButtons({ selector = "", colors = [], data = null, elements = null }) {
  // const rows = Node.table.querySelectorAll('.avg-buttons');
  // const colors = [['gold', '#EFBF04'], ['silver', '#C4C4C4'], ['bronze', '#CE8946'], ['ignore', '#898989']];
  // const {digit2, digit3} = await getData('/playground/avg');
  const { Node } = elements;
  const rows = Node.table.querySelectorAll(selector);
  
  rows.forEach((tr, idx) => {
    const groups = setGroups(idx, selector, data);
    tr.childNodes.forEach((cell, i) => {
      if (cell.tagName !== "TD") return;
      const [color, code] = colors[i - 1];
      const btn = node({
        type: "button",
        text: color,
        style: `background-color: ${code}; border:0px; padding:5px; cursor:pointer;`,
        handler: (e) => {
          const [_, numbers] = groups.find(([k, v]) => color == k);
          handleClick(numbers, code, selector, elements);
        },
      });
      cell.appendChild(btn);
      // debugger
    });
  });
  // debugger
}


function setGroups(idx, selector, data) {
  if (selector == ".avg-buttons") {
    if (idx !== 0 && idx !== 1) throw new Error("ไม่ยอมรับ index=" + idx);
    const { digit2, digit3 } = data;
    const { gold, silver, bronze, ignore } = idx == 0 ? digit3 : digit2; //3ตัว 2ตัว
    const groups = [
      ["gold", gold],
      ["silver", silver],
      ["bronze", bronze],
      ["ignore", ignore],
    ];
    // debugger
    return groups;
  } else if (selector == ".db-buttons") {
    if (idx !== 0) throw new Error("ไม่ยอมรับ index=" + idx);
    const {
      numbers: { best, veryGood, good, dead },
    } = data;
    const groups = [
      ["best", best],
      ["veryGood", veryGood],
      ["good", good],
      ["dead", dead],
    ];
    // debugger
    return groups;
  } else if (selector == ".square-buttons") {
    if (idx !== 0) throw new Error("ไม่ยอมรับ index=" + idx);
    const { gold, silver, bronze } = data;
    const [nGold, nSilver, nBronze] = [gold, silver, bronze].map((arr) =>
      arr.map((item) => item.number)
    );
    const groups = [
      ["gold", nGold],
      ["silver", nSilver],
      ["bronze", nBronze],
    ];
    // debugger
    return groups;
  } else if (selector == ".square-diff-buttons") {
    if (idx !== 0) throw new Error("ไม่ยอมรับ index=" + idx);
    const { best, good } = data;
    const [nBest, nGood] = [best, good].map((arr) =>
      arr.map((item) => item.number)
    );
    const groups = [
      ["best", nBest],
      ["good", nGood],
    ];
    // debugger
    return groups;
  } else {
    throw new Error("ไม่รู้จัก selector=" + selector);
  }
}