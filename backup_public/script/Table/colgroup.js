import {node} from "../dom.js"

//colgroup1:[ 2, "background-color:red;", "class1 class2 class3" ]
function set( {span=1, style="", classList=""} ) {
    if(!this?.Node) throw new Error('Node is not exist.');
    if(typeof span !== 'number') throw new Error('span type must be Number');
    if(typeof style !== 'string') throw new Error('Type of Style must be String.');
    if(typeof classList !== 'string') throw new Error('Type of classList must be String.');

    if(style !== "" && !style.match(/\w+:\s*\#?\w+;/g)) throw new Error('Style format should be like "background-color:red;"');
    
    const colgroup = node({type: 'colgroup', style, classList});
    colgroup.setAttribute('span', `${span}`);
    // debugger;
    // const lastColgroup = this.Node.table.querySelector("colgroup:last-child");//colgroup ตัวสุดท้าย
    const lastColgroup = this.Node.table.querySelectorAll('colgroup');//colgroup ตัวสุดท้าย
    if(lastColgroup?.length > 0) {
        const last = lastColgroup.length -1;
        lastColgroup[last].after(colgroup);//แทรกไว้หลัง colgroup ตัวสุดท้าย
    }else if(this.Node.caption) {
        this.Node.caption.after(colgroup);//แทรก ไว้หลัง caption
    }else{
        this.Node.table.prepend(colgroup);//แทรกเป็นลูกตัวแรกของ table
    }
    // this.Node.set(colgroup, 'colgroup');
    // const all = this.Node.table.querySelectorAll('colgroup')
    // debugger
    return this.ColGroup;
}

export default function ColGroup(parent) {
    return { set: set.bind(parent) }
}




//old code
// function set([ group1=[], group2=[], group3=[], ...rest ]) {
//     [group1, group2, group3, ...rest].forEach(v => {
//         if(!Array.isArray(v) || v.length > 3) throw new Error('รูปแบบ Array ไม่ถูกต้อง สมาชิกของอาเรย์ต้องไม่เกิน 3ตัว ตัวอย่าง [span:number, style:string, classList:string]')
//     });
//     let allGroups = [group1, group2, group3, ...rest].filter(v => Array.isArray(v) && v.length > 0);
//     allGroups = allGroups.map(([span, style, classList]) => {
//         if(typeof span !== 'number') throw new Error('span type must be Number');
//         style = !style ? "" : style;
//         if(typeof style !== 'string') throw new Error('Type of Style must be String.');
//         if(style !== "" && !style.match(/\w+:\s*\#?\w+;/g)) throw new Error('Style format should be like "background-color:red;"');
//         classList = !classList ? "" : classList;
//         if(typeof classList !== 'string') throw new Error('Type of classList must be String.');
//         return [span, style, classList]
//     })
    
//     for(let [span, style, classList] of allGroups) {
//         const colgroup = node({type: 'colgroup', style, classList});
//         colgroup.setAttribute('span', `${span}`);

//         const lastColgroup = this.Node.table.querySelector("colgroup:last-child");//colgroup ตัวสุดท้าย
//         if(lastColgroup) {
//             lastColgroup.after(colgroup);//แทรกไว้หลัง colgroup ตัวสุดท้าย
//         }else if(this.Node.caption) {
//             this.Node.caption.after(colgroup);//แทรก ไว้หลัง caption
//         }else{
//             this.Node.table.prepend(colgroup);//แทรกเป็นลูกตัวแรกของ table
//         }
//         this.Node.set(colgroup, 'colgroup');
//     }
//     // const all = this.Node.table.querySelectorAll('colgroup')
//     // debugger
//     return this;
// }