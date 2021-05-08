const isString = (x) => typeof x === "string";
const firstN = (arr, n) => {
  const result = [];
  for (const item of arr) {
    result.push(item);
    if (item.length === n) break;
  }
  return result;
};

module.exports = {
  firstN,
  isString,
};
