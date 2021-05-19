export const isFunction = func => {
  return Object.prototype.toString.call(func) === "[object Function]";
};

export function toNumber(str) {
  const converted = Number(str);
  return isNaN(converted) ? 0 : converted;
}
