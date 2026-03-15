import Numbers from "./Numbers.js"
import Date from "./Date.js"
import Text from './Text.js'
import BaseCF from './BaseCF.js'
import { postData } from "../api.js"

class ConfigGlobal {
    constructor({id}) {
        if(!id) throw new Error('คุณต้องระบุ id เพื่อจำกัด scope การทำงาน');
        this.id = id;
        const num = new Numbers();
        const setDraw = num.setUpcomingDraw.bind(num);
        this._Date = new Date(setDraw);
        this._Numbers = num;
        this._Text = new Text();
        this._Base = new BaseCF();
        this._Policy = 'safe';// safe|risk; safe: ตัวเลขเยอะ, risk: ตัวเลขน้อย
    }
    ready(callback = async () => {}) {
        this._Numbers.addEventListener('Done', async(e) => {
            const {upcoming} = this.Date;
            const {digit, watch, position, lastDraw,} = this.Numbers;
            const {hml} = this.Text;
            const {enable, group, eeeooo, triple, m03, oppositeNumber } = this.Base;
            const data = {
                Date: {upcoming},
                Numbers: {digit, watch, position, lastDraw,},
                Text: {hml},
                Base: {enable, group, eeeooo, triple, m03, oppositeNumber },
                Policy: this.Policy,
            }
            //config data will be updated whenever ConfigGlobal is called.
            const res = await postData('/system/config', data);
            console.log(res.message);
            await callback()
        })
    }

    checkId(id) {
        if(id !== this.id) throw new Error('id ไม่ตรงกัน');
        return true
    }
    get Date() {
        return this._Date
    }
    get Numbers() {
        return this._Numbers
    }
    get Text() {
        return this._Text
    }
    get Base() {
        return this._Base
    }
    set Policy(name = 'safe') {
        if(name !== 'safe' && name !== 'risk') throw new Error('Policy value must be risk or safe only.');
        this._Policy = name;
    }
    get Policy() {
        return this._Policy
    }
    //NOTE - เพิ่ม config อื่นๆ ตามต้องการ
}

export const playGroundConfig = new ConfigGlobal({id: 'playGround'});

export const performanceConfig = new ConfigGlobal({id: 'performance'});
// debugger;

//NOTE - เพิ่ม config อื่นๆได้ที่นี่
const cf1 = new ConfigGlobal({id: 'test'});
export const testConfig = {Date: cf1.Date, Numbers: cf1.Numbers, checkId: cf1.checkId};