import { getData } from "../../script/api.js";
import {digit2Table, digit3Table} from "./avgTable.js"
import {base} from '../init.js'
import {playGroundConfig as config} from '../../script/config/config.global.js'

export default async function handleAVG({presentYear, content2}) {
    if(!config) throw new Error('config is not defined.');
    if(!presentYear) throw new Error('missing parametors');
    if(!content2) throw new Error('missing content2 element');

    const {digit2, digit3} = await getData("/playground/avg")
    if(!digit2 || !digit3) throw new Error('No data received from /playground/avg');
    const up2 = await getData(`/playground/db/present?position=up&digit=2&presentYear=${presentYear}`)
    const up3 = await getData(`/playground/db/present?position=up&digit=3&presentYear=${presentYear}`)
    if(!up2 || !up3) throw new Error('No data received from /playground/db/present');
    console.log('avg:digit2\n', digit2)
    console.log('avg:digit3\n', digit3)

    if(config.Base.enable) {
        // const {resolved: gold, } = base.matchUp3(digit3.gold)
        // digit3.gold = gold;
        // const {resolved: silver, } = base.matchUp3(digit3.silver)
        // digit3.silver = silver;
        // debugger;
    }

    const table2 = digit2Table(digit2, up2)
    const table3 = digit3Table(digit3, up3)

    content2.appendChild(table2)
    content2.appendChild(table3)
    // debugger;
}