import {node} from "../../script/dom.js"

//drag and drop table
export function dragAndDrop(Node) {
    Node.table.setAttribute('draggable', 'true');
    const event = new CustomEvent("newTable", { detail: {item: Node.table}  });
    document.dispatchEvent(event)
}

//close button
export function closeButton(tableBox) {
    const closeBtn = node({type: 'button', text: 'X', classList: 'buttonX'})
    closeBtn.addEventListener('click', (e) => {
        tableBox.style.display = 'none';
        const caption = tableBox.querySelector('caption');
        const recentBox = document.getElementById('content-1');
        const box = node({type: 'div', text: caption.innerText, classList: "box-title"})
        const handleBoxClick = (e) => {
            tableBox.style.display = 'block';
            box.removeEventListener('click', handleBoxClick)
            box.remove();
        }
        box.addEventListener('click', handleBoxClick)
        recentBox.appendChild(box);
    });
    tableBox.appendChild(closeBtn);
}