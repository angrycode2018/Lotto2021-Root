import { DateTime } from "../../../../../src/class/utils/DateTime/DateTime.js";

const dt = new DateTime();

export default  function countPrimary(histories = null, primaryDate={day, month, year}) {
    if(!histories) debugger;// throw new Error('histories is required.');
    const numb = {}
    histories.map((his, i) => {
        let { date, digit3Up, prize1 } = his['groups'];
        const y = dt.splitYear(date);
        if(!y) throw new Error('fail to split year');
        const three = digit3Up.split('').map(num => Number(num))
        three.map(nb => {
            if(!numb[nb]) 
                numb[nb] = 0
            numb[nb]++
        })
    });
    // debugger
    return { date: primaryDate, countNum: numb };
}