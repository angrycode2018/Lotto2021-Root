import { isTod } from "../../script/array.js";

let mode = null; //avg or db

//update td elements
export default function handleClick(numbers, code, selector, elements) {
  // if(selector == '.square-diff-buttons') debugger;
  const { Node } = elements;
  const digit = numbers[0].length;
  const tbody = Node.table.querySelector("tbody");
  const rows = tbody.childNodes;
  const m =
    selector == ".avg-buttons"
      ? "avg"
      : selector == ".db-buttons"
      ? "db"
      : selector == ".square-buttons"
      ? "square"
      : selector == ".square-diff-buttons"
      ? "square-diff"
      : null;

  // switch การทำงานจาก mode db เป็น mode avg
  const columns =
    m == "avg"
      ? [2, 3]
      : m == "db"
      ? [3]
      : m == "square"
      ? [2]
      : m == "square-diff"
      ? [2]
      : [];
  if (mode !== m) {
    rows.forEach((tr) => {
      tr.childNodes.forEach((cell, i) => {
        if (!columns.some((v) => v == i)) return; //column 3ตัว 2ตัว บน
        if (cell.style.backgroundColor) cell.style.backgroundColor = "";
      });
    });
  }

  mode = m;
  if (m == "db" && digit == 3) throw new Error("db ไม่รองรับ เลขท้าย 3ตัว");
  // debugger;
  rows.forEach((tr) => {
    tr.childNodes.forEach((cell, i) => {
      if (!columns.some((v) => v == i)) return; //column 3ตัว 2ตัว บน
      if ((cell.textContent * 1).toString() == "NaN") return;
      const value = Array.from(cell.textContent, (v) => v * 1);
      if (value.length !== digit) return;

      const match = numbers.some((num) => isTod(num, value));
      if (match) {
        if (cell.style.backgroundColor) {
          cell.style.backgroundColor = "";
        } else {
          cell.style.backgroundColor = code;
        }
      }
      // debugger
    });
  });
}