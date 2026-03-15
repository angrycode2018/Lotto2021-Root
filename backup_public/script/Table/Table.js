import {node} from "../dom.js"
import Obj from "../obj.js"
import Caption from "./Caption.js"
import ColGroup from "./colgroup.js";
import THead from "./thead.js";
import TBody from "./tbody.js"
import TFoot from "./tfoot.js";

if(!Obj?.isObject) throw new Error('Obj.isObject is not exist.');


export default class Table {
    Node = class {
        static get(name="") {
            if(!this[name]) throw new Error('not found Node='+name)
            return this[name]
        }
        static set(node, name="") {
            if(!name) throw new Error('Name must be specified.');
            if(this[name]) {
                this[name] = Array.isArray(this[name]) ? [...this[name], node] : [this[name], node];//ถ้ามี node นั้นอยู่แล้ว เช่น Node tr
                return
            }else{
                return this[name] = node;
            }
        }
    }
    constructor({id="", style="", classList=""}) {
        if(!id) throw new Error('id is not set');
        const table = node({type: 'table', id, style, classList});
        this.Node.set(table, 'table')
        if(!this.Node.table) throw new Error('Fail to set Node Table');
        this.setTableComponents()
    }

    setTableComponents() {
        this.Caption = Caption(this);
        this.ColGroup = ColGroup(this);
        this.THead = new THead(this);
        this.TBody = new TBody(this);
        this.TFoot = new TFoot(this)
        // debugger
    }
    
    
}