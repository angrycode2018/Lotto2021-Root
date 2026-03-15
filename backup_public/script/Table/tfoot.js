import Obj from "../obj.js";
import {node} from "../dom.js"

function createClass(className="") {
    const isClass = (name="") => name.toLowerCase() == className.toLowerCase();
    if(!isClass('style') && !isClass('classlist')) throw new Error('wrong class name');
    return class {
        default = {};
        constructor(parent) {
            this.Node = parent.Node;
        }
        setDefault({tfoot="", tr="", th="", td=""}) {
            this.default = {tfoot, tr, th, td}
        }
        setTfoot({style="", classList=""}) {
            if(typeof style !== 'string' || typeof classList !== 'string') throw new Error('require string');
            if(!style && !classList) throw new Error('string must not be empty.');
            if(!this?.Node?.tfoot) throw new Error('tfoot is not set.');
            isClass('style') && this.Node.tfoot.setAttribute('style', style);
            isClass('classlist') && this.Node.tfoot.classList.add(...classList.split(/ /g));
            return this;// style
        }
        //ทำงานกับ ชุดของ elements หลายตัว
        lists({tag="", style="", classList=""}) {
            if(typeof tag !== 'string' || typeof style !== 'string' || typeof classList !== 'string') throw new Error('require type of string');
            if(!tag && !style && !classList) throw new Error('argument must not be empty.');
            if(!this?.Node?.tfoot) throw new Error('tfoot is not set.');
            if(!['tr', 'th', 'td'].some(v => v == tag)) throw new Error('สำหรับ tag tr, th, หรือ td เท่านั้น');

            const all = this.Node.tfoot.querySelectorAll(tag);
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
        return ({tfoot="", tr="", th="", td=""}) => {
            if([tfoot, tr, th, td].some(v => typeof v !== 'string')) throw new Error('require type of string.');
            instance.setDefault({tfoot, tr, th, td});//ถ้า elements ยังไม่ถูกสร้าง จะเก็บ style ไว้ก่อน
            tfoot && instance.setTfoot({...newObj(tfoot)});//tfoot ถูกสร้างไว้ก่อนแล้ว
            const trList = Node.tfoot.querySelectorAll('tr');
            
            //ถ้าเรียกใช้ TFoot.tr() ก่อน TFoot.CSS.style() จะเป็นการ apply style หลังจาก element สร้างเสร็จแล้ว
            if(trList.length > 0) {
                tr && instance.lists({tag:'tr', ...newObj(tr)});
                th && instance.lists({tag:'th', ...newObj(th)});
                td && instance.lists({tag:'td', ...newObj(td)});
            }
            return true
        }
    }
    style({tfoot="", tr="", th="", td=""}) {
        const applyStyle = this.#useClass('Style')
        const done = applyStyle({tfoot, tr, th, td})
        return done && this;
    }
    class({tfoot="", tr="", th="", td=""}) {
        const applyClass = this.#useClass('ClassList')
        const done = applyClass({tfoot, tr, th, td})
        return done && this;
    }

}

export default class TFoot {
    constructor(parent) {
        this.Node = parent.Node;
        this.CSS = new CSS(this);
        this.Style = this.CSS.Style;
        this.ClassList = this.CSS.ClassList;
       this.setTFoot()
    }

    setTFoot() {
        if(this.Node.table.querySelector('tfoot')) throw new Error('tfoot ถูกสร้างไว้แล้ว ไม่สามารถสร้างซ้ำได้');
        const tfoot = node({type: 'tfoot'});
        this.Node.set(tfoot, 'tfoot');
        this.Node.table.appendChild(tfoot);
    }

    tr({ id="", key="", data=['Tom', 30, 'New York'], style={tr:"", td:"", th:""}, classList={tr:"", td:"", th:""} }) {
        if(!Obj.isObject(style) || Object.keys(style).some(k => k !== 'tr' && k !== 'td' && k !== 'th')) throw new Error('Style must be Object like {tr: "", td: ""}');
        if(!Obj.isObject(classList) || Object.keys(classList).some(k => k !== 'tr' && k !== 'td' && k !== 'th')) throw new Error('ClassList must be Object like {tr: "", td: ""}');
        
        const joinStr = (str1="", str2="") => str1+(str1 && str2 ? ' ' : '')+str2;
        style.tr = this.Style.default?.tr ? joinStr(this.Style.default?.tr, style.tr) : style.tr;
        style.td = this.Style.default?.td ? joinStr(this.Style.default?.td, style.td) : style.td;
        style.th = this.Style.default?.th ? joinStr(this.Style.default?.th, style.th) : style.th;
        classList.tr = this.ClassList.default?.tr ? joinStr(this.ClassList.default?.tr, classList.tr) : classList.tr;
        classList.th = this.ClassList.default?.th ? joinStr(this.ClassList.default?.th, classList.th) : classList.th;
        classList.td = this.ClassList.default?.td ? joinStr(this.ClassList.default?.td, classList.td) : classList.td;
        // debugger

        const tr = node({type: 'tr', ...(id ? {id} : {}), style: style.tr, classList: classList.tr});
        // debugger
        if(key) {
            const th = node({type: 'th', text: key, style: style.th, classList: classList.th});
            th && th.setAttribute('scope', 'row');
            th && tr.appendChild(th)
        }

        // this.Node.set(tr, 'tr');
        if(Array.isArray(data)) {
            for(let cellData of data) {
                if(Array.isArray(cellData)) {
                    cellData.forEach(cell => {
                        tr.appendChild(node({type: 'td', text: cell, style: style.td, classList: classList.td}))
                    });
                    continue;
                }
                const td = node({type: 'td', text: cellData, style: style.td, classList: classList.td});
                tr.appendChild(td);
            };
        }else if(data) {
            const td = node({type: 'td', text: data, style: style.td, classList: classList.td});
            tr.appendChild(td);
        }
        // this.node.querySelector('tfoot').appendChild(tr);
        if(!this.Node.tfoot) throw new Error('tfoot is not found.');
        this.Node.tfoot.appendChild(tr)
        return this;
    }
}


