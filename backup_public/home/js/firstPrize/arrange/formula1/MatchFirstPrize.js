import { findMinMaxInArray } from "../../../../../../function/common.js";
import { isTod } from "../../../../../../function/lottery.js";
import {developFP} from "../function.js"


//เปรียบเทียบ firstPrize 2ตัว
export default class MatchFirstPrize {
    prize1 = []
    constructor(prize1 = []) {
        this.prize1 = prize1;
        const {number, hml, eo, range} = developFP(prize1);
        this.develop = {number, hml, eo, range};
    }

    matchHML = (firstPrize = []) => {
        const {hml} = this.develop;
        const char1 = firstPrize.map(num => num[1]);
        return isTod(char1, [...hml[0], ...hml[1], ...hml[2]])
    }

    //NOTE - ฟังค์ชั่นนี้ทำให้ตัวเลขเพิ่มขึ้นจำนวนมาก
    matchHMLRange = (Model, firstPrize) => {
        const {h, m, l} = Model.hml;
        const text = firstPrize.map(num => num[1]);
        const match = [h, m, l].every(([min, max], i) => {
            const str = i == 0 ? 'H' : i == 1 ? 'M' : 'L';
            const count = text.filter(char => char == str).length;
            return count >= min && count <= max
        });
        return match
    }

    matchEO = (firstPrize = []) => {
        const {eo} = this.develop;
        const char2 = firstPrize.map(num => num[2]);
        return isTod(char2, [...eo[0], ...eo[1], ...eo[2]])
    }

    matchRange = (firstPrize = []) => {
        const {range} = this.develop;
        const [min, max] = findMinMaxInArray(firstPrize.map(num => num[0]));
        return (max === range.max) && (min === range.min);
    }

}