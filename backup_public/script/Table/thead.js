// import Obj from "../obj.js";
import {node} from "../dom.js"

//for simple columns
function setColNames(names=["Tom", 33, "Thailand"]) {
    if(!this?.Node) throw new Error('Node is not exist.');
    
    const tr = node({type: 'tr'});
    names.forEach(name => {
        const th = node({type: 'th', text: name, });
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
    this.Style;
    this.ClassList;
    //สร้าง row1
    const tr1 = node({type: 'tr', style: this.Style.default.tr, classList: this.ClassList.default.tr});
    const r1 = [...new Set(row1)].map(name => [name, row1.filter(n => n == name).length]);
    for(let [name, span] of r1) {
        const th = node({type: 'th', text: name, style: this.Style.default.th, classList: this.ClassList.default.th});
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
        const tr2 = node({type: 'tr', style: this.Style.default.tr, classList: this.ClassList.default.tr});
        row2.forEach(name => {
            name && tr2.appendChild(node({type: 'th', text: name, style: this.Style.default.th, classList: this.ClassList.default.th}))
        });

        this.Node.thead.appendChild(tr2)
    }

    // debugger
    // this.Node.table.querySelector('tbody').before(this.Node.thead);
    return this;// THead
}

function createClass(className="") {
    const isClass = (name="") => name.toLowerCase() == className.toLowerCase();
    if(!isClass('style') && !isClass('classlist')) throw new Error('wrong class name');
    return class {
        default = {};
        constructor(parent) {
            this.Node = parent.Node;
        }
        setDefault({thead="", tr="", th="",}) {
            this.default = {thead, tr, th,}
        }
        setThead({style="", classList=""}) {
            if(typeof style !== 'string' || typeof classList !== 'string') throw new Error('require string');
            if(!style && !classList) throw new Error('string must not be empty.');
            if(!this?.Node?.thead) throw new Error('thead is not set.');
            isClass('style') && this.Node.thead.setAttribute('style', style);
            isClass('classlist') && this.Node.thead.classList.add(...classList.split(/ /g));
            return this;// style
        }
        //ทำงานกับ ชุดของ elements หลายตัว
        lists({tag="", style="", classList=""}) {
            if(typeof tag !== 'string' || typeof style !== 'string' || typeof classList !== 'string') throw new Error('require type of string');
            if(!tag && !style && !classList) throw new Error('argument must not be empty.');
            if(!this?.Node?.thead) throw new Error('thead is not set.');
            if(!['tr', 'th', 'td'].some(v => v == tag)) throw new Error('สำหรับ tag tr, th, หรือ td เท่านั้น');

            const all = this.Node.thead.querySelectorAll(tag);
            // debugger
            if(all.length == 0) {
                const [name, css] = isClass('style') ? ['style', style] : ['classList', classList];
                return console.error('fail to apply css '+name+ ' to tag '+tag+' '+css+ ' may be tag is not exist.');
            }

            for(let tag of all) {
                isClass('style') && tag.setAttribute('style', style)
                isClass('classlist') && tag.classList.add(...classList.split(/ /g))
            }
            return this;// style
        }
    }
}

const Style = createClass('Style');
const ClassList = createClass('ClassList');

class CSS {
    constructor(parent) {
        this.Style = new Style(parent);
        this.ClassList = new ClassList(parent);
        this.Node = parent.Node;
    }
    //instance = Style | ClassList
    #useClass(className="") {
        const isClass = (name="") => name.toLowerCase() == className.toLowerCase();
        if(!['style', 'classlist'].some(n => n.toLowerCase() == className.toLowerCase())) throw new Error('for class Style or ClassList only.');
        const instance = isClass('style') ? this.Style : isClass('classlist') ? this.ClassList : null;
        if(!instance) throw new Error('instance can not be null.');
        const Node = this.Node;
        const newObj = (value) => isClass('style') ? {style: value} : {classList: value};
        // debugger
        return ({thead="", tr="", th="",}) => {
            if([thead, tr, th,].some(v => typeof v !== 'string')) throw new Error('require type of string.');
            instance.setDefault({thead, tr, th,});//ถ้า elements ยังไม่ถูกสร้าง จะเก็บ style ไว้ก่อน
            thead && instance.setThead({...newObj(thead)});//thead ถูกสร้างไว้ก่อนแล้ว
            const trList = Node.thead.querySelectorAll('tr');
            // debugger
            //apply style หลังจาก element สร้างเสร็จแล้ว
            if(trList.length > 0) {
                tr && instance.lists({tag:'tr', ...newObj(tr)});
                th && instance.lists({tag:'th', ...newObj(th)});
            }
            return true
        }
    }
    style({thead="", tr="", th="",}) {
        // debugger
        const applyStyle = this.#useClass('Style')
        const done = applyStyle({thead, tr, th,})
        return done && this;
    }
    class({thead="", tr="", th="",}) {
        const applyClass = this.#useClass('ClassList')
        const done = applyClass({thead, tr, th,})
        return done && this;
    }

}

export default class THead {

    constructor(parent) {
        this.Node = parent.Node;
        this.CSS = new CSS(this);
        this.Style = this.CSS.Style;
        this.ClassList = this.CSS.ClassList;
       this.setTHead()
    }
    setTHead() {
        if(this.Node.table.querySelector('thead')) throw new Error('thead ถูกสร้างไว้แล้ว ไม่สามารถสร้างซ้ำได้');
        const thead = node({type: 'thead'});
        this.Node.set(thead, 'thead');
        this.Node.table.appendChild(thead);
    }

    useColumnNames = setColNames;
    useTemplate = setTemplate;
}

