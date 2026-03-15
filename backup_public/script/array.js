
export function isTod(arr1, arr2) {
  const s1 = [...arr1].sort((x,y) => x-y), s2 = [...arr2].sort((x,y) => x-y);//ต้องใช้ sort สำหรับเลขโต๊ด
  return s1.every((av, i) => av == s2[i] )
}

export function isTrong(arr1, arr2) {
  return arr1.every((av, i) => av == arr2[i] )
}

//compareArrays([2, 2], [1, 2, 3])    // false (2 มีตัวเดียวในชุดหลัง)
//compareArrays([2, 2], [3, 2, 2])    // true  (2 มีสองตัวเท่ากัน)
//compareArrays([2, 3], [4, 3, 2])    // true
export function arrayIncludes(has = [], inArray = []) {
  const count = (arr) => arr.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  const counts1 = count(has);
  const counts2 = count(inArray);

  // ตรวจสอบว่าทุกค่าใน arr1 มีจำนวนใน arr2 มากกว่าหรือเท่ากัน
  return Object.keys(counts1).every(key => 
    counts2[key] >= counts1[key]
  );
};