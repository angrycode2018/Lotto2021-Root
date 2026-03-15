
    const validateMinMax = (min, max) => {
        if([min, max].every(v => !v && v !== 0)) throw new Error('min max is required.');
        if([min, max].some(v => v < 0 || v > 6)) throw new Error('invalid value');
        if((min > 0 && max > 0) && min > max) throw new Error('min value must be less than max.');
    }

    const updateResults = (min, max, text="", data = []) => {
        const exact = (!max && min >= 0) ? min : undefined;//exact match H จำนวน x ตัวเท่านั้น

        const filter = data.filter(({prize1}) => {
            const count = prize1.hml.filter(txt => txt === text).length;
            // if([5,6].some(v => v === count)) debugger
            const match =  exact !== undefined ? count === exact : (min >= 0 && max >= 0) ? (count >= min && count <= max) : undefined;
            if(match === undefined) throw new Error('something wrong');
            return match
        });
        // debugger
        return filter
    }


export default class HML {
    results = [];
    history = null;

    constructor(history) {
        if(!history) throw new Error('require history');
        this.history = history;
    }

    get = () => {
        return this.results
    }

    H = (min, max) => {
        validateMinMax(min, max);
        const data = this.results.length > 0 ? this.results : this.history;

        this.results = updateResults(min, max, 'H', data)
        // debugger
        return this
    }
    M = (min, max) => {
        validateMinMax(min, max);
        const data = this.results.length > 0 ? this.results : this.history;

        this.results = updateResults(min, max, 'M', data)
        // debugger
        return this
    }
    L = (min, max) => {
        validateMinMax(min, max);
        const data = this.results.length > 0 ? this.results : this.history;

        this.results = updateResults(min, max, 'L', data)
        // debugger
        return this
    }
}