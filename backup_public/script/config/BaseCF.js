

export default class BaseCF {
    // 1 = ON, 0 = OFF
    _enable = 0;
    _group = 0;//reject sum not in range 9-18
    _triple = 1;//reject 333, 444, 555, ...
    _eeeooo = 0;//reject EEE or OOO
    _m03 = 0;//reject M = 0 || 3 ตัว
    _oppositeNumber = 1;

    set enable(n) {
        if([0,1].every(v => v !== n)) throw new Error('invalid value.');
        this._enable = n;
    }
    set group(n) {
        if([0,1].every(v => v !== n)) throw new Error('invalid value.');
        this._group = n;
    }
    set triple(n) {
        if([0,1].every(v => v !== n)) throw new Error('invalid value.');
        this._triple = n;
    }
    set eeeooo(n) {
        if([0,1].every(v => v !== n)) throw new Error('invalid value.');
        this._eeeooo = n;
    }
    set m03(n) {
        if([0,1].every(v => v !== n)) throw new Error('invalid value.');
        this._m03 = n;
    }
    set oppositeNumber(n) {
        if([0,1].every(v => v !== n)) throw new Error('invalid value.');
        this._oppositeNumber = n;
    }
    get enable() {
        return this._enable
    }
    get group() {
        return this._group
    }
    get triple() {
        return this._triple
    }
    get eeeooo() {
        return this._eeeooo
    }
    get m03() {
        return this._m03
    }
    get oppositeNumber() {
        return this._oppositeNumber
    }

}