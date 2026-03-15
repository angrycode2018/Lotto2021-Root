import { initLayout } from "../script/layout/layout.js";
import { node } from "../script/dom.js";
import { getData } from "../script/api.js";
import handlePlusOne from "./handler/handlePlusOne.js";
import handleAddSubstract from "./handler/handleAddSubstract.js"
import { performanceConfig as config } from "../script/config/config.global.js";
// alert('Hello')
config.Date.setUpcomingDraw({d: 16, m: 0, y: 68})
config.Numbers.setDigit(3);
config.Numbers.setPosition('up');

console.warn('ไม่สามารถใช้งาน tailwind class ใน project นี้ได้เนื่องจาก ใช้ external hardisk จังไม่สามารถติดตั้ง tailwind ให้เสร็จสมบูรณ์ได้')
const messages = [
    ['taiwind', 'ไม่สามารถใช้งาน tailwind class ใน project นี้ได้เนื่องจาก ใช้ external hardisk จังไม่สามารถติดตั้ง tailwind ให้เสร็จสมบูรณ์ได้'],
    ['drag & drop', 'ตารางในหน้านี้สามารถ drag & drop ได้'],
];

const {wrapper, main, menu, info, h4, content1, content2} = initLayout({ menu:1, info:1, h4:1, content1:1 });//สร้าง layout หน้า HTML
h4.textContent = "สำรวจความแม่นยำของสูตรต่างๆ";
document.body.appendChild(wrapper);

createButtons(['plusOne', 'addSubstract']);//สร้างปุ่ม

//สร้าง Button สำหรับทดสอบโค้ด
function createButtons(names=[]) {
    names.forEach(txt => {
        const btn = node({
            type: 'button', 
            text: txt, 
            handler: async (e) => {
                e.target.disabled = true;
                await handleClick(txt)
            },
        });
        menu.appendChild(btn)
    });
}

async function handleClick(txt) {
    // alert(txt)
    const a = txt == 'plusOne' && await handlePlusOne();
    const b = txt == 'addSubstract' && await handleAddSubstract();
    content2.appendChild(a || b);
}

