

export class Storage {
    constructor(){}

    addRange = (range) => {
        // localStorage.removeItem('range')
        if(!range) throw new Error('Require parameter Range')
        const storage = JSON.parse(localStorage.getItem('range'))
        if(!storage){
          localStorage.setItem('range', JSON.stringify([ range ]))
        }else{
          const same = storage.some(r => r.every((num, i) => num == range[i] ))
          if(!same) localStorage.setItem('range', JSON.stringify([ ...storage, range ]))
        }
        const count = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0 }
        const newStorage = JSON.parse(localStorage.getItem('range'))
        console.log('localstroage', newStorage )
        newStorage.map(st => {
          st.map(num => {
            count[num] = !count[num] ? 0 : count[num];
            count[num] += 1;
          })
        })
        console.log('count range', count)
    }
}