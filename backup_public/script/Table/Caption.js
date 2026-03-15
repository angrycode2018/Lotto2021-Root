import {node} from "../dom.js"

function setTitle({title=""}) {
    if(!this?.Node) throw new Error('Node is not exist');
    if(this.Node.table.querySelector('caption')) throw new Error('caption ถูกสร้างไว้แล้ว ไม่สามารถสร้างซ้ำได้');
    const caption = node({type: 'caption', text: title});
    !this.Node.caption && this.Node.set(caption, 'caption');
    this.Node.table.prepend(caption);//แทรกเป็นลูกตัวแรกของ table
    // debugger
    return this.Caption
}
function test() {
    alert('test caption')
    return this.Caption
}

// export default function Caption(parent) {
//     parent.Caption = {setTitle: setTitle.bind(parent)}
// }

export default function Caption(parent) {
    return { 
        setTitle: setTitle.bind(parent),
        test: test.bind(parent)
    }
}