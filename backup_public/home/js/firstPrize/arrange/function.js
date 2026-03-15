import { findMinMaxInArray } from "../../../../../function/common.js";
import Settings from "../settings.js";

const {setHML, setEO, setFP} = Settings;



export function developFP(fp = [1,2,3,4,5,6]) {
    fp = fp.toSorted((a,b) => a - b);
    let number = [ [], [], [] ], hml = [ [], [], [] ], eo = [ [], [], [] ];
    const [min, max] = findMinMaxInArray(fp);
    const range = {min, max};
    fp.map((n, i) => {
        const index = [0,1].some(k => k == i) ? 0 : [2,3].some(k => k == i) ? 1 : 2;
        number[index].push(n)
        hml[index].push(setHML(n))
        eo[index].push(setEO(n)); 
    })
    return {number, hml, eo, range}
}