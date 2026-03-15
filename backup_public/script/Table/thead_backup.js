// import Obj from "../obj.js"
import {node} from "../dom.js"
/*
**** โค๊ดหน้า thead_backup.js สามารถใช้งานได้ แต่เป็นรูปแบบเก่า ****
*/

//style สำหรับ Thead
function theadStyle(style="") {
    if(!this?.Node) throw new Error('Node not found.');
    if(!this.Node.thead) throw new Error('thead is not set.');

    this.Node.thead.setAttribute('style', style);
    return true;// style
}
//style สำหรับ Th
function thStyle(style="") {
    if(!this?.Node) throw new Error('Node not found.');
    if(!this.Node.thead) throw new Error('thead is not set.');

    const all = this.Node.thead.querySelectorAll('th');
    if(all.length == 0) return false;//th ยังไม่ถูกสร้าง

    for(let th of all) {
        th.setAttribute('style', style)
    }
    return true;// style
}
//classList สำหรับ Thead
function theadClassList(classList="") {
    if(!this?.Node) throw new Error('Node not found.');
    if(!this.Node.thead) throw new Error('thead is not set.');

    const array = classList.split(/ /g)
    this.Node.thead.classList.add(...array)
    return true;// classList
}
//classList สำหรับ Th
function thClassList(classList="") {
    if(!this?.Node) throw new Error('Node not found.');
    if(!this.Node.thead) throw new Error('thead is not set.');

    const all = this.Node.thead.querySelectorAll('th');
    if(all.length == 0) return false;//th ยังไม่ถูกสร้าง

    const array = classList.split(/ /g);
    for(let th of all) {
        th.classList.add(...array)
    }
    return true;// classList
}

//for simple columns
function setColNames(names=["Tom", 33, "Thailand"]) {
    if(!this?.Node) throw new Error('Node is not exist.');
    
    const tr = node({type: 'tr'});
    names.forEach(name => {
        const th = node({type: 'th', text: name, classList: this.tailwind.th});
        th.setAttribute('scope', 'col');
        tr.appendChild(th);
    });

    this.Node.thead.appendChild(tr);
    // this.Node.table.querySelector('tbody').before(this.Node.thead);
    return this;// THead
}

//for complex columns
//row1: ["previous 3", "watch", "match", "error", "error", "error"], //error ใช้ 3 คอลัมน์
//row2: ["", "", "", "stars", "wing", "dub"], *Optional มีหรือไม่มีก้อได้
function setTemplate(row1=[], row2=[]) {
    if(!this?.Node) throw new Error('Node is not exist.');
    
    //สร้าง row1
    const tr1 = node({type: 'tr'});
    const r1 = [...new Set(row1)].map(name => [name, row1.filter(n => n == name).length]);
    for(let [name, span] of r1) {
        const th = node({type: 'th', text: name, classList: this.tailwind.th});
        th.setAttribute('scope', 'col');
        if(r1.some(([n, s]) => s > 1)) {
            row2 && span == 1 && th.setAttribute('rowspan', '2');
            span > 1 && th.setAttribute('colspan', span.toString());
        }
        tr1.appendChild(th);
    }
    this.Node.thead.appendChild(tr1);

    //สร้าง row2
    if(Array.isArray(row2) && row2.length > 0) {
        const tr2 = node({type: 'tr'});
        row2.forEach(name => {
            name && tr2.appendChild(node({type: 'th', text: name, classList: this.tailwind.th}))
        });

        this.Node.thead.appendChild(tr2)
    }

    // debugger
    // this.Node.table.querySelector('tbody').before(this.Node.thead);
    return this;// THead
}

class Style {
    constructor(parent) {
        this.Node = parent.Node;
    }
    thead = theadStyle;
    th = thStyle;
}
class ClassList {
    constructor(parent) {
        this.Node = parent.Node;
    }
    thead = theadClassList;
    th = thClassList ;
}


export default class THead {
    constructor(parent) {
        this.Node = parent.Node;
        this.useTailwind = parent.useTailwind;
        this.tailwind = {
            thead: this.useTailwind ? parent.tailwind.thead  : "",
            th: this.useTailwind ? parent.tailwind.th : "",
        }
        this.setThead();
    }
    setThead() {
        if(this.Node.table.querySelector('thead')) throw new Error('thead ถูกสร้างไว้แล้ว ไม่สามารถสร้างซ้ำได้');
        const thead = node({type: 'thead', classList: this.tailwind.thead});
        this.Node.set(thead,'thead');
        this.Node.table.appendChild(thead)
    }

