import LocalStorage from "../../../../../src/class/utils/LocalStorage.js";

const local = new LocalStorage();


export default function saveStorage(data = {}) {
    if(!this.storage) local.set('countWinNumber', []);
    const _storage = this.storage || local.get('countWinNumber');
    // localStorage.setItem('countWinNumber', JSON.stringify([...storage, data]))
    local.set('countWinNumber', [..._storage, data]);
    this.storage = local.get('countWinNumber');
    this.sumarizeWinNumber()
}