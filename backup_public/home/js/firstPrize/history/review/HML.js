import { arrayIncludes, combineValue, exit, findMax, genArr, groupArray, removeExactArray, removeSameArray, sortNumber, sortText, uniqueArray } from "../../../../../../function/common.js";
import { isTod } from "../../../../../../function/lottery.js";
import Settings from "../../settings.js";
const {HML: Text} = Settings;

class Char {
    data = [];
    constructor(char = 'H') {
        this.char = char;
        this.member = char === 'H' ? Text.H : char === 'M' ? Text.M : char === 'L' ? Text.L : exit('unknown text='+char);
        // debugger
    }
    addData = (data) => this.data.push(...data);

    index = (index) => {
        if(!this.data || this.data.length === 0) throw new Error('data is not set.');
        const filter = this.data.map(({date, mix}) => ({date, mix: mix.filter(([,,,idx]) => idx === index)})).filter(({mix}) => mix.length > 0)
        // debugger
        return filter
    }
    number = (number) => {
        if(!this.data || this.data.length === 0) throw new Error('data is not set.');
        const filter = this.data.map(({date, mix}) => ({date, mix: mix.filter(([nb]) => nb === number)})).filter(({mix}) => mix.length > 0)
        // debugger
        return filter
    }
    eo = (eo = 'E') => {
        if(!this.data || this.data.length === 0) throw new Error('data is not set.');
        const filter = this.data.map(arr => arr.filter(val => val[2] === eo)).filter(v => v.length > 0)
        return filter
    }
    length = (length = 1) => {
        if(!this.data || this.data.length === 0) throw new Error('data is not set.');
        const filter = this.data.filter(({date, mix}) => mix.length === length);
        // if(this.char === 'M' && length === 3) debugger;
        // debugger
        return filter
    }
}

class ReviewText extends Char{
    constructor(char = 'H') {
        super(char)
    }
    Index = class {
         static getIndex = (key = [], rest) => {
            let copy = rest.map(pair => pair.map(val => [...val]))
            const find = (k, pair) => {
                const [, index] = pair.find(([nb, idx]) => nb === k) || exit('not found number='+k);
                const newPair = pair.toSpliced(pair.findIndex(([nb, idx]) => idx === index), 1);
                // debugger
                return {index, newPair}
            }

            return key.map(k => {
                const indexs = copy.map((pair, i) => {
                    const {index, newPair} = find(k, pair)
                    copy[i] = newPair;
                    return index
                });//อย่าพึ่งใช้ indexs.sort() ที่นี่ เพราะเราไม่ต้องการเปลี่ยนตำแหน่งของ index
                return ({ number: k, index: indexs, })
            })
        }
    }
    Diff = class {
        //indexLength จำนวนสมาชิกของ index  ต้องมีจำนวน length 2 หรือ 3 เท่านั้น
        static buildIndex = (indexLength = 2 | 3) => {
            if(![2,3].some(v => v === indexLength)) throw new Error('accept index.length = 2 or 3 only.');
            const indexs = [0,1,2,3,4,5];
            const arrayIndex = indexs.map((a, i, self) => {
                //สร้าง index สมาชิก 2ตัว
                const index2 = self.filter((b, idx) => idx > i ).map(c => [a,c].sort((x, y) => x - y));
                let index3 = undefined;
                //สร้าง index สมาชิก 3ตัว
                if(indexLength === 3) {
                    index3 = index2.map(([min, max]) => {
                        const restIndexs = indexs.filter(idx => idx > max);
                        return restIndexs.map(idx => [min, max, idx]);
                    }).flat();
                }
                return (index3 || index2)
            }).flat();
            // debugger
            return arrayIndex
        }

        // diff = 1 index = [2,3],  diff = [1,1] index = [2,3,4]
        static getIndex = (diff = 1 | [1,1]) => {            
            const arrayIndex = Array.isArray(diff) && diff.length === 2 ? this.buildIndex(3) : (diff >= 1 && diff <= 5) ? this.buildIndex(2) : exit('diff='+diff+' is rejected.');
            const diffIndex = arrayIndex.map(arr => {
                const [min, mid, max] = arr;
                const diff = arr.length === 2 ? [mid - min] : arr.length === 3 ? [(mid-min), (max-mid)] : exit(`array.length = ${arr.length} is rejected.`);
                return {diff, index: (arr.length === 2 ? [min, mid] : arr.length === 3 ? [min, mid, max] : exit('something wrong'))}
            });
            const diffs = removeSameArray(diffIndex.map(({diff}) => diff));
            const combined = diffs.map(df => {
                const picked = diffIndex.filter(({diff}) => isTod(df, diff)).map(({index}) => index)
                return {diff: df, index: picked}
            })
            const found = combined.find(({diff: df}) => isTod(df, diff)) || exit('not found diff='+diff);
            // debugger
            return found
        }
    }
    reviewIndex = (index = 0) => {
        if(!(index >= 0 && index <= 5)) throw new Error('expect value of index only 0-5');
        const source = this.index(index);
        const numbers = source.map(({mix}) => mix[0][0]).sort((a,b) => a - b);
        const result = this.member.map(n => ({index, number: n, win: numbers.filter(v => v==n).length}))
        // debugger
        return result
    }
    reviewNumber = (number = 9) => {
        if(!this.member.some(n => n === number)) throw new Error('expect number '+this.member+' only');
        const indexs = this.number(number).map(({mix}) => mix.map(([,,,idx]) => idx).flat()).flat()
        const result = [0,1,2,3,4,5].map(n => ({number, index: n, win: indexs.filter(v => v==n).length}) ) 
        // debugger
        return result
    }

