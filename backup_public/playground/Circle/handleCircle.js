import { getData } from "../../script/api.js";
import { circleReportTable, circleResultTable } from "./circleTables.js";
import {base} from '../init.js'
import {playGroundConfig as config} from '../../script/config/config.global.js'

export default async function handleCircle({presentYear, previous3, watch, content2}) {
    if(!config) throw new Error('config is not defined.');
    if([presentYear, previous3, watch, content2].some(v => !v)) throw new Error('some parametor is missing value.');
    const {result, thisYear} = await getData(`/playground/circle?presentYear=${presentYear}&prev3=${previous3}&watch=${watch}`);
    if(!result || !thisYear) throw new Error('No data received from /playground/circle');
    console.log('circle:data\n', result)
    console.log('circle:thisYear\n', thisYear)
    if(config.Base.enable) {
        const {resolved, rejected} = base.matchUp3(result.numbers)
        result.numbers = resolved;
        // debugger;
    }
    //Table Result
    content2.appendChild(circleResultTable(result))
    //Table Report
    content2.appendChild(circleReportTable(thisYear))
}