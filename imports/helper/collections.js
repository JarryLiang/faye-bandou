

export function divideList(list, slotSize) {
  const result = [];
  let currentSlot = [];
  list.forEach((item) => {
    currentSlot.push(item);
    if (currentSlot.length >= slotSize) {
      result.push(currentSlot);
      currentSlot = [];
    }
  });
  if (currentSlot.length > 0) {
    result.push(currentSlot);
  }
  return result;
}

export function replaceOrAppendinList(oldlist, newItem, getKey) {
  let find = false;
  const newlist = oldlist.map((item) => {
    if (getKey(item) === getKey(newItem)) {
      find = true;
      return newItem;
    }
    return item;
  });
  if (!find) {
    newlist.push(newItem);
  }
  return newlist;
}

export function mergeTwoListWithoutKey(aList, bList) {
  const list1 = aList || [];
  const list2 = bList || [];

  const remains = bList.filter((b) => {
    const match = aList.find((a) => {
      return a === b;
    });
    if (match) {
      return false;
    }
    return true;
  });
  return [...aList, ...remains];
}


export function excludeFromList(aList, bList, getKey) {
  const list1 = aList || [];
  const list2 = bList || [];

  const result = [];
  list1.forEach((itemA) => {
    const keyA = getKey ? getKey(itemA) : itemA;
    const exist = list2.find((itemB) => {
      const keyB = getKey ? getKey(itemB) : itemB;
      return keyB === keyA;
    });
    if (!exist) {
      result.push(itemA);
    }
  });
  return result;
}

export function removeFromList(source, toRemove, getKey) {
  const existed = {};

  toRemove.forEach((r) => {
    const key = getKey ? getKey(r) : r;
    existed[key] = true;
  });

  return source.filter((r) => {
    const key = getKey ? getKey(r) : r;
    if (existed[key]) {
      return false;
    }
    return true;
  });
}


export function combineTwoListWithKey(list1, list2, getKey) {
  const map1 = {};
  list1.forEach((r) => {
    map1[getKey(r)] = r;
  });
  const map2 = {};
  list2.forEach((r) => {
    map2[getKey(r)] = r;
  });
  const result = Object.keys(map1)
    .map((k) => {
      const rec1 = map1[k];
      const rec2 = map2[k] || {};
      return {
        ...rec1,
        ...rec2,
      };
    });
  return result;
}

function emptyGetKey(v) {
  return v;
}

export function intersectTwoList(list1, list2, getKey) {
  const gk = getKey || emptyGetKey;

  const result = [];
  list1.forEach((item1) => {
    const k1 = gk(item1);
    const exist = list2.find((item2) => {
      const k2 = gk(item2);
      return k1 === k2;
    });
    if (exist) {
      result.push(item1);
    }
  });
  return result;
}

export function diffList(list1, list2, getKey) {
  const gk = getKey || emptyGetKey;
  const added = [];
  const removed = [];
  list2.forEach((item2) => {
    const key2 = gk(item2);
    const exist = list1.find((item1) => {
      return gk(item1) === key2;
    });
    if (!exist) {
      added.push(item2);
    }
  });

  list1.forEach((item1) => {
    const key1 = gk(item1);
    const exist = list2.find((item2) => {
      return gk(item2) === key1;
    });
    if (!exist) {
      removed.push(item1);
    }
  });
  return {
    added,
    removed,
    diff: added.length + removed.length,
  };
}

export function extractFromList(list, check) {
  const match = list.find((r) => {
    return check(r);
  });
  if (match) {
    const remains = list.filter((r) => {
      return !check(r);
    });
    return [match, remains];
  }
  return [null, list];
}

export function aggsFields(list, fields) {
  const fs = {};
  fields.forEach((f) => {
    fs[f] = {};
  });

  list.forEach((r) => {
    fields.forEach((f) => {
      const v = r[f];
      fs[f][v] = 1;
    });
  });

  return fields.map((f) => {
    return Object.keys(fs[f]);
  });
}

export function extractKeyToMap(list, getKey) {
  const result = {};
  list.forEach((l) => {
    const k = getKey(l);
    result[k] = true;
  });
  return result;
}

export function accumulateFromList(list, getKey) {
  const ss = {};
  list.forEach((item) => {
    const k = getKey(item);
    if(k==='RU'){
      console.log(item);
    }
    if (!ss[k]) {
      ss[k] = 1;
    } else {
      ss[k] += 1;
    }
  });
  return ss;
}

