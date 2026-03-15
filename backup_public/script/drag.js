/* ตัวอย่างการสร้าง Event 'newTable'
    Node.table.setAttribute('draggable', 'true');
    const event = new CustomEvent("newTable", { detail: {item: Node.table}  });
    document.dispatchEvent(event)
*/
const items = [];
const handlers = [
    ['dragstart', handleDragStart],
    ['dragover', handleDragOver],
    ['dragenter', handleDragEnter],
    ['dragleave', handleDragLeave],
    ['dragend', handleDragEnd],
    ['drop', handleDrop],
];

//ทำงานเมื่อมีการสร้างตารางใหม่
document.addEventListener("newTable", (e) => {
    const {item} = e.detail;
    items.push(item);
    handlers.forEach(([name, handler]) => {
        item.addEventListener(name, handler)
    });    
});


function handleDragStart(e) {
    this.style.opacity = '0.4';

    dragSrcEl = this;
    // e.dataTransfer.effectAllowed = 'move';
    // e.dataTransfer.setData('text/html', this.innerHTML);
    // debugger
}

function handleDragEnd(e) {
    this.style.opacity = '1';

    items.forEach(item => {
        item.classList.remove('over');
    })
    
}

function handleDragOver(e) {
    e.preventDefault();
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    e.stopPropagation();

    if (dragSrcEl !== this) {
        // dragSrcEl.innerHTML = this.innerHTML;
        // this.innerHTML = e.dataTransfer.getData('text/html');
        const target = this.parentNode;
        const src = dragSrcEl.parentNode;
        target.appendChild(dragSrcEl)
        src.appendChild(this)
    }

    return false;
}


