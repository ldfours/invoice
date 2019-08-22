/*
 * group array @arr by specified number of elements, e.g.
 *    console.log(groupByRange(["a", "b", "c", "d", "e", "f", "g", "h"], 3))
 */

/*eslint no-unused-vars: "off"*/
/*
function groupByRange(arr, n) {
  return (
    arr.reduce(
      function (acc, val, i, array) {
        return (
          i % n === 0 ?
            acc.concat([array.slice(i, i + n)])
            :
            acc)
      }, []
    ))
}
*/

/*
 * In the new ES2015 standard for JavaScript (formerly called ES6),
 * objects can be created with computed keys: Object Initializer spec.
    var obj = {
    [myKey]: value,
    }
    console.log(stringToObject(process.env.REACT_APP_INVOICE_TEXT, 6))
 */

/*
export function stringToObject(text, n) {
  const arr = text.split(":");
  return (
    arr.reduce(
      function (acc, val, i, array) {
        //console.log(acc)
        return (
          i % n === 0 ?
            Object.assign(acc,
              {
                [ array[i] ]:
                  array.slice(i + 1, i + n)
              })
            : acc)
      }, {}
    ))
}
const invoiceText =
  process.env.REACT_APP_INVOICE_TEXT ?
    stringToObject(process.env.REACT_APP_INVOICE_TEXT, 6) : {}
*/

export const compose = (...fns) => x =>
  fns.reduceRight((y, f) => f(y), x);

export const range = (start, end) =>
  Array.from({ length: (end - start) }, (v, k) => k + start);

/*
export const formatDate = (date) => {
  const PARSING = "YYYY-MM-DD";
  const DISPLAY = "MMMM D, YYYY";
  return moment(date, PARSING).format(DISPLAY);
}
*/

/*
export const transformEntities = (lineItems, description) => {
  lineItems.map(line => {
      line.description = description;

      // date
      line.date = formatDate(line.date);
      return line;
    }
  )
};
*/

export const formatCurrency =
  (amount, currency = 'USD', locale = 'en-US') => {
    return (new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount))
  }

