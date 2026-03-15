//ตัวอย่างใช้งาน ในหน้า index.html
//ให้เพิ่ม <script src="../script/dom.js"></script> (ระบุ path ที่ถูกต้อง) ในส่วน <head> หรือ ก่อนปิด </body>
//เพิ่ม script ธรรมดา (ไม่ใช่ type="module") เช่น
// <script>
//    เรียกใช้ function node() จาก dom.js
// </script>



//สร้าง element แบบง่ายๆ
//classList = "text-center text-blue-500"
//style="display: flex;"
function node({type='button', text = '', id = '', style="", classList = "", event ='click', handler = null}) {
    const node = document.createElement(type);
    node.innerText = text;
    if(id) node.id = id;
    style && node.setAttribute('style', style);
    classList && classList.split(/ /g).forEach(name => node.classList.add(name));
    if(event && typeof handler == 'function')
        node.addEventListener(event, handler);
    // if(type == 'caption') debugger;
    return node
}

//หน้า index.html
//เรียกใช้ function overridePushState(onUrlChange) และระบุฟังก์ชันที่จะให้ทำงานเมื่อ URL เปลี่ยน  
//เมื่อมีการเรียกใช้ history.pushState({}, "", "/about") เพื่อเปลี่ยน URL จากหน้า Home เป็น /about และฟังก์ชัน onUrlChange จะถูกเรียกโดยอัตโนมัติ
function overridePushState(onUrlChange = () => {}){
    // เก็บ pushState ตัวเดิม
    const originalPushState = history.pushState;

    // override pushState ใหม่
    history.pushState = function (state, title, url) {
        originalPushState.apply(history, [state, title, url]); // เรียกตัวเดิม
        console.log("URL changed to:", url);
        onUrlChange(url); // เรียกฟังก์ชันของคุณ
    };
}


export { node, overridePushState}

// window.node = node;//ตัวแปร global
// window.overridePushState = overridePushState;
// window.getData = getData;
// window.Table = Table;

// alert('dom.js loaded')