export function mergeTwoList(list1, list2, getKey) {
  const existed = {};

  const result = [];
  if (list1) {
    list1.forEach((r) => {
      const key = getKey ? getKey(r) : JSON.stringify(r);
      if (!existed[key]) {
        result.push(r);
        existed[key] = true;
      }
    });
  }


  if (list2) {
    list2.forEach((r) => {
      const key = getKey ? getKey(r) : JSON.stringify(r);
      if (!existed[key]) {
        result.push(r);
        existed[key] = true;
      }
    });
  }

  return result;
}

export function existInList(list, target, getKey) {
  const gk = getKey || emptyGetKey;
  const t = gk(target);

  const exist = list.find((item) => {
    if (gk(item) === t) {
      return true;
    }
    return false;
  });
  return exist;
}


function removeItemFromList(list, target, getKey) {
  const gk = getKey || emptyGetKey;
  const key = gk(target);

  const result = list.filter((r) => {
    return gk(r) !== key;
  });

  return result;
}

function removeFromListWithKey(list, key, getKey) {
  const gk = getKey || emptyGetKey;
  const result = list.filter((r) => {
    return gk(r) !== key;
  });
  return result;
}

function replaceInList(list, target, getKey) {
  const gk = getKey || emptyGetKey;
  const key = gk(target);
  const result = list.map((r) => {
    if (gk(r) === key) {
      return target;
    }
    return r;
  });
  return result;
}

function listToMap(list, getKey) {
  const result = {};
  list.forEach((item) => {
    const key = getKey(item);
    result[key] = item;
  });
  return result;
}

function extractField(list, getKey) {
  const r = {};
  list.forEach((item) => {
    const key = getKey(item);
    r[key] = true;
  });
  return Object.keys(r);
}

function mapToList(aMap) {
  return Object.keys(aMap)
    .map((key) => {
      return aMap[key];
    });
}

function defaultGetValue(r) {
  return r;
}

export function getMinMax(list, getValue) {
  if (!list) {
    return null;
  }
  const func = getValue || defaultGetValue;
  let min = func(list[0]);
  let max = func(list[0]);
  list.forEach((item) => {
    const v = func(item);
    if (v < min) {
      min = v;
    }
    if (v > max) {
      max = v;
    }
  });
  return [min, max];
}

function inList(list, value) {
  if (!list) {
    return false;
  }
  const sz = list.length;
  if (sz === 0) {
    return false;
  }
  for (let i = 0; i < sz; i++) {
    if (list[i] == value) {
      return true;
    }
  }
  return false;
}


function aggByKey(list, getKey) {
  const result = {};
  list.forEach((r) => {
    const key = getKey(r);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(r);
  });
  return result;
}

function aggByKeyAndSort(list, getKey) {
  const byKey = aggByKey(list, getKey);
  const result = Object.keys(byKey)
    .map((k) => {
      const l = byKey[k];
      return {
        key: k,
        count: l.length,
        list: l,
      };
    });
  result.sort((a, b) => {
    return b.count - a.count;
  });
  return result;
}

function replaceBy(list, fieldName, value, newItem) {
  return list.map((r) => {
    if (r[fieldName] === value) {
      return newItem;
    }
    return r;
  });
}

function removeBy(list, fieldName, value) {
  return list.filter((r) => {
    return r[fieldName] !== value;
  });
}


function getUniqueField(list, getField, getKey) {
  const mm = {};
  list.forEach((r) => {
    const field = getField(r);
    if (field) {
      const k = getKey ? getKey(field) : field;
      if (!mm[k]) {
        mm[k] = field;
      }
    }
  });
  return Object.keys(mm)
    .map((k) => {
      return mm[k];
    });
}

function accumulateMapToOptions(map) {
  const list = Object.keys(map)
    .map((k) => {
      const v = map[k];
      return {
        key: k,
        count: v,
      };
    });

  list.sort((a, b) => {
    return b.count - a.count;
  });

  return list.map((item) => {
    const {
      key,
      count
    } = item;
    const label = `${key} (${count})`;
    return {
      label,
      value: key,
    };
  });
}

function xor(list, newItem) {

  const remains = list.filter((r) => {
    if (r !== newItem) {
      return true;
    }
    return false;
  });
  if (remains.length != list.length) {
    return remains;
  }
  return [...list, newItem];
}

export const ListOP = {
  removeItemFromList,
  removeFromListWithKey,
  replaceInList,
  mapToList,
  listToMap,
  extractField,
  inList,
  aggByKey,
  aggByKeyAndSort,
  accumulateFromList,
  replaceBy,
  removeBy,
  getUniqueField,
  accumulateMapToOptions,
  existInList,
  excludeFromList,
  xor
};
