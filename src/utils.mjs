export const isString = (x) => typeof x === 'string'

export const firstN = (arr, n) => {
  const result = []
  for (const item of arr) {
    result.push(item)
    if (item.length === n) break
  }
  return result
}
