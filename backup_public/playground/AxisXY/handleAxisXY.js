import { getData } from "../../script/api.js";
import {axisXYForecastTable, axisXYReportTable} from "./axisxyTable.js";
import {base} from '../init.js'
import {playGroundConfig as config} from '../../script/config/config.global.js'

//เมื่อมีการคลิกปุ่ม axis
export default async function handleAxisXY({presentYear, present3, content2, upcomingDate}) {
    if(!presentYear || !present3 || !content2) throw new Error('missing parametors');
    const {d,m,y} = upcomingDate;
    const {reports, forecast} = await getData(`/playground/axis?y=${y}&m=${m}&d=${d}&present3=${present3}`);
    if(!reports || !forecast) throw new Error('No data received from /playground/axis');
    
    if(config.Base.enable == 1) {
        const {resolved, rejected} = base.matchUp3(forecast.d3)
        forecast.d3 = resolved;

        const three = forecast.d31.three.map(arr => {
            const result = arr.map(val => {
                const {resolved: f3} = base.matchUp3(val)
                return f3
            });
            // debugger;
            return result
        });
        forecast.d31.three = three;
    }
    console.log('axisXY this year\n', reports)
    console.log('axisXY forecast\n', forecast)

    //Table Result
    content2.appendChild(axisXYForecastTable(forecast))
    //Table Report
    content2.appendChild(axisXYReportTable(reports))
}