
/** เปลี่ยน key ของ object ตาม keyMap ที่ระบุ
 * @param {object} oldObject - object เดิมที่ต้องการเปลี่ยน key
 * @param {object} keyMap - แผนที่การเปลี่ยน key เช่น {oldKey: 'newKey'}
 * @returns {object} - object with updated keys */
export function changeKey(oldObject = {}, keyMap = {oldKey: 'newKey'}) {
    const updated = Object.fromEntries(
        Object.entries(oldObject).map(([key, value]) => [keyMap[key] || key, value])
    );
    return updated;
}