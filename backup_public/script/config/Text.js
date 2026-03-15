

export default class Text {
    constructor(){
    }
    setHML({H=[7,8,9], M=[3,4,5,6], L=[0,1,2]}) {
        if(this._hml) throw new Error('HML rules is already set.');
        this._hml = {H, M, L};
    }
    get hml() {
        if(!this._hml) throw new Error('HML rules is not defined.');
        return this._hml
    }
}