    reviewLength = (length = 2) => {
        const query = this.length(length);
        const numX = query.map(({date, mix}) => ({date, mix: mix.map(([nb, txt, eo, idx]) => [nb, idx])}))
        const keyNumber = removeSameArray(numX.map(({mix}) => mix.map(([nb, idx]) => nb)))
        // debugger
        const map = keyNumber.map(key => {
            const rest = numX.filter(({mix}) => isTod(key, mix.map(([nb]) => nb)))
            const dates = rest.map(({date}) => date);
            const array = this.Index.getIndex(key, rest.map(({mix}) => mix))
            const number = array.map(({number, index}) => number)
            const index = array.map(({number, index}) => index)
            const combinedIndex = index.length > 1 ? combineValue(...index) : index;
            const textIndex = combinedIndex.map(arr => arr.map(nb => nb <= 2 ? 'L' : 'H'));//0-2 low, 3-5 high
            let addOn = {};

            if(number.length === 3) {
                const diff = combinedIndex.map(arr => {
                    const [min, mid, max] = arr.toSorted((a,b) => a - b);
                    return [mid - min, max - mid]
                }).toSorted((a,b) => a.reduce((n1,n2) => n1+n2) - b.reduce((n1,n2) => n1+n2));
                const uniq = removeSameArray(diff);

                //index ที่เคยออกรางวัลไปแล้ว
                const diffIndex = uniq.map(df => {
                    const picked = combinedIndex.filter(arr => {
                        const [min, mid, max] = arr.toSorted((a,b) => a - b);
                        return isTod(df, [(mid - min), (max - mid)]);
                    })
                    return {diff: df, index: sortNumber(picked)}
                });

                //index ที่ยังไม่เคยออกรางวัล
                const neverWinDiffIndex = diffIndex.map(({diff, index}) => {
                    const all = this.Diff.getIndex([...diff]);
                    const neverWinIndex = all.index.filter(idx => !index.some(ix => isTod(idx, ix)))
                    return {diff, index: neverWinIndex}
                }).filter(({index}) => index.length > 0)
                
                // if(isTod(number, [4,6,4])) debugger;
                addOn.diffIndex = {everWin: diffIndex, neverWin: neverWinDiffIndex};
            }
            // debugger
            return {number, index: combinedIndex, textIndex, date: dates, ...addOn}
        })
        // debugger
        const sorted = map.map(({number, index, textIndex, diffIndex, date}) => {
            const textNum = (text) => text == 'L' ? 1 : text == 'H' ? 2 : exit('expect text H or L only.');
            index = index.length > 1 ? sortNumber(index) : index.length === 1 ? index[0].sort((a,b) => a - b) : index;
            textIndex = textIndex.length > 1 ? sortText(textIndex, ['L', 'H']) : 
            textIndex.length === 1 ? textIndex[0].sort((a,b) => textNum(a) - textNum(b)) : 
            textIndex;
            const addOn = diffIndex ? {diffIndex} : {};
            console.log({number, index, textIndex, ...addOn})
            return {number, index, textIndex, ...addOn, date}
        })

        // debugger
        return sorted
        // keyNumber.map(key => {
        //     const found = this.parent.history.filter(({date, prize1: {number}}) => {
        //         if(date[2] < 60) return false;
        //         return arrayIncludes(number, key)
        //     }).map(({date, prize1}) => ({date, number: prize1.number}))
        //     console.log('found ', {key, found})
        //     // debugger
        // })
    }
}

class TextFormat {
    constructor({textFormat, history}) {
        this.textFormat = textFormat;
        this.history = history;
    }

