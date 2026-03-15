import { getData } from "../../script/api.js";
import { dbTable } from "./dbTable.js";
import {base} from '../init.js'
import {playGroundConfig as config} from '../../script/config/config.global.js'

//เมื่อมีการคลิกปุ่ม DB
export default async function handleDB({presentYear, place, digit, content2}) {
    if([presentYear, place, digit, content2].some(v => !v)) throw new Error('parametor missing value');
    const response = await getData(`/playground/db?presentYear=${presentYear}&place=${place}&digit=${digit}`);
    // debugger
    console.log('DB', response)
    const {best, veryGood, good, dead} = response.numbers;
    if(digit == 3 && config.Base.enable) {
        // const bestMatch = base.matchUp3(best);
        // response.numbers.best = bestMatch.resolved;
        // const veryGoodMatch = base.matchUp3(veryGood);
        // response.numbers.veryGood = veryGoodMatch.resolved;
        // const goodMatch = base.matchUp3(good);
        // response.numbers.good = goodMatch.resolved;
        // const deadMatch = base.matchUp3(dead);
        // response.numbers.dead = deadMatch.resolved;
    }
    // debugger;
    content2.appendChild(dbTable(response))

}