import React from 'react'
/*
 * group array @arr by specified number of elements, e.g.
 *    console.log(groupByRange(["a", "b", "c", "d", "e", "f", "g", "h"], 3))
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

function isLetter(str) {
  return str && str.length === 1 && str.match(/[a-z]/i)
}

 * In the new ES2015 standard for JavaScript (formerly called ES6),
 * objects can be created with computed keys: Object Initializer spec.
 *   var obj = {
 *   [myKey]: value,
 *   }
 *   console.log(stringToObject(process.env.REACT_APP_INVOICE_TEXT, 6))

export function stringToObject(text, n) {
  const arr = text.split(":")
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

export const formatDate = (date) => {
  //date.toISOString().slice(0, 10)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString("en-US", options)
}

export const arraySpan = (array, spanStyle = {}) => {
  return array.map((line, i) =>
    <span key={i} style={spanStyle}>{line} </span>)
}

/* example usage: export default compose( withFirebase, )(List) */
export const compose = (...fns) => x =>
  fns.reduceRight((y, f) => f(y), x)

/* returns type of @obj object */
//  arguments to eslint annotation are "off" or 0, "warn" or 1, "error" or 2
/*eslint no-unused-vars: "off"*/
const type = obj => {
  //const text = Function.prototype.toString.call(obj.constructor)
  //return text.match(/function (.*)\(/)[1]
  return Object.prototype.toString.call(obj)
}

/*
export const range = (size, startAt = 0) => {
  [...Array(size).keys()].map(i => i + startAt)
}
*/
export const range = (start, end) =>
  Array.from({ length: (end - start) }, (v, k) => k + start)

export function DateComparator([dateA, ...restA], [dateB, ...restB]) {
  const a = new Date(dateA)
  const b = new Date(dateB)
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    useGrouping: false,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const sumArr = (arr) =>
  arr.reduce((acc, val, i, arr) => {
    return acc + val
  }, 0)

export const clone = (obj) => //.slice(0) // copy array
  JSON.parse(JSON.stringify(obj))

export const groupBy = (items, key) => items.reduce(
  (result, item) => ({
    ...result,
    [item[key]]: [
      ...(result[item[key]] || []),
      item,
    ],
  }),
  {},
)
