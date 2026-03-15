import Table from "../../script/Table/Table.js";
import { node } from "../../script/dom.js";
import { dragAndDrop, closeButton } from "../tables/services.js";
import { getData, postData } from "../../script/api.js";
import setColorButtons from "./setColorButtons.js"

const tableBox = node({ type: "div", classList: "table-box" }); //table wrap
const { Caption, THead, TBody, TFoot, Node } = new Table({id: "lottery-results",});

const elements = { Caption, THead, TBody, TFoot, Node, tableBox};


export default async function setTable(results, config) {
    if(!results || results.length === 0) throw new Error('ไม่พบผลการออกรางวัล');
    if (!config.Date.upcoming) throw new Error("Date.upcoming is not set");
  const { y: presentYear } = config.Date.upcoming;
  const place = config.Numbers.position;
  const digit = config.Numbers.digit;

  Caption.setTitle({ title: "ผลการออกรางวัล ปี " + presentYear });
  THead.useColumnNames(["date", "prize1", "3 UP", "2 UP", "2 DOWN"]);

  //แสดงผลการออกรางวัล
  results.forEach(({ date, prize1, digit3Up, digit2Up, digit2 }) => {
    TBody.tr({ data: [date, prize1, digit3Up, digit2Up, digit2] });
  });
  // debugger;
  TFoot.tr({ key: `จำนวน ${results.length} งวด`, data: null });
  TFoot.tr({
    key: "Avg 3ตัว",
    data: [null, null, null, null],
    classList: { tr: "avg-buttons" },
  });
  TFoot.tr({
    key: "Avg 2ตัว",
    data: [null, null, null, null],
    classList: { tr: "avg-buttons" },
  });
  TFoot.tr({
    key: "DB 2ตัว",
    data: [null, null, null, null],
    classList: { tr: "db-buttons" },
  });
  TFoot.tr({
    key: "Square Area 3ตัว",
    data: [null, null, null],
    classList: { tr: "square-buttons" },
  });
  TFoot.tr({
    key: "Square Diff 3ตัว",
    data: [null, null],
    classList: { tr: "square-diff-buttons" },
  });

  setColorButtons({
    selector: ".avg-buttons",
    colors: [
      ["gold", "#EFBF04"],
      ["silver", "#C4C4C4"],
      ["bronze", "#CE8946"],
      ["ignore", "#898989"],
    ],
    data: await getData("/playground/avg"),
    elements,
  });

  const dbData = await getData(
    `/playground/db?presentYear=${presentYear}&place=${place}&digit=${2}`
  );
  setColorButtons({
    selector: ".db-buttons",
    colors: [
      ["best", "#A3D78A"],
      ["veryGood", "#C1E59F"],
      ["good", "#FF937E"],
      ["dead", "#FF5555"],
    ],
    data: dbData,
    elements,
  });
  // debugger;
  const [{ area, diff }] = await getData("/output/square");
  const allAreas = [...area.best, ...area.good, ...area.ok];
  const sGold = await postData("/playground/square/query", {
    areas: allAreas.filter((n) => n < 10),
  });
  const sSilver = await postData("/playground/square/query", {
    areas: allAreas.filter((n) => n >= 10 && n < 20),
  });
  const sBronze = await postData("/playground/square/query", {
    areas: allAreas.filter((n) => n >= 20),
  });
  // debugger
  setColorButtons({
    selector: ".square-buttons",
    colors: [
      ["gold", "#EFBF04"],
      ["silver", "#C4C4C4"],
      ["bronze", "#CE8946"],
    ],
    data: { gold: sGold, silver: sSilver, bronze: sBronze },
    elements,
  });
  const sBest = await postData("/playground/square/query", {
    diffs: diff.best,
  });
  const sGood = await postData("/playground/square/query", {
    diffs: diff.good,
  });
  setColorButtons({
    selector: ".square-diff-buttons",
    colors: [
      ["best", "#A3D78A"],
      ["good", "#C1E59F"],
    ],
    data: { best: sBest, good: sGood },
    elements,
  });
  // debugger
  // await dbRows(Node)
  dragAndDrop(Node);
  closeButton(tableBox);

  tableBox.appendChild(Node.table);
  return tableBox;
}