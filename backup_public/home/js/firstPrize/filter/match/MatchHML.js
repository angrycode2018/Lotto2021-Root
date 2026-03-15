import { findMax, removeExactArray } from "../../../../../../function/common.js";
import { isTod } from "../../../../../../function/lottery.js";
import PastTime from "../../history/history.js";
import Settings from "../../settings.js";
import Base from "./Base.js";

const past = PastTime.inspect();
const {setFP, options} = Settings;
// debugger

class SetUp extends Base {
    constructor() {
        super()
    }
    //method ที่จะถูกเลือกให้ทำงานเพียงตัวเดียว
    setMethod = () => {
        const {minimizeTextFormat, syncFavorite, syncFiveStars} = options.textFormat;
        const settings = [minimizeTextFormat, syncFavorite, syncFiveStars];
        if(settings.filter(v => v == 1).length > 1) throw new Error('settings == 1 ต้องมีเพียงตัวเดียว');
        settings.some((v, i) => {
            if(v == 1)
                this.method = i == 0 ? this.matchTextFormat : i == 1 ? this.matchFavorite : this.matchFiveStars;
            return v == 1
        })
        // debugger
        if(!this.method) throw new Error('fail to set method.');
    }
    
}

export default class MatchHML extends SetUp{
    constructor(watch) {
        super()
        this.watch = watch;
        this.setMethod();
    }
    
    match = (firstprize = [5,5,7,9,9,0]) => {
        this.pass = undefined;
        this.fp = setFP(firstprize);
        this.textFormat = this.setTextFormat(this.fp);
        this.method();

        if([true, false].every(v => v !== this.pass )) throw new Error('pass value is invalid.');
        return this.pass
    }

    matchTextFormat = () => {
        if(options.textFormat.minimizeTextFormat !== 1) return false;
        if(this.pass === false) return false;
        const {textFormat} = past.hml.past;
        const mostWin = findMax(textFormat.map(arr => arr.length), 3)
        const [gold, silver, bronze] = textFormat
        .filter(arr => mostWin.some(val => val == arr.length))
        .sort((a,b) => b.length - a.length)
        .map(arr => arr[0]);
        // if(minimizeTextFormat == 1)
        //     this.pass = isTod(gold, this.textFormat)
        this.pass = [gold, silver, bronze].some(ft => isTod(ft, this.textFormat))
        // debugger
        if(this.break()) debugger;
    }

    //format ที่ออกมากกว่า 1 ครั้งต่อปี
    matchFavorite = () => {
        if(options.textFormat.syncFavorite !== 1) return false;
        if(this.pass === false) return false;
        const {textFormat2} = past.hml.past;
        const favoriteFormat = textFormat2.favorite.map(arr => arr.map(obj => obj.format)).flat();
        this.pass = favoriteFormat.some(([f1, f2, f3]) => f1 == this.textFormat[0] && f2 == this.textFormat[1] && f3 == this.textFormat[2]);
        // debugger
        if(this.break()) debugger;
    }

    //format ที่ออกมากกว่า 2 ครั้งต่อปี
    matchFiveStars = () => {
        if(options.textFormat.syncFiveStars !== 1) return false;
        if(this.pass === false) return false;
        const {textFormat2} = past.hml.past;
        const fiveStars = textFormat2.fiveStars.map(arr => arr.map(obj => obj.format)).flat();
        this.pass = fiveStars.some(([f1, f2, f3]) => f1 == this.textFormat[0] && f2 == this.textFormat[1] && f3 == this.textFormat[2]);
        // debugger
        if(this.break()) debugger;
    }

}