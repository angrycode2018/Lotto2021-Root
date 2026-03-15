import ERR from "../../../src/class/System/ERR.js";
import summary from "../../../src/class/Summary.js";
import { EvenOdd, isObject } from "../../../src/function/common.js";
import { isTod } from "../../../src/function/lottery.js";
import LottoTable from "./Table/LottoTable.js";

const inst = null;

export default async function main(instance) {
    const {record, app, tableOutput, triangle: {triangleArea}, order, settings} = instance;
    inst = instance;

    new LottoTable({
        showTable: true,//แสดง หรือ ไม่แสดง ตาราง
        record: record,
        histories: app.histories,
        tableOutput: tableOutput,
        divLottery: 'table-lottery-result',
        divEvenOdd: 'table-even-odd',
        divNumber: 'table-combined-number',
        divNumberFlat: 'table-number-flat',
        divRange: 'table-range',
        upDown: false,
    });
    // debugger;
    await forecast(instance)
}

async function forecast(instance) {
    const {settings, order} = instance;
    if(settings.mode === 0) return;
    const {default: Forecast} = await import('./Forecast/Forecast.js');
    const fc = new Forecast();
    // debugger;
    //const two = await fc.randomByHistory({H: true, L: true});
    const {addSubtract, kradanga, plusOne, newPlusOne, line3} = await fc.formula();
    const {never, ever} = await fc.newTriangle();
    const reduce = (arr) => arr.reduce((a,b) => a + b);
    const all = {line3, addSubtract, kradanga, plusOne, newPlusOne, newTriangle: {never, ever}}


    const sameNumbers = findSameNumbers(all).toSorted((a,b) => reduce(b) - reduce(a));
    const restLine3 = line3.filter(three => !sameNumbers.some(n3 => isTod(three, n3)));
    const final = [...sameNumbers, ...restLine3].toSorted((a,b) => reduce(b) - reduce(a));

    const reOrder = final.map(three => order(three))
    const infoNumb = infos(final)

    // const dub = final.filter(d3 => ![0,1,7,8].some(n => d3.some(v => n == v)))
    // const wing = dub.filter(d3 => [6,4].some(n => d3.some(v => v == n)))
    // const orderWing = wing.map(d3 => order(d3))

    const pick =  final.filter(three => ![[0,1,2], [3,4,5,6], [7,8,9]].every(arr => arr.some(v => three.some(n => v==n))) )
    const orderPick = pick.map(three => ({three: three.toString(), order: order(three)}))
    const oddGroup = pick.filter(three => (three.reduce((a,b) => a + b) % 2) !== 0)
    const evenGroup = pick.filter(three => (three.reduce((a,b) => a + b) % 2) === 0)
    ERR.print()
    debugger
    
}

    function infos(array = []) {
        const fgroup = (arr) => arr.reduce((a,b) => a + b);
        const ftype = (group) => EvenOdd(group);
        const ftext = (arr) => arr.map(v => inst.cnv.HML(v));
        const feo = (three) => three.map(n => EvenOdd(n))
        const obj = {
            three: [],
            group: [],
            type: [],
            text: [],
            EO: [],
        }
        array.map(three => {
            obj.three.push(three)
            obj.group.push(fgroup(three))
            obj.type.push(ftype(fgroup(three)))
            obj.text.push(ftext(three))
            obj.EO.push(feo(three))
        })
        // debugger
        return obj
    }

    //หาตัวเลขที่เหมือนกันจากสูตรต่างๆ
    function findSameNumbers({addSubtract, kradanga, plusOne, newPlusOne, line3, newTriangle}) {
        const allNumbers = [...line3];
        const x =[addSubtract, kradanga, plusOne, newPlusOne, newTriangle].map(formula => {
            const threes = collectThree(formula)
            allNumbers.push(...threes)
        });

        let index = [];
        const same = allNumbers.map((three, i, all) => {
            const equals = all.filter((n3, x) => isTod(three, n3) && !index.some(y => y === x) && index.push(x))
            // debugger
            return equals.length > 1 ? equals : null
        }).filter(three => three !== null);

        const uniqueSame = same.map(arr => arr[0])
        // debugger
        return uniqueSame
    }

    function collectThree(formula) {
        const keys = isObject(formula) ? Object.keys(formula) : undefined;
        if(!keys) throw new Error('only Object is allowed.'); 
        let results = [];

        if(keys.every(k => k === 'single' || k === 'twin')) {
            results.push(...formula['single']['unique'], ...formula['twin']['unique'])
            return results
        }
        else if(keys.some(k => ['left', 'right', 'midL', 'midR'].some(key => k === key))) {
            keys.map(k => {
                ['up', 'down'].map(position => {
                    const {HHH, HHL, LLH, LLL} = formula[k][position]
                    results.push(...HHH, ...HHL, ...LLH, ...LLL)
                })
            })
            return results
        }
        else if(keys.some(k => k === 'never' || k === 'ever')) {
            keys.map(k => {
                formula[k].map(({group, numbers}) => {
                    results.push(...numbers)
                })
            })
            // debugger
            return results
        }
        else {
            keys.map(key => {
                results.push(...formula[key])
            })
            return results
        }
    }

    function getArea() {
        return;
        const arr = [ 
            [7,7,9], [5,7,4], [7,7,3], [7,7,4], [0,3,8], [3,0,8], [3,8,0], [2,7,2], 
        ].map(arr => {
            const {area} = triangleArea(arr);
            console.log(`${arr.toString()} area = ${area}`)
        });
    }

    class Print {
        static summary = () => {
            const {formula: {wing: {roimalai}}, newPlusOne: {couple}} = summary;
            console.log('wing: roimalai: ',roimalai);
            console.log('newPlusOne:couple:high: ' ,couple.high);
            console.log('newPlusOne:couple:low: ',couple.low);
        }
        static kradanga = (results) => {
            const {single, twin} = results;
            single.unique.map(three => console.log('kradanga: ',three));
            twin.unique.map(three => console.log('kradanga: ',three));
        }
        static addSubtract = (results) => {
            const {asBefore, notSame} = results;
            asBefore.map(three => console.log('addSubtract: ',three));
            notSame.map(three => console.log('addSubtract: ',three));
        }
        static plusOne = (results) => {
            const {result1, result2} = results;
            result1.map(three => console.log('plusOne: ',three));
            result2.map(three => console.log('plusOne: ',three));
        }
        static newPlusOne = (results) => {
            const {left, right, midL, midR} = results;
            Object.entries(left.up).map(([key, arr]) => {
                arr.map(three => console.log('newPlusOne:left:up:'+key, three))
            })
            Object.entries(left.down).map(([key, arr]) => {
                arr.map(three => console.log('newPlusOne:left:down:'+key, three))
            })
            Object.entries(right.up).map(([key, arr]) => {
                arr.map(three => console.log('newPlusOne:right:up:'+key, three))
            })
            Object.entries(right.down).map(([key, arr]) => {
                arr.map(three => console.log('newPlusOne:right:down:'+key, three))
            })
            Object.entries(midL.up).map(([key, arr]) => {
                arr.map(three => console.log('newPlusOne:midL:up:'+key, three))
            })
            Object.entries(midL.down).map(([key, arr]) => {
                arr.map(three => console.log('newPlusOne:midL:down:'+key, three))
            })
            Object.entries(midR.up).map(([key, arr]) => {
                arr.map(three => console.log('newPlusOne:midR:up:'+key, three))
            })
            Object.entries(midR.down).map(([key, arr]) => {
                arr.map(three => console.log('newPlusOne:midR:down:'+key, three))
            })
        }

        static newTriangle = (results) => {
            const {never, ever} = results;
            never.map(({group, numbers}) => {
                numbers.map(three => {
                    console.log('newTriangle:never: '+group, three)
                })
            })
            ever.map(({group, numbers}) => {
                numbers.map(three => {
                    console.log('newTriangle:ever: '+group, three)
                })
            })
        }
    }