    style({thead="", th=""}) { 
        if(typeof thead !== 'string' || typeof th !== 'string') throw new Error('wrong type');
        if(!thead && !th) throw new Error('คุณต้องระบุ style ให้กับ thead หรือ th');
        
        const style = new Style(this);
        thead && style.thead(thead);
        // debugger
        if(th == "") return this;

        const done = style.th(th);
        if(!done) //th ยังไม่ได้ถูกสร้าง
            this._style = {th};//เก็บ style ที่ยังไม่ถูก apply
        
        return this;
    }
    class({thead="", th=""}) {
        if(typeof thead !== 'string' || typeof th !== 'string') throw new Error('wrong type');
        if(!thead && !th) throw new Error('คุณต้องระบุ style ให้กับ thead หรือ th');

        const cls = new ClassList(this);
        thead && cls.thead(thead);
        // debugger
        if(th == "") return this;

        const done = cls.th(th);
        if(!done) //th ยังไม่ได้ถูกสร้าง
            this._style = {th};//เก็บ style ที่ยังไม่ถูก apply
        
        return this;
    }

    setColNames = setColNames;
    setTemplate = setTemplate;

}




/* โค๊ดเก่า
//colSpan = [ [columnName: string, span: number] ]
function thead({
        colNames=[], // [name1:string, name2: string, name3: string]
        //colSpan=[ [] ], //NOTE - ยกเลิกใช้งาน colSpan
        classList = {thead:"", th: ""}, 
        style = {thead: "", th: ""},
        template = [
            //row1: ["previous 3", "watch", "match", "error", "error", "error"], //error ใช้ 3 คอลัมน์
            //row2: ["", "", "", "stars", "wing", "dub"], *Optional มีหรือไม่มีก้อได้
        ],
    }) {
        if(!this?.Node) throw new Error('Node is not exist.');
        if(this.Node.table.querySelector('thead')) throw new Error('thead ถูกสร้างไว้แล้ว ไม่สามารถสร้างซ้ำได้');
        if(!Obj.isObject(classList) || Object.keys(classList).some(v => v !== 'thead' && v !== 'th')) 
            throw new Error('classList must be Object like {thead:"", th:""}');
        if(!Obj.isObject(style) || Object.keys(style).some(v => v !== 'thead' && v !== 'th')) 
            throw new Error('Style must be Object like {thead:"", th:""}');
        if(!Array.isArray(colNames) || colNames.some(v => typeof v !== 'string'))
            throw new Error('colNames must be String Array like [ "str1", "str2", "str3" ]');
        if(!Array.isArray(template) || template.some(v => !Array.isArray(v)))
            throw new Error('template must be Array2D like [ [] ]');
        if(colNames.length > 0 && template.length > 0)
            throw new Error('คุณควรเลือกใช้งาน อย่างใดอย่างหนึ่ง ระหว่าง ColNames หรือ Template');

        // if(!Array.isArray(colSpan) || colSpan.some(v => !Array.isArray(v)))
        //     throw new Error('colSpan must be Array like [ ["colName, 3] ]');
        // colSpan = colSpan.filter(v => v.length > 0);

        const class1 = this.useTailwind ? this.tailwind.thead  : classList.thead;
        const class2 = this.useTailwind ? this.tailwind.th : classList.th;
        const thead = node({type: 'thead', style: style.thead, classList: class1});
        !this.Node.thead && this.Node.set(thead,'thead');
        const tr = node({type: 'tr'});

        // Complex Columns คอลัมน์ที่ซับซ้อน
        if(template.length > 0) {
            // if(template.length !== 2) throw new Error('Template must has 2elements each element represent row1 and row2');
            const [row1, row2] = template;
            //สร้าง row1
            const r1 = [...new Set(row1)].map(name => [name, row1.filter(n => n == name).length]);
            for(let [name, span] of r1) {
                const th = node({type: 'th', text: name, style: style.th, classList: class2});
                th.setAttribute('scope', 'col');
                if(r1.some(([n, s]) => s > 1)) {
                    row2 && span == 1 && th.setAttribute('rowspan', '2');
                    span > 1 && th.setAttribute('colspan', span.toString());
                }
                tr.appendChild(th);
            }
            thead.appendChild(tr);

            //สร้าง row2
            if(Array.isArray(row2) && row2.length > 0) {
                const tr2 = node({type: 'tr'});
                row2.forEach(name => {
                    name && tr2.appendChild(node({type: 'th', text: name, style: style.th, classList: class2 }))
                });
                thead.appendChild(tr2)
            }
            // debugger

        //Simple Columns คอลัมน์พื้นฐาน
        }else if(colNames.length > 0) {
            colNames.forEach(colName => {
                const th = node({type: 'th', text: colName, style: style.th, classList: class2});
                th.setAttribute('scope', 'col');
                // const [_, span] = colSpan.find(([c_name,]) => c_name == colName) || [];
                // if(span*1 > 0) th.setAttribute('colspan', span.toString());
                // this.Node.set(th, 'th')
                tr.appendChild(th);
            });
            thead.appendChild(tr);
        }

        this.Node.table.appendChild(thead);
        // debugger;
        return this;
    }
*/