    //format L: 1 ตัว, M: 2 ตัว, H: 3 ตัว
    review = (format = [ [1,2,3], [1,3,2], [2,3,1], [2,1,3], [3,1,2], [3,2,1] ]) => {
        const byFormat = format.map(fm => ({format: fm, years: {}}));

        const byYear = this.history.map(({year, history: data}) => {
            const oneYear = byFormat.map(({format: [low, mid, high], years}) => {
                if(!years[year]) years[year] = [];
                const pick = data.filter(({date, prize1 }) => {
                    const textL = prize1.hml.filter(chr => chr === 'L').length;
                    const textM = prize1.hml.filter(chr => chr === 'M').length;
                    const textH = prize1.hml.filter(chr => chr === 'H').length;
                    const match = textL === low && textM === mid && textH === high;
                    if(match) years[year].push({date, prize1})
                    return match
                });
                return {format: [low, mid, high], result: pick}
            })
            return {year, history: oneYear}
        });

        // debugger
        const byDetail = byFormat.map(({format, years}) => {
            const eo = [], hml = [], mix = [], number = [], part = [], range = [], sum = [], unique = [], dates = [];
            for(let [year, results] of Object.entries(years)) {
                if(results.length === 0) continue;
                results.map(({date, prize1}) => {
                    eo.push(prize1.eo);
                    hml.push(prize1.hml);
                    mix.push(prize1.mix);
                    number.push(prize1.number);
                    part.push(prize1.part);
                    range.push(prize1.range);
                    sum.push(prize1.sum);
                    unique.push(prize1.unique);
                    dates.push(date)
                })
            }
            // debugger
            return {format, detail: {dates, eo, hml, mix, number, part, range, sum, unique}}
        })

        return {byYear, byFormat, byDetail}
    }

    //หารูปแบบ text ที่ออกบ่อยที่สุด
    countText = (text) => {
        const lmh = text.map(txt => [
            txt.filter(t => t === 'L').length, 
            txt.filter(t => t === 'M').length, 
            txt.filter(t => t === 'H').length,
        ]).toSorted((a,b) => a[1] - b[1]);
        const unique = removeSameArray(lmh);
        const groups = unique.map(key => lmh.filter(count => isTod(count, key)).sort((a,b) => a[0] - b[0]));
        groups.map(group => {
            const one = group[0];
            const index = this.textFormat.findIndex(format => format.some(arr => isTod(arr, one)));
            if(index === -1)
                return this.textFormat.push(group)
            
            return this.textFormat[index] = [...this.textFormat[index], ...group].sort((a,b) => a[0] - b[0])
            // debugger
        })
        // debugger
    }
}


export default class HML {
    L = new ReviewText('L');
    M = new ReviewText("M");
    H = new ReviewText('H');
    textFormat = [];// [l, m, h] รูปแบบ text ที่ออกบ่อยที่สุด
    history = [];

    constructor({getYear}) {
        // this.parent = parent
        this.getYear = getYear;
        this.setProps();//setProps ก่อน setHistory 
        // this.setHistory(year)
        // debugger
    }

    setProps = () => {
        const {countText, review} = new TextFormat({textFormat: this.textFormat, history: this.history});
        this.countText = countText;
        this.reviewTextFormat = review;
        // debugger
    }

    setHistory = (year) => {
        year = year.sort((a,b) => a - b);
        const [start, end] = year.length === 2 ? year : [];
        if(start && end) {
            this.manyYears(start, end)
        }else {
            year.map(y => this.oneYear(y))
        }
    }

    oneYear = (year = 67) => {
        const oneYear = this.getYear(year)
        this.history.push({year, history: oneYear});
        const text = oneYear.map(({prize1}) => prize1.hml)
        const mix = oneYear.map(({date, prize1}) => ({mix: prize1.mix, date}))
        // debugger
        this.#singleChar(mix);
        this.countText(text);
        // debugger
    }

    manyYears = (start = 60, end = 67) => {
        if(start > end) throw new Error('start must be less than end.');
        
        for(let y = start; y <= end; y++) {
            this.oneYear(y)
        }
    }

    #singleChar = (mix) => {
        const low = mix.map(({mix: mx, date}) => ({date, mix: mx.filter(val => val[1] === 'L')}))
        const mid = mix.map(({mix: mx, date}) => ({date, mix: mx.filter(val => val[1] === 'M')}))
        const high = mix.map(({mix: mx, date}) => ({date, mix: mx.filter(val => val[1] === 'H')}))
        // debugger
        this.L.addData(low)
        this.M.addData(mid)
        this.H.addData(high)
    }
}