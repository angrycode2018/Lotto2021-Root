// import Square from "../../class/formula/Square/Square.js"
// import FirstPrize from "../lotto_result_table/js/firstPrize/FirstPrize.js";

// const fp = new FirstPrize()
// debugger
import { drawTable } from "./Lottery/drawTable.js";
import MenuButton from "./MenuButton.js";
import { showMessages } from "./common.js";

const messages = [
    [
        "taiwind",
        "ไม่สามารถใช้งาน tailwind class ใน project นี้ได้เนื่องจาก ใช้ external hardisk จังไม่สามารถติดตั้ง tailwind ให้เสร็จสมบูรณ์ได้",
    ],
    ["drag & drop", "ตารางในหน้านี้สามารถ drag & drop ได้"],
];

let config = null; //config จะถูกส่งมาจากไฟล์ init.js
let reports = null; //reports จะถูกส่งมาจากไฟล์ init.js
let base = null; //base จะถูกส่งมาจากไฟล์ init.js
let layout = null;

export default function start({ ...root }) {
    config = root.config;
    reports = root.reports;
    base = root.base;
    layout = root.layout;
    //สร้างปุ่มเมนู
    const menu = new MenuButton({ config, content2: layout.content2 });
    menu.createButtons([
        "Home",
        "Circle",
        "AxisXY",
        "DB",
        "AVG",
        "Square",
        "SampleTable",
    ]);

    //ตารางผลการออกรางวัลล่าสุด
    drawTable().then((tableNode) => {
        layout.content2.appendChild(tableNode);
    });

    //แจ้งเตือน
    showMessages(messages).forEach(div => layout.info.appendChild(div));
}


