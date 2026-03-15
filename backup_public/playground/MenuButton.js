import handleSquare from "./Square/handleSquare.js";
import handleAVG from "./AVG/handleAVG.js";
import handleAxisXY from "./AxisXY/handleAxisXY.js";
import handleDB from "./DB/handleDB.js";
import handleCircle from "./Circle/handleCircle.js";
import {showSampleTable} from "./tables/sampleTables.js"
import { node } from "../script/dom.js"


export default class MenuButton {
    constructor({config, content2}) {
        if(!config || !content2) throw new Error('ต้องระบุ config และ content2');
        this.config = config;
        this.content2 = content2;
    }
    //สร้าง Menu Button สำหรับทดสอบโค้ด
    createButtons(names=[]) {
        names.forEach(txt => {
            const btn = node({
                type: 'button', 
                text: txt, 
                handler: async (e) => {
                    e.target.disabled = true;
                    await this.handleClick(txt)
                },
            });
            menu.appendChild(btn)
        });
    }
    //เมื่อมีการคลิกปุ่ม จะนำข้อมูลขึ้นแสดงบนตาราง
    async handleClick(txt) {
        const {config, content2} = this;
        txt = txt.toLowerCase();
        if(!['circle', 'axisXY', 'DB', 'AVG', 'Square', 'sampleTable'].some(v => v.toLowerCase() == txt)) {
            return alert(txt)
        }
        // debugger;
        const {y, m, d} = config.Date.upcoming;//งวดที่จะทำการคำนวณ
        const present3 = config.Numbers.lastDraw;//งวดล่าสุด
        const watch = config.Numbers.watch;
        const place = config.Numbers.position;
        const digit = config.Numbers.digit;
        //  debugger
        (txt == 'sampletable') && showSampleTable(3).map(node => content2.appendChild(node));//แสดงตารางตัวอย่าง
        (txt == 'circle') && await handleCircle({presentYear: y, previous3: present3, watch, content2});
        txt == 'axisxy' && await handleAxisXY({presentYear: y, present3, content2, upcomingDate: {y, m, d}});
        txt == 'db' && await handleDB({presentYear: y, place, digit, content2});
        txt == 'avg' && await handleAVG({presentYear: y, content2});
        txt == 'square' && await handleSquare(content2);
    }
}