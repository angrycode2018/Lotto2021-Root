import { getData } from "../script/api.js";

(async() => {
    try{
        const res = await getData('/test/opp?m=1');//ระบุเดือนของหวยงวดที่ต้องการคำนวณ
        debugger

    } catch(e) {
        console.error(e)
    }
})()