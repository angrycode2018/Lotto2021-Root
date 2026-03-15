import { node } from "../../script/dom.js"

export function initLayout(includes= { menu:1, info:1, h4:1, content1:1 }) {
    const primary = {
        wrapper: {type: 'div', id: 'wrapper', classList: "grid-test"},//wrapper contains 1 main
        main: {type:'div', id:'main'},//main contains many elements.
        content2: {type: 'div', id: 'content-2', classList: "content responsive-image-gallery"},//grid-responsive-columns
    };
    const secondary = {
        menu: {type: 'div', id: 'menu', },
        info: {type: 'div', id: 'info', classList: "grid-responsive-columns"},//แจ้งเตือน
        h4: {type: 'h4', classList: "text-center"},
        content1: {type: 'div', id: 'content-1', classList: "content flex-center-space-around", style: "padding:7px; border: 1px solid;"},
    }
    
    //สร้าง elements สำหรับหน้า .html
    const [wrapper, main, content2] = Object.entries(primary).map(([key, cf]) => node(cf)); 
    const [menu, info, h4, content1] = Object.entries(includes).map(([key, val]) => {
        if(val && secondary[key]) 
            return node(secondary[key]);
        return null;
    });
    //เพิ่ม Elements ลงใน main (เรียงตามลำดับ)
    const x = [h4, menu, info, content1, content2].forEach(nd => nd && main.appendChild(nd));
    
    wrapper.appendChild(main);
    return {wrapper, main, menu, info, h4, content1, content2